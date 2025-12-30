import type { GameState, UnitType } from './types';
import { Unit } from './types';
import { filterExpiredUpgrades } from './calculations';
import { GRID_COLS } from '../config/grid';

/**
 * Database row format for players table
 */
interface PlayerDBRow {
  user_id: string;
  points: string; // Stored as string to preserve bigint precision
  clickvalue: string; // Stored as string to preserve bigint precision
  pointspersecond: string; // Stored as string to preserve bigint precision
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
  stacked_count: number;
  max_capacity: number;
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
      points: state.currency.points.toString(), // Convert bigint to string for DB storage
      clickvalue: state.production.clickValue.toString(), // Convert bigint to string for DB storage
      pointspersecond: state.production.pointsPerSecond.toString(), // Convert bigint to string for DB storage
      totalclicks: state.currency.totalClicks,
      created_at: state.metadata.createdAt.toISOString(),
      updated_at: new Date().toISOString(),
    },
    units: state.grid
      .map((row, y) =>
        row.map((u, x) =>
          u !== null
            ? {
                id: u.id,
                player_id: userId,
                type: u.type,
                value: u.value,
                position_x: x,
                position_y: y,
                stacked_count: u.stackedCount,
                max_capacity: u.maxCapacity,
              }
            : null
        )
      )
      .flat()
      .filter(u => u !== null),
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
  // Convert units and build grid
  const gridRows = 11; // Or load from config
  const gridCols = 11;
  const grid: (Unit | null)[][] = Array.from({ length: gridRows }, () => Array(gridCols).fill(null));
  for (const row of unitsRows) {
    if (
      typeof row.position_x === 'number' &&
      typeof row.position_y === 'number' &&
      row.position_x >= 0 && row.position_x < gridCols &&
      row.position_y >= 0 && row.position_y < gridRows
    ) {
      const unit = new Unit(row.id, row.type as UnitType, row.position_x, row.position_y, row.value ?? 0, false, row.stacked_count ?? 1, row.max_capacity ?? 1);
      grid[row.position_y][row.position_x] = unit;
    }
  }

  // Convert upgrades and filter expired ones
  const activeUpgrades = upgradesRows.map(row => ({
    upgradeId: row.upgrade_id,
    purchasedAt: new Date(row.purchased_at)
  }));

  const filteredUpgrades = filterExpiredUpgrades(activeUpgrades);

  return {
    currency: {
      points: BigInt(playerRow.points || "0"), // Parse string back to bigint
      totalClicks: playerRow.totalclicks || 0,
    },
    production: {
      pointsPerSecond: BigInt(playerRow.pointspersecond || "0"), // Parse string back to bigint
      clickValue: BigInt(playerRow.clickvalue || "1"), // Parse string back to bigint
    },
    grid,
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
      points: 0n,
      totalClicks: 0,
    },
    production: {
      pointsPerSecond: 0n,
      clickValue: 1n,
    },
    grid: Array.from({ length: GRID_COLS }, () => Array(GRID_COLS).fill(null)),
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
