import Decimal from 'break_infinity.js';
import type { UnitType, Grid, ActiveUpgrade, GameState, UnitLevels } from './core/types';
import { Unit, getMaxCapacity } from './core/types';
import {
  calculateProduction,
  calculateClickValue,
  calculateUnitCost,
  calculateUpgradeCost,
  filterExpiredUpgrades
} from './core/calculations';
import { UNIT_CONFIG } from './config/units';
import { updateUnitsBonusState } from './core/bonuses';
import { GRID_COLS, GRID_ROWS } from './config/grid';
import { UPGRADES } from './config/upgrades';
import { savePlayerToDB, loadPlayerFromDB } from './services/database';

/**
 * GameEngine Class - Core Game Logic
 *
 * This class encapsulates all game state and logic for the idle clicker game.
 * It is completely decoupled from React and serves as the single source of truth
 * for game mechanics. The engine manages:
 *
 * - Player currency (points) and production rates
 * - Unit placement and management on a grid
 * - Upgrade system with temporary bonuses
 * - Game persistence data
 *
 * All state is stored in private variables and accessed through public methods
 * and getters. Methods mutate internal state directly and are synchronous.
 *
 * The engine is designed to be framework-agnostic and can be used in any
 * environment (React, Node.js, etc.) without modification.
 */
export class GameEngine {
  // Core game state - player's resources and statistics (using Decimal for precision)
  points: Decimal = new Decimal(0);           // Current points/currency
  totalClicks: number = 0;          // Total clicks ever made
  pointsPerSecond: Decimal = new Decimal(1);   // Current production rate
  clickValue: Decimal = new Decimal(1);        // Points gained per click

  // Game world state
  gameGrid: Grid = Array.from({ length: GRID_COLS }, () => Array(GRID_COLS).fill(null));
  activeUpgrades: ActiveUpgrade[] = [];
  
  // Unit upgrade levels - determines maxCapacity (2^level) for each unit type
  unitLevels: UnitLevels = {
    unit1: 0, unit2: 0, unit3: 0, unit4: 0, unit5: 0, unit6: 0,
    unit7: 0, unit8: 0, unit9: 0, unit10: 0, unit11: 0, unit12: 0,
    unit13: 0, unit14: 0, unit15: 0, unit16: 0, unit17: 0, unit18: 0,
  };

  // Metadata and UI state
  createdAt: Date = new Date();     // When the game was created
  isLoading: boolean = false;       // Loading state for UI
  isSaving: boolean = false;        // Saving state for UI
  error: string | null = null;      // Error message for UI
  userId: string | null = null;     // Current user ID for saving

  // Public methods for game interactions

  /**
   * Handles a click action: increases points by clickValue and increments totalClicks.
   * Uses Decimal addition for precise point tracking.
   */
  click(): void {
    this.points = this.points.plus(this.clickValue);
    this.totalClicks += 1;
  }

  /**
   * Processes a game tick: adds points per second to the current points.
   * Also removes expired upgrades and recalculates production if needed.
   */
  tick(): void {
    // Remove expired upgrades only if there are active upgrades
    if (this.activeUpgrades.length > 0) {
      const oldCount = this.activeUpgrades.length;
      this.activeUpgrades = filterExpiredUpgrades(this.activeUpgrades);
      
      if (this.activeUpgrades.length !== oldCount) {
        // Recalculate production after removing expired upgrades
        this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
        this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
      }
    }
    // Add points using Decimal addition
    this.points = this.points.plus(this.pointsPerSecond);
  }

  /**
   * Loads game state from a saved GameState object.
   * Used for restoring saved games from the database.
   */
  loadState(state: GameState): void {
    this.points = state.points;
    this.totalClicks = state.totalClicks;
    this.gameGrid = state.grid;
    this.activeUpgrades = state.activeUpgrades;
    this.unitLevels = state.unitLevels || this.unitLevels;
    this.createdAt = state.createdAt;
    this.isLoading = state.isLoading;
    this.isSaving = state.isSaving;
    this.error = state.error;

    // Recalculate production values based on loaded grid and upgrades
    // This ensures accuracy even if saved production values were stale
    this.gameGrid = updateUnitsBonusState(this.gameGrid);
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
  }

  /**
   * Initializes the game engine with user data.
   * Loads saved state if userId is provided.
   */
  async initialize(userId: string | null): Promise<void> {
    this.userId = userId;
    if (userId) {
      try {
        const savedState = await loadPlayerFromDB(userId);
        this.loadState(savedState);
      } catch (error) {
        console.warn('Failed to load game state:', error);
        // Continue with default state
      }
    }
  }

