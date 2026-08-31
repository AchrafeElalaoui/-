/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Group, Person, TurnType, WaterTurn, GroupTurnSchedule, GlobalTurn, GlobalTurnLog, AllocationHistoryRecord } from '../types';

/**
 * Calculates the turn order (1-indexed) for a person in a group for a specific round.
 * Rotates sequentially each round so every member takes a different turn order.
 */
export function getPersonTurnOrder(
  personIndexInGroup: number,
  totalMembersInGroup: number,
  roundNumber: number
): number {
  if (totalMembersInGroup <= 1) return 1;
  // Shift index by (roundNumber - 1)
  const shift = (roundNumber - 1) % totalMembersInGroup;
  return ((personIndexInGroup + shift) % totalMembersInGroup) + 1;
}

/**
 * Determines the TurnType enum (FIRST, MIDDEL, LAST, FULL) based on order and group size.
 */
export function getTurnTypeForOrder(order: number, totalMembers: number): TurnType {
  if (totalMembers <= 1) {
    return TurnType.FULL;
  }
  if (order === 1) {
    return TurnType.FIRST;
  }
  if (order === totalMembers) {
    return TurnType.LAST;
  }
  return TurnType.MIDDLE;
}

export function getTurnTypeDetails(turnType: TurnType) {
  switch (turnType) {
    case TurnType.FIRST:
      return {
        label: 'FIRST',
        displayName: 'First Turn',
        description: 'Receives initial high-pressure flow from full tank',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        glow: 'shadow-emerald-100',
      };
    case TurnType.MIDDLE:
      return {
        label: 'MIDDEL',
        displayName: 'Middle Turn',
        description: 'Receives intermediate steady flow from tank',
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        dot: 'bg-sky-500',
        glow: 'shadow-sky-100',
      };
    case TurnType.LAST:
      return {
        label: 'LAST',
        displayName: 'Last Turn',
        description: 'Receives the concluding discharge of the tank volume',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        glow: 'shadow-amber-100',
      };
    case TurnType.FULL:
      return {
        label: 'FULL',
        displayName: 'Full Turn',
        description: 'Sole beneficiary receiving complete tank allocation',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
        dot: 'bg-purple-500',
        glow: 'shadow-purple-100',
      };
  }
}

/**
 * Formats a date string for day N of a round starting from base date.
 */
export function getCycleDateString(dayNumber: number, roundNumber: number): string {
  const base = new Date(2026, 7, 1); // August 1, 2026
  const totalDays = (roundNumber - 1) * 43 + (dayNumber - 1);
  const targetDate = new Date(base.getTime() + totalDays * 24 * 60 * 60 * 1000);
  return targetDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Builds the GlobalTurn for a specific Day (1..43) and Round.
 * Generates all scheduled groups and their sorted WaterTurn objects.
 */
export function generateGlobalTurnForDay(
  dayNumber: number,
  roundNumber: number,
  allGroups: Group[],
  allPersons: Person[],
  tankCapacity: number = 60,
  activeGroupIds?: number[] // if omitted, Day D maps to Group D (plus optional auxiliary groups)
): GlobalTurn {
  // Default 1-to-1 mapping for the 43-day cycle: Day D has Group D as primary
  const targetGroupIds = activeGroupIds || [((dayNumber - 1) % 43) + 1];

  const dateStr = getCycleDateString(dayNumber, roundNumber);
  const groupSchedules: GroupTurnSchedule[] = [];
  let totalAllocatedUnits = 0;

  targetGroupIds.forEach((gId, gIdx) => {
    const group = allGroups.find(g => g.id === gId);
    if (!group) return;

    const groupMembers = allPersons.filter(p => p.groupId === gId && p.active);
    const totalMembers = groupMembers.length;

    // Build WaterTurn for each member with dynamic rotation based on roundNumber
    const unsortedWaterTurns: WaterTurn[] = groupMembers.map((member) => {
      const memberIndexInGroup = group.memberIds.indexOf(member.id);
      const safeIndex = memberIndexInGroup >= 0 ? memberIndexInGroup : 0;
      const order = getPersonTurnOrder(safeIndex, totalMembers, roundNumber);
      const turnType = getTurnTypeForOrder(order, totalMembers);

      return {
        id: `WT-D${dayNumber}-R${roundNumber}-G${gId}-${member.id}`,
        globalTurnId: dayNumber,
        dayNumber,
        roundNumber,
        groupId: gId,
        personId: member.id,
        personName: member.name,
        units: member.waterUnitsQuota,
        turnType,
        orderInGroup: order,
        status: 'PENDING'
      };
    });

    // Sort turns by orderInGroup (1st turn, then 2nd, ..., last)
    const sortedWaterTurns = unsortedWaterTurns.sort((a, b) => a.orderInGroup - b.orderInGroup);
    const groupTotalUnits = sortedWaterTurns.reduce((sum, wt) => sum + wt.units, 0);
    totalAllocatedUnits += groupTotalUnits;

    groupSchedules.push({
      groupId: gId,
      groupName: group.name,
      activeOrderInDay: gIdx + 1,
      waterTurns: sortedWaterTurns,
      totalGroupUnits: groupTotalUnits,
      status: 'PENDING'
    });
  });

  const logs: GlobalTurnLog[] = [
    {
      id: `log-init-${dayNumber}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: `Global Turn for Day ${dayNumber} (Round ${roundNumber}) initialized with ${groupSchedules.length} group(s). Total demand: ${totalAllocatedUnits} units against ${tankCapacity} units capacity.`,
      severity: totalAllocatedUnits > tankCapacity ? 'warning' : 'info'
    }
  ];

  return {
    id: dayNumber,
    dayNumber,
    roundNumber,
    dateStr,
    tankCapacity,
    tankInitialUnits: tankCapacity,
    tankRemainingUnits: tankCapacity,
    totalAllocatedUnits,
    status: 'SCHEDULED',
    groups: groupSchedules,
    logs
  };
}

/**
 * Updates a person's allocation history when a WaterTurn is executed.
 */
export function recordAllocationToPerson(
  person: Person,
  turn: WaterTurn,
  tankLevelBefore: number,
  tankLevelAfter: number,
  dateStr: string
): Person {
  const newHistoryRecord: AllocationHistoryRecord = {
    id: `HIST-${turn.id}-${Date.now()}`,
    globalTurnId: turn.globalTurnId,
    dayNumber: turn.dayNumber,
    roundNumber: turn.roundNumber,
    date: dateStr,
    unitsAllocated: turn.units,
    turnType: turn.turnType,
    turnOrder: turn.orderInGroup,
    tankLevelBefore,
    tankLevelAfter,
    status: 'COMPLETED',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: `Successfully received ${turn.units} units (${turn.turnType} turn)`
  };

  return {
    ...person,
    allocationHistory: [newHistoryRecord, ...person.allocationHistory]
  };
}
