/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { GameState, UnitType } from '../game/core/types';
import { Unit } from '../game/core/types';
import { createDefaultState } from '../game/core/state';
import { loadPlayerFromDB, savePlayerToDB } from '../game/services/database';
import { 
  calculateProduction, 
  calculateClickValue, 
  calculateUnitCost,
  filterExpiredUpgrades 
} from '../game/core/calculations';
import { UNIT_CONFIG } from '../game/config/units';
import { UPGRADES } from '../game/config/upgrades';
import { AUTO_SAVE_DELAY_MS, GAME_TICK_INTERVAL_MS } from '../game/config/constants';
import { logError, getErrorMessage } from '../utils/errorUtils';

/**
 * Game state context - data only
 */
const GameStateContext = createContext<GameState | null>(null);

/**
 * Game actions context - stable function references
 */
interface GameActions {
  click: () => void;
  buyUnit: (type: UnitType) => void;
  sellUnit: (type: UnitType) => void;
  buyUpgrade: (upgradeId: string) => void;
  save: () => Promise<void>;
  setPoints: (points: number) => void;
}

const GameActionsContext = createContext<GameActions | null>(null);

interface Props {
  userId?: string;
  children: React.ReactNode;
}

export function GameProvider({ userId, children }: Props) {
  const [state, setState] = useState<GameState>(createDefaultState());
  const userIdRef = useRef<string | null>(null);
  const stateRef = useRef<GameState>(state);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep stateRef in sync for async operations
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Debounced save helper
  const scheduleSave = useCallback(() => {
    if (!userIdRef.current) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (userIdRef.current) {
        savePlayerToDB(userIdRef.current, stateRef.current)
          .catch(err => logError('debounced-save', err));
      }
    }, AUTO_SAVE_DELAY_MS);
  }, []);

  // Actions - stable references
  const actions = useMemo<GameActions>(() => ({
    click: () => {
      setState(prev => ({
        ...prev,
        currency: {
          ...prev.currency,
          points: prev.currency.points + prev.production.clickValue,
          totalClicks: prev.currency.totalClicks + 1,
        },
      }));
    },

    buyUnit: (type: UnitType) => {
      setState(prev => {
        const config = UNIT_CONFIG[type];
        const cost = calculateUnitCost(prev.inventory.units, type, config.cost);
        
        if (prev.currency.points < cost) return prev;
        
        const newUnit = new Unit(crypto.randomUUID(), type, 0, 0, config.value);
        const newUnits = [...prev.inventory.units, newUnit];
        const newProduction = calculateProduction(newUnits, prev.upgrades.active);
        const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
        
        scheduleSave();
        
        return {
          ...prev,
          currency: {
            ...prev.currency,
            points: prev.currency.points - cost,
          },
          inventory: {
            units: newUnits,
          },
          production: {
            pointsPerSecond: newProduction,
            clickValue: newClickValue,
          },
        };
      });
    },

    sellUnit: (type: UnitType) => {
      setState(prev => {
        const lastUnit = [...prev.inventory.units].reverse().find(u => u.type === type);
        if (!lastUnit) return prev;
        
        const config = UNIT_CONFIG[type];
        const newUnits = prev.inventory.units.filter(u => u.id !== lastUnit.id);
        const newProduction = calculateProduction(newUnits, prev.upgrades.active);
        const newClickValue = calculateClickValue(newProduction, prev.upgrades.active);
        
        scheduleSave();
        
        return {
          ...prev,
          currency: {
            ...prev.currency,
            points: prev.currency.points + config.refund,
          },
          inventory: {
            units: newUnits,
          },
          production: {
            pointsPerSecond: newProduction,
            clickValue: newClickValue,
          },
        };
      });
    },

    buyUpgrade: (upgradeId: string) => {
      setState(prev => {
        const upgrade = UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade) return prev;
        if (prev.currency.points < upgrade.cost) return prev;
        
        const newUpgrades = [...prev.upgrades.active, { upgradeId, purchasedAt: new Date() }];
        const newProduction = calculateProduction(prev.inventory.units, newUpgrades);
        const newClickValue = calculateClickValue(newProduction, newUpgrades);
        
        scheduleSave();
        
        return {
          ...prev,
          currency: {
            ...prev.currency,
            points: prev.currency.points - upgrade.cost,
          },
          upgrades: {
            active: newUpgrades,
          },
          production: {
            pointsPerSecond: newProduction,
            clickValue: newClickValue,
          },
        };
      });
    },

    save: async () => {
      try {
        if (!userIdRef.current) return;
        
        setState(prev => ({ ...prev, ui: { ...prev.ui, isSaving: true } }));
        
        await savePlayerToDB(userIdRef.current, stateRef.current);
        
        setState(prev => ({ 
          ...prev, 
          ui: { ...prev.ui, isSaving: false, error: null } 
        }));
      } catch (err) {
        logError('save', err);
        setState(prev => ({ 
          ...prev, 
          ui: { ...prev.ui, isSaving: false, error: getErrorMessage(err) } 
        }));
      }
    },

    setPoints: (points: number) => {
      setState(prev => ({
        ...prev,
        currency: {
          ...prev.currency,
          points,
        },
      }));
    },
  }), [scheduleSave]);

  // Load player data and start game loop
  useEffect(() => {
    if (!userId) {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    userIdRef.current = userId;
    let cancelled = false;

    // Load from database
    (async () => {
      setState(prev => ({ ...prev, ui: { ...prev.ui, isLoading: true } }));
      
      try {
        const loaded = await loadPlayerFromDB(userId);
        if (!cancelled) {
          setState(loaded);
        }
      } catch (err) {
        logError('load', err);
        if (!cancelled) {
          setState(prev => ({ 
            ...prev, 
            ui: { ...prev.ui, isLoading: false, error: getErrorMessage(err) } 
          }));
        }
      }
    })();

    // Start game tick
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

    return () => {
      cancelled = true;
      
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      
      if (userIdRef.current) {
        savePlayerToDB(userIdRef.current, stateRef.current).catch(err => 
          logError('unmount-save', err)
        );
      }
    };
  }, [userId]);

  return (
    <GameStateContext.Provider value={state}>
      <GameActionsContext.Provider value={actions}>
        {children}
      </GameActionsContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const state = useContext(GameStateContext);
  if (!state) throw new Error('useGameState must be used within GameProvider');
  return state;
}

export function useGameActions() {
  const actions = useContext(GameActionsContext);
  if (!actions) throw new Error('useGameActions must be used within GameProvider');
  return actions;
}

// Convenience hook for components that need both
export function useGame() {
  return {
    ...useGameState(),
    ...useGameActions(),
  };
}
