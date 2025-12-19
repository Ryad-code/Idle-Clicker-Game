import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { GameState } from '../../game/core/types';
import { calculateProduction, calculateClickValue, filterExpiredUpgrades } from '../../game/core/calculations';
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
        setState(prev => {
          // Filter expired upgrades
          const filteredUpgrades = filterExpiredUpgrades(prev.upgrades.active);
          const upgradesChanged = filteredUpgrades.length !== prev.upgrades.active.length;
          
          // Only update if something changed
          if (prev.production.pointsPerSecond === 0 && !upgradesChanged) {
            return prev;
          }
          
          // Recalculate production if upgrades expired
          let newProduction = prev.production.pointsPerSecond;
          let newClickValue = prev.production.clickValue;
          
          if (upgradesChanged) {
            newProduction = calculateProduction(prev.inventory.units, filteredUpgrades);
            newClickValue = calculateClickValue(newProduction, filteredUpgrades);
          }
          
          return {
            ...prev,
            currency: {
              ...prev.currency,
              points: prev.currency.points + prev.production.pointsPerSecond,
            },
            upgrades: {
              active: filteredUpgrades,
            },
            production: {
              pointsPerSecond: newProduction,
              clickValue: newClickValue,
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
