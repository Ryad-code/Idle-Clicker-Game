import type { UnitType } from '../core/types';

/**
 * Complete metadata for each unit type in the game
 */
export interface UnitMetadata {
  // Game mechanics
  cost: number;        // Base purchase cost
  value: number;       // Points per second generated
  refund: number;      // Points refunded when sold (50% of cost)
  bonus: number;       // Bonus multiplier when conditions are met (e.g., 1.1 = 10% bonus, 1.5 = 50% bonus)
  
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
    value: 1, 
    refund: 8,
    bonus: 1.1,
    name: "Viewer", 
    emoji: "👆", 
    color: "#4CAF50",
    bonusColor: "#2a00e6ff",
    description: "Just watching, not clicking... but somehow generates views",
    bonusDescription: "+10% value if 3 Viewers in a row or column"
  },
  unit2: { 
    cost: 100, 
    value: 2, 
    refund: 50,
    bonus: 1.15,
    name: "Tutorial Tim", 
    emoji: "👵", 
    color: "#8B7355",
    bonusColor: "#FFD600",
    description: "Explains how to click, but takes forever to get to the point",
    bonusDescription: "+15% value if in a corner position with another Tutorial Tim adjacent"
  },
  unit3: { 
    cost: 1100, 
    value: 8, 
    refund: 550,
    bonus: 1.3,
    name: "Sigma Male Coach", 
    emoji: "🌾", 
    color: "#7CB342",
    bonusColor: "#FF9100",
    description: "Tells you to grind harder and ignore the haters",
    bonusDescription: "+30% value when surrounded by Viewers or Tutorial Tims"
  },
  unit4: { 
    cost: 12000, 
    value: 47, 
    refund: 6000,
    bonus: 1.15,
    name: "Clickbait Karen", 
    emoji: "⛏️", 
    color: "#78909C",
    bonusColor: "#00B8D4",
    description: "Complains about everything and demands refunds",
    bonusDescription: "+15% value if diagonally adjacent to another Clickbait Karen"
  },
  unit5: { 
    cost: 130000, 
    value: 260, 
    refund: 65000,
    bonus: 1.25,
    name: "ASMR", 
    emoji: "🏭", 
    color: "#607D8B",
    bonusColor: "#FF1744",
    description: "Whispers sweet nothings while generating views",
    bonusDescription: "+25% value if placed in the center of the grid"
  },
  unit6: { 
    cost: 1400000, 
    value: 1400, 
    refund: 700000,
    bonus: 1.3,
    name: "Cat meme", 
    emoji: "🏦", 
    color: "#5C6BC0",
    bonusColor: "#00BFAE",
    description: "Posts cute pictures that go viral instantly",
    bonusDescription: "+30% value if symmetrically placed with another Cat meme"
  },
  unit7: { 
    cost: 20000000, 
    value: 7800, 
    refund: 10000000,
    bonus: 1.2,
    name: "Comment Section Troll", 
    emoji: "🛕", 
    color: "#8E24AA",
    bonusColor: "#D500F9",
    description: "Leaves inflammatory comments everywhere",
    bonusDescription: "+20% value if at the center of a cross pattern"
  },
  unit8: { 
    cost: 330000000, 
    value: 44000, 
    refund: 165000000,
    bonus: 1.25,
    name: "Gaming Streamer", 
    emoji: "🧙", 
    color: "#5E35B1",
    bonusColor: "#651FFF",
    description: "Streams gameplay while eating snacks and yelling",
    bonusDescription: "+25% value if stacked vertically with another Gaming Streamer"
  },
  unit9: { 
    cost: 5100000000, 
    value: 260000, 
    refund: 2550000000,
    bonus: 1.35,
    name: "Minecraft youtuber", 
    emoji: "🚢", 
    color: "#1976D2",
    bonusColor: "#00B0FF",
    description: "Builds redstone contraptions that somehow generate views",
    bonusDescription: "+35% value if in a horizontal line with at least 2 other Minecraft youtubers"
  },
  unit10: { 
    cost: 75000000000, 
    value: 1600000, 
    refund: 37500000000,
    bonus: 1.25,
    name: "AI deepfakes", 
    emoji: "🔬", 
    color: "#00897B",
    bonusColor: "#00E5FF",
    description: "Creates fake content that's indistinguishable from real",
    bonusDescription: "+25% value if adjacent to a Minecraft youtuber"
  },
  unit11: { 
    cost: 1000000000000, 
    value: 10000000, 
    refund: 500000000000,
    bonus: 1.35,
    name: "BOT", 
    emoji: "🌐", 
    color: "#0288D1",
    bonusColor: "#76FF03",
    description: "Automated spam that floods the chat",
    bonusDescription: "+35% value if 3 BOTs in a row or column"
  },
  unit12: { 
    cost: 14000000000000, 
    value: 65000000, 
    refund: 7000000000000,
    bonus: 1.45,
    name: "Tandrew Ate", 
    emoji: "⏰", 
    color: "#F57C00",
    bonusColor: "#FFEA00",
    description: "Roasts everyone while eating snacks on camera",
    bonusDescription: "+45% value if surrounded by BOTs or AI deepfakes (all 8 neighbors)"
  },
  unit13: { 
    cost: 170000000000000, 
    value: 430000000, 
    refund: 85000000000000,
    bonus: 1.3,
    name: "KCI & Pogan Laul", 
    emoji: "🔭", 
    color: "#512DA8",
    bonusColor: "#C51162",
    description: "Makes music videos about internet drama",
    bonusDescription: "+30% value if adjacent to a Tandrew Ate"
  },
  unit14: { 
    cost: 2100000000000000, 
    value: 2900000000, 
    refund: 1050000000000000,
    bonus: 1.4,
    name: "DewPieDie", 
    emoji: "🌌", 
    color: "#303F9F",
    bonusColor: "#AA00FF",
    description: "Reviews internet trends with British sarcasm",
    bonusDescription: "+40% value if 3 DewPieDies in a row or column"
  },
  unit15: { 
    cost: 26000000000000000, 
    value: 21000000000, 
    refund: 13000000000000000,
    bonus: 1.5,
    name: "Roe Jogan", 
    emoji: "🕳️", 
    color: "#000000",
    bonusColor: "#FF3D00",
    description: "Jogs while collecting views from random encounters",
    bonusDescription: "+50% value if surrounded by DewPieDies or KCI & Pogan Lauls (all 8 neighbors)"
  },
  unit16: { 
    cost: 310000000000000000, 
    value: 150000000000, 
    refund: 155000000000000000,
    bonus: 1.35,
    name: "Bollywood Youtube channel", 
    emoji: "⚛️", 
    color: "#1565C0",
    bonusColor: "#00C853",
    description: "Makes dramatic music videos about viral trends",
    bonusDescription: "+35% value if adjacent to a Roe Jogan"
  },
  unit17: { 
    cost: 71000000000000000000, 
    value: 1100000000000, 
    refund: 35500000000000000000,
    bonus: 1.45,
    name: "Bister Meast", 
    emoji: "🕸️", 
    color: "#4A148C",
    bonusColor: "#FF6D00",
    description: "Hosts cooking shows with celebrity guests",
    bonusDescription: "+45% value if 3 Bister Measts in a row or column"
  },
  unit18: { 
    cost: 12000000000000000000000, 
    value: 8300000000000, 
    refund: 6000000000000000000000,
    bonus: 1.55,
    name: "Algorythm", 
    emoji: "💎", 
    color: "#00BCD4",
    bonusColor: "#FFD600",
    description: "The mysterious force behind all recommendations",
    bonusDescription: "+55% value if surrounded by Bister Measts or Bollywood Youtube channels (all 8 neighbors)"
  }
};

/**
 * Helper array to get all unit types dynamically
 * Useful for mapping over all units without hardcoding
 */
export const UNIT_TYPES = Object.keys(UNIT_CONFIG) as UnitType[];
