import { gameEngine } from './gameEngine';
import { useGameStore } from './gameStore';

/**
 * Game Tick System
 *
 * Runs every second to increment points based on current production rate
 * and syncs the Zustand store with the updated game engine state.
 *
 * This module manages two critical background processes:
 * 1. Game tick interval (1000ms) - Updates game state and production
 * 2. Auto-save interval (30000ms) - Persists game state to local storage
 *
 * Intervals are started automatically on module load and can be cleaned up
 * when the application shuts down to prevent memory leaks.
 */

let tickIntervalId: ReturnType<typeof setInterval> | null = null;
let autoSaveIntervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Starts the game tick interval if not already running.
 * The tick interval updates game state every second.
 */
export function startTickInterval(): void {
  if (tickIntervalId !== null) return; // Already running

  tickIntervalId = setInterval(() => {
    gameEngine.tick();
    useGameStore.getState().syncWithEngine();
  }, 1000);
}

/**
 * Starts the auto-save interval if not already running.
 * The auto-save interval persists game state every 30 seconds.
 */
export function startAutoSaveInterval(): void {
  if (autoSaveIntervalId !== null) return; // Already running

  autoSaveIntervalId = setInterval(() => {
    gameEngine.save().catch(err => {
      console.error('Auto-save failed:', err);
    });
  }, 30000);
}

/**
 * Stops the game tick interval if running.
 * Safe to call multiple times.
 */
function stopTickInterval(): void {
  if (tickIntervalId !== null) {
    clearInterval(tickIntervalId);
    tickIntervalId = null;
  }
}

/**
 * Stops the auto-save interval if running.
 * Safe to call multiple times.
 */
function stopAutoSaveInterval(): void {
  if (autoSaveIntervalId !== null) {
    clearInterval(autoSaveIntervalId);
    autoSaveIntervalId = null;
  }
}

/**
 * Cleans up all background intervals and timers.
 * This should be called when the application is shutting down
 * or when the tick system needs to be completely reset.
 *
 * Safe to call multiple times - subsequent calls are no-ops.
 */
export function cleanupTickSystem(): void {
  stopTickInterval();
  stopAutoSaveInterval();
}