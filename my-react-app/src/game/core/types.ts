
/**
 * Unit type string union
 */
export type UnitType =
  | "unit1" | "unit2" | "unit3" | "unit4" | "unit5" | "unit6"
  | "unit7" | "unit8" | "unit9" | "unit10" | "unit11" | "unit12"
  | "unit13" | "unit14" | "unit15" | "unit16" | "unit17" | "unit18";


/**
 * Game grid as a 2D array of Units (or null for empty cells)
 */
export type Grid = (Unit | null)[][];

/**
 * Flattened game state structure
 * Organized by change frequency for optimal re-renders
 */
export interface GameState {
  // Hot path - changes every tick/click
  currency: {
    points: bigint;
    totalClicks: number;
  };
  // Warm path - recalculated on unit/upgrade changes
  production: {
    pointsPerSecond: bigint;
    clickValue: bigint;
  };
  // Cold path - changes on buy/expire
  upgrades: {
    active: Array<{ upgradeId: string; purchasedAt: Date }>;
  };
  // Static - set once
  metadata: {
    createdAt: Date;
  };
  // UI state
  ui: {
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
  };
  // Grid is now the single source of truth for units
  grid: Grid;
}

/**
 * Unit instance
 */
export class Unit {
  id: string;
  type: UnitType;
  position: { x: number; y: number };
  value: number;
  // Tracks if this unit's bonus is currently active
  bonusActive: boolean;

  /**
   * @param bonusActive - whether the unit's bonus is active (default: false)
   */
  constructor(id: string, type: UnitType, x: number, y: number, value: number, bonusActive = false) {
    this.id = id;
    this.type = type;
    this.position = { x, y };
    this.value = value;
    this.bonusActive = bonusActive;
  }
}

/**
 * Active upgrade entry
 */
export interface ActiveUpgrade {
  upgradeId: string;
  purchasedAt: Date;
}
