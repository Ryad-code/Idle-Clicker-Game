import Decimal from 'break_infinity.js';
import type { GameState, UnitType, UnitLevels } from './types';
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
  unit_levels: string; // JSON string of UnitLevels
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
      unit_levels: JSON.stringify(state.unitLevels), // Serialize unit levels as JSON string
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
      const unit = new Unit(row.id, row.type as UnitType, row.position_x, row.position_y, row.value ?? 0, false, row.stacked_count ?? 1);
      grid[row.position_y][row.position_x] = unit;
    }
  }

  // Convert upgrades and filter expired ones
  const activeUpgrades = upgradesRows.map(row => ({
    upgradeId: row.upgrade_id,
    purchasedAt: new Date(row.purchased_at)
  }));

  const filteredUpgrades = filterExpiredUpgrades(activeUpgrades);
  
  // Parse unit levels from JSON string, default to level 0 for all units if not present
  let unitLevels: UnitLevels;
  try {
    unitLevels = JSON.parse(playerRow.unit_levels || '{}');
  } catch {
    unitLevels = {
      unit1: 0, unit2: 0, unit3: 0, unit4: 0, unit5: 0, unit6: 0,
      unit7: 0, unit8: 0, unit9: 0, unit10: 0, unit11: 0, unit12: 0,
      unit13: 0, unit14: 0, unit15: 0, unit16: 0, unit17: 0, unit18: 0,
    };
  }
  
  // Ensure all unit types have a level (default to 0 if missing)
  const allUnitTypes: UnitType[] = [
    'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6',
    'unit7', 'unit8', 'unit9', 'unit10', 'unit11', 'unit12',
    'unit13', 'unit14', 'unit15', 'unit16', 'unit17', 'unit18',
  ];
  allUnitTypes.forEach(type => {
    if (unitLevels[type] === undefined) {
      unitLevels[type] = 0;
    }
  });

  return {
    points: new Decimal(playerRow.points || "0"), // Parse string to Decimal
    totalClicks: playerRow.totalclicks || 0,
    pointsPerSecond: new Decimal(0), // Will be recalculated by gameEngine.loadState()
    clickValue: new Decimal(1), // Will be recalculated by gameEngine.loadState()
    grid,
    activeUpgrades: filteredUpgrades,
    unitLevels, // Include parsed unit levels
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
    unitLevels: {
      unit1: 0, unit2: 0, unit3: 0, unit4: 0, unit5: 0, unit6: 0,
      unit7: 0, unit8: 0, unit9: 0, unit10: 0, unit11: 0, unit12: 0,
      unit13: 0, unit14: 0, unit15: 0, unit16: 0, unit17: 0, unit18: 0,
    },
    createdAt: new Date(),
    isLoading: false,
    isSaving: false,
    error: null,
  };
}
