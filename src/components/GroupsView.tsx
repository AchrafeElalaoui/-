/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Group, Person, TurnType } from '../types';
import { getPersonTurnOrder, getTurnTypeForOrder, getTurnTypeDetails } from '../utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel } from '../utils/i18n';
import { Users, Search, MapPin, Phone, Droplets, Calendar, ChevronDown, ChevronUp, UserCheck, ShieldCheck } from 'lucide-react';

interface GroupsViewProps {
  groups: Group[];
  persons: Person[];
  currentRound: number;
  currentDay: number;
  onSelectPerson: (person: Person) => void;
  onJumpToDay: (day: number) => void;
  language?: Language;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  persons,
  currentRound,
  currentDay,
  onSelectPerson,
  onJumpToDay,
  language = 'ar'
}) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [previewRound, setPreviewRound] = useState<number>(currentRound);
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(currentDay);

  // Extract unique sectors
  const sectors = ['ALL', ...Array.from(new Set(groups.map(g => g.sector)))];

  const filteredGroups = groups.filter(g => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.representativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || g.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
              {language === 'ar' ? '43 مجموعة كاملة' : '43 TOTAL GROUPS'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t.groupsSubtitle}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
            {t.groupsDirectory}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {language === 'ar'
              ? 'تضم كل مجموعة n من المستفيدين الذين يتم تدوير ترتيب نوبهم تلقائياً كل دورة عبر الـ 43 يوماً'
              : 'Every group features n members whose turn order dynamically permutes each round across 43 days'}
          </p>
        </div>

        {/* Round Preview Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <span className="text-xs font-bold text-slate-600 px-1">{language === 'ar' ? 'محاكاة التدوير للدورة:' : 'Simulate for:'}</span>
          <select
            value={previewRound}
            onChange={(e) => setPreviewRound(Number(e.target.value))}
            className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden font-mono cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(r => (
              <option key={r} value={r}>{t.round} {r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchGroups}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-9 pe-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">{t.filterSector}:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-hidden cursor-pointer"
          >
            {sectors.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? t.allSectors : s}</option>
            ))}
          </select>
          <span className="text-xs font-mono text-slate-400">
            ({filteredGroups.length})
          </span>
        </div>
      </div>

      {/* 43 Groups Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => {
          const groupMembers = persons.filter(p => p.groupId === group.id && p.active);
          const totalMembers = groupMembers.length;
          const isExpanded = expandedGroupId === group.id;
          const isTodayGroup = group.id === currentDay;

          // Calculate rotated turn orders for this group under the chosen previewRound
          const membersWithRotatedTurn = groupMembers.map((member) => {
            const memberIndex = group.memberIds.indexOf(member.id);
            const safeIndex = memberIndex >= 0 ? memberIndex : 0;
            const order = getPersonTurnOrder(safeIndex, totalMembers, previewRound);
            const turnType = getTurnTypeForOrder(order, totalMembers);
            return { member, order, turnType };
          }).sort((a, b) => a.order - b.order);

          const totalQuota = groupMembers.reduce((sum, m) => sum + m.waterUnitsQuota, 0);

          return (
            <div
              key={group.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isTodayGroup
                  ? 'border-blue-400 ring-2 ring-blue-100 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Group Card Top Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl font-mono font-bold flex items-center justify-center text-sm shadow-xs shrink-0 ${
                    isTodayGroup
                      ? 'bg-blue-600 text-white shadow-blue-500/30'
                      : 'bg-slate-900 text-white'
                  }`}>
                    G{group.id.toString().padStart(2, '0')}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{group.name}</h3>
                      {isTodayGroup && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full animate-pulse">
                          {language === 'ar' ? `نوبة اليوم (${t.day} ${currentDay})` : `Today (Day ${currentDay})`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{group.sector}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onJumpToDay(group.id)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-[11px] font-bold transition-colors shrink-0 cursor-pointer"
                  title={`${language === 'ar' ? 'الانتقال إلى اليوم' : 'Jump to Day'} ${group.id}`}
                >
                  {t.day} {group.id}
                </button>
              </div>

              {/* Group Summary Metrics */}
              <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">{t.totalMembers}:</span>
                  <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    {totalMembers} {language === 'ar' ? 'مستفيدين' : 'People'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t.dailyQuota}:</span>
                  <span className="font-bold text-blue-700 font-mono flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    {totalQuota} / 60 {t.units}
                  </span>
                </div>
              </div>

              {/* Representative / Coordinator Info */}
              <div className="px-4 py-2.5 text-xs text-slate-600 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">{t.representative}:</span>
                <span className="font-bold text-slate-800 truncate max-w-[170px]">
                  {group.representativeName}
                </span>
              </div>

              {/* Members and Rotated Turn Sequence Accordion */}
              <div className="p-3 bg-slate-50/40 border-t border-slate-100">
                <button
                  onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>{language === 'ar' ? `ترتيب نوب الدورة ${previewRound} (${totalMembers} أعضاء)` : `Round ${previewRound} Turn Sequence (${totalMembers} Members)`}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/60">
                    {membersWithRotatedTurn.map(({ member, order, turnType }) => {
                      const ttDetails = getTurnTypeDetails(turnType);

                      return (
                        <div
                          key={member.id}
                          onClick={() => onSelectPerson(member)}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-100 font-mono font-bold text-[10px] text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                              #{order}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900">{member.name}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{member.plotNumber}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-700 text-[11px]">
                              {member.waterUnitsQuota} {t.unitsShort}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${ttDetails.badgeColor}`}>
                              {getTurnTypeLabel(turnType, language)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
