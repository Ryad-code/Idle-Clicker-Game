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
    value: 1, 
    refund: 7,
    name: "Worker", 
    emoji: "🟢", 
    color: "#4CAF50",
    description: "Basic unit - 15s ROI, steady production"
  },
  unit2: { 
    cost: 100, 
    value: 3, 
    refund: 50,
    name: "Engineer", 
    emoji: "🔵", 
    color: "#2196F3",
    description: "Mid-tier unit - 33s ROI, better efficiency"
  },
  unit3: { 
    cost: 500, 
    value: 12, 
    refund: 250,
    name: "Manager", 
    emoji: "🟠", 
    color: "#FF9800",
    description: "Advanced unit - 41s ROI, maximum output"
  }
};

/**
 * Helper array to get all unit types dynamically
 * Useful for mapping over all units without hardcoding
 */
export const UNIT_TYPES = Object.keys(UNIT_CONFIG) as UnitType[];
