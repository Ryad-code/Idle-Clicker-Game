/* eslint-disable react-refresh/only-export-components */ //so we can have 2 exports

import React, { createContext, useContext, useState, useCallback } from "react";

type ClickerContextType = {
  points: number;
  clickValue: number;
  pointsPerSecond: number;
  clicks: number;
  handleClick: () => void;
  addPoints: (value: number) => void
  addPoints: (value: number) => void
};

const ClickerContext = createContext<ClickerContextType | undefined>(undefined);

export function ClickerProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState<number>(0);
  const [clickValue] = useState<number>(1);
  const [pointsPerSecond] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);

  const handleClick = useCallback(() => {
    setPoints(prev => prev + clickValue);
    setClicks(prev => prev + 1);
  }, [clickValue]);

  const addPoints = (value: number) => {
    setPoints(points + value);
  }
  const removePoints = (value: number) => {
    setPoints(points - value)
  }

  const value: ClickerContextType = {
    points,
    clickValue,
    pointsPerSecond,
    clicks,
    handleClick,
    addPoints,
    removePoints
  };

  return <ClickerContext.Provider value={value}>{children}</ClickerContext.Provider>;
}

export function useClicker() {
  const ctx = useContext(ClickerContext);
  if (!ctx) throw new Error("useClicker must be used inside ClickerProvider");
  return ctx;
}
