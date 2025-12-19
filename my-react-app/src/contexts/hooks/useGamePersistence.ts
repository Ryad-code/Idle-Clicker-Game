import { useEffect, useRef, useCallback, type Dispatch, type SetStateAction } from 'react';
import type { GameState } from '../../game/core/types';
import { loadPlayerFromDB, savePlayerToDB } from '../../game/services/database';
import { AUTO_SAVE_DELAY_MS } from '../../game/config/constants';
import { logError, getErrorMessage } from '../../utils/errorUtils';

/**
 * Manages game state persistence (loading, saving, auto-save)
 */
export function useGamePersistence(
  userId: string | undefined,
  state: GameState,
  setState: Dispatch<SetStateAction<GameState>>
) {
  const userIdRef = useRef<string | null>(null);
  const stateRef = useRef<GameState>(state);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    userIdRef.current = userId || null;
  }, [userId]);

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

  // Load player data on mount/userId change
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

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

    return () => {
      cancelled = true;
    };
  }, [userId, setState]);

  // Save on unmount
  useEffect(() => {
    return () => {
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
  }, []);

  return { userIdRef, stateRef, scheduleSave };
}
