import type { GameState, UnitType, UnitLevels } from '../core/types';
import { Unit } from '../core/types';
import { createDefaultState } from '../core/state';
import { logError } from '../../utils/errorUtils';
import { saveToLocalStorage, loadFromLocalStorage } from '../../localStorage/localStorage';
import Decimal from 'break_infinity.js';

const STORAGE_KEY = 'game_state';

interface SerializedUnit {
  id: string;
  type: string;
  value: number;
  bonusActive: boolean;
  stackedCount: number;
}

interface SerializedUpgrade {
  upgradeId: string;
  purchasedAt: string;
}

interface SerializedGameState {
  points: string;
  totalClicks: number;
  pointsPerSecond: string;
  clickValue: string;
  activeUpgrades: SerializedUpgrade[];
  createdAt: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  grid: (SerializedUnit | null)[][];
  unitLevels: UnitLevels;
}

/**
 * Convert GameState to a serializable format for localStorage
 */
function serializeGameState(state: GameState): SerializedGameState {
  return {
    points: state.points.toString(),
    totalClicks: state.totalClicks,
    pointsPerSecond: state.pointsPerSecond.toString(),
    clickValue: state.clickValue.toString(),
    activeUpgrades: state.activeUpgrades.map(u => ({
      upgradeId: u.upgradeId,
      purchasedAt: u.purchasedAt.toISOString(),
    })),
    createdAt: state.createdAt.toISOString(),
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    grid: state.grid.map(row => 
      row.map(unit => unit ? {
        id: unit.id,
        type: unit.type,
        value: unit.value,
        bonusActive: unit.bonusActive,
        stackedCount: unit.stackedCount,
      } : null)
    ),
    unitLevels: state.unitLevels,
  };
}

/**
 * Convert serialized data back to GameState
 */
function deserializeGameState(data: SerializedGameState): GameState {
  // Reconstruct grid with proper Unit instances
  const grid = data.grid.map((row: (SerializedUnit | null)[], y: number) => 
    row.map((unitData: SerializedUnit | null, x: number) => 
      unitData ? new Unit(
        unitData.id,
        unitData.type as UnitType,
        x,
        y,
        unitData.value,
        unitData.bonusActive,
        unitData.stackedCount
      ) : null
    )
  );

  return {
    points: new Decimal(data.points),
    totalClicks: data.totalClicks,
    pointsPerSecond: new Decimal(data.pointsPerSecond),
    clickValue: new Decimal(data.clickValue),
    activeUpgrades: data.activeUpgrades.map((u: SerializedUpgrade) => ({
      upgradeId: u.upgradeId,
      purchasedAt: new Date(u.purchasedAt),
    })),
    createdAt: new Date(data.createdAt),
    isLoading: data.isLoading,
    isSaving: data.isSaving,
    error: data.error,
    grid,
    unitLevels: data.unitLevels,
  };
}

/**
 * Load player data from localStorage and convert to GameState
 */
export async function loadPlayerFromDB(): Promise<GameState> {
  try {
    const savedData = loadFromLocalStorage<SerializedGameState>(STORAGE_KEY);
    
    if (!savedData) {
      return createDefaultState();
    }

    return deserializeGameState(savedData);
  } catch (error) {
    logError('loadPlayerFromDB', error);
    return createDefaultState();
  }
}

/**
 * Save GameState to localStorage
 */
export async function savePlayerToDB(state: GameState): Promise<void> {
  try {
    const serializedState = serializeGameState(state);
    
    const success = saveToLocalStorage(STORAGE_KEY, serializedState);
    
    if (!success) {
      throw new Error('Failed to save to localStorage');
    }
  } catch (error) {
    logError('savePlayerToDB', error);
    throw error;
  }
}
