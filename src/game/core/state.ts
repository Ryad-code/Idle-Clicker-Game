import Decimal from 'break_infinity.js';
import type { GameState, UnitType } from './types';
import { Unit } from './types';
import { filterExpiredUpgrades } from './calculations';
import { GRID_COLS } from '../config/grid';

/**
 * Database row format for players table
 */
interface PlayerDBRow {
  user_id: string;
  points: string; // Stored as string to preserve Decimal precision
  clickvalue: string; // Stored as string to preserve Decimal precision
  pointspersecond: string; // Stored as string to preserve Decimal precision
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
 * Converts Decimal values to strings for database storage
 */
export function stateToDBFormat(state: GameState, userId: string) {
  return {
    player: {
      user_id: userId,
      points: state.points.toString(), // Convert Decimal to string for DB storage
      clickvalue: state.clickValue.toString(), // Convert Decimal to string for DB storage
      pointspersecond: state.pointsPerSecond.toString(), // Convert Decimal to string for DB storage
      totalclicks: state.totalClicks,
      created_at: state.createdAt.toISOString(),
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
    upgrades: state.activeUpgrades.map(u => ({
      player_id: userId,
      upgrade_id: u.upgradeId,
      purchased_at: u.purchasedAt.toISOString(),
    })),
  };
}

/**
 * Convert database format to GameState
 * Parses string values back to Decimals
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
    points: new Decimal(playerRow.points || "0"), // Parse string to Decimal
    totalClicks: playerRow.totalclicks || 0,
    pointsPerSecond: new Decimal(0), // Will be recalculated by gameEngine.loadState()
    clickValue: new Decimal(1), // Will be recalculated by gameEngine.loadState()
    grid,
    activeUpgrades: filteredUpgrades,
    createdAt: playerRow.created_at ? new Date(playerRow.created_at) : new Date(),
    isLoading: false,
    isSaving: false,
    error: null,
  };
}

/**
 * Create default/empty game state
 * Uses Decimal for numeric values
 */
export function createDefaultState(): GameState {
  return {
    points: new Decimal(0),
    totalClicks: 0,
    pointsPerSecond: new Decimal(0),
    clickValue: new Decimal(1),
    grid: Array.from({ length: GRID_COLS }, () => Array(GRID_COLS).fill(null)),
    activeUpgrades: [],
    createdAt: new Date(),
    isLoading: false,
    isSaving: false,
    error: null,
  };
}
