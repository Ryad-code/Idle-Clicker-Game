/**
 * Game Store - Zustand State Management
 *
 * This is the central state management store for the idle clicker game using Zustand.
 * It provides reactive access to game state, with the GameEngine as the
 * single source of truth for game logic. The store acts as a bridge between the
 * React components and the game engine.
 *
 * Key features:
 * - Reactive state updates that trigger component re-renders
 * - Selector-based subscriptions for optimal performance
 * - Global state accessible from any component
 */

import { create } from 'zustand';
import type { GameState } from '../game/core/types';
import { gameEngine } from '../game/gameEngine';

/**
 * Extended GameState interface that includes the sync method.
 * Actions are handled directly via gameEngine.
 */
interface GameStore extends GameState {
  syncWithEngine: () => void;
}

// Use the global gameEngine instance instead of creating a new one
// const gameEngine = new GameEngine();

export const useGameStore = create<GameStore>((set) => ({
  // Initialize store state from the game engine's current state
  points: gameEngine.points,
  totalClicks: gameEngine.totalClicks,
  pointsPerSecond: gameEngine.pointsPerSecond,
  clickValue: gameEngine.clickValue,
  activeUpgrades: gameEngine.activeUpgrades,
  createdAt: gameEngine.createdAt,
  isLoading: gameEngine.isLoading,
  isSaving: gameEngine.isSaving,
  error: gameEngine.error,
  grid: gameEngine.grid,

  /**
   * Syncs the store state with the current game engine state.
   * This is called after any game engine mutation to keep the store in sync.
   */
  syncWithEngine: () => {
    set({
      points: gameEngine.points,
      totalClicks: gameEngine.totalClicks,
      pointsPerSecond: gameEngine.pointsPerSecond,
      clickValue: gameEngine.clickValue,
      activeUpgrades: gameEngine.activeUpgrades,
      createdAt: gameEngine.createdAt,
      isLoading: gameEngine.isLoading,
      isSaving: gameEngine.isSaving,
      error: gameEngine.error,
      grid: gameEngine.grid,
    });
  },
}));