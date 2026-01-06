import Decimal from 'break_infinity.js';
import type { GameState } from './types';
import { GRID_COLS } from '../config/grid';

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