  /**
   * Buys a unit of the specified type if affordable and space available.
   * Places the unit on the grid and updates production values.
   * Uses Decimal for cost comparison and subtraction.
   */
  buyUnit(type: UnitType): void {
    const config = UNIT_CONFIG[type];
    const flatUnits = this.gameGrid.flat().filter((u): u is Unit => u !== null);
    if (flatUnits.length >= this.gameGrid.length * this.gameGrid[0].length) return;
    
    const numToBuy = getMaxCapacity(this.unitLevels[type]);
    const cost = calculateUnitCost(flatUnits, type, config.cost, numToBuy);
    // Check if player can afford using Decimal comparison
    if (this.points.lt(cost)) return;
    
    const placedGrid = this.placeUnitInGrid(this.gameGrid, type, config.value);
    this.gameGrid = updateUnitsBonusState(placedGrid);
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
    
    // Deduct cost using Decimal subtraction
    this.points = this.points.minus(cost);
  }

  /**
   * Sells the last unit of the specified type from the grid.
   * Refunds points and updates production values.
   * Uses Decimal for refund addition.
   */
  sellUnit(type: UnitType): void {
    let lastPos: { x: number; y: number } | null = null;
    for (let y = this.gameGrid.length - 1; y >= 0; y--) {
      for (let x = this.gameGrid[y].length - 1; x >= 0; x--) {
        const unit = this.gameGrid[y][x];
        if (unit && unit.type === type) {
          lastPos = { x, y };
          break;
        }
      }
      if (lastPos) break;
    }
    if (!lastPos) return;
    
    const config = UNIT_CONFIG[type];
    const removedGrid = this.gameGrid.map((row, y) =>
      row.map((cell, x) => (x === lastPos!.x && y === lastPos!.y ? null : cell))
    );
    this.gameGrid = updateUnitsBonusState(removedGrid);
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
    
    // Add refund using Decimal addition
    this.points = this.points.plus(config.refund);
  }

  /**
   * Buys an upgrade by ID if affordable.
   * Adds the upgrade to active list and updates production values.
   * Uses Decimal for cost comparison and subtraction.
   */
  buyUpgrade(upgradeId: string): void {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;
    
    const cost = calculateUpgradeCost(upgradeId, this.pointsPerSecond, this.clickValue);
    // Check if player can afford using Decimal comparison
    if (this.points.lt(cost)) return;
    
    this.activeUpgrades = [...this.activeUpgrades, { upgradeId, purchasedAt: new Date() }];
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
    
    // Deduct cost using Decimal subtraction
    this.points = this.points.minus(cost);
  }

  /**
   * Sets the points to a new value (for testing/debugging).
   * Converts number to Decimal.
   */
  setPoints(newPoints: number): void {
    this.points = new Decimal(newPoints);
  }

  /**
   * Resets the game by clearing all units and resetting unit levels to 0.
   */
  resetGame(): void {
    this.gameGrid = Array.from({ length: GRID_COLS }, () => Array(GRID_COLS).fill(null));
    this.unitLevels = {
      unit1: 0, unit2: 0, unit3: 0, unit4: 0, unit5: 0, unit6: 0,
      unit7: 0, unit8: 0, unit9: 0, unit10: 0, unit11: 0, unit12: 0,
      unit13: 0, unit14: 0, unit15: 0, unit16: 0, unit17: 0, unit18: 0,
    };
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
  }

