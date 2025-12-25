import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { GameState } from '../../game/core/types';
import { filterExpiredUpgrades } from '../../game/core/calculations';
import { GAME_TICK_INTERVAL_MS } from '../../game/config/constants';

/**
 * Manages the game tick interval that updates points per second
 * and filters expired upgrades
 */
export function useGameTick(
  userId: string | undefined,
  setState: Dispatch<SetStateAction<GameState>>
) {
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!userId) {
      // Clear interval if user logs out
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    // Start game tick if not already running
    if (!tickIntervalRef.current) {
      tickIntervalRef.current = setInterval(() => {
        console.log("tick")
        setState(prev => {
          // Filter expired upgrades
          const filteredUpgrades = filterExpiredUpgrades(prev.upgrades.active);
          
          return {
            ...prev,
            currency: {
              ...prev.currency,
              points: prev.currency.points + prev.production.pointsPerSecond,
            },
            upgrades: {
              active: filteredUpgrades,
            },
          };
        });
      }, GAME_TICK_INTERVAL_MS);
    }

    // Cleanup on unmount
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [userId, setState]);
}
