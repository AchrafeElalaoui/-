/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Group, Person, WaterTurn, GlobalTurn, TurnType } from './types';
import { generateInitialData } from './data/initialData';
import { generateGlobalTurnForDay, recordAllocationToPerson } from './utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel } from './utils/i18n';
import { Navbar } from './components/Navbar';
import { GlobalTurnView } from './components/GlobalTurnView';
import { GroupsView } from './components/GroupsView';
import { PersonsView } from './components/PersonsView';
import { WaterTurnEngineView } from './components/WaterTurnEngineView';
import { AnalyticsView } from './components/AnalyticsView';
import { PersonProfileModal } from './components/PersonProfileModal';
import { ManualAllocationModal } from './components/ManualAllocationModal';

export default function App() {
  // Main language state: Arabic is primary
  const [language, setLanguage] = useState<Language>('ar');
  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleToggleLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  // Initialize seeded groups and persons data
  const initialData = useMemo(() => generateInitialData(), []);
  const [groups, setGroups] = useState<Group[]>(initialData.groups);
  const [persons, setPersons] = useState<Person[]>(initialData.persons);

  // Round and Day state (1 to 43 days in a round)
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [currentRound, setCurrentRound] = useState<number>(1);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'globalTurn' | 'groups' | 'persons' | 'waterEngine' | 'analytics'>('globalTurn');

  // Modals state
  const [selectedPersonForModal, setSelectedPersonForModal] = useState<Person | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);

  // Global turn for the current active day
  const [currentTurn, setCurrentTurn] = useState<GlobalTurn>(() =>
    generateGlobalTurnForDay(1, 1, initialData.groups, initialData.persons, 60)
  );

  // Sync GlobalTurn whenever currentDay, currentRound, groups, or persons change
  useEffect(() => {
    setCurrentTurn((prev) => {
      // If we are already on this day/round and have ongoing execution state, keep it unless day changed
      if (prev.dayNumber === currentDay && prev.roundNumber === currentRound) {
        return prev;
      }
      return generateGlobalTurnForDay(currentDay, currentRound, groups, persons, 60);
    });
  }, [currentDay, currentRound, groups, persons]);

  // Execute a single WaterTurn
  const handleDispenseTurn = (turn: WaterTurn) => {
    if (currentTurn.tankRemainingUnits < turn.units) {
      const msg = language === 'ar'
        ? `كمية الماء المتبقية في الخزان غير كافية! المطلوب: ${turn.units} وحدة، المتاح: ${currentTurn.tankRemainingUnits} وحدة. يرجى إعادة تعبئة الخزان.`
        : `Insufficient water in tank! Requested: ${turn.units} units, Available: ${currentTurn.tankRemainingUnits} units. Please refill the tank.`;
      alert(msg);
      return;
    }

    const tankBefore = currentTurn.tankRemainingUnits;
    const tankAfter = Math.max(0, tankBefore - turn.units);

    // Update turn status in currentTurn
    const updatedGroups = currentTurn.groups.map(g => ({
      ...g,
      waterTurns: g.waterTurns.map(wt => {
        if (wt.id === turn.id) {
          return {
            ...wt,
            status: 'COMPLETED' as const,
            tankLevelBefore: tankBefore,
            tankLevelAfter: tankAfter,
            dispensedAt: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
          };
        }
        return wt;
      })
    }));

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      message: language === 'ar'
        ? `تم صرف ${turn.units} وحدة ماء للمستفيد ${turn.personName} (${getTurnTypeLabel(turn.turnType, 'ar')} - نوبة #${turn.orderInGroup}). منسوب الخزان: ${tankBefore}و ← ${tankAfter}و.`
        : `Dispensed ${turn.units} units to ${turn.personName} (${turn.turnType} Turn #${turn.orderInGroup}). Tank level: ${tankBefore}U → ${tankAfter}U.`,
      severity: 'success' as const
    };

    setCurrentTurn({
      ...currentTurn,
      tankRemainingUnits: tankAfter,
      groups: updatedGroups,
      status: 'IN_PROGRESS',
      logs: [newLog, ...currentTurn.logs]
    });

    // Update Person's allocation history
    setPersons(prevPersons =>
      prevPersons.map(p => {
        if (p.id === turn.personId) {
          return recordAllocationToPerson(p, turn, tankBefore, tankAfter, currentTurn.dateStr);
        }
        return p;
      })
    );

    // If modal is open for this person, refresh its state
    if (selectedPersonForModal && selectedPersonForModal.id === turn.personId) {
      setSelectedPersonForModal(prev =>
        prev ? recordAllocationToPerson(prev, turn, tankBefore, tankAfter, currentTurn.dateStr) : null
      );
    }
  };

  // Dispense all pending turns for today
  const handleDispenseAllToday = () => {
    let currentTank = currentTurn.tankRemainingUnits;
    const pending = currentTurn.groups.flatMap(g => g.waterTurns).filter(t => t.status === 'PENDING');
    
    if (pending.length === 0) return;

    let updatedPersons = [...persons];
    const newLogs = [...currentTurn.logs];

    const updatedGroups = currentTurn.groups.map(g => ({
      ...g,
      waterTurns: g.waterTurns.map(wt => {
        if (wt.status === 'PENDING' && currentTank >= wt.units) {
          const tankBefore = currentTank;
          const tankAfter = currentTank - wt.units;
          currentTank = tankAfter;

          // Update person
          const targetPerson = updatedPersons.find(p => p.id === wt.personId);
          if (targetPerson) {
            const updatedP = recordAllocationToPerson(targetPerson, wt, tankBefore, tankAfter, currentTurn.dateStr);
            updatedPersons = updatedPersons.map(p => p.id === updatedP.id ? updatedP : p);
          }

          newLogs.unshift({
            id: `log-auto-${wt.id}-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
            message: language === 'ar'
              ? `[صرف جماعي] تم صرف ${wt.units} وحدة للمستفيد ${wt.personName} (${getTurnTypeLabel(wt.turnType, 'ar')} - نوبة #${wt.orderInGroup}). المتبقي بالخزان: ${tankAfter}و.`
              : `[Batch] Dispensed ${wt.units} units to ${wt.personName} (${wt.turnType} Turn #${wt.orderInGroup}). Tank remaining: ${tankAfter}U.`,
            severity: 'success' as const
          });

          return {
            ...wt,
            status: 'COMPLETED' as const,
            tankLevelBefore: tankBefore,
            tankLevelAfter: tankAfter,
            dispensedAt: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
          };
        }
        return wt;
      })
    }));

    setPersons(updatedPersons);
    setCurrentTurn({
      ...currentTurn,
      tankRemainingUnits: currentTank,
      groups: updatedGroups,
      status: 'COMPLETED',
      logs: newLogs
    });
  };

  // Refill tank to 60 units
  const handleRefillTank = () => {
    setCurrentTurn(prev => ({
      ...prev,
      tankRemainingUnits: 60,
      logs: [
        {
          id: `log-refill-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          message: language === 'ar'
            ? 'تمت إعادة تعبئة خزان المياه الرئيسي إلى سعته الكاملة (60 وحدة).'
            : 'Main reservoir tank refilled to full 60 units capacity.',
          severity: 'info'
        },
        ...prev.logs
      ]
    }));
  };

  // Advance to next day (1 to 43)
  const handleNextDay = () => {
    if (currentDay < 43) {
      const nextD = currentDay + 1;
      setCurrentDay(nextD);
      setCurrentTurn(generateGlobalTurnForDay(nextD, currentRound, groups, persons, 60));
    } else {
      // Completed full 43-day round! Advance to next round
      const nextR = currentRound + 1;
      setCurrentRound(nextR);
      setCurrentDay(1);
      setCurrentTurn(generateGlobalTurnForDay(1, nextR, groups, persons, 60));
    }
  };

  const handlePrevDay = () => {
    if (currentDay > 1) {
      const prevD = currentDay - 1;
      setCurrentDay(prevD);
      setCurrentTurn(generateGlobalTurnForDay(prevD, currentRound, groups, persons, 60));
    }
  };

  const handleJumpToDay = (day: number) => {
    setCurrentDay(day);
    setCurrentTurn(generateGlobalTurnForDay(day, currentRound, groups, persons, 60));
  };

  const handleResetToDay1 = () => {
    setCurrentRound(1);
    setCurrentDay(1);
    setCurrentTurn(generateGlobalTurnForDay(1, 1, groups, persons, 60));
  };

  // Update a turn's units or TurnType
  const handleUpdateTurnUnits = (turnId: string, newUnits: number, newTurnType?: TurnType) => {
    setCurrentTurn(prev => {
      let totalUnits = 0;
      const updatedGroups = prev.groups.map(g => {
        const updatedTurns = g.waterTurns.map(wt => {
          if (wt.id === turnId) {
            return {
              ...wt,
              units: newUnits,
              turnType: newTurnType || wt.turnType
            };
          }
          return wt;
        });
        const gTotal = updatedTurns.reduce((s, t) => s + t.units, 0);
        totalUnits += gTotal;
        return {
          ...g,
          waterTurns: updatedTurns,
          totalGroupUnits: gTotal
        };
      });

      return {
        ...prev,
        groups: updatedGroups,
        totalAllocatedUnits: totalUnits
      };
    });
  };

  // Add custom manual WaterTurn
  const handleAddCustomTurn = (newTurn: WaterTurn) => {
    setCurrentTurn(prev => {
      let updatedGroups = [...prev.groups];
      const existingGroupIndex = updatedGroups.findIndex(g => g.groupId === newTurn.groupId);

      if (existingGroupIndex >= 0) {
        const g = updatedGroups[existingGroupIndex];
        const updatedTurns = [...g.waterTurns, newTurn];
        updatedGroups[existingGroupIndex] = {
          ...g,
          waterTurns: updatedTurns,
          totalGroupUnits: updatedTurns.reduce((s, t) => s + t.units, 0)
        };
      } else {
        const groupObj = groups.find(grp => grp.id === newTurn.groupId);
        updatedGroups.push({
          groupId: newTurn.groupId,
          groupName: groupObj?.name || (language === 'ar' ? `المجموعة ${newTurn.groupId}` : `Group ${newTurn.groupId}`),
          activeOrderInDay: updatedGroups.length + 1,
          waterTurns: [newTurn],
          totalGroupUnits: newTurn.units,
          status: 'PENDING'
        });
      }

      const totalDemand = updatedGroups.reduce((sum, g) => sum + g.totalGroupUnits, 0);

      return {
        ...prev,
        groups: updatedGroups,
        totalAllocatedUnits: totalDemand,
        logs: [
          {
            id: `log-custom-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
            message: language === 'ar'
              ? `تمت إضافة نوبة مياه استثنائية يدوياً: ${newTurn.personName} (${newTurn.units} وحدة، ${getTurnTypeLabel(newTurn.turnType, 'ar')}).`
              : `Manually added custom WaterTurn: ${newTurn.personName} (${newTurn.units} Units, ${newTurn.turnType}).`,
            severity: 'info'
          },
          ...prev.logs
        ]
      };
    });
  };

  // Update person profile
  const handleUpdatePerson = (updatedPerson: Person) => {
    setPersons(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
    if (selectedPersonForModal && selectedPersonForModal.id === updatedPerson.id) {
      setSelectedPersonForModal(updatedPerson);
    }
  };

  // Add new person to roster
  const handleAddNewPerson = (newPerson: Person) => {
    setPersons(prev => [...prev, newPerson]);
    setGroups(prev =>
      prev.map(g => {
        if (g.id === newPerson.groupId) {
          return {
            ...g,
            memberIds: [...g.memberIds, newPerson.id],
            baseDailyDemand: g.baseDailyDemand + newPerson.waterUnitsQuota
          };
        }
        return g;
      })
    );
  };

  const selectedPersonGroup = useMemo(() => {
    if (!selectedPersonForModal) return null;
    return groups.find(g => g.id === selectedPersonForModal.groupId) || null;
  }, [selectedPersonForModal, groups]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Navbar */}
      <Navbar
        currentDay={currentDay}
        currentRound={currentRound}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNextDay={handleNextDay}
        onPrevDay={handlePrevDay}
        onOpenManualModal={() => setIsManualModalOpen(true)}
        onResetToDay1={handleResetToDay1}
        tankRemainingUnits={currentTurn.tankRemainingUnits}
        tankCapacity={currentTurn.tankCapacity}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'globalTurn' && (
          <GlobalTurnView
            currentTurn={currentTurn}
            groups={groups}
            persons={persons}
            onDispenseTurn={handleDispenseTurn}
            onDispenseAllToday={handleDispenseAllToday}
            onRefillTank={handleRefillTank}
            onSelectPerson={setSelectedPersonForModal}
            onJumpToDay={handleJumpToDay}
            onNextDay={handleNextDay}
            onUpdateTurnUnits={handleUpdateTurnUnits}
            language={language}
          />
        )}

        {activeTab === 'groups' && (
          <GroupsView
            groups={groups}
            persons={persons}
            currentRound={currentRound}
            currentDay={currentDay}
            onSelectPerson={setSelectedPersonForModal}
            onJumpToDay={(day) => {
              handleJumpToDay(day);
              setActiveTab('globalTurn');
            }}
            language={language}
          />
        )}

        {activeTab === 'persons' && (
          <PersonsView
            persons={persons}
            groups={groups}
            onSelectPerson={setSelectedPersonForModal}
            onAddNewPerson={handleAddNewPerson}
            language={language}
          />
        )}

        {activeTab === 'waterEngine' && (
          <WaterTurnEngineView
            groups={groups}
            persons={persons}
            currentRound={currentRound}
            onSelectPerson={setSelectedPersonForModal}
            language={language}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            currentDay={currentDay}
            currentRound={currentRound}
            groups={groups}
            persons={persons}
            currentTurn={currentTurn}
            language={language}
          />
        )}
      </main>

      {/* Modals */}
      {selectedPersonForModal && (
        <PersonProfileModal
          person={selectedPersonForModal}
          group={selectedPersonGroup}
          onClose={() => setSelectedPersonForModal(null)}
          onUpdatePerson={handleUpdatePerson}
          language={language}
        />
      )}

      {isManualModalOpen && (
        <ManualAllocationModal
          currentDay={currentDay}
          currentRound={currentRound}
          groups={groups}
          persons={persons}
          tankRemainingUnits={currentTurn.tankRemainingUnits}
          onClose={() => setIsManualModalOpen(false)}
          onAddCustomTurn={handleAddCustomTurn}
          language={language}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold">
            {language === 'ar'
              ? 'أكوا-تيرن • نظام توزيع المياه وإدارة نوب السقي الدوري (دورة 43 يوماً وخزان 60 وحدة)'
              : 'AquaTurn • 43-Day Water Distribution & Turn Allocation System'}
          </span>
          <span className="font-mono text-[11px]">
            {language === 'ar'
              ? 'مخطط الكائنات الخمسة: GlobalTurn • Group • Person • WaterTurn • TurnType (FIRST, MIDDEL, LAST, FULL)'
              : '5 Objects Schema: GlobalTurn • Group • Person • WaterTurn • TurnType (FIRST, MIDDEL, LAST, FULL)'}
          </span>
        </div>
      </footer>
    </div>
  );
}
