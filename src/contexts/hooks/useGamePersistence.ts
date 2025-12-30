import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { GameState } from '../../game/core/types';
import { loadPlayerFromDB, savePlayerToDB } from '../../game/services/database';
import { logError, getErrorMessage } from '../../utils/errorUtils';
import { updateUnitsBonusState } from '../../game/core/bonuses';

const AUTO_SAVE_INTERVAL_MS = 30000; // 30 seconds

/**
 * Manages game state persistence (loading, auto-save, final save)
 */
export function useGamePersistence(
  userId: string | undefined,
  state: GameState,
  setState: Dispatch<SetStateAction<GameState>>
) {
  // Ref to always hold the latest state for background saves
  const stateRef = useRef<GameState>(state);

  // ----------------------------
  // Keep the ref in sync with React state
  // ----------------------------
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ----------------------------
  // Load player data when userId changes
  // ----------------------------
  useEffect(() => {
    if (!userId) return; // No user, nothing to load

    let cancelled = false;

    // Set loading indicator immediately
    setState(prev => ({ ...prev, ui: { ...prev.ui, isLoading: true } }));

    // Load player asynchronously
    loadPlayerFromDB(userId)
      .then(loaded => {
        if (cancelled) return; // Abort if unmounted or user changed

        // Update units' bonus states
        loaded.grid = updateUnitsBonusState(loaded.grid);
        // Update state with loaded data and stop loading
        setState({ ...loaded, ui: { ...loaded.ui, isLoading: false } });
      })
      .catch(err => {
        if (cancelled) return;
        logError('load', err);

        // Set error in UI
        setState(prev => ({
          ...prev,
          ui: { ...prev.ui, isLoading: false, error: getErrorMessage(err) },
        }));
      });

    // Cleanup function to cancel state updates if unmounted or user changes
    return () => {
      cancelled = true;
    };
  }, [userId, setState]);

  // ----------------------------
  // Auto-save interval setup
  // ----------------------------
  useEffect(() => {
    if (!userId) return; // Only run if a user exists

    const intervalId = setInterval(() => {
      savePlayerToDB(userId, stateRef.current).catch(err =>
        logError('auto-save', err)
      );
      console.log('auto-save');
    }, AUTO_SAVE_INTERVAL_MS);

    // Cleanup interval when user changes or component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [userId]);

  // ----------------------------
  // No more save on unmount
  // ----------------------------

  // Expose a manual save function
  return {
    save: async () => {
      if (!userId) return;
      await savePlayerToDB(userId, stateRef.current);
    },
  };
}

