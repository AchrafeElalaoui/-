/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TurnType } from '../types';

export type Language = 'ar' | 'en';

export const TRANSLATIONS = {
  ar: {
    // App & System
    appName: 'نظام إدارة نوب وتوزيع مياه الخزان',
    appSubtitle: 'نظام التدوير العادل للمياه • دورة 43 يوماً • خزان 60 وحدة',
    badgeSpec: 'خزان 60 وحدة • 43 مجموعة • دورة 43 يوماً',
    globalCycle: 'الدورة العامة',
    round: 'الدورة',
    day: 'اليوم',
    dayOf: 'من أصل 43 يوماً',
    manualTurnBtn: 'نوبة يدوية',
    prevDay: 'اليوم السابق',
    nextDay: 'اليوم التالي',
    resetCycle: 'إعادة ضبط الدورة 1',
    tankStatus: 'حالة الخزان',
    refillTank: 'ملء الخزان (60 وحدة)',
    refillSuccess: 'تمت إعادة ملء الخزان بالكامل بسعة 60 وحدة.',
    dispenseAll: 'توزيع جميع نوب اليوم',
    allTurnsCompleted: 'تم إنجاز كافة نوب اليوم بنجاح',
    units: 'وحدة',
    unitsShort: 'و',
    remaining: 'المتبقي',
    allocated: 'الموزع',
    capacity: 'السعة الكلية',
    
    // 5 Core Objects
    objectGlobalTurn: 'النوبة العامة (Global Turn)',
    objectGroup: 'المجموعات (43 مجموعة)',
    objectPerson: 'المستفيدون وسجل الحصص (Person & History)',
    objectWaterTurn: 'محرك نوب الماء (WaterTurn Engine)',
    objectAnalytics: 'إحصائيات الدورة والعدالة (Analytics)',

    // Tabs
    tabGlobalTurn: 'النوبة العامة اليومية',
    tabGroups: 'المجموعات (43)',
    tabPersons: 'سجل المستفيدين',
    tabEngine: 'محرك التدوير والعدالة',
    tabAnalytics: 'إحصائيات الدورة',

    // Turn Types
    turnTypeFirst: 'الأول (FIRST)',
    turnTypeMiddle: 'الأوسط (MIDDEL)',
    turnTypeLast: 'الأخير (LAST)',
    turnTypeFull: 'كامل (FULL)',
    turnTypeFirstDesc: 'أول تدفق في المجموعة - ضغط مائي عالٍ',
    turnTypeMiddleDesc: 'تدفق أوسط مستقر ومنتظم',
    turnTypeLastDesc: 'آخر تدفق - تصريف كامل للحصة المتبقية',
    turnTypeFullDesc: 'نوبة منفردة كاملة لمستفيد وحيد',

    // Turn Status
    statusPending: 'قيد الانتظار',
    statusDispensing: 'جارِ التوزيع',
    statusCompleted: 'مكتمل',
    statusSkipped: 'متجاوز',
    statusScheduled: 'مجدول',
    statusInProgress: 'قيد التنفيذ',

    // Tank Gauge
    tankTitle: 'خزان المياه الرئيسي (60 وحدة)',
    tankSubtitle: 'خزان التوزيع الهيدروليكي المركزي',
    tankFull: 'الخزان ممتلئ',
    tankMedium: 'المستوى جيد',
    tankLow: 'مستوى منخفض - يلزم الضخ',
    tankEmpty: 'الخزان فارغ!',
    valveOpen: 'الصمام مفتوح (جارِ الصرف)',
    valveClosed: 'الصمام مغلق',
    todayDemand: 'طلب اليوم الإجمالي',
    remainingAfterScheduled: 'المتبقي بعد جدولة اليوم',

    // Global Turn View
    globalTurnHeader: 'نوبة اليوم العامة',
    quickDayJump: 'الانتقال السريع بين أيام الدورة الـ 43:',
    activeGroupsToday: 'المجموعات المستفيدة اليوم',
    groupTurnOrder: 'ترتيب المجموعة',
    dispenseAction: 'صرف الحصة',
    editQuota: 'تعديل الحصة',
    viewHistory: 'السجل',
    historyTitle: 'سجل الحصص التاريخية',
    executionLogs: 'سجل العمليات المباشرة',
    noLogsYet: 'لا توجد عمليات مسجلة لليوم حتى الآن.',
    turnNumberInGroup: 'النوبة رقم',

    // Groups View
    groupsDirectory: 'دليل المجموعات الـ 43',
    groupsSubtitle: 'إدارة 43 مجموعة فلاحية وسكنية مع منسقيها وحصصها الأساسية',
    searchGroups: 'البحث باسم المجموعة، الرمز، القطاع، أو المنسق...',
    filterSector: 'تصفية حسب القطاع',
    allSectors: 'جميع القطاعات',
    totalMembers: 'إجمالي الأعضاء',
    dailyQuota: 'الحصة اليومية المرجعية',
    representative: 'منسق المجموعة',
    viewGroupTurns: 'عرض نوب المجموعة',
    groupTurnDay: 'اليوم المخصص في الدورة',

    // Persons View
    personsDirectory: 'سجل المستفيدين والأعضاء',
    personsSubtitle: 'قاعدة بيانات المستفيدين مع تفاصيل الحصص وسجل الاستفادة التاريخي من الخزان',
    searchPersons: 'بحث بالاسم، رقم القطعة، الهاتف، أو المجموعة...',
    filterGroup: 'تصفية بالمجموعة',
    allGroups: 'كافة المجموعات (1 - 43)',
    statusFilter: 'الحالة',
    activeOnly: 'نشط فقط',
    inactiveOnly: 'غير نشط',
    allStatus: 'الكل',
    beneficiaryName: 'اسم المستفيد',
    plotNumber: 'رقم القطعة / الأرض',
    assignedQuota: 'الحصة المعتمدة',
    totalReceived: 'إجمالي ما تم استلامه',
    lastTurnType: 'آخر نوع نوبة',
    inspectProfile: 'الملف والسجل الكامل',

    // Profile Modal
    personProfileTitle: 'بطاقة المستفيد وسجل الحصص',
    personProfileSubtitle: 'البيانات الشخصية والتوثيق الزمني لكافة نوب المياه السابقة',
    personalInfo: 'المعلومات الشخصية والفلاحية',
    phone: 'رقم الهاتف',
    nationalId: 'رقم البطاقة الوطنية',
    groupMembership: 'المجموعة التابع لها',
    quotaPerTurn: 'حصة النوبة الواحدة',
    memberStatus: 'حالة الحساب',
    active: 'نشط ومؤهل للري',
    inactive: 'موقوف مؤقتاً',
    allocationHistoryTitle: 'السجل الزمني للحصص المائية السابقة',
    allocationHistorySubtitle: 'توثيق دقيق لكل نوبة ماء (اليوم، الدورة، الكمية، نوع النوبة، ومستوى الخزان)',
    historyRound: 'الدورة',
    historyDay: 'اليوم',
    historyUnits: 'الكمية المستلمة',
    historyTurnType: 'نوع النوبة',
    historyTankDelta: 'حالة الخزان (قبل ← بعد)',
    historyStatus: 'حالة النوبة',
    noHistoryRecords: 'لا توجد سجلات تاريخية مسجلة بعد لهذا المستفيد.',
    close: 'إغلاق',

    // Manual Modal
    manualModalTitle: 'تسجيل نوبة ماء يدوية / استثنائية',
    manualModalSubtitle: 'إضافة حصة مائية مباشرة إلى خزان اليوم مع تحديد نوع النوبة',
    selectBeneficiary: 'اختر المستفيد',
    choosePerson: '-- اختر المستفيد --',
    unitsToDispense: 'عدد الوحدات المائية (وحدات من الخزان)',
    selectTurnType: 'نوع النوبة (TurnType)',
    optionalNotes: 'ملاحظات إضافية',
    notesPlaceholder: 'سبب التخصيص الاستثنائي أو ملاحظات التوزيع...',
    submitTurn: 'تأكيد وإضافة النوبة',
    cancel: 'إلغاء',

    // Engine View
    engineTitle: 'محرك تدوير نوب المياه والعدالة الرياضية',
    engineSubtitle: 'نظام رياضي يضمن التدوير الدوري المنصف لنوع النوبة (الأول • الأوسط • الأخير) لكل مستفيد عبر الدورات',
    mathProofTitle: 'الضمان الرياضي لتدوير النوب',
    mathProofDesc: 'لكل عضو بالترتيب i في مجموعة عدد أفرادها N خلال الدورة R، يحسب ترتيب النوبة وفق الصيغة: order = ((i + R - 1) % N) + 1. عبر N دورات متتالية (كل دورة 43 يوماً)، يتساوى جميع الأعضاء في الحصول على نوبة (الأول) ذات التدفق القوي، و(الأوسط)، و(الأخير)، مما يلغي أي تحيز في توزيع مياه الخزان.',
    roundSimulator: 'محاكي الدورات (1 إلى 43)',
    selectGroupSim: 'اختر مجموعة لاختبار التدوير:',
    membersInGroup: 'أعضاء المجموعة وتدوير أدوارهم:',
    matrixTitle: 'مصفوفة التدوير العادل عبر الدورات المتعاقبة',

    // Analytics View
    analyticsTitle: 'لوحة التحليلات ومراقبة توازن الخزان',
    analyticsSubtitle: 'مؤشرات استهلاك الخزان (60 وحدة) وعدالة التوزيع عبر دورة الـ 43 يوماً',
    exportCsv: 'تصدير التقرير (CSV)',
    totalWaterDispensed: 'إجمالي المياه الموزعة',
    cycleCompletion: 'نسبة تقدم الدورة الحالية',
    avgGroupDemand: 'متوسط طلب المجموعة',
    tankEfficiency: 'كفاءة استغلال الخزان',
    turnTypeEquityTitle: 'توزيع أنواع النوب (عدالة التوزيع)',
    cycleProgressTitle: 'جدول الـ 43 يوماً وحجم الاستهلاك اليومي',

    // Language Toggle
    langArabic: 'العربية',
    langEnglish: 'English',
    switchLang: 'تغيير اللغة'
  },
  en: {
    // App & System
    appName: 'Water Distribution & Tank Turn Manager',
    appSubtitle: '43-Day Cyclic Water System • 60-Unit Tank • Fair Rotation',
    badgeSpec: '60U Tank • 43 Groups • 43-Day Cycle',
    globalCycle: 'Global Cycle',
    round: 'Round',
    day: 'Day',
    dayOf: 'of 43 Days',
    manualTurnBtn: 'Manual Turn',
    prevDay: 'Previous Day',
    nextDay: 'Next Day',
    resetCycle: 'Reset to Day 1',
    tankStatus: 'Tank Status',
    refillTank: 'Refill Tank (60 Units)',
    refillSuccess: 'Tank successfully refilled to 60 units capacity.',
    dispenseAll: 'Dispense All Today',
    allTurnsCompleted: 'All scheduled turns completed today',
    units: 'Units',
    unitsShort: 'U',
    remaining: 'Remaining',
    allocated: 'Allocated',
    capacity: 'Full Capacity',

    // 5 Core Objects
    objectGlobalTurn: 'Global Turn (1 Day = 1 Turn)',
    objectGroup: '43 Groups',
    objectPerson: 'Beneficiary & History',
    objectWaterTurn: 'Water Turn (n Units)',
    objectAnalytics: 'Cycle Analytics & Equity',

    // Tabs
    tabGlobalTurn: 'Global Turn (Daily)',
    tabGroups: 'Groups (43)',
    tabPersons: 'Beneficiaries',
    tabEngine: 'Turn Rotation Engine',
    tabAnalytics: 'Cycle Analytics',

    // Turn Types
    turnTypeFirst: 'FIRST',
    turnTypeMiddle: 'MIDDEL',
    turnTypeLast: 'LAST',
    turnTypeFull: 'FULL',
    turnTypeFirstDesc: 'First stream in group - high initial pressure',
    turnTypeMiddleDesc: 'Middle stream - steady consistent flow',
    turnTypeLastDesc: 'Last stream - draining remaining allocated volume',
    turnTypeFullDesc: 'Sole beneficiary complete full allocation',

    // Turn Status
    statusPending: 'Pending',
    statusDispensing: 'Dispensing',
    statusCompleted: 'Completed',
    statusSkipped: 'Skipped',
    statusScheduled: 'Scheduled',
    statusInProgress: 'In Progress',

    // Tank Gauge
    tankTitle: 'Main Reservoir Tank (60 Units)',
    tankSubtitle: 'Central Hydraulic Distribution Tank',
    tankFull: 'Tank Full',
    tankMedium: 'Good Level',
    tankLow: 'Low Level - Refill Recommended',
    tankEmpty: 'Tank Empty!',
    valveOpen: 'Valve Open (Dispensing)',
    valveClosed: 'Valve Closed',
    todayDemand: "Today's Total Demand",
    remainingAfterScheduled: 'Remaining After Today',

    // Global Turn View
    globalTurnHeader: "Today's Global Turn",
    quickDayJump: 'Quick Jump across 43-Day Cycle:',
    activeGroupsToday: 'Beneficiary Groups Today',
    groupTurnOrder: 'Group Turn Order',
    dispenseAction: 'Dispense',
    editQuota: 'Edit Quota',
    viewHistory: 'History',
    historyTitle: 'Previous Allocation History',
    executionLogs: 'Live Turn Execution Logs',
    noLogsYet: 'No turn operations logged today yet.',
    turnNumberInGroup: 'Turn #',

    // Groups View
    groupsDirectory: 'Directory of 43 Groups',
    groupsSubtitle: 'Management of 43 agricultural & residential groups with coordinators and quotas',
    searchGroups: 'Search group name, code, sector, representative...',
    filterSector: 'Filter by Sector',
    allSectors: 'All Sectors',
    totalMembers: 'Total Members',
    dailyQuota: 'Base Quota Demand',
    representative: 'Group Representative',
    viewGroupTurns: 'View Group Turns',
    groupTurnDay: 'Assigned Day in Cycle',

    // Persons View
    personsDirectory: 'Beneficiary & Personnel Directory',
    personsSubtitle: 'Personnel records with water quotas and chronological tank allocation histories',
    searchPersons: 'Search by name, plot number, phone, or group...',
    filterGroup: 'Filter by Group',
    allGroups: 'All Groups (1 - 43)',
    statusFilter: 'Status',
    activeOnly: 'Active Only',
    inactiveOnly: 'Inactive Only',
    allStatus: 'All',
    beneficiaryName: 'Beneficiary Name',
    plotNumber: 'Plot / Farm No.',
    assignedQuota: 'Assigned Quota',
    totalReceived: 'Total Water Received',
    lastTurnType: 'Last Turn Type',
    inspectProfile: 'Profile & Full History',

    // Profile Modal
    personProfileTitle: 'Beneficiary File & Allocation History',
    personProfileSubtitle: 'Personnel details and chronological audit trail of all previous tank turns',
    personalInfo: 'Personal & Agricultural Details',
    phone: 'Phone Number',
    nationalId: 'National ID',
    groupMembership: 'Group Membership',
    quotaPerTurn: 'Quota per Turn',
    memberStatus: 'Account Status',
    active: 'Active & Eligible for Irrigation',
    inactive: 'Temporarily Suspended',
    allocationHistoryTitle: 'Chronological Water Turn History',
    allocationHistorySubtitle: 'Accurate record of each turn (Day, Round, Units, TurnType, and Tank delta)',
    historyRound: 'Round',
    historyDay: 'Day',
    historyUnits: 'Units Dispensed',
    historyTurnType: 'Turn Type',
    historyTankDelta: 'Tank Level (Before → After)',
    historyStatus: 'Status',
    noHistoryRecords: 'No historical turns recorded for this member yet.',
    close: 'Close',

    // Manual Modal
    manualModalTitle: 'Record Manual / Ad-Hoc Water Turn',
    manualModalSubtitle: 'Directly allocate water units from the 60U tank with custom TurnType',
    selectBeneficiary: 'Select Beneficiary',
    choosePerson: '-- Select Beneficiary --',
    unitsToDispense: 'Water Units (from 60U Tank)',
    selectTurnType: 'Turn Type (TurnType)',
    optionalNotes: 'Optional Notes',
    notesPlaceholder: 'Reason for ad-hoc allocation or delivery notes...',
    submitTurn: 'Confirm & Dispatch Turn',
    cancel: 'Cancel',

    // Engine View
    engineTitle: 'Turn Rotation & Cyclic Fairness Engine',
    engineSubtitle: 'Mathematical system guaranteeing permutation of TurnType (FIRST • MIDDEL • LAST) across rounds',
    mathProofTitle: 'Mathematical Rotation Proof',
    mathProofDesc: 'For member index i in group of size N on Round R, turn order is order = ((i + R - 1) % N) + 1. Over N rounds (each 43 days), every member receives an equal share of FIRST (high pressure), MIDDEL (steady), and LAST (drainage) turns, eliminating all structural bias.',
    roundSimulator: 'Multi-Round Simulator (Rounds 1 to 43)',
    selectGroupSim: 'Select a Group to simulate:',
    membersInGroup: 'Group Members & Permuted Turn Orders:',
    matrixTitle: 'Multi-Round Cyclic Rotation Matrix',

    // Analytics View
    analyticsTitle: 'Cycle Analytics & Reservoir Balance',
    analyticsSubtitle: 'Water consumption metrics and turn equity across the 43-day cycle',
    exportCsv: 'Export Report (CSV)',
    totalWaterDispensed: 'Total Water Dispensed',
    cycleCompletion: 'Current Cycle Progress',
    avgGroupDemand: 'Avg Group Demand',
    tankEfficiency: 'Tank Utilization Efficiency',
    turnTypeEquityTitle: 'TurnType Equity Distribution',
    cycleProgressTitle: '43-Day Cycle Consumption Schedule',

    // Language Toggle
    langArabic: 'العربية',
    langEnglish: 'English',
    switchLang: 'Switch Language'
  }
};

export function getTurnTypeLabel(turnType: TurnType, lang?: Language | string): string {
  const selectedLang = (lang === 'en' ? 'en' : 'ar') as Language;
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.ar;
  switch (turnType) {
    case TurnType.FIRST:
      return t.turnTypeFirst;
    case TurnType.MIDDLE:
      return t.turnTypeMiddle;
    case TurnType.LAST:
      return t.turnTypeLast;
    case TurnType.FULL:
      return t.turnTypeFull;
    default:
      return turnType;
  }
}

export function getTurnTypeDescription(turnType: TurnType, lang?: Language | string): string {
  const selectedLang = (lang === 'en' ? 'en' : 'ar') as Language;
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.ar;
  switch (turnType) {
    case TurnType.FIRST:
      return t.turnTypeFirstDesc;
    case TurnType.MIDDLE:
      return t.turnTypeMiddleDesc;
    case TurnType.LAST:
      return t.turnTypeLastDesc;
    case TurnType.FULL:
      return t.turnTypeFullDesc;
    default:
      return '';
  }
}
