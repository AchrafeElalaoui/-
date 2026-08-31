/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Group, Person, TurnType, GlobalTurn } from '../types';
import { getTurnTypeDetails } from '../utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel, getTurnTypeDescription } from '../utils/i18n';
import { BarChart3, Download, Droplets, Calendar, Users, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  currentDay: number;
  currentRound: number;
  groups: Group[];
  persons: Person[];
  currentTurn: GlobalTurn;
  language?: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentDay,
  currentRound,
  groups,
  persons,
  currentTurn,
  language = 'ar'
}) => {
  const t = TRANSLATIONS[language];
  // Total round statistics
  const totalRoundCapacity = 43 * 60; // 2,580 units per 43-day round
  const allHistoryRecords = persons.flatMap(p => p.allocationHistory || []);
  const totalWaterDeliveredLifetime = allHistoryRecords.reduce((sum, r) => sum + (r.status === 'COMPLETED' ? r.unitsAllocated : 0), 0);

  // Group demand totals
  const totalDailyDemandAllGroups = persons.reduce((sum, p) => sum + (p.active ? p.waterUnitsQuota : 0), 0);
  const avgQuotaPerPerson = persons.length > 0 ? (totalDailyDemandAllGroups / persons.length).toFixed(1) : '0';

  // TurnType distribution in historical allocations
  const turnCounts = {
    [TurnType.FIRST]: allHistoryRecords.filter(r => r.turnType === TurnType.FIRST).length,
    [TurnType.MIDDLE]: allHistoryRecords.filter(r => r.turnType === TurnType.MIDDLE).length,
    [TurnType.LAST]: allHistoryRecords.filter(r => r.turnType === TurnType.LAST).length,
    [TurnType.FULL]: allHistoryRecords.filter(r => r.turnType === TurnType.FULL).length,
  };

  const handleExportCSV = () => {
    const headers = language === 'ar' 
      ? ['معرف المستفيد', 'الاسم', 'معرف المجموعة', 'اسم المجموعة', 'الهاتف', 'رقم القطعة', 'حصة الماء (وحدة)', 'إجمالي الماء المستلم (وحدة)', 'عدد النوب']
      : ['Person ID', 'Name', 'Group ID', 'Group Name', 'Phone', 'Plot', 'Water Quota (Units)', 'Total Historical Received (Units)', 'Total Turns'];
    
    const rows = persons.map(p => {
      const g = groups.find(grp => grp.id === p.groupId);
      const totalRcv = p.allocationHistory?.reduce((sum, h) => sum + (h.status === 'COMPLETED' ? h.unitsAllocated : 0), 0) || 0;
      return [
        p.id,
        `"${p.name}"`,
        p.groupId,
        `"${g?.name || ''}"`,
        `"${p.phone}"`,
        `"${p.plotNumber}"`,
        p.waterUnitsQuota,
        totalRcv,
        p.allocationHistory?.length || 0
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `water_allocation_round_${currentRound}_day_${currentDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
              {language === 'ar' ? 'مؤشرات دورة 43 يوماً' : '43-DAY CYCLE METRICS'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t.round} {currentRound} • {t.day} {currentDay} {language === 'ar' ? 'من 43' : 'of 43'}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
            {t.analyticsTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t.analyticsSubtitle}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{t.capacity}</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            60 <span className="text-xs text-slate-500 font-normal">{t.units} / {t.day}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            2,580 {t.units} {language === 'ar' ? 'لكل دورة (43 يوماً)' : 'per 43-Day Round'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{t.groups}</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-700 mt-2">
            43 <span className="text-xs text-slate-500 font-normal">{language === 'ar' ? 'مجموعة' : 'Groups'}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            {persons.length} {language === 'ar' ? 'مستفيد مسجل بالكامل' : 'Total Registered Beneficiaries'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{language === 'ar' ? 'إجمالي الماء المصروف' : 'Total Water Dispensed'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-2">
            {totalWaterDeliveredLifetime} <span className="text-xs text-slate-500 font-normal">{t.units}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            {language === 'ar' ? `عبر ${allHistoryRecords.length} عملية صرف مسجلة` : `Across ${allHistoryRecords.length} recorded turn events`}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{language === 'ar' ? 'متوسط الحصة / مستفيد' : 'Average Quota / Member'}</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-700 mt-2">
            {avgQuotaPerPerson} <span className="text-xs text-slate-500 font-normal">{t.units}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            {language === 'ar' ? 'متوسط حجم السقي المعتمد' : 'Standard irrigation delivery size'}
          </div>
        </div>
      </div>

      {/* TurnType Distribution & Equity Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>{language === 'ar' ? 'توزيع أنماط النوب (TurnType) المحققة للعدالة' : 'Lifetime TurnType Delivery Distribution'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[TurnType.FIRST, TurnType.MIDDLE, TurnType.LAST, TurnType.FULL].map((tt) => {
            const details = getTurnTypeDetails(tt);
            const count = turnCounts[tt] || 0;
            const percentage = allHistoryRecords.length > 0 ? ((count / allHistoryRecords.length) * 100).toFixed(1) : '0';

            return (
              <div key={tt} className={`rounded-xl border p-4 ${details.bg}`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${details.badgeColor}`}>
                    {getTurnTypeLabel(tt, language)}
                  </span>
                  <span className="text-xs font-mono font-bold">{percentage}%</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 mt-2">
                  {count} <span className="text-xs text-slate-600 font-normal">{language === 'ar' ? 'نوبة' : 'Turns'}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">{getTurnTypeDescription(tt, language)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 43 Groups Demand Matrix Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">{language === 'ar' ? 'ميزان طلب الـ 43 مجموعة مقابل سعة خزان الـ 60 وحدة' : '43 Groups Demand vs. 60-Unit Tank Feasibility'}</h3>
          <span className="text-xs text-slate-500 font-mono">43 {t.groups}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {groups.map((g) => {
            const gMembers = persons.filter(p => p.groupId === g.id && p.active);
            const demand = gMembers.reduce((sum, m) => sum + m.waterUnitsQuota, 0);
            const isToday = g.id === currentDay;

            return (
              <div
                key={g.id}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isToday
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`text-[10px] font-mono font-bold ${isToday ? 'text-blue-200' : 'text-slate-500'}`}>
                  G{g.id.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-black font-mono mt-0.5">
                  {demand} {t.unitsShort}
                </div>
                <div className={`text-[9px] ${isToday ? 'text-blue-100' : 'text-slate-400'}`}>
                  {gMembers.length} {language === 'ar' ? 'مستفيد' : 'people'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
