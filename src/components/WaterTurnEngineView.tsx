/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Group, Person, TurnType } from '../types';
import { getPersonTurnOrder, getTurnTypeForOrder, getTurnTypeDetails } from '../utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel, getTurnTypeDescription } from '../utils/i18n';
import { Layers, RotateCw, CheckCircle2, ShieldCheck, Droplets, ArrowRight, Zap, Info } from 'lucide-react';

interface WaterTurnEngineViewProps {
  groups: Group[];
  persons: Person[];
  currentRound: number;
  onSelectPerson: (person: Person) => void;
  language?: Language;
}

export const WaterTurnEngineView: React.FC<WaterTurnEngineViewProps> = ({
  groups,
  persons,
  currentRound,
  onSelectPerson,
  language = 'ar'
}) => {
  const t = TRANSLATIONS[language];
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
  const [matrixRoundsCount, setMatrixRoundsCount] = useState<number>(8);

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const groupMembers = persons.filter(p => p.groupId === selectedGroup?.id && p.active);
  const totalMembers = groupMembers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            {language === 'ar' ? 'محرك الكائنات الخمسة (5 Objects Engine)' : '5 SYSTEM OBJECTS ENGINE'}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {language === 'ar' ? 'العدالة الرياضية والتناوب الدوري التلقائي' : 'Mathematical Fairness & Cyclic Permutation'}
          </span>
        </div>
        <h2 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
          {language === 'ar' ? 'محرك كائنات نوب المياه (WaterTurn) والتدوير الدوري لـ 43 يوماً' : 'WaterTurn Objects & 43-Day Dynamic Rotation Engine'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          {language === 'ar'
            ? 'النموذج الهيكلي المتكامل الذي يربط الكائنات الـ 5 مع قيود سعة الخزان (60 وحدة) وتدوير رتب المستفيدين'
            : 'Deep architectural model detailing the 5 objects, tank volume constraints, and multi-round turn sequence shift'}
        </p>
      </div>

      {/* The 5 System Objects Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {/* Object 1: Global Turn */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              {language === 'ar' ? 'الكائن 1' : 'OBJECT 1'}
            </div>
            <h3 className="text-base font-bold text-white mt-1">1. GlobalTurn</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {language === 'ar'
                ? 'اليوم = نوبة عامة واحدة (1 Global Turn). الدورة 43 يوماً تضم 43 نوبة عامة تدير خزان الـ 60 وحدة.'
                : '1 Day = 1 Global Turn. A 43-day round contains 43 Global Turns managing the 60-unit main tank.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
            {language === 'ar' ? (
              <>
                • سعة الخزان 60 وحدة يومياً<br />
                • دورة كاملة مدتها 43 يوماً<br />
                • يحوي المجموعات المجدولة
              </>
            ) : (
              <>
                • 60 Units Tank Volume<br />
                • 43 Days per Round Cycle<br />
                • Holds scheduled groups
              </>
            )}
          </div>
        </div>

        {/* Object 2: Group */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
              {language === 'ar' ? 'الكائن 2' : 'OBJECT 2'}
            </div>
            <h3 className="text-base font-bold text-white mt-1">2. Group</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {language === 'ar'
                ? '43 مجموعة سقي زراعي. تضم كل مجموعة n مستفيداً يستلمون الماء وفق ترتيب دوري.'
                : '43 community irrigation groups. Each group has n members who receive water in cyclic order.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
            {language === 'ar' ? (
              <>
                • 43 مجموعة بالتحديد<br />
                • منسق وممثل لكل مجموعة<br />
                • توزيع حسب القطاعات الجغرافية
              </>
            ) : (
              <>
                • Exactly 43 Groups<br />
                • Representative coordinator<br />
                • Sector plot assignments
              </>
            )}
          </div>
        </div>

        {/* Object 3: Person */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
              {language === 'ar' ? 'الكائن 3' : 'OBJECT 3'}
            </div>
            <h3 className="text-base font-bold text-white mt-1">3. Person</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {language === 'ar'
                ? 'المستفيد الفردي مع بياناته الشخصية، حصته المعتمدة (n وحدة)، وسجل الصرف التاريخي الكامل.'
                : 'Individual beneficiary with personnel infos, quota units, and full chronological allocation history.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
            {language === 'ar' ? (
              <>
                • البيانات الشخصية ورقم الهاتف<br />
                • الحصة المائية المقررة (n وحدة)<br />
                • سجل النوب التاريخي الموثق
              </>
            ) : (
              <>
                • Personnel contact info<br />
                • Water volume quota (n units)<br />
                • Chronological history records
              </>
            )}
          </div>
        </div>

        {/* Object 4: WaterTurn */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              {language === 'ar' ? 'الكائن 4' : 'OBJECT 4'}
            </div>
            <h3 className="text-base font-bold text-white mt-1">4. WaterTurn</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {language === 'ar'
                ? 'وحدة الصرف التنفيذية التي تحمل n وحدات ماء، طابعاً زمنياً، وحالة ونوع النوبة (TurnType).'
                : 'Execution unit holding n water units, timestamp, status, and associated TurnType enum.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
            {language === 'ar' ? (
              <>
                • حجم ماء محدد (n وحدة)<br />
                • خصم فوري من منسوب الخزان<br />
                • حالة فتح الصمام والضخ
              </>
            ) : (
              <>
                • n water units volume<br />
                • Tank level delta tracking<br />
                • Real-time valve status
              </>
            )}
          </div>
        </div>

        {/* Object 5: TurnType Enum */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              {language === 'ar' ? 'الكائن 5' : 'OBJECT 5'}
            </div>
            <h3 className="text-base font-bold text-white mt-1">5. TurnType Enum</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {language === 'ar'
                ? 'حالات التدفق الأربع التي تحدد ضغط الماء والترتيب الطبيعي للصرف.'
                : 'The 4 distinct flow classification states governing physical pressure and sequence.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-0.5">
            <span className="text-emerald-400">FIRST (الأولى)</span> • <span className="text-sky-400">MIDDEL (الوسطى)</span><br />
            <span className="text-amber-400">LAST (الأخيرة)</span> • <span className="text-purple-400">FULL (الكاملة)</span>
          </div>
        </div>
      </div>

      {/* TurnType Enum Breakdown Guide */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>{language === 'ar' ? 'تعريفات حالات النوبة (TurnType) وخصائص الضغط الهيدروليكي' : 'TurnType Enum Definitions & Physical Flow Characteristics'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[TurnType.FIRST, TurnType.MIDDLE, TurnType.LAST, TurnType.FULL].map((tt) => {
            const details = getTurnTypeDetails(tt);

            return (
              <div key={tt} className={`rounded-xl border p-4 ${details.bg}`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${details.badgeColor}`}>
                    {getTurnTypeLabel(tt, language)}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${details.dot}`} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-2">
                  {language === 'ar'
                    ? (tt === TurnType.FIRST ? 'نوبة البداية (FIRST)' : tt === TurnType.MIDDLE ? 'نوبة الوسط (MIDDEL)' : tt === TurnType.LAST ? 'نوبة الختام (LAST)' : 'النوبة الشاملة (FULL)')
                    : details.displayName}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  {getTurnTypeDescription(tt, language)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Multi-Round Turn Order Permutation Simulator */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-indigo-600" />
              <span>{language === 'ar' ? 'مصفوفة محاكاة تدوير رتب النوب عبر الدورات' : 'Multi-Round Turn Order Permutation Matrix'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {language === 'ar'
                ? 'اختر أي مجموعة من الـ 43 لمحاكاة كيف يتغير ترتيب النوب وأنواعها بين الأعضاء بالعدل مع كل دورة'
                : 'Select any of the 43 groups to simulate how member turn order and TurnTypes permute fairly across rounds'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-mono cursor-pointer"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.sector}) - {persons.filter(p => p.groupId === g.id).length} {language === 'ar' ? 'مستفيدين' : 'Members'}
                </option>
              ))}
            </select>

            <select
              value={matrixRoundsCount}
              onChange={(e) => setMatrixRoundsCount(Number(e.target.value))}
              className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white cursor-pointer"
            >
              <option value={4}>4 {language === 'ar' ? 'دورات' : 'Rounds'}</option>
              <option value={8}>8 {language === 'ar' ? 'دورات' : 'Rounds'}</option>
              <option value={12}>12 {language === 'ar' ? 'دورة' : 'Rounds'}</option>
            </select>
          </div>
        </div>

        {/* Matrix Visualization Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-mono text-[11px]">
                <th className="py-3 px-4 border-r border-slate-800 sticky start-0 bg-slate-900 z-10 text-start">
                  {language === 'ar' ? `أعضاء المجموعة (${totalMembers} مستفيدين)` : `Group Member (${totalMembers} people)`}
                </th>
                <th className="py-3 px-3 border-r border-slate-800 text-center">{t.quotaUnits}</th>
                {Array.from({ length: matrixRoundsCount }, (_, r) => r + 1).map((roundNum) => (
                  <th
                    key={roundNum}
                    className={`py-3 px-3 text-center border-r border-slate-800 font-bold ${
                      roundNum === currentRound ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    {t.round} {roundNum} {roundNum === currentRound ? (language === 'ar' ? '(الحالية)' : '(Active)') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupMembers.map((member, memberIdx) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-200 sticky start-0 bg-white z-10 text-start">
                    <button
                      onClick={() => onSelectPerson(member)}
                      className="hover:text-blue-600 font-bold transition-colors text-start cursor-pointer"
                    >
                      {member.name}
                    </button>
                    <div className="text-[10px] text-slate-400 font-mono">{member.plotNumber}</div>
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-bold text-blue-700 border-r border-slate-200 bg-slate-50/50">
                    {member.waterUnitsQuota} {t.unitsShort}
                  </td>

                  {Array.from({ length: matrixRoundsCount }, (_, r) => r + 1).map((roundNum) => {
                    const order = getPersonTurnOrder(memberIdx, totalMembers, roundNum);
                    const turnType = getTurnTypeForOrder(order, totalMembers);
                    const ttDetails = getTurnTypeDetails(turnType);
                    const isCurrent = roundNum === currentRound;

                    return (
                      <td
                        key={roundNum}
                        className={`py-2.5 px-3 text-center border-r border-slate-100 ${
                          isCurrent ? 'bg-blue-50/60' : ''
                        }`}
                      >
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            #{order}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${ttDetails.badgeColor}`}>
                            {getTurnTypeLabel(turnType, language)}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mathematical Proof Note */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-900">{language === 'ar' ? 'ضمان التدوير الدوري العادل:' : 'Cyclic Rotation Guarantee:'}</span>{' '}
            {language === 'ar' ? (
              <>
                لأي مستفيد ترتيبه الفهرسي <em>i</em> في مجموعة تضم <em>N</em> أعضاء عند الدورة <em>R</em>، يتم احتساب ترتيب النوبة بالمعادلة: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">order = ((i + R - 1) % N) + 1</code>. على مدار <em>N</em> دورات متعاقبة (كل دورة 43 يوماً)، يضمن النظام لكل مستفيد الحصول على نفس عدد نوب <span className="font-bold text-emerald-700">البداية (FIRST)</span>، و<span className="font-bold text-sky-700">الوسط (MIDDEL)</span>، و<span className="font-bold text-amber-700">الختام (LAST)</span>، مما يلغي أي تحيز في تدفق المياه نهائياً.
              </>
            ) : (
              <>
                For any member with index <em>i</em> in a group of <em>N</em> persons on Round <em>R</em>, the turn position is determined by <code>order = ((i + R - 1) % N) + 1</code>. Over <em>N</em> successive 43-day rounds, every member is guaranteed an equal number of <span className="font-bold text-emerald-700">FIRST</span>, <span className="font-bold text-sky-700">MIDDEL</span>, and <span className="font-bold text-amber-700">LAST</span> turns, fully eliminating structural water delivery bias.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
