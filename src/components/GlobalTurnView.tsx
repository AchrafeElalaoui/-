/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GlobalTurn, Group, Person, WaterTurn, TurnType } from '../types';
import { WaterTankGauge } from './WaterTankGauge';
import { getTurnTypeDetails } from '../utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel, getTurnTypeDescription } from '../utils/i18n';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Droplets, 
  User, 
  AlertCircle, 
  RotateCw, 
  FileText, 
  FastForward, 
  Edit3,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

interface GlobalTurnViewProps {
  currentTurn: GlobalTurn;
  groups: Group[];
  persons: Person[];
  onDispenseTurn: (turn: WaterTurn) => void;
  onDispenseAllToday: () => void;
  onRefillTank: () => void;
  onSelectPerson: (person: Person) => void;
  onJumpToDay: (day: number) => void;
  onNextDay: () => void;
  onUpdateTurnUnits: (turnId: string, newUnits: number, newTurnType?: TurnType) => void;
  language?: Language;
}

export const GlobalTurnView: React.FC<GlobalTurnViewProps> = ({
  currentTurn,
  groups,
  persons,
  onDispenseTurn,
  onDispenseAllToday,
  onRefillTank,
  onSelectPerson,
  onJumpToDay,
  onNextDay,
  onUpdateTurnUnits,
  language = 'ar'
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [editingTurnId, setEditingTurnId] = useState<string | null>(null);
  const [editUnits, setEditUnits] = useState<number>(10);
  const [editTurnType, setEditTurnType] = useState<TurnType>(TurnType.FIRST);

  // Flatten all turns for today across scheduled groups
  const allTurnsToday = currentTurn.groups.flatMap(g => g.waterTurns);
  const completedTurns = allTurnsToday.filter(t => t.status === 'COMPLETED');
  const pendingTurns = allTurnsToday.filter(t => t.status === 'PENDING');
  const isAllCompleted = allTurnsToday.length > 0 && completedTurns.length === allTurnsToday.length;

  const handleStartEdit = (turn: WaterTurn) => {
    setEditingTurnId(turn.id);
    setEditUnits(turn.units);
    setEditTurnType(turn.turnType);
  };

  const handleSaveEdit = (turnId: string) => {
    onUpdateTurnUnits(turnId, editUnits, editTurnType);
    setEditingTurnId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Day Header & Quick 43-Day Jump Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-blue-100 text-blue-800 border border-blue-200">
              {language === 'ar' ? `النوبة العامة • اليوم ${currentTurn.dayNumber} من 43` : `GLOBAL TURN • DAY ${currentTurn.dayNumber} OF 43`}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">
              {t.round} {currentTurn.roundNumber}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentTurn.dateStr}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
            {language === 'ar' ? 'جدول توزيع مياه الخزان اليومي وقائمة النوب' : 'Daily Water Tank Dispatch & Turn Queue'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {language === 'ar' 
              ? 'نوبة عامة يومية واحدة تصرف حتى 60 وحدة من مياه الخزان وفق التدوير الدوري المنصف'
              : 'Single global turn per day dispensing up to 60 units to rotated group members'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isAllCompleted && pendingTurns.length > 0 && (
            <button
              onClick={onDispenseAllToday}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FastForward className="w-4 h-4" />
              <span>{t.dispenseAll} ({pendingTurns.length} {language === 'ar' ? 'نوب' : 'turns'})</span>
            </button>
          )}

          {isAllCompleted && (
            <button
              onClick={onNextDay}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer animate-pulse"
            >
              <span>{language === 'ar' ? `الانتقال إلى اليوم ${currentTurn.dayNumber < 43 ? currentTurn.dayNumber + 1 : 1}` : `Advance to Day ${currentTurn.dayNumber < 43 ? currentTurn.dayNumber + 1 : 1}`}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* 43-Day Quick Jump Pill Matrix */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-bold text-slate-800">{t.quickDayJump}</span>
          <span className="text-[11px] text-slate-400">{language === 'ar' ? 'انقر على أي يوم (1..43) لمعاينة نوبته العامة' : 'Click any day (1..43) to view or simulate its Global Turn'}</span>
        </div>
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
          {Array.from({ length: 43 }, (_, i) => i + 1).map((d) => {
            const isCurrent = d === currentTurn.dayNumber;
            const isPast = d < currentTurn.dayNumber;
            return (
              <button
                key={d}
                onClick={() => onJumpToDay(d)}
                className={`w-7 h-7 rounded-md text-[11px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 ring-offset-1 scale-110 z-10'
                    : isPast
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
                title={`${t.day} ${d}: GRP-${d.toString().padStart(2, '0')}`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Water Tank 60-Unit Reservoir Visualizer */}
      <WaterTankGauge
        capacity={currentTurn.tankCapacity}
        remaining={currentTurn.tankRemainingUnits}
        allocatedToday={currentTurn.totalAllocatedUnits}
        isDispensing={allTurnsToday.some(t => t.status === 'DISPENSING')}
        onRefill={onRefillTank}
        language={language}
      />

      {/* Scheduled Group(s) & WaterTurn Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Group Turns */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ar' ? `قائمة نوب المياه المجدولة لليوم ${currentTurn.dayNumber}` : `Scheduled WaterTurn Queue for Day ${currentTurn.dayNumber}`}
              </h3>
              <span className="px-2 py-0.5 text-xs font-mono bg-slate-200 text-slate-700 rounded-md font-bold">
                {allTurnsToday.length} {language === 'ar' ? 'مستفيدين' : 'Beneficiaries'}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {t.statusCompleted}: <span className="font-bold text-emerald-600 font-mono">{completedTurns.length}</span> / {allTurnsToday.length}
            </div>
          </div>

          {currentTurn.groups.map((groupSchedule) => {
            const groupInfo = groups.find(g => g.id === groupSchedule.groupId);

            return (
              <div
                key={groupSchedule.groupId}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Group Header Card */}
                <div className="bg-slate-50/90 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-xs shrink-0">
                      G{groupSchedule.groupId.toString().padStart(2, '0')}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{groupSchedule.groupName}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                          {groupInfo?.sector || 'واحة النخيل'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t.representative}: <span className="font-medium text-slate-700">{groupInfo?.representativeName}</span> • <span className="font-mono">{groupInfo?.representativePhone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={isRtl ? 'text-left' : 'text-right'}>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{t.dailyQuota}</div>
                      <div className="text-sm font-bold font-mono text-blue-700">
                        {groupSchedule.totalGroupUnits} <span className="text-xs text-slate-500 font-normal">/ 60 {t.units}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Turns List for this group */}
                <div className="p-4 space-y-3">
                  {groupSchedule.waterTurns.map((turn) => {
                    const person = persons.find(p => p.id === turn.personId);
                    const ttDetails = getTurnTypeDetails(turn.turnType);
                    const isEditing = editingTurnId === turn.id;
                    const isCompleted = turn.status === 'COMPLETED';
                    const isDispensing = turn.status === 'DISPENSING';
                    const canDispense = turn.status === 'PENDING' && currentTurn.tankRemainingUnits >= turn.units;

                    return (
                      <div
                        key={turn.id}
                        className={`rounded-xl border transition-all p-3.5 ${
                          isCompleted
                            ? 'bg-slate-50/60 border-slate-200 opacity-90'
                            : isDispensing
                            ? 'bg-cyan-50/60 border-cyan-300 ring-2 ring-cyan-200'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Person details & Turn order */}
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shrink-0">
                              #{turn.orderInGroup}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => person && onSelectPerson(person)}
                                  className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{turn.personName}</span>
                                  <User className="w-3 h-3 text-slate-400" />
                                </button>

                                {/* TurnType Badge */}
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${ttDetails.badgeColor}`}
                                  title={getTurnTypeDescription(turn.turnType, language)}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${ttDetails.dot}`} />
                                  {getTurnTypeLabel(turn.turnType, language)}
                                </span>

                                {person?.plotNumber && (
                                  <span className="text-[11px] text-slate-400 font-medium">
                                    ({person.plotNumber})
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                                <span>{language === 'ar' ? 'الحصة المطلوبة:' : 'Requested Volume:'}</span>
                                <span className="font-bold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 text-xs">
                                  {turn.units} {t.units}
                                </span>
                                {turn.notes && (
                                  <span className="text-[11px] text-slate-400 italic">
                                    • {turn.notes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Turn Actions & Status */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {isEditing ? (
                              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-300">
                                <input
                                  type="number"
                                  min="1"
                                  max="60"
                                  value={editUnits}
                                  onChange={(e) => setEditUnits(Number(e.target.value))}
                                  className="w-16 px-2 py-1 text-xs border border-slate-300 rounded font-mono font-bold bg-white"
                                />
                                <select
                                  value={editTurnType}
                                  onChange={(e) => setEditTurnType(e.target.value as TurnType)}
                                  className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-bold"
                                >
                                  <option value={TurnType.FIRST}>{t.turnTypeFirst}</option>
                                  <option value={TurnType.MIDDLE}>{t.turnTypeMiddle}</option>
                                  <option value={TurnType.LAST}>{t.turnTypeLast}</option>
                                  <option value={TurnType.FULL}>{t.turnTypeFull}</option>
                                </select>
                                <button
                                  onClick={() => handleSaveEdit(turn.id)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 cursor-pointer"
                                >
                                  {language === 'ar' ? 'حفظ' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingTurnId(null)}
                                  className="px-2 py-1 bg-slate-300 text-slate-700 rounded text-xs cursor-pointer"
                                >
                                  {t.cancel}
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEdit(turn)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                  title={t.editQuota}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {isCompleted ? (
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{language === 'ar' ? `تم الصرف (${turn.units} ${t.unitsShort})` : `Dispensed (${turn.units}U)`}</span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => onDispenseTurn(turn)}
                                    disabled={!canDispense}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                                      canDispense
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                    title={
                                      canDispense
                                        ? `${t.dispenseAction} ${turn.units} ${t.units}`
                                        : (language === 'ar' ? 'الماء المتبقي في الخزان غير كافٍ. يرجى ملء الخزان أولاً.' : 'Insufficient water remaining in 60U tank. Refill tank first.')
                                    }
                                  >
                                    <Droplets className="w-3.5 h-3.5" />
                                    <span>{t.dispenseAction} #{turn.orderInGroup}</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: 5 Objects Architecture Guide & Daily Logs */}
        <div className="lg:col-span-4 space-y-4">
          {/* 5-Object Snapshot Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'حالة الكائنات الخمسة (5 Objects)' : '5 System Objects State'}</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-medium">1. {t.objectGlobalTurn}:</span>
                <span className="font-mono font-bold text-white">{t.day} {currentTurn.dayNumber} / 43</span>
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-medium">2. {language === 'ar' ? 'المجموعة المستفيدة' : 'Active Group'}:</span>
                <span className="font-bold text-cyan-300">
                  {currentTurn.groups.map(g => g.groupName).join(', ')}
                </span>
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-medium">3. {t.tabPersons}:</span>
                <span className="font-mono font-bold text-white">{allTurnsToday.length} {language === 'ar' ? 'أعضاء' : 'Members'}</span>
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-medium">4. {t.objectWaterTurn}:</span>
                <span className="font-mono font-bold text-emerald-400">{allTurnsToday.length} {language === 'ar' ? 'نوب مجدولة' : 'Queued'}</span>
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 font-medium block mb-1.5">5. {language === 'ar' ? 'أنواع النوب الموزعة (TurnType):' : 'TurnType Rotation:'}</span>
                <div className="flex flex-wrap gap-1">
                  {allTurnsToday.map((turnObj) => (
                    <span
                      key={turnObj.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-700 text-slate-200"
                    >
                      {getTurnTypeLabel(turnObj.turnType, language)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Daily Global Turn Activity Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.executionLogs}
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{currentTurn.logs.length} {language === 'ar' ? 'أحداث' : 'events'}</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {currentTurn.logs.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4">{t.noLogsYet}</div>
              ) : (
                currentTurn.logs.map((log) => (
                  <div
                    key={log.id}
                    className={`text-[11px] p-2.5 rounded-lg border ${
                      log.severity === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : log.severity === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                      <span className="font-mono">{log.timestamp}</span>
                      <span className="font-semibold uppercase">{log.severity}</span>
                    </div>
                    <p className="leading-snug">{log.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
