# Idle Clicker Game

## Overview
This is a React-based idle clicker game where players place units on a grid to generate production points. The game features grid-based bonuses, upgrades, authentication, and persistent state via Supabase. Players can sign up, log in, and track their progress across sessions.

## Architecture
- **Frontend**: React with TypeScript, using Zustand for state management and React Router for navigation.
- **Backend**: Supabase for authentication and database persistence.
- **Build Tool**: Vite for development and building.
- **Styling**: Styled-components with a custom theme.

## Project Structure
```
├── src/
│   ├── components/          # UI components (UnitPanel, ClickerPanel, ShopPanel, Layout, UI)
│   ├── game/
│   │   ├── config/          # Game data (units, upgrades, constants, grid)
│   │   ├── core/            # Game logic (calculations, bonuses, state, types)
│   │   ├── services/        # Database interactions
│   │   ├── gameEngine.ts    # Core game engine (framework-agnostic)
│   │   ├── gameStore.ts     # Zustand state management store
│   │   └── tick.ts          # Game loop and auto-save system
│   ├── hooks/               # Custom hooks (useAuth)
│   ├── pages/               # Page components (AuthPage, HomePage, Stats)
│   ├── styles/              # Theme and component-specific styles
│   ├── utils/               # Utility functions (errorUtils, formatters, colorUtils)
│   ├── supabaseClient.ts    # Supabase client configuration
│   └── main.tsx             # App entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── README.md                # (This file, moved from here)
```

## Key Features
- **Authentication**: User signup and login with Supabase Auth.
- **Grid-Based Gameplay**: Place units on an 11x11 grid to earn production points.
- **Unit Bonuses**: Each unit has unique grid-based bonuses (e.g., adjacency, clusters, symmetry).
- **Unit Stacking System**: 
  - Stack same-type units by moving them onto each other
  - Each stack multiplies production by the number of units stacked
  - Initial capacity of 1 unit per cell (level 0)
  - Visual feedback with color intensity based on stack count
- **Unit Type Upgrades**: 
  - Upgrade entire unit types to increase stacking capacity (2^level formula)
  - Level 0: 1 unit capacity → Level 1: 2 units → Level 2: 4 units, etc.
  - Requires all units of that type to be fully stacked and an even number of units
  - Purchasing units buys a full stack at current capacity level
- **Temporary Upgrades**: Purchase time-limited multipliers for production or click value.
- **Persistence**: Auto-save every 30 seconds to Supabase database.
- **Real-Time Updates**: Production updates every second; bonuses recalculate on grid changes.
- **Statistics**: View detailed game progress and stats on the Stats page.
- **Reset Functionality**: Clear the grid and unit levels to start fresh while keeping points.

## Pages
- **AuthPage**: Handles user login and signup.
- **HomePage**: Main game interface with clicker, unit placement, and shop panels.
- **Stats**: Displays game statistics and progress.

## How to Run
1. Install dependencies: `npm install`
2. Set up Supabase:
   - Create a new Supabase project
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key to `.env`
3. Start dev server: `npm run dev`
4. Build for production: `npm run build`

## Core Mechanics

### Production System
- **Base Production**: Each unit generates points per second based on its value
- **Stacking Multiplier**: Units stacked in the same cell multiply production (e.g., 3 units stacked = 3x production)
- **Grid Bonuses**: Position-based bonuses activate based on unit placement patterns
- **Upgrade Multipliers**: Temporary upgrades boost production or click value
- **Click Value**: Scales with production rate (minimum 1 + 10% of production per second)

### Unit Stacking System
1. **Moving Units**: Drag units to move them around the grid
2. **Stacking**: Move a unit onto another of the same type to combine them
3. **Capacity Limits**: Each unit type has a maximum capacity determined by its level (2^level)
4. **Visual Feedback**: Stacked units display darker, more saturated colors
5. **Production**: Stacked units multiply their base production by stack count

### Unit Type Upgrade System
- **Leveling Up**: Permanently increase a unit type's stacking capacity
- **Requirements**:
  - Must own at least 2 units of that type (even number required)
  - All units must be at maximum capacity for current level
  - Example: 2 units at capacity 1 → Upgrade → 2 units with capacity 2
- **Capacity Formula**: `maxCapacity = 2^level`
  - Level 0: 1 unit per cell
  - Level 1: 2 units per cell
  - Level 2: 4 units per cell
  - Level 3: 8 units per cell (and so on)
- **Purchasing**: When buying units, you automatically buy a full stack at current capacity

### Temporary Upgrades
- **Types**: Production multipliers or click value multipliers
- **Duration**: Time-limited (specified in seconds)
- **Stacking**: Multiple upgrades of the same type stack multiplicatively
- **Cost**: Dynamically calculated based on potential benefit (40% of net gain)
- **Selection**: 3 random upgrades available at a time (can reload for new options)

### Progression
1. Start by clicking to earn points
2. Buy and place units on the grid to automate production
3. Position units strategically to activate bonuses
4. Stack units to multiply their production
5. Upgrade unit types to increase stacking capacity
6. Purchase temporary upgrades for significant boosts
7. Unlock higher-tier units as you progress

## API Reference

### Core Functions
- **`calculateProduction(grid, activeUpgrades)`**: Computes total production from all units, bonuses, and upgrades.
- **`calculateUnitCost(units, type, baseCost, numToBuy)`**: Calculates cost for buying units (exponential scaling with geometric series).
- **`getUnitBonusMultiplier(grid, x, y)`**: Returns bonus multiplier for a specific grid position.
- **`updateUnitsBonusState(grid)`**: Recalculates and updates bonus states for all units in the grid.
- **`getMaxCapacity(level)`**: Returns maximum stacking capacity for a given level (formula: 2^level).

### Game Engine Methods
- **`gameEngine.click()`**: Process a manual click
- **`gameEngine.tick()`**: Process one game tick (called every second)
- **`gameEngine.buyUnit(type)`**: Purchase and place a unit on the grid
- **`gameEngine.sellUnit(type)`**: Remove and refund a unit from the grid
- **`gameEngine.moveUnit(fromX, fromY, toX, toY)`**: Move or stack units
- **`gameEngine.upgradeUnitType(type)`**: Increase unit type capacity level
- **`gameEngine.buyUpgrade(upgradeId)`**: Purchase a temporary upgrade
- **`gameEngine.resetGame()`**: Clear grid and reset unit levels
- **`gameEngine.save()`**: Manually save to database
- **`gameEngine.initialize(userId)`**: Load saved state for a user

## Dependencies
- **React 19.1.1**: UI framework
- **React Router DOM 7.9.5**: Client-side routing
- **TypeScript 5.9.3**: Type safety and developer experience
- **Zustand 5.0.0**: Lightweight state management
- **Supabase 2.78.0**: Authentication and database
- **Styled-components 6.1.19**: CSS-in-JS styling
- **break_infinity.js 2.2.0**: Large number handling (for idle game scaling)
- **Vite 7.1.7**: Build tool and dev server

## Technical Highlights
- **Framework-Agnostic Game Engine**: Core game logic is fully decoupled from React
- **Decimal Precision**: Uses `break_infinity.js` for accurate calculations with large numbers
- **Optimized Rendering**: Zustand selectors prevent unnecessary re-renders
- **Type Safety**: Full TypeScript coverage with strict mode
- **Auto-Save**: Background persistence every 30 seconds
- **Modular Architecture**: Clear separation between game logic, state management, and UI

For more details, refer to inline code comments or contact the maintainer.
