import type { UnitType, Grid, ActiveUpgrade, GameState } from './core/types';
import { Unit } from './core/types';
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
import { savePlayerToDB } from './services/database';

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
  // Core game state - player's resources and statistics
  points: bigint = 0n;              // Current points/currency
  totalClicks: number = 0;          // Total clicks ever made
  pointsPerSecond: bigint = 1n;     // Current production rate
  clickValue: bigint = 1n;          // Points gained per click

  // Game world state
  gameGrid: Grid = Array.from({ length: GRID_COLS }, () => Array(GRID_COLS).fill(null));
  activeUpgrades: ActiveUpgrade[] = [];

  // Metadata and UI state
  createdAt: Date = new Date();     // When the game was created
  isLoading: boolean = false;       // Loading state for UI
  isSaving: boolean = false;        // Saving state for UI
  error: string | null = null;      // Error message for UI
  userId: string | null = null;     // Current user ID for saving

  // Public methods for game interactions

  /**
   * Handles a click action: increases points by clickValue and increments totalClicks.
   */
  click(): void {
    this.points += this.clickValue;
    this.totalClicks += 1;
  }

  /**
   * Processes a game tick: adds points per second to the current points.
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
    // Add points
    this.points += this.pointsPerSecond;
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
   * Buys a unit of the specified type if affordable and space available.
   * Places the unit on the grid and updates production values.
   */
  buyUnit(type: UnitType): void {
    const config = UNIT_CONFIG[type];
    const flatUnits = this.gameGrid.flat().filter((u): u is Unit => u !== null);
    if (flatUnits.length >= this.gameGrid.length * this.gameGrid[0].length) return;
    const cost = calculateUnitCost(flatUnits, type, config.cost);
    if (this.points < cost) return;
    const placedGrid = this.placeUnitInGrid(this.gameGrid, type, config.value);
    this.gameGrid = updateUnitsBonusState(placedGrid);
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
    this.points -= cost;
  }

  /**
   * Sells the last unit of the specified type from the grid.
   * Refunds points and updates production values.
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
    this.points += BigInt(config.refund);
  }

  /**
   * Buys an upgrade by ID if affordable.
   * Adds the upgrade to active list and updates production values.
   */
  buyUpgrade(upgradeId: string): void {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;
    const cost = calculateUpgradeCost(upgradeId, this.pointsPerSecond, this.clickValue);
    if (this.points < cost) return;
    this.activeUpgrades = [...this.activeUpgrades, { upgradeId, purchasedAt: new Date() }];
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
    this.points -= cost;
  }

  /**
   * Sets the points to a new value (for testing/debugging).
   */
  setPoints(newPoints: number): void {
    this.points = BigInt(newPoints);
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

    const newGrid = this.gameGrid.map(row => row.slice());
    const source = newGrid[fromY][fromX];
    const dest = newGrid[toY][toX];
    if (!source) return;
    if (!dest) {
      newGrid[toY][toX] = new Unit(
        source.id, source.type, toX, toY, source.value, source.bonusActive, source.stackedCount, source.maxCapacity
      );
      newGrid[fromY][fromX] = null;
    } else {
      if (source.type !== dest.type) {
        newGrid[toY][toX] = new Unit(
          source.id, source.type, toX, toY, source.value, source.bonusActive, source.stackedCount, source.maxCapacity
        );
        newGrid[fromY][fromX] = new Unit(
          dest.id, dest.type, fromX, fromY, dest.value, dest.bonusActive, dest.stackedCount, dest.maxCapacity
        );
      } else {
        if (dest.stackedCount + source.stackedCount <= dest.maxCapacity) {
          newGrid[toY][toX] = new Unit(
            dest.id, dest.type, toX, toY, dest.value, dest.bonusActive, dest.stackedCount + source.stackedCount, dest.maxCapacity
          );
          newGrid[fromY][fromX] = null;
        } else {
          return;
        }
      }
    }
    this.gameGrid = updateUnitsBonusState(newGrid);
    this.pointsPerSecond = calculateProduction(this.gameGrid, this.activeUpgrades);
    this.clickValue = calculateClickValue(this.pointsPerSecond, this.activeUpgrades);
  }

  /**
   * Upgrades all units of the specified type by doubling their maxCapacity.
   * Updates the grid and production values.
   */
  upgradeUnitType(type: UnitType): void {
    const newGrid = this.gameGrid.map(row =>
      row.map(cell => {
        if (cell && cell.type === type) {
          return new Unit(cell.id, cell.type, cell.position.x, cell.position.y, cell.value, cell.bonusActive, cell.stackedCount, cell.maxCapacity * 2);
        }
        return cell;
      })
    );
    this.gameGrid = updateUnitsBonusState(newGrid);
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
    return grid.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (rowIdx === y && colIdx === x) {
          return new Unit(crypto.randomUUID(), type, x, y, value);
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