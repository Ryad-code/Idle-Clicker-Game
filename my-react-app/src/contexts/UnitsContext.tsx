/* eslint-disable react-refresh/only-export-components */ //so we can have 2 exports

import React, { createContext, useContext, useState } from "react";

export type UnitType = "archer" | "knight" | "mage";

export interface Unit {
  id: string;
  type: UnitType;
  hp: number;
}

interface UnitsContextState {
  units: Unit[];
  unitCounts: Record<UnitType, number>;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  addUnit: (type: UnitType) => void;
}

const UnitsContext = createContext<UnitsContextState | undefined>(undefined);

export const UnitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitCounts, setUnitCounts] = useState<Record<UnitType, number>>({
    archer: 0,
    knight: 0,
    mage: 0,
  });

  const addUnit = (type: UnitType) => {
    const newUnit: Unit = {
      id: crypto.randomUUID(),
      type,
      hp: 100,
    };

    setUnits((prev) => [...prev, newUnit]);
    setUnitCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const updateUnit = (id: string, updates: Partial<Unit>) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  return (
    <UnitsContext.Provider value={{ units, unitCounts, updateUnit, addUnit }}>
      {children}
    </UnitsContext.Provider>
  );
};

export const useUnits = () => {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error("useUnits must be used inside UnitsProvider");
  return ctx;
};
