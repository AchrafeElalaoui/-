/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Droplets, Calendar, Users, Layers, Activity, ChevronLeft, ChevronRight, RotateCcw, PlusCircle, ShieldCheck, Languages } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface NavbarProps {
  currentDay: number;
  currentRound: number;
  activeTab: 'globalTurn' | 'groups' | 'persons' | 'waterEngine' | 'analytics';
  setActiveTab: (tab: 'globalTurn' | 'groups' | 'persons' | 'waterEngine' | 'analytics') => void;
  onNextDay: () => void;
  onPrevDay: () => void;
  onOpenManualModal: () => void;
  onResetToDay1: () => void;
  tankRemainingUnits: number;
  tankCapacity: number;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDay,
  currentRound,
  activeTab,
  setActiveTab,
  onNextDay,
  onPrevDay,
  onOpenManualModal,
  onResetToDay1,
  tankRemainingUnits,
  tankCapacity,
  language,
  onToggleLanguage
}) => {
  const t = TRANSLATIONS[language];
  const roundProgress = (currentDay / 43) * 100;
  const isRtl = language === 'ar';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Banner: Global cycle status & Day control */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & System Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-black text-white tracking-tight">{t.appName}</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  {t.badgeSpec}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Center / Right: 43-Day Cycle Controls & Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer shadow-xs"
              title={t.switchLang}
            >
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Round & Day Badge with Navigator */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shadow-inner">
              <button
                onClick={isRtl ? onNextDay : onPrevDay}
                disabled={isRtl ? currentDay >= 43 : currentDay <= 1}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                title={isRtl ? t.nextDay : t.prevDay}
              >
                {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <div className="px-3 py-0.5 text-center min-w-[125px]">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t.round} {currentRound}
                </div>
                <div className="text-sm font-bold font-mono text-cyan-300 flex items-center justify-center gap-1">
                  <span>{t.day} {currentDay}</span>
                  <span className="text-slate-500 text-xs font-normal">/ 43</span>
                </div>
              </div>

              <button
                onClick={isRtl ? onPrevDay : onNextDay}
                disabled={isRtl ? currentDay <= 1 : currentDay >= 43}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-slate-800 transition-colors"
                title={isRtl ? t.prevDay : t.nextDay}
              >
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={onOpenManualModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs shadow-blue-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.manualTurnBtn}</span>
            </button>

            <button
              onClick={onResetToDay1}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors cursor-pointer"
              title={t.resetCycle}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 43-Day Round Progress Strip */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">{language === 'ar' ? 'تقدم دورة الـ 43 يوماً:' : '43-Day Cycle Progress:'}</span>
            <span className="font-mono text-cyan-400 font-bold">{roundProgress.toFixed(0)}%</span>
            <span className="text-slate-500">({43 - currentDay} {language === 'ar' ? 'يوماً متبقية في الدورة' : 'days remaining'})</span>
          </div>

          <div className="flex-1 min-w-[140px] max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${roundProgress}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">{t.tankStatus}:</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              {tankRemainingUnits} / {tankCapacity} {t.unitsShort}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-950/70 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('globalTurn')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'globalTurn'
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-cyan-300" />
            <span>{t.tabGlobalTurn}</span>
            <span className="px-1.5 py-0.2 bg-slate-900/60 text-cyan-200 rounded-full text-[10px] font-mono">
              {t.day} {currentDay}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-300" />
            <span>{t.tabGroups}</span>
            <span className="px-1.5 py-0.2 bg-slate-900/60 text-slate-300 rounded-full text-[10px] font-mono">
              43
            </span>
          </button>

          <button
            onClick={() => setActiveTab('persons')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'persons'
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            <span>{t.tabPersons}</span>
          </button>

          <button
            onClick={() => setActiveTab('waterEngine')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'waterEngine'
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{t.tabEngine}</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-300" />
            <span>{t.tabAnalytics}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

