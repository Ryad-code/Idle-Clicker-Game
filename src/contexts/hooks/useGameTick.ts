import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { GameState } from '../../game/core/types';
import { filterExpiredUpgrades } from '../../game/core/calculations';
import { GAME_TICK_INTERVAL_MS } from '../../game/config/constants';

/**
 * Custom hook that manages the game's periodic tick system.
 *
 * This hook sets up an interval that runs every GAME_TICK_INTERVAL_MS milliseconds
 * to update the game state with points earned from production and to clean up
 * expired upgrades. The tick only runs when a user is logged in (userId is provided).
 *
 * @param userId - The ID of the logged-in user; if undefined, the tick is paused
 * @param setState - State setter function to update the game state
 */
export function useGameTick(
  userId: string | undefined,
  setState: Dispatch<SetStateAction<GameState>>
) {
  // Reference to store the interval ID for cleanup
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // If no user is logged in, stop the tick and clean up
    if (!userId) {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    // Start the game tick interval if it's not already running
    if (!tickIntervalRef.current) {
      tickIntervalRef.current = setInterval(() => {
        // Debug log for tick execution (can be removed in production)
        console.log("tick");

        // Update game state within the tick
        setState(prev => {
          // Remove any upgrades that have expired
          const filteredUpgrades = filterExpiredUpgrades(prev.upgrades.active);

          // Return updated state with new points and filtered upgrades
          return {
            ...prev,
            currency: {
              ...prev.currency,
              // Add points earned from production since last tick
              points: prev.currency.points + prev.production.pointsPerSecond,
            },
            upgrades: {
              active: filteredUpgrades,
            },
          };
        });
      }, GAME_TICK_INTERVAL_MS);
    }

    // Cleanup function to clear interval when component unmounts or userId changes
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [userId, setState]); // Re-run effect when userId or setState changes
}
