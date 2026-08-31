/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Person, Group, TurnType, AllocationHistoryRecord } from '../types';
import { getTurnTypeDetails } from '../utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel, getTurnTypeDescription } from '../utils/i18n';
import { X, User, Phone, MapPin, Droplets, Calendar, History, Shield, Edit2, Check, BarChart2 } from 'lucide-react';

interface PersonProfileModalProps {
  person: Person | null;
  group: Group | null;
  onClose: () => void;
  onUpdatePerson: (updated: Person) => void;
  language?: Language;
}

export const PersonProfileModal: React.FC<PersonProfileModalProps> = ({
  person,
  group,
  onClose,
  onUpdatePerson,
  language = 'ar'
}) => {
  if (!person) return null;

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: person.name,
    phone: person.phone,
    plotNumber: person.plotNumber,
    waterUnitsQuota: person.waterUnitsQuota,
    notes: person.notes || '',
    active: person.active,
  });

  // Calculate statistics across allocation history
  const history = person.allocationHistory || [];
  const totalWaterReceived = history.reduce((sum, h) => sum + (h.status === 'COMPLETED' ? h.unitsAllocated : 0), 0);
  
  const turnCounts = {
    [TurnType.FIRST]: history.filter(h => h.turnType === TurnType.FIRST).length,
    [TurnType.MIDDLE]: history.filter(h => h.turnType === TurnType.MIDDLE).length,
    [TurnType.LAST]: history.filter(h => h.turnType === TurnType.LAST).length,
    [TurnType.FULL]: history.filter(h => h.turnType === TurnType.FULL).length,
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePerson({
      ...person,
      name: formData.name,
      phone: formData.phone,
      plotNumber: formData.plotNumber,
      waterUnitsQuota: Number(formData.waterUnitsQuota),
      notes: formData.notes,
      active: formData.active,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{person.name}</h2>
                <span className="px-2 py-0.5 text-xs font-mono rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {person.id}
                </span>
                {formData.active ? (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-700 text-slate-300 rounded-full">
                    {language === 'ar' ? 'غير نشط' : 'Inactive'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'ar' ? 'عضو في ' : 'Member of '}
                <span className="font-bold text-white">{group?.name || `Group ${person.groupId}`}</span> ({group?.sector || 'واحة النخيل'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? t.cancel : (language === 'ar' ? 'تعديل البيانات' : 'Edit Profile')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Edit Form or Information Card */}
          {isEditing ? (
            <form onSubmit={handleSave} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">{language === 'ar' ? 'تعديل بيانات المستفيد' : 'Edit Personnel Info'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.fullName}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.phone}</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.plotNumber}</label>
                  <input
                    type="text"
                    required
                    value={formData.plotNumber}
                    onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.quotaUnits} ({t.units})</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={formData.waterUnitsQuota}
                    onChange={(e) => setFormData({ ...formData, waterUnitsQuota: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ar' ? 'ملاحظات المستفيد والمحصول' : 'Personnel Notes'}</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={language === 'ar' ? 'احتياجات السقي، نوع المحصول، تفاصيل القطعة...' : 'Irrigation requirements, crop type, crop parcel notes...'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
                  />
                  <span>{language === 'ar' ? 'عضو نشط في جدول الـ 43 يوماً' : 'Active Member in 43-Day Water Schedule'}</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.quotaUnits}</span>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                  {person.waterUnitsQuota} <span className="text-xs text-slate-500 font-normal">{t.units}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.plotNumber}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1 truncate">
                  {person.plotNumber}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.phone}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1 truncate font-mono">
                  {person.phone}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>{language === 'ar' ? 'إجمالي المستلم' : 'Total Delivered'}</span>
                </div>
                <div className="text-lg font-bold font-mono text-purple-700 mt-1">
                  {totalWaterReceived} <span className="text-xs text-slate-500 font-normal">{t.unitsShort}</span>
                </div>
              </div>
            </div>
          )}

          {/* Turn Type Rotation Equity Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'ar' ? 'ميزان تناوب أنماط النوب وعدالة التوزيع' : 'Turn Type Experience & Rotation Balance'}</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {language === 'ar' ? 'إجمالي النوب:' : 'Total Allocations:'} {history.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[TurnType.FIRST, TurnType.MIDDLE, TurnType.LAST, TurnType.FULL].map((tt) => {
                const details = getTurnTypeDetails(tt);
                const count = turnCounts[tt] || 0;
                return (
                  <div key={tt} className={`rounded-lg p-2.5 border ${details.bg} flex items-center justify-between`}>
                    <div>
                      <div className="text-[11px] font-bold">{getTurnTypeLabel(tt, language)}</div>
                      <div className="text-[10px] opacity-80 font-medium">{tt}</div>
                    </div>
                    <span className="text-base font-bold font-mono px-2 py-0.5 rounded-md bg-white/70 border border-black/5">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chronological Water Allocation History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{t.history}</h3>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                {history.length} {language === 'ar' ? 'سجلات صرف' : 'Recorded Allocations'}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                {language === 'ar'
                  ? 'لا توجد سجلات صرف سابقة لهذا المستفيد حتى الآن. قم بتنفيذ نوبة اليوم لتسجيل أول عملية صرف.'
                  : "No past allocation records yet for this person. Run today's Global Turn to record their first allocation."}
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100">
                <div className="bg-slate-100/80 px-3.5 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider grid grid-cols-12">
                  <span className="col-span-3">{language === 'ar' ? 'اليوم / الدورة' : 'Day / Round'}</span>
                  <span className="col-span-3">{language === 'ar' ? 'نوع النوبة' : 'Turn Type'}</span>
                  <span className="col-span-3">{language === 'ar' ? 'الكمية وحالة الخزان' : 'Units & Tank'}</span>
                  <span className="col-span-3 text-end">{language === 'ar' ? 'الحالة والتاريخ' : 'Status / Date'}</span>
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {history.map((record) => {
                    const ttDetails = getTurnTypeDetails(record.turnType);
                    return (
                      <div key={record.id} className="px-3.5 py-2.5 text-xs hover:bg-slate-50 transition-colors grid grid-cols-12 items-center">
                        <div className="col-span-3">
                          <div className="font-bold text-slate-900">
                            {t.day} {record.dayNumber} {language === 'ar' ? 'من 43' : 'of 43'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {t.round} {record.roundNumber} • {language === 'ar' ? 'نوبة' : 'Turn'} #{record.turnOrder}
                          </div>
                        </div>

                        <div className="col-span-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${ttDetails.badgeColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ttDetails.dot}`} />
                            {getTurnTypeLabel(record.turnType, language)}
                          </span>
                        </div>

                        <div className="col-span-3">
                          <div className="font-mono font-bold text-blue-700">
                            {record.unitsAllocated} {t.units}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {t.tankTitle}: {record.tankLevelBefore}{t.unitsShort} → {record.tankLevelAfter}{t.unitsShort}
                          </div>
                        </div>

                        <div className="col-span-3 text-end">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {language === 'ar' ? 'مكتمل' : record.status}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            {record.date}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق الملف' : 'Close Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
