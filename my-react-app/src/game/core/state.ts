import type { GameState, UnitType } from './types';
import { Unit } from './types';
import { filterExpiredUpgrades } from './calculations';

/**
 * Database row format for players table
 */
interface PlayerDBRow {
  user_id: string;
  points: number;
  clickvalue: number;
  pointspersecond: number;
  totalclicks: number;
  created_at: string;
  updated_at: string;
}

/**
 * Database row format for units table
 */
interface UnitDBRow {
  id: string;
  player_id: string;
  type: string;
  value: number;
  position_x: number;
  position_y: number;
}

/**
 * Database row format for active_upgrades table
 */
interface UpgradeDBRow {
  player_id: string;
  upgrade_id: string;
  purchased_at: string;
}

/**
 * Convert GameState to database format for saving
 */
export function stateToDBFormat(state: GameState, userId: string) {
  return {
    player: {
      user_id: userId,
      points: Math.floor(state.currency.points),
      clickvalue: Math.floor(state.production.clickValue),
      pointspersecond: Math.floor(state.production.pointsPerSecond),
      totalclicks: Math.floor(state.currency.totalClicks),
      created_at: state.metadata.createdAt.toISOString(),
      updated_at: new Date().toISOString(),
    },
    units: state.inventory.units.map(u => ({
      id: u.id,
      player_id: userId,
      type: u.type,
      value: u.value,
      position_x: u.position.x,
      position_y: u.position.y,
    })),
    upgrades: state.upgrades.active.map(u => ({
      player_id: userId,
      upgrade_id: u.upgradeId,
      purchased_at: u.purchasedAt.toISOString(),
    })),
  };
}

/**
 * Convert database format to GameState
 */
export function dbToStateFormat(
  playerRow: PlayerDBRow,
  unitsRows: UnitDBRow[],
  upgradesRows: UpgradeDBRow[]
): GameState {
  // Convert units
  const units = unitsRows.map(row =>
    new Unit(
      row.id,
      row.type as UnitType,
      row.position_x ?? 0,
      row.position_y ?? 0,
      row.value ?? 0
    )
  );

  // Convert upgrades and filter expired ones
  const activeUpgrades = upgradesRows.map(row => ({
    upgradeId: row.upgrade_id,
    purchasedAt: new Date(row.purchased_at)
  }));

  const filteredUpgrades = filterExpiredUpgrades(activeUpgrades);

  return {
    currency: {
      points: playerRow.points || 0,
      totalClicks: playerRow.totalclicks || 0,
    },
    production: {
      pointsPerSecond: playerRow.pointspersecond || 0,
      clickValue: playerRow.clickvalue || 1,
    },
    inventory: {
      units,
    },
    upgrades: {
      active: filteredUpgrades,
    },
    metadata: {
      createdAt: playerRow.created_at ? new Date(playerRow.created_at) : new Date(),
    },
    ui: {
      isLoading: false,
      isSaving: false,
      error: null,
    },
  };
}

/**
 * Create default/empty game state
 */
export function createDefaultState(): GameState {
  return {
    currency: {
      points: 0,
      totalClicks: 0,
    },
    production: {
      pointsPerSecond: 0,
      clickValue: 1,
    },
    inventory: {
      units: [],
    },
    upgrades: {
      active: [],
    },
    metadata: {
      createdAt: new Date(),
    },
    ui: {
      isLoading: false,
      isSaving: false,
      error: null,
    },
  };
}
