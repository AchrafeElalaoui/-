/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TurnType {
  FIRST = 'FIRST',
  MIDDLE = 'MIDDEL', // Specified in prompt as MIDDEL
  LAST = 'LAST',
  FULL = 'FULL',
}

export interface AllocationHistoryRecord {
  id: string;
  globalTurnId: number;
  dayNumber: number; // 1 to 43
  roundNumber: number; // Round 1, 2, etc.
  date: string;
  unitsAllocated: number;
  turnType: TurnType;
  turnOrder: number; // 1st, 2nd, etc. in group for that day
  tankLevelBefore: number;
  tankLevelAfter: number;
  status: 'COMPLETED' | 'PARTIAL' | 'SKIPPED';
  timestamp: string;
  notes?: string;
}

export interface Person {
  id: string;
  name: string;
  groupId: number; // 1 to 43
  nationalId?: string;
  phone: string;
  plotNumber: string;
  waterUnitsQuota: number; // n water units needed/assigned
  active: boolean;
  notes?: string;
  allocationHistory: AllocationHistoryRecord[];
}

export interface WaterTurn {
  id: string;
  globalTurnId: number;
  dayNumber: number; // 1 to 43
  roundNumber: number;
  groupId: number;
  personId: string;
  personName: string;
  units: number; // n water units
  turnType: TurnType;
  orderInGroup: number; // 1 = first, etc.
  status: 'PENDING' | 'DISPENSING' | 'COMPLETED' | 'SKIPPED';
  tankLevelBefore?: number;
  tankLevelAfter?: number;
  dispensedAt?: string;
  notes?: string;
}

export interface GroupTurnSchedule {
  groupId: number;
  groupName: string;
  activeOrderInDay: number;
  waterTurns: WaterTurn[];
  totalGroupUnits: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface Group {
  id: number; // 1 to 43
  name: string;
  code: string;
  sector: string;
  representativeName: string;
  representativePhone: string;
  memberIds: string[];
  baseDailyDemand: number; // sum of members' quotas
}

export interface GlobalTurnLog {
  id: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface GlobalTurn {
  id: number;
  dayNumber: number; // 1 to 43
  roundNumber: number;
  dateStr: string;
  tankCapacity: number; // 60 units
  tankInitialUnits: number;
  tankRemainingUnits: number;
  totalAllocatedUnits: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  groups: GroupTurnSchedule[];
  logs: GlobalTurnLog[];
}

export interface SystemConfig {
  tankVolume: number; // 60 units
  totalGroups: number; // 43
  daysPerRound: number; // 43
  autoRefillDaily: boolean;
}
