/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { GameState, UnitType } from '../game/core/types';
import { createDefaultState } from '../game/core/state';
import { useGamePersistence } from './hooks/useGamePersistence';
import { useGameTick } from './hooks/useGameTick';
import { calculateProduction, calculateClickValue } from '../game/core/calculations';
import {
  clickAction,
  buyUnitAction,
  sellUnitAction,
  buyUpgradeAction,
  setPointsAction,
  moveUnitAction,
} from './gameActions';

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
  moveUnit: (fromX: number, fromY: number, toX: number, toY: number) => void;
}

const GameActionsContext = createContext<GameActions | null>(null);

interface Props {
  userId?: string;
  children: React.ReactNode;
}

export function GameProvider({ userId, children }: Props) {
  const [state, setState] = useState<GameState>(createDefaultState());

  // Manage persistence (load/auto-save)
  const { save } = useGamePersistence(userId, state, setState);

  // Manage game tick (points per second, upgrade expiration)
  useGameTick(userId, setState);

  // Recalculate production when units or upgrades change
  useEffect(() => {
    const newProduction = calculateProduction(state.grid, state.upgrades.active);
    const newClickValue = calculateClickValue(newProduction, state.upgrades.active);
    setState(prev => ({
      ...prev,
      production: {
        pointsPerSecond: newProduction,
        clickValue: newClickValue,
      },
    }));
  }, [state.grid, state.upgrades.active]);

  // Create stable action references
  const actions = useMemo<GameActions>(() => ({
    click: () => clickAction(setState),
    buyUnit: (type) => buyUnitAction(setState, type),
    sellUnit: (type) => sellUnitAction(setState, type),
    buyUpgrade: (upgradeId) => buyUpgradeAction(setState, upgradeId),
    save,
    setPoints: (points) => setPointsAction(setState, points),
    moveUnit: (fromX, fromY, toX, toY) => moveUnitAction(setState, fromX, fromY, toX, toY),
  }), [save]);

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
