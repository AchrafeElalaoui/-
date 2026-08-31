/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Group, Person, TurnType, AllocationHistoryRecord } from '../types';

const FIRST_NAMES_AR = [
  'أمينة', 'طارق', 'فاطمة', 'يوسف', 'زهرة', 'عمر', 'ليلى', 'كريم',
  'سلمى', 'رشيد', 'نادية', 'حمزة', 'سميرة', 'مهدي', 'هدى', 'بلال',
  'خديجة', 'أنس', 'مريم', 'إلياس', 'صوفيا', 'وليد', 'إيمان', 'حسن',
  'نور', 'إدريس', 'هاجر', 'سعيد', 'أسماء', 'مصطفى', 'غيثة', 'عادل',
  'ريم', 'رضا', 'سناء', 'نبيل', 'منى', 'عثمان', 'كنزة', 'ياسين',
  'شيماء', 'جمال', 'لطيفة', 'زكرياء', 'زينب', 'مروان', 'إكرام', 'فؤاد'
];

const LAST_NAMES_AR = [
  'العلمي', 'بنعلي', 'الشرايبي', 'الداودي', 'العمراني', 'الفاسي', 'الغربي', 'الحسني',
  'الإدريسي', 'الجباري', 'القبّاج', 'اللحلو', 'المنصوري', 'الناصري', 'الوزاني', 'القادري',
  'الراجي', 'الصبّاري', 'الطاهري', 'الوهابي', 'اليوسفي', 'زهير', 'برادة', 'الشرقاوي',
  'الدراوي', 'الخطابي', 'الفيلالي', 'الكديرة', 'حكيمي', 'الإبراهيمي', 'الجيدي', 'الكتاني'
];

const SECTORS_AR = [
  'واحة النخيل الشمالية', 'مدرجات الهضبة العليا', 'حوض الساقية الشرقية', 'بساتين النخيل الجنوبية',
  'دلتا ضفاف الوادي', 'بساتين البساتين المركزية', 'حوض عين العاطي', 'سهل شجر الزيتون',
  'مرتفعات الينبوع', 'خوانق تافيلالت', 'هضبة درعة السفلى', 'مروج السقي الحديث'
];

export function generateInitialData() {
  const groups: Group[] = [];
  const persons: Person[] = [];
  let personCounter = 1;

  for (let gId = 1; gId <= 43; gId++) {
    const padId = gId.toString().padStart(2, '0');
    const groupName = `المجموعة ${padId} (Group ${padId})`;
    const code = `GRP-${padId}`;
    const sector = SECTORS_AR[(gId - 1) % SECTORS_AR.length];
    
    // Each group has 2 to 5 members
    const memberCount = 2 + ((gId * 3) % 4); // 2, 3, 4, or 5 members
    const memberIds: string[] = [];

    // Representative
    const repFirstName = FIRST_NAMES_AR[(gId * 2) % FIRST_NAMES_AR.length];
    const repLastName = LAST_NAMES_AR[(gId * 3) % LAST_NAMES_AR.length];
    const representativeName = `${repFirstName} ${repLastName}`;
    const representativePhone = `+212 6${(10 + gId).toString().padStart(2, '0')} ${200 + (gId * 37) % 700} ${10 + (gId * 13) % 89}`;

    // Generate members for this group
    let totalGroupQuota = 0;
    for (let m = 0; m < memberCount; m++) {
      const pId = `P-${personCounter.toString().padStart(3, '0')}`;
      personCounter++;
      memberIds.push(pId);

      const fName = m === 0 ? repFirstName : FIRST_NAMES_AR[(gId * 7 + m * 5) % FIRST_NAMES_AR.length];
      const lName = m === 0 ? repLastName : LAST_NAMES_AR[(gId * 11 + m * 3) % LAST_NAMES_AR.length];
      const name = `${fName} ${lName}`;

      // Water units for this person (e.g. 10 to 22 units so total group is around 40-60 units)
      const baseUnits = Math.round(54 / memberCount) + ((m % 2 === 0 ? 2 : -1));
      const waterUnitsQuota = Math.max(8, Math.min(30, baseUnits));
      totalGroupQuota += waterUnitsQuota;

      // Generate realistic past allocation history
      const allocationHistory: AllocationHistoryRecord[] = [];
      
      const previousRoundTurnOrder = ((m + 1) % memberCount) + 1; // previous round rotation
      let prevTurnType = TurnType.MIDDLE;
      if (memberCount === 1) prevTurnType = TurnType.FULL;
      else if (previousRoundTurnOrder === 1) prevTurnType = TurnType.FIRST;
      else if (previousRoundTurnOrder === memberCount) prevTurnType = TurnType.LAST;

      allocationHistory.push({
        id: `HIST-${pId}-R0`,
        globalTurnId: gId,
        dayNumber: gId,
        roundNumber: 0,
        date: `2026-07-${(gId % 28 + 1).toString().padStart(2, '0')}`,
        unitsAllocated: waterUnitsQuota,
        turnType: prevTurnType,
        turnOrder: previousRoundTurnOrder,
        tankLevelBefore: 60 - (previousRoundTurnOrder - 1) * 15,
        tankLevelAfter: Math.max(0, 60 - previousRoundTurnOrder * 15),
        status: 'COMPLETED',
        timestamp: `2026-07-${(gId % 28 + 1).toString().padStart(2, '0')} 09:30`,
        notes: `نوبة سابقة بالدورة 0 (نوبة ${prevTurnType})`
      });

      const person: Person = {
        id: pId,
        name,
        groupId: gId,
        nationalId: `CNI-${(100000 + personCounter * 17)}`,
        phone: m === 0 ? representativePhone : `+212 6${(20 + gId).toString().padStart(2, '0')} ${100 + (m * 123) % 800} ${20 + (m * 7) % 70}`,
        plotNumber: `القطعة الفلاحية ${String.fromCharCode(65 + (gId % 10))}-${10 + m}`,
        waterUnitsQuota,
        active: true,
        notes: m === 0 ? 'منسق المجموعة ومسؤول فتح الصمام' : 'مستفيد مسجل بحصة منتظمة',
        allocationHistory
      };

      persons.push(person);
    }

    groups.push({
      id: gId,
      name: groupName,
      code,
      sector,
      representativeName,
      representativePhone,
      memberIds,
      baseDailyDemand: totalGroupQuota
    });
  }

  return { groups, persons };
}

