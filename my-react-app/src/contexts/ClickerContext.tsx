
/* eslint-disable react-refresh/only-export-components */ // so we can have 2 exports

import React, { createContext, useState, useCallback } from "react";

export type ClickerContextType = {
  points: number;
  clickValue: number;
  pointsPerSecond: number;
  clicks: number;
  handleClick: () => void;
  addPoints: (value: number) => void;
  removePoints: (value: number) => void;
};

export const ClickerContext = createContext<ClickerContextType | undefined>(undefined);

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
    setPoints(prev => prev + value);
  };

  const removePoints = (value: number) => {
    if (points < value) {
      throw new Error("Not enough points to remove");
    }
    setPoints(prev => {
      return prev - value;
    });
  };

  const value: ClickerContextType = {
    points,
    clickValue,
    pointsPerSecond,
    clicks,
    handleClick,
    addPoints,
    removePoints
  };

  return (
    <ClickerContext.Provider value={value}>
      {children}
    </ClickerContext.Provider>
  );
}
