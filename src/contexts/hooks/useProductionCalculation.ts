import { useEffect } from 'react';
import type { GameState } from '../../game/core/types';
import { calculateProduction, calculateClickValue } from '../../game/core/calculations';

/**
 * Custom hook to recalculate game production metrics.
 *
 * This hook monitors changes to the game grid and active upgrades, and automatically
 * updates the production state (points per second and click value) whenever units
 * or upgrades are modified. It ensures the game's production calculations remain
 * accurate and up-to-date without manual intervention.
 *
 * @param state - The current game state
 * @param setState - State setter function to update the game state
 */
export function useProductionCalculation(state: GameState, setState: React.Dispatch<React.SetStateAction<GameState>>) {
  useEffect(() => {
    // Recalculate production based on current grid and active upgrades
    const newProduction = calculateProduction(state.grid, state.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, state.upgrades.active);

    // Update the production state with new values
    setState(prev => ({
      ...prev,
      production: {
        pointsPerSecond: newProduction,
        clickValue: newClickValue,
      },
    }));
  }, [state.grid, state.upgrades.active, setState]);
}