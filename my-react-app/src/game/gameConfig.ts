import type { UnitType } from './types';

/**
 * Complete metadata for each unit type in the game
 */
export interface UnitMetadata {
  // Game mechanics
  cost: number;        // Base purchase cost
  value: number;       // Points per second generated
  refund: number;      // Points refunded when sold (50% of cost)
  
  // Display info
  name: string;        // Human-readable name
  emoji: string;       // Visual icon
  color: string;       // Hex color for styling
  description: string; // Tooltip/info text
}

/**
 * Centralized configuration for all unit types
 * Single source of truth for game balance and presentation
 */
export const UNIT_CONFIG: Record<UnitType, UnitMetadata> = {
  unit1: { 
    cost: 15, 
    value: 0.1, 
    refund: 8,
    name: "unit1", 
    emoji: "👆", 
    color: "#4CAF50",
    description: "Autoclicks once every 10 seconds (Cursor)"
  },
  unit2: { 
    cost: 100, 
    value: 1, 
    refund: 50,
    name: "unit2", 
    emoji: "👵", 
    color: "#8B7355",
    description: "A nice grandma to bake more cookies (Grandma)"
  },
  unit3: { 
    cost: 1100, 
    value: 8, 
    refund: 550,
    name: "unit3", 
    emoji: "🌾", 
    color: "#7CB342",
    description: "Grows cookie plants from cookie seeds (Farm)"
  },
  unit4: { 
    cost: 12000, 
    value: 47, 
    refund: 6000,
    name: "unit4", 
    emoji: "⛏️", 
    color: "#78909C",
    description: "Mines out cookie dough and chocolate chips (Mine)"
  },
  unit5: { 
    cost: 130000, 
    value: 260, 
    refund: 65000,
    name: "unit5", 
    emoji: "🏭", 
    color: "#607D8B",
    description: "Produces large quantities of cookies (Factory)"
  },
  unit6: { 
    cost: 1400000, 
    value: 1400, 
    refund: 700000,
    name: "unit6", 
    emoji: "🏦", 
    color: "#5C6BC0",
    description: "Generates cookies from interest (Bank)"
  },
  unit7: { 
    cost: 20000000, 
    value: 7800, 
    refund: 10000000,
    name: "unit7", 
    emoji: "🛕", 
    color: "#8E24AA",
    description: "Full of precious, ancient chocolate (Temple)"
  },
  unit8: { 
    cost: 330000000, 
    value: 44000, 
    refund: 165000000,
    name: "unit8", 
    emoji: "🧙", 
    color: "#5E35B1",
    description: "Summons cookies with magic spells (Wizard Tower)"
  },
  unit9: { 
    cost: 5100000000, 
    value: 260000, 
    refund: 2550000000,
    name: "unit9", 
    emoji: "🚢", 
    color: "#1976D2",
    description: "Brings cookies from the past (Shipment)"
  },
  unit10: { 
    cost: 75000000000, 
    value: 1600000, 
    refund: 37500000000,
    name: "unit10", 
    emoji: "🔬", 
    color: "#00897B",
    description: "Turns gold into cookies (Alchemy Lab)"
  },
  unit11: { 
    cost: 1000000000000, 
    value: 10000000, 
    refund: 500000000000,
    name: "unit11", 
    emoji: "🌐", 
    color: "#0288D1",
    description: "Opens portals to the cookieverse (Portal)"
  },
  unit12: { 
    cost: 14000000000000, 
    value: 65000000, 
    refund: 7000000000000,
    name: "unit12", 
    emoji: "⏰", 
    color: "#F57C00",
    description: "Brings cookies from the past (Time Machine)"
  },
  unit13: { 
    cost: 170000000000000, 
    value: 430000000, 
    refund: 85000000000000,
    name: "unit13", 
    emoji: "🔭", 
    color: "#512DA8",
    description: "Generates antimatter cookies (Antimatter Condenser)"
  },
  unit14: { 
    cost: 2100000000000000, 
    value: 2900000000, 
    refund: 1050000000000000,
    name: "unit14", 
    emoji: "🌌", 
    color: "#303F9F",
    description: "Converts prisms to cookies (Prism)"
  },
  unit15: { 
    cost: 26000000000000000, 
    value: 21000000000, 
    refund: 13000000000000000,
    name: "unit15", 
    emoji: "🕳️", 
    color: "#000000",
    description: "Turns matter into cookies (Chancemaker)"
  },
  unit16: { 
    cost: 310000000000000000, 
    value: 150000000000, 
    refund: 155000000000000000,
    name: "unit16", 
    emoji: "⚛️", 
    color: "#1565C0",
    description: "Manipulates the very fabric of cookies (Fractal Engine)"
  },
  unit17: { 
    cost: 71000000000000000000, 
    value: 1100000000000, 
    refund: 35500000000000000000,
    name: "unit17", 
    emoji: "🕸️", 
    color: "#4A148C",
    description: "Generates cookies from the javascript (Javascript Console)"
  },
  unit18: { 
    cost: 12000000000000000000000, 
    value: 8300000000000, 
    refund: 6000000000000000000000,
    name: "unit18", 
    emoji: "💎", 
    color: "#00BCD4",
    description: "A timeless recipe (Idleverse)"
  }
};

/**
 * Helper array to get all unit types dynamically
 * Useful for mapping over all units without hardcoding
 */
export const UNIT_TYPES = Object.keys(UNIT_CONFIG) as UnitType[];
