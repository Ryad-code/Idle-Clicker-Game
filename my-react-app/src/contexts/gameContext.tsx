/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Player, type UnitType } from '../game/types';
import { loadPlayerFromDB, savePlayerToDB } from '../game/playerService';
import { buyUnit as buyUnitLogic, sellUnit as sellUnitLogic } from '../game/gameLogic';

interface GameContextValue {
  player: Player;
  click: () => void;
  buyUnit: (type: UnitType) => void;
  sellUnit: (type: UnitType) => void;
  save: () => Promise<void>;
  setPoints: (points: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

interface Props {
  userId?: string;
  children: React.ReactNode;
}

export function GameProvider({ userId, children }: Props) {
  const [player, setPlayer] = useState<Player>(new Player());
  const userIdRef = useRef<string | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Action: Handle click
  const click = useCallback(() => {
    setPlayer((prev) => {
      const updated = Object.assign(new Player(), prev);
      updated.units = [...prev.units];
      updated.click();
      return updated;
    });
  }, []);

  // Action: Buy unit
  const buyUnit = useCallback((type: UnitType) => {
    setPlayer((prev) => {
      const updated = buyUnitLogic(prev, type);
      return updated;
    });
  }, []);

  // Action: Sell unit
  const sellUnit = useCallback((type: UnitType) => {
    setPlayer((prev) => {
      const updated = sellUnitLogic(prev, type);
      return updated;
    });
  }, []);

  // Action: Manual save
  const save = useCallback(async () => {
    if (!userIdRef.current) return;
    await savePlayerToDB(userIdRef.current, player);
  }, [player]);

  // Action: Set points (for testing)
  const setPoints = useCallback((points: number) => {
    setPlayer((prev) => {
      const updated = Object.assign(new Player(), prev);
      updated.units = [...prev.units];
      updated.setPoints(points);
      return updated;
    });
  }, []);

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
    save,
    setPoints,
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
