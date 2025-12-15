/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Player, type UnitType } from '../game/types';
import { UPGRADES } from '../game/upgradeConfig';
import { loadPlayerFromDB, savePlayerToDB } from '../game/gameServices';
import { buyUnit as buyUnitLogic, sellUnit as sellUnitLogic } from '../game/gameLogic';
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
  triggerError: (message: string) => void;
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
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const click = () => setPlayer((prev) => {
    const updated = Object.assign(new Player(), prev);
    updated.units = [...prev.units];
    updated.activeUpgrades = [...(prev.activeUpgrades || [])];
    updated.click();
    return updated;
  });

  const buyUnit = (type: UnitType) => setPlayer((prev) => buyUnitLogic(prev, type));

  const sellUnit = (type: UnitType) => setPlayer((prev) => sellUnitLogic(prev, type));

  const buyUpgrade = (upgradeId: string) => setPlayer((prev) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return prev;
    if (!prev.canAfford(upgrade.cost)) return prev;

    const updated = Object.assign(new Player(), prev);
    updated.units = [...prev.units];
    updated.activeUpgrades = [...(prev.activeUpgrades || [])];

    updated.removePoints(upgrade.cost);
    updated.activeUpgrades.push({ upgradeId, purchasedAt: new Date() });
    updated.refreshDerivedStats();
    return updated;
  });

  const save = async () => {
    try {
      if (!userIdRef.current) return;
      await savePlayerToDB(userIdRef.current, player);
      setError(null);
    } catch (err) {
      logError('save', err);
      setError(getErrorMessage(err));
    }
  };

  const setPoints = (points: number) => setPlayer((prev) => {
    const updated = Object.assign(new Player(), prev);
    updated.units = [...prev.units];
    updated.activeUpgrades = [...(prev.activeUpgrades || [])];
    updated.setPoints(points);
    return updated;
  });

  // Load player data and start loops
  useEffect(() => {
    if (!userId) {
      // Stop loops when userId is cleared
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
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

    // Start auto-save loop (30s)
    if (!saveIntervalRef.current) {
      saveIntervalRef.current = setInterval(() => {
        setPlayer((prevPlayer) => {
          if (userIdRef.current) {
            void savePlayerToDB(userIdRef.current, prevPlayer);
          }
          return prevPlayer;
        });
      }, 30000);
    }

    return () => {
      cancelled = true;
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
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
    triggerError: (message: string) => setError(message),
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
