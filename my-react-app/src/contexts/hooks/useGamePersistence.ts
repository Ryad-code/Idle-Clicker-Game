import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import type { GameState } from '../../game/core/types';
import { loadPlayerFromDB, savePlayerToDB } from '../../game/services/database';
import { logError, getErrorMessage } from '../../utils/errorUtils';

const AUTO_SAVE_INTERVAL_MS = 30000; // 30 seconds

/**
 * Manages game state persistence (loading, auto-save)
 */
export function useGamePersistence(
  userId: string | undefined,
  state: GameState,
  setState: Dispatch<SetStateAction<GameState>>
) {
  const stateRef = useRef<GameState>(state);

  // Keep state ref in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load player data on mount/userId change
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      setState(prev => ({ ...prev, ui: { ...prev.ui, isLoading: true } }));
      
      try {
        const loaded = await loadPlayerFromDB(userId);
        if (!cancelled) {
          setState({ ...loaded, ui: { ...loaded.ui, isLoading: false } });
          
          // Start auto-save after load completes
          const saveInterval = setInterval(() => {
            savePlayerToDB(userId, stateRef.current).catch(err => 
              logError('auto-save', err)
            );
          }, AUTO_SAVE_INTERVAL_MS);
          
          return () => clearInterval(saveInterval);
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

    return () => {
      cancelled = true;
    };
  }, [userId, setState]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (userId) {
        savePlayerToDB(userId, stateRef.current).catch(err => 
          logError('unmount-save', err)
        );
      }
    };
  }, [userId]);

  return { 
    save: async () => {
      if (userId) {
        await savePlayerToDB(userId, stateRef.current);
      }
    }
  };
}
