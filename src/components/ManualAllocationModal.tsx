/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Person, Group, TurnType, WaterTurn } from '../types';
import { getTurnTypeDetails } from '../utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel } from '../utils/i18n';
import { X, Droplets, User, PlusCircle, Check } from 'lucide-react';

interface ManualAllocationModalProps {
  currentDay: number;
  currentRound: number;
  groups: Group[];
  persons: Person[];
  tankRemainingUnits: number;
  onClose: () => void;
  onAddCustomTurn: (turn: WaterTurn) => void;
  language?: Language;
}

export const ManualAllocationModal: React.FC<ManualAllocationModalProps> = ({
  currentDay,
  currentRound,
  groups,
  persons,
  tankRemainingUnits,
  onClose,
  onAddCustomTurn,
  language = 'ar'
}) => {
  const t = TRANSLATIONS[language];
  const [selectedGroupId, setSelectedGroupId] = useState<number>(groups[0]?.id || 1);
  const groupPersons = persons.filter(p => p.groupId === selectedGroupId);
  const [selectedPersonId, setSelectedPersonId] = useState<string>(groupPersons[0]?.id || '');
  const [units, setUnits] = useState<number>(15);
  const [turnType, setTurnType] = useState<TurnType>(TurnType.FIRST);
  const [notes, setNotes] = useState<string>(language === 'ar' ? 'صرف استثنائي طارئ' : 'Special emergency irrigation override');

  const handleGroupChange = (gId: number) => {
    setSelectedGroupId(gId);
    const firstP = persons.find(p => p.groupId === gId);
    if (firstP) {
      setSelectedPersonId(firstP.id);
      setUnits(firstP.waterUnitsQuota);
    }
  };

  const handlePersonChange = (pId: string) => {
    setSelectedPersonId(pId);
    const p = persons.find(item => item.id === pId);
    if (p) setUnits(p.waterUnitsQuota);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const person = persons.find(p => p.id === selectedPersonId);
    if (!person) return;

    const newTurn: WaterTurn = {
      id: `CUSTOM-WT-${Date.now()}`,
      globalTurnId: currentDay,
      dayNumber: currentDay,
      roundNumber: currentRound,
      groupId: selectedGroupId,
      personId: person.id,
      personName: person.name,
      units: Number(units),
      turnType,
      orderInGroup: 99,
      status: 'PENDING',
      notes
    };

    onAddCustomTurn(newTurn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-400/30 text-blue-300 rounded-xl shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{language === 'ar' ? 'إضافة نوبة مياه استثنائية يدوياً' : 'Manual WaterTurn Allocation'}</h3>
              <p className="text-xs text-slate-300 font-medium">
                {t.day} {currentDay} ({t.round} {currentRound}) • {language === 'ar' ? 'المتاح بالخزان:' : 'Available in Tank:'} <span className="font-mono text-cyan-300 font-bold">{tankRemainingUnits} {t.units}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ar' ? 'المجموعة المستهدفة (1-43)' : 'Target Group (1-43)'}</label>
              <select
                value={selectedGroupId}
                onChange={(e) => handleGroupChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.sector})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ar' ? 'اختيار المستفيد' : 'Select Beneficiary Person'}</label>
              <select
                value={selectedPersonId}
                onChange={(e) => handlePersonChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
              >
                {groupPersons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.plotNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'حجم الصرف (وحدة)' : 'Allocated Volume (Units)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                />
                <span className="absolute end-3 top-2.5 text-xs text-slate-400 font-sans">{t.unitsShort}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'تصنيف نوع النوبة (TurnType)' : 'Turn Type Classification'}
              </label>
              <select
                value={turnType}
                onChange={(e) => setTurnType(e.target.value as TurnType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
              >
                <option value={TurnType.FIRST}>{getTurnTypeLabel(TurnType.FIRST, language)} (FIRST)</option>
                <option value={TurnType.MIDDLE}>{getTurnTypeLabel(TurnType.MIDDLE, language)} (MIDDEL)</option>
                <option value={TurnType.LAST}>{getTurnTypeLabel(TurnType.LAST, language)} (LAST)</option>
                <option value={TurnType.FULL}>{getTurnTypeLabel(TurnType.FULL, language)} (FULL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ar' ? 'ملاحظات وتبرير الصرف' : 'Operational Notes / Reason'}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: أولوية سقي أرض جافة، نوبة مضخة احتياطية...' : 'e.g. Dry field priority, auxiliary pump turn...'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
            <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {language === 'ar'
                ? `سيتم إدراج نوبة مياه مخصصة لليوم ${currentDay}. عند الصرف، سيتم استهلاك ${units} وحدة من خزان الـ 60 وحدة وتوثيقها في سجل المستفيد.`
                : `This will queue a custom WaterTurn for Day ${currentDay}. When dispensed, it will consume ${units} units from the 60-unit main tank and log into the person's allocation history.`}
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'ar' ? 'إدراج في طابور النوب' : 'Queue WaterTurn'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
