/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState } from "react";

export type UnitType = "unit1" | "unit2" | "unit3";

export interface Unit {
  id: string;
  type: UnitType;
  hp: number;
  position: { x: number; y: number };
  value: number;
}

export interface UnitsContextState {
  unitsByType: Record<UnitType, Unit[]>;
  unitCounts: Record<UnitType, number>;
  addUnit: (type: UnitType, position: { x: number; y: number }, value: number) => void;
  removeUnit: (type: UnitType) => void;
  updateUnit: (type: UnitType, index: number, updates: Partial<Unit>) => void;
  getAllUnits: () => Unit[];
  isUnitAvailable: (type: UnitType) => boolean;
}

export const UnitsContext = createContext<UnitsContextState | undefined>(undefined);

export const UnitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitsByType, setUnitsByType] = useState<Record<UnitType, Unit[]>>({
    unit1: [],
    unit2: [],
    unit3: [],
  });

  //const UNIT_PRICES: Record<UnitType, number> = {
  //unit1: 5,
  //unit2: 10,
  //unit3: 20,
//};
//...........................BASIC..............................//
  // Add a new unit
  const addUnit = (type: UnitType, position: { x: number; y: number }, value: number) => {
    const newUnit: Unit = {
      id: crypto.randomUUID(),
      type,
      hp: 100,
      position,
      value,
    };

    setUnitsByType(prev => ({
      ...prev,
      [type]: [...prev[type], newUnit],
    }));
  };

  // Remove the last unit of a given type
  const removeUnit = (type: UnitType) => {
    setUnitsByType(prev => ({
      ...prev,
      [type]: prev[type].slice(0, -1),
    }));
  };

  // Update a unit by type and index
  const updateUnit = (type: UnitType, index: number, updates: Partial<Unit>) => {
    setUnitsByType(prev => ({
      ...prev,
      [type]: prev[type].map((u, i) => (i === index ? { ...u, ...updates } : u)),
    }));
  };

  // Get all units combined in a single array
  const getAllUnits = (): Unit[] => {
    return [...unitsByType.unit1, ...unitsByType.unit2, ...unitsByType.unit3];
  };

  const isUnitAvailable = (type: UnitType): boolean => {
    return unitsByType[type].length > 0;
  };

  // Counts of units per type
  const unitCounts: Record<UnitType, number> = {
    unit1: unitsByType.unit1.length,
    unit2: unitsByType.unit2.length,
    unit3: unitsByType.unit3.length,
  };
  //.......................SHOP...........................//

  return (
    <UnitsContext.Provider
      value={{ unitsByType, unitCounts, addUnit, removeUnit, updateUnit, getAllUnits, isUnitAvailable }}
    >
      {children}
    </UnitsContext.Provider>
  );
};
