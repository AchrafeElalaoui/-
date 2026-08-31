/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Person, Group, TurnType } from '../types';
import { Search, User, Phone, MapPin, Droplets, History, Plus, Filter, UserCheck, Shield } from 'lucide-react';
import { getTurnTypeDetails } from '../utils/rotationEngine';
import { Language, TRANSLATIONS, getTurnTypeLabel } from '../utils/i18n';

interface PersonsViewProps {
  persons: Person[];
  groups: Group[];
  onSelectPerson: (person: Person) => void;
  onAddNewPerson: (newPerson: Person) => void;
  language?: Language;
}

export const PersonsView: React.FC<PersonsViewProps> = ({
  persons,
  groups,
  onSelectPerson,
  onAddNewPerson,
  language = 'ar'
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | 'ALL'>('ALL');
  const [isAddingPerson, setIsAddingPerson] = useState(false);

  // New person form state
  const [newPersonData, setNewPersonData] = useState({
    name: '',
    groupId: 1,
    phone: '+966 50 123 4567',
    plotNumber: language === 'ar' ? 'قطعة أ-01' : 'Plot A-01',
    waterUnitsQuota: 15,
    notes: language === 'ar' ? 'مستفيد جديد' : 'New member quota holder'
  });

  const filteredPersons = persons.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroupId === 'ALL' || p.groupId === selectedGroupId;
    return matchesSearch && matchesGroup;
  });

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    const newPerson: Person = {
      id: `P-${(persons.length + 1).toString().padStart(3, '0')}`,
      name: newPersonData.name,
      groupId: Number(newPersonData.groupId),
      phone: newPersonData.phone,
      plotNumber: newPersonData.plotNumber,
      waterUnitsQuota: Number(newPersonData.waterUnitsQuota),
      active: true,
      notes: newPersonData.notes,
      allocationHistory: []
    };
    onAddNewPerson(newPerson);
    setIsAddingPerson(false);
    setNewPersonData({
      name: '',
      groupId: 1,
      phone: '+966 50 123 4567',
      plotNumber: language === 'ar' ? 'قطعة أ-01' : 'Plot A-01',
      waterUnitsQuota: 15,
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-md">
              {persons.length} {language === 'ar' ? 'مستفيد مسجل' : 'TOTAL BENEFICIARIES'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              43 {t.groups}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-2 tracking-tight">
            {t.personsTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t.personsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddingPerson(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.registerBeneficiary}</span>
        </button>
      </div>

      {/* Add Person Modal Form */}
      {isAddingPerson && (
        <div className="bg-slate-50 border border-blue-200 rounded-2xl p-5 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>{t.registerBeneficiary}</span>
            </h3>
            <button
              onClick={() => setIsAddingPerson(false)}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-bold"
            >
              {t.cancel}
            </button>
          </div>

          <form onSubmit={handleCreatePerson} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.fullName}</label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'مثال: يوسف المنصوري' : 'e.g. Yassine Filali'}
                  value={newPersonData.name}
                  onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'ar' ? 'تعيين إلى المجموعة (1-43)' : 'Assign to Group (1-43)'}</label>
                <select
                  value={newPersonData.groupId}
                  onChange={(e) => setNewPersonData({ ...newPersonData, groupId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.quotaUnits} ({t.units})</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={newPersonData.waterUnitsQuota}
                  onChange={(e) => setNewPersonData({ ...newPersonData, waterUnitsQuota: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.plotNumber}</label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'مثال: قطعة ج-14' : 'e.g. Plot C-14'}
                  value={newPersonData.plotNumber}
                  onChange={(e) => setNewPersonData({ ...newPersonData, plotNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.phone}</label>
                <input
                  type="text"
                  required
                  placeholder="+966 50 123 4567"
                  value={newPersonData.phone}
                  onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingPerson(false)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                {language === 'ar' ? 'حفظ وتسجيل المستفيد' : 'Save & Register'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchPersons}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-9 pe-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap">{t.filterGroup}:</span>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-hidden cursor-pointer"
          >
            <option value="ALL">{t.allGroups}</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <span className="text-xs font-mono text-slate-400">
            ({filteredPersons.length})
          </span>
        </div>
      </div>

      {/* Persons Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 text-start">{t.personName}</th>
                <th className="py-3 px-4 text-start">{t.groupName}</th>
                <th className="py-3 px-4 text-start">{t.plotNumber}</th>
                <th className="py-3 px-4 text-start">{t.phone}</th>
                <th className="py-3 px-4 text-start">{t.quotaUnits}</th>
                <th className="py-3 px-4 text-start">{t.history}</th>
                <th className="py-3 px-4 text-end">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPersons.map((person) => {
                const group = groups.find(g => g.id === person.groupId);
                const historyCount = person.allocationHistory?.length || 0;
                const lastRecord = person.allocationHistory?.[0];
                const lastTurnTypeDetails = lastRecord ? getTurnTypeDetails(lastRecord.turnType) : null;

                return (
                  <tr
                    key={person.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectPerson(person)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                          {person.id.replace('P-', '')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {person.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {person.nationalId || person.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">
                        {group?.name || `Group ${person.groupId}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {group?.sector || 'واحة النخيل'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {person.plotNumber}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {person.phone}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 text-xs">
                        {person.waterUnitsQuota} {t.units}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <History className="w-3.5 h-3.5 text-blue-600" />
                          {historyCount} {language === 'ar' ? 'سجلات' : 'logs'}
                        </span>

                        {lastTurnTypeDetails && lastRecord && (
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${lastTurnTypeDetails.badgeColor}`}>
                            {language === 'ar' ? 'السابق:' : 'Last:'} {getTurnTypeLabel(lastRecord.turnType, language)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPerson(person);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        {t.viewHistory}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
