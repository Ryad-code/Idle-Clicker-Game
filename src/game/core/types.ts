import Decimal from "break_infinity.js";

/**
 * Unit type string union
 */
export type UnitType =
  | "unit1" | "unit2" | "unit3" | "unit4" | "unit5" | "unit6"
  | "unit7" | "unit8" | "unit9" | "unit10" | "unit11" | "unit12"
  | "unit13" | "unit14" | "unit15" | "unit16" | "unit17" | "unit18";

/**
 * Unit levels map - tracks upgrade level for each unit type
 * Level determines maxCapacity: 2^level
 */
export type UnitLevels = Record<UnitType, number>;

/**
 * Game grid as a 2D array of Units (or null for empty cells)
 */
export type Grid = (Unit | null)[][];

/**
 * Calculate max capacity for a unit based on its level
 * Formula: 2^level (level 0 = capacity 1, level 1 = capacity 2, etc.)
 */
export function getMaxCapacity(level: number): number {
  return Math.pow(2, level);
}

/**
 * Flattened game state structure
 * Organized by change frequency for optimal re-renders
 * Uses Decimal for precise numeric calculations with large numbers
 */
export interface GameState {
  // Hot path - changes every tick/click
  points: Decimal;
  totalClicks: number;

  // Warm path - recalculated on unit/upgrade changes
  pointsPerSecond: Decimal;
  clickValue: Decimal;

  // Cold path - changes on buy/expire
  activeUpgrades: Array<{ upgradeId: string; purchasedAt: Date }>;

  // Static - set once
  createdAt: Date;

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Grid is now the single source of truth for units
  grid: Grid;
  
  // Unit upgrade levels - determines maxCapacity for each unit type
  unitLevels: UnitLevels;
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
  // Stacking count - maxCapacity is now derived from unitLevels
  stackedCount: number;

  /**
   * @param bonusActive - whether the unit's bonus is active (default: false)
   */
  constructor(id: string, type: UnitType, x: number, y: number, value: number, bonusActive = false, stackedCount = 1) {
    this.id = id;
    this.type = type;
    this.position = { x, y };
    this.value = value;
    this.bonusActive = bonusActive;
    this.stackedCount = stackedCount;
  }
}

/**
 * Active upgrade entry
 */
export interface ActiveUpgrade {
  upgradeId: string;
  purchasedAt: Date;
}
