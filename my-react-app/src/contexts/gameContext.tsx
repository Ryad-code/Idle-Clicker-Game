/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Player, type UnitType } from '../game/types';
import { UPGRADES } from '../game/upgradeConfig';
import { loadPlayerFromDB, savePlayerToDB } from '../game/gameServices';
import { buyUnit as buyUnitLogic, sellUnit as sellUnitLogic, buyUpgrade as buyUpgradeLogic } from '../game/gameLogic';
import { logError, getErrorMessage } from '../utils/errorUtils';

interface GameContextValue {
  player: Player;
  click: () => void;
  buyUnit: (type: UnitType) => void;
  sellUnit: (type: UnitType) => void;
  buyUpgrade: (upgradeId: string) => void;
  save: () => Promise<void>;
  setPoints: (points: number) => void;
  error: string | null;
}

const GameContext = createContext<GameContextValue | null>(null);

interface Props {
  userId?: string;
  children: React.ReactNode;
}

export function GameProvider({ userId, children }: Props) {
  const [player, setPlayer] = useState<Player>(new Player());
  const [error, setError] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const playerRef = useRef<Player>(new Player());
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: Schedule debounced save
  const scheduleSave = () => {
    if (!userIdRef.current) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (userIdRef.current) {
        savePlayerToDB(userIdRef.current, playerRef.current)
          .catch(err => logError('debounced-save', err));
      }
    }, 1000);
  };

  const click = () => {
    setPlayer((prev) => {
      const updated = Object.assign(new Player(), prev);
      updated.units = [...prev.units];
      updated.activeUpgrades = [...(prev.activeUpgrades || [])];
      updated.click();
      return updated;
    });
  };

  const buyUnit = (type: UnitType) => {
    setPlayer((prev) => {
      const updated = buyUnitLogic(prev, type);
      if (updated !== prev) scheduleSave();
      return updated;
    });
  };

  const sellUnit = (type: UnitType) => {
    setPlayer((prev) => {
      const updated = sellUnitLogic(prev, type);
      if (updated !== prev) scheduleSave();
      return updated;
    });
  };

  const buyUpgrade = (upgradeId: string) => {
    setPlayer((prev) => {
      const updated = buyUpgradeLogic(prev, upgradeId);
      if (updated !== prev) scheduleSave();
      return updated;
    });
  };

  const save = async () => {
    try {
      if (!userIdRef.current) return;
      await savePlayerToDB(userIdRef.current, playerRef.current);
      setError(null);
    } catch (err) {
      logError('save', err);
      setError(getErrorMessage(err));
    }
  };

  const setPoints = (points: number) => {
    setPlayer((prev) => {
      const updated = Object.assign(new Player(), prev);
      updated.units = [...prev.units];
      updated.activeUpgrades = [...(prev.activeUpgrades || [])];
      updated.setPoints(points);
      return updated;
    });
  };

  // Keep playerRef in sync and log debug info
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Load player data and start loops
  useEffect(() => {
    if (!userId) {
      // Stop loops when userId is cleared
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    userIdRef.current = userId;
    let cancelled = false;

    // Load player from DB
    (async () => {
      const loaded = await loadPlayerFromDB(userId);
      if (!cancelled) {
        setPlayer(loaded);
      }
    })();

    // Start tick loop (1s)
    if (!tickIntervalRef.current) {
      tickIntervalRef.current = setInterval(() => {
        setPlayer((prev) => {
          const updated = Object.assign(new Player(), prev);
          updated.units = [...prev.units];
          const now = Date.now();
          const byId = new Map(UPGRADES.map(u => [u.id, u]));
          updated.activeUpgrades = (prev.activeUpgrades || []).filter(entry => {
            const u = byId.get(entry.upgradeId);
            if (!u) return false;
            const expiresAt = entry.purchasedAt.getTime() + u.durationSeconds * 1000;
            return expiresAt > now;
          });
          updated.refreshDerivedStats();
          if (updated.pointsPerSecond > 0) {
            updated.addPoints(updated.pointsPerSecond);
          }
          return updated;
        });
      }, 1000);
    }

    return () => {
      cancelled = true;
      
      // Clear intervals and timeouts
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      
      // Final save on unmount
      if (userIdRef.current) {
        savePlayerToDB(userIdRef.current, playerRef.current).catch(err => 
          logError('unmount-save', err)
        );
      }
    };
  }, [userId]);

  const value: GameContextValue = {
    player,
    click,
    buyUnit,
    sellUnit,
    buyUpgrade,
    save,
    setPoints,
    error,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