  /**
   * Moves a unit from one grid position to another.
   * Handles moving, swapping, or stacking units as appropriate.
   */
  moveUnit(fromX: number, fromY: number, toX: number, toY: number): void {
    // Validate coordinates are within grid bounds
    if (fromX < 0 || fromX >= GRID_COLS || fromY < 0 || fromY >= GRID_ROWS ||
        toX < 0 || toX >= GRID_COLS || toY < 0 || toY >= GRID_ROWS) {
      console.warn(`Invalid move coordinates: from(${fromX},${fromY}) to(${toX},${toY})`);
      return;
    }

    // Create a deep copy of the grid to avoid mutating the original state
    const newGrid = this.gameGrid.map(row => row.slice());
    const source = newGrid[fromY][fromX];
    const dest = newGrid[toY][toX];

    // If there's no unit at the source position, do nothing
    if (!source) return;

    // If the destination is empty, simply move the unit there
    if (!dest) {
      newGrid[toY][toX] = new Unit(
        source.id, source.type, toX, toY, source.value, source.bonusActive, source.stackedCount
      );
      newGrid[fromY][fromX] = null;
    } else {
      // If destination has a unit
      if (source.type !== dest.type) {
        // Different unit types: swap the units
        newGrid[toY][toX] = new Unit(
          source.id, source.type, toX, toY, source.value, source.bonusActive, source.stackedCount
        );
        newGrid[fromY][fromX] = new Unit(
          dest.id, dest.type, fromX, fromY, dest.value, dest.bonusActive, dest.stackedCount
        );
      } else {
        // Same unit type: attempt to stack them
        const maxCapacity = getMaxCapacity(this.unitLevels[dest.type]);
        if (dest.stackedCount + source.stackedCount <= maxCapacity) {
          // Stack the units by combining their counts
          newGrid[toY][toX] = new Unit(
            dest.id, dest.type, toX, toY, dest.value, dest.bonusActive, dest.stackedCount + source.stackedCount
          );
          newGrid[fromY][fromX] = null;
        } else {
          // Cannot stack due to capacity limit, do nothing
          return;
        }
      }
    }

    // Update the game grid with bonus states recalculated
    this.gameGrid = updateUnitsBonusState(newGrid);
    // Recalculate production and click values based on the new grid
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
  }

  /**
   * Checks if all units of the given type are fully stacked.
   */
  isUnitTypeFullyStacked(type: UnitType): boolean {
    const maxCapacity = getMaxCapacity(this.unitLevels[type]);
    return this.gameGrid.flat().every(unit => 
      unit === null || unit.type !== type || unit.stackedCount >= maxCapacity
    );
  }

  /**
   * Upgrades a unit type by incrementing its level.
   * This doubles the maxCapacity for all units of that type (2^level).
   */
  upgradeUnitType(type: UnitType): void {
    const totalOwned = this.gameGrid.flat().filter(unit => unit && unit.type === type).length;
    if (totalOwned === 0 || !this.isUnitTypeFullyStacked(type) || totalOwned % 2 !== 0) {
      return; // Prevent upgrade if no units, not fully stacked, or odd number
    }
    
    // Create new object to trigger Zustand reactivity
    this.unitLevels = {
      ...this.unitLevels,
      [type]: this.unitLevels[type] + 1,
    };
    
    // Recalculate production since capacity increased
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
  }

  // Private helper methods

  /**
   * Places a new unit in a random available cell on the grid.
   * Returns the updated grid.
   */
  private placeUnitInGrid(
    grid: (Unit | null)[][],
    type: UnitType,
    value: number
  ): (Unit | null)[][] {
    const available: { x: number; y: number }[] = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === null) {
          available.push({ x, y });
        }
      }
    }
    if (available.length === 0) return grid;
    const idx = Math.floor(Math.random() * available.length);
    const { x, y } = available[idx];
    const maxCapacity = getMaxCapacity(this.unitLevels[type]);
    return grid.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (rowIdx === y && colIdx === x) {
          return new Unit(crypto.randomUUID(), type, x, y, value, false, maxCapacity);
        }
        return cell;
      })
    );
  }

  // ============================================================================
  // Getters - Provide read-only access to game state
  // ============================================================================

  /** Gets the current game grid (2D array of units). */
  get grid() { return this.gameGrid; }

  /**
   * Sets the current user ID for saving/loading operations.
   */
  setUserId(userId: string | null): void {
    this.userId = userId;
  }

  /**
   * Saves the current game state to the database for the current user.
   */
  async save(): Promise<void> {
    if (!this.userId) {
      throw new Error('No user ID set for saving');
    }
    
    this.isSaving = true;
    this.error = null;
    
    try {
      const state: GameState = {
        points: this.points,
        totalClicks: this.totalClicks,
        pointsPerSecond: this.pointsPerSecond,
        clickValue: this.clickValue,
        activeUpgrades: this.activeUpgrades,
        createdAt: this.createdAt,
        isLoading: this.isLoading,
        isSaving: this.isSaving,
        error: this.error,
        grid: this.gameGrid,
        unitLevels: this.unitLevels,
      };
      
      await savePlayerToDB(this.userId, state);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Save failed';
      throw error;
    } finally {
      this.isSaving = false;
    }
  }
}

// ============================================================================
// Global Game Engine Instance
// ============================================================================

/**
 * Singleton instance of the GameEngine.
 * This is the single source of truth for all game state and logic.
 * All components and systems should interact with this instance.
 */
export const gameEngine = new GameEngine();