export type UnitType = "unit1" | "unit2" | "unit3" | "unit4" | "unit5" | "unit6" | "unit7" | "unit8" | "unit9" | "unit10" | "unit11" | "unit12" | "unit13" | "unit14" | "unit15" | "unit16" | "unit17" | "unit18";

/**
 * Flattened game state structure
 * Organized by change frequency for optimal re-renders
 */
export interface GameState {
  // Hot path - changes every tick/click
  currency: {
    points: number;
    totalClicks: number;
  };
  
  // Warm path - recalculated on unit/upgrade changes
  production: {
    pointsPerSecond: number;
    clickValue: number;
  };
  
  // Cold path - changes on buy/sell only
  inventory: {
    units: Unit[];
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
}

/**
 * Unit instance
 */
export class Unit {
  id: string;
  type: UnitType;
  position: { x: number; y: number };
  value: number;

  constructor(
    id: string,
    type: UnitType,
    x: number,
    y: number,
    value: number
  ) {
    this.id = id;
    this.type = type;
    this.position = { x, y };
    this.value = value;
  }
}

/**
 * Active upgrade entry
 */
export interface ActiveUpgrade {
  upgradeId: string;
  purchasedAt: Date;
}
