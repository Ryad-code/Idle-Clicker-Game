import type { UnitType } from '../core/types';

/**
 * Complete metadata for each unit type in the game
 */
export interface UnitMetadata {
  // Game mechanics
  cost: number;        // Base purchase cost
  value: number;       // Points per second generated
  refund: number;      // Points refunded when sold (50% of cost)
  bonus: number;       // Bonus value between 5 and 100 based on value
  
  // Display info
  name: string;        // Human-readable name
  emoji: string;       // Visual icon
  color: string;       // Hex color for styling
  bonusColor: string;  // Hex color for styling when bonus is active
  description: string; // Tooltip/info text
  bonusDescription: string; // Description of the bonus effect
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
    bonus: 5,
    name: "unit1", 
    emoji: "👆", 
    color: "#4CAF50",
    bonusColor: "#2a00e6ff",
    description: "Autoclicks once every 10 seconds (Cursor)",
    bonusDescription: "+10% value when adjacent to a Grandma"
  },
  unit2: { 
    cost: 100, 
    value: 1, 
    refund: 50,
    bonus: 10,
    name: "unit2", 
    emoji: "👵", 
    color: "#8B7355",
    bonusColor: "#FFD600",
    description: "A nice grandma to bake more cookies (Grandma)",
    bonusDescription: "+20% value when 3 Grandmas are in a row or column"
  },
  unit3: { 
    cost: 1100, 
    value: 8, 
    refund: 550,
    bonus: 15,
    name: "unit3", 
    emoji: "🌾", 
    color: "#7CB342",
    bonusColor: "#FF9100",
    description: "Grows cookie plants from cookie seeds (Farm)",
    bonusDescription: "+30% value when surrounded by Cursors or Grandmas"
  },
  unit4: { 
    cost: 12000, 
    value: 47, 
    refund: 6000,
    bonus: 20,
    name: "unit4", 
    emoji: "⛏️", 
    color: "#78909C",
    bonusColor: "#00B8D4",
    description: "Mines out cookie dough and chocolate chips (Mine)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit5: { 
    cost: 130000, 
    value: 260, 
    refund: 65000,
    bonus: 25,
    name: "unit5", 
    emoji: "🏭", 
    color: "#607D8B",
    bonusColor: "#FF1744",
    description: "Produces large quantities of cookies (Factory)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit6: { 
    cost: 1400000, 
    value: 1400, 
    refund: 700000,
    bonus: 30,
    name: "unit6", 
    emoji: "🏦", 
    color: "#5C6BC0",
    bonusColor: "#00BFAE",
    description: "Generates cookies from interest (Bank)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit7: { 
    cost: 20000000, 
    value: 7800, 
    refund: 10000000,
    bonus: 35,
    name: "unit7", 
    emoji: "🛕", 
    color: "#8E24AA",
    bonusColor: "#D500F9",
    description: "Full of precious, ancient chocolate (Temple)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit8: { 
    cost: 330000000, 
    value: 44000, 
    refund: 165000000,
    bonus: 40,
    name: "unit8", 
    emoji: "🧙", 
    color: "#5E35B1",
    bonusColor: "#651FFF",
    description: "Summons cookies with magic spells (Wizard Tower)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit9: { 
    cost: 5100000000, 
    value: 260000, 
    refund: 2550000000,
    bonus: 45,
    name: "unit9", 
    emoji: "🚢", 
    color: "#1976D2",
    bonusColor: "#00B0FF",
    description: "Brings cookies from the past (Shipment)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit10: { 
    cost: 75000000000, 
    value: 1600000, 
    refund: 37500000000,
    bonus: 50,
    name: "unit10", 
    emoji: "🔬", 
    color: "#00897B",
    bonusColor: "#00E5FF",
    description: "Turns gold into cookies (Alchemy Lab)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit11: { 
    cost: 1000000000000, 
    value: 10000000, 
    refund: 500000000000,
    bonus: 60,
    name: "unit11", 
    emoji: "🌐", 
    color: "#0288D1",
    bonusColor: "#76FF03",
    description: "Opens portals to the cookieverse (Portal)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit12: { 
    cost: 14000000000000, 
    value: 65000000, 
    refund: 7000000000000,
    bonus: 70,
    name: "unit12", 
    emoji: "⏰", 
    color: "#F57C00",
    bonusColor: "#FFEA00",
    description: "Brings cookies from the past (Time Machine)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit13: { 
    cost: 170000000000000, 
    value: 430000000, 
    refund: 85000000000000,
    bonus: 75,
    name: "unit13", 
    emoji: "🔭", 
    color: "#512DA8",
    bonusColor: "#C51162",
    description: "Generates antimatter cookies (Antimatter Condenser)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit14: { 
    cost: 2100000000000000, 
    value: 2900000000, 
    refund: 1050000000000000,
    bonus: 80,
    name: "unit14", 
    emoji: "🌌", 
    color: "#303F9F",
    bonusColor: "#AA00FF",
    description: "Converts prisms to cookies (Prism)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit15: { 
    cost: 26000000000000000, 
    value: 21000000000, 
    refund: 13000000000000000,
    bonus: 85,
    name: "unit15", 
    emoji: "🕳️", 
    color: "#000000",
    bonusColor: "#FF3D00",
    description: "Turns matter into cookies (Chancemaker)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit16: { 
    cost: 310000000000000000, 
    value: 150000000000, 
    refund: 155000000000000000,
    bonus: 90,
    name: "unit16", 
    emoji: "⚛️", 
    color: "#1565C0",
    bonusColor: "#00C853",
    description: "Manipulates the very fabric of cookies (Fractal Engine)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit17: { 
    cost: 71000000000000000000, 
    value: 1100000000000, 
    refund: 35500000000000000000,
    bonus: 95,
    name: "unit17", 
    emoji: "🕸️", 
    color: "#4A148C",
    bonusColor: "#FF6D00",
    description: "Generates cookies from the javascript (Javascript Console)",
    bonusDescription: "Bonus not yet implemented"
  },
  unit18: { 
    cost: 12000000000000000000000, 
    value: 8300000000000, 
    refund: 6000000000000000000000,
    bonus: 100,
    name: "unit18", 
    emoji: "💎", 
    color: "#00BCD4",
    bonusColor: "#FFD600",
    description: "A timeless recipe (Idleverse)",
    bonusDescription: "Bonus not yet implemented"
  }
};

/**
 * Helper array to get all unit types dynamically
 * Useful for mapping over all units without hardcoding
 */
export const UNIT_TYPES = Object.keys(UNIT_CONFIG) as UnitType[];
