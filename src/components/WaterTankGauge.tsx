/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Droplets, RefreshCw, AlertTriangle, CheckCircle2, ArrowDownCircle } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface WaterTankGaugeProps {
  capacity?: number; // default 60
  remaining: number;
  allocatedToday: number;
  isDispensing?: boolean;
  onRefill?: () => void;
  compact?: boolean;
  language?: Language;
}

export const WaterTankGauge: React.FC<WaterTankGaugeProps> = ({
  capacity = 60,
  remaining,
  allocatedToday,
  isDispensing = false,
  onRefill,
  compact = false,
  language = 'ar'
}) => {
  const t = TRANSLATIONS[language];
  const percentage = Math.min(100, Math.max(0, (remaining / capacity) * 100));
  const dispensedToday = Math.max(0, capacity - remaining);
  const isLow = percentage < 25;
  const isEmpty = remaining <= 0;
  const isOverAllocated = allocatedToday > capacity;

  if (compact) {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 shrink-0">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">{t.tankTitle}</div>
            <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1.5">
              <span>{remaining}</span>
              <span className="text-xs text-slate-400 font-normal">/ {capacity} {t.units}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isLow ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {onRefill && (
            <button
              onClick={onRefill}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-300 rounded-lg transition-colors flex items-center gap-1 border border-slate-700 cursor-pointer"
              title={t.refillTank}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.refillTank}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800/80 shadow-lg relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Tank Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Droplets className={`w-5 h-5 ${isDispensing ? 'animate-bounce text-cyan-300' : ''}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-tight">{t.tankTitle}</h3>
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                {capacity} {t.units} ({t.capacity})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {t.tankSubtitle}
            </p>
          </div>
        </div>

        {onRefill && (
          <button
            onClick={onRefill}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/25 hover:bg-blue-600/40 text-cyan-300 text-xs font-bold rounded-xl border border-blue-500/40 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.refillTank}</span>
          </button>
        )}
      </div>

      {/* Main Tank Visual & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-5 relative z-10">
        {/* Left: 3D Visual Water Tank Cylinder */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-52 bg-slate-950/80 rounded-2xl border-2 border-slate-700 p-2 shadow-2xl flex flex-col justify-end overflow-hidden">
            {/* Glass reflection gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none z-20" />
            
            {/* Top lid ring */}
            <div className="absolute top-2 left-2 right-2 h-4 rounded-full border border-slate-600/60 bg-slate-800/80 z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-500/50 rounded-full" />
            </div>

            {/* Scale unit markers on the side */}
            <div className="absolute end-3 top-8 bottom-4 flex flex-col justify-between text-[9px] font-mono text-slate-500 z-20 select-none">
              <span className="flex items-center gap-1">--- 60 {t.unitsShort}</span>
              <span className="flex items-center gap-1">--- 45 {t.unitsShort}</span>
              <span className="flex items-center gap-1">--- 30 {t.unitsShort}</span>
              <span className="flex items-center gap-1">--- 15 {t.unitsShort}</span>
              <span className="flex items-center gap-1">--- 0 {t.unitsShort}</span>
            </div>

            {/* Dispensing stream visual */}
            {isDispensing && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-cyan-400/80 blur-xs animate-pulse z-30 flex items-center justify-center">
                <ArrowDownCircle className="w-3 h-3 text-white animate-bounce" />
              </div>
            )}

            {/* Liquid Body */}
            <div
              className={`w-full rounded-b-xl transition-all duration-700 ease-out relative overflow-hidden ${
                isEmpty
                  ? 'bg-slate-800'
                  : isLow
                  ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400'
                  : 'bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-400'
              }`}
              style={{ height: `${Math.max(4, percentage)}%` }}
            >
              {/* Wave surface shimmer */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-white/40 blur-[1px] animate-pulse" />
              {/* Bubbles */}
              <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping" />
              <div className="absolute bottom-6 right-6 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
            </div>

            {/* Center live numeric reading */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
              <div className="backdrop-blur-sm bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-lg text-center">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {remaining}
                </span>
                <span className="text-[10px] text-slate-300 mx-1 font-bold">/ {capacity} {t.unitsShort}</span>
                <div className="text-[10px] font-bold text-cyan-300">{percentage.toFixed(0)}% {language === 'ar' ? 'ممتلئ' : 'Full'}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-medium">
            <span className={`w-2 h-2 rounded-full ${isDispensing ? 'bg-cyan-400 animate-ping' : isLow ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span>{isDispensing ? t.valveOpen : isLow ? t.tankLow : t.valveClosed}</span>
          </div>
        </div>

        {/* Right: Metrics & Turn Allocation Status */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-slate-400">{t.capacity}</div>
              <div className="text-xl font-bold font-mono text-white mt-1">60 <span className="text-xs text-slate-400 font-normal">{t.units}</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'ar' ? 'سعة الخزان الثابتة' : 'Fixed daily volume'}</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-slate-400">{t.todayDemand}</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{allocatedToday} <span className="text-xs text-slate-400 font-normal">{t.units}</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'ar' ? 'حصة المجموعات المجدولة' : "Today's group quota"}</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-semibold text-slate-400">{t.allocated}</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{dispensedToday} <span className="text-xs text-slate-400 font-normal">{t.units}</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'ar' ? 'تم صرفه للمستفيدين' : 'Delivered to members'}</div>
            </div>
          </div>

          {/* Allocation Feasibility Bar */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-bold">{language === 'ar' ? 'ميزان استهلاك الخزان اليومي' : 'Daily Tank Consumption Balance'}</span>
              <span className="font-mono text-slate-400 text-[11px]">
                {dispensedToday} {t.unitsShort} + {Math.max(0, remaining)} {t.unitsShort} = {capacity} {t.unitsShort}
              </span>
            </div>
            
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${(dispensedToday / capacity) * 100}%` }}
                title={`${t.allocated}: ${dispensedToday} ${t.units}`}
              />
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${(remaining / capacity) * 100}%` }}
                title={`${t.remaining}: ${remaining} ${t.units}`}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {t.allocated} ({dispensedToday} {t.unitsShort})
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                {t.remaining} ({remaining} {t.unitsShort})
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
                {language === 'ar' ? 'غير مخصص' : 'Unallocated'} ({Math.max(0, capacity - allocatedToday)} {t.unitsShort})
              </span>
            </div>
          </div>

          {/* Warning or Status Notice */}
          {isOverAllocated ? (
            <div className="flex items-center gap-2 p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-200 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === 'ar'
                  ? `الطلب المجدول لليوم (${allocatedToday} وحدة) يتجاوز سعة الخزان بمقدار ${allocatedToday - capacity} وحدة.`
                  : `Today's scheduled demand (${allocatedToday} Units) exceeds the 60-unit tank capacity by ${allocatedToday - capacity} units.`}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {language === 'ar'
                  ? `سعة الخزان (60 وحدة) تغطي بالكامل طلب اليوم المجدول والبالغ ${allocatedToday} وحدة.`
                  : `Tank volume fully covers today's allocated group demand of ${allocatedToday} units.`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

