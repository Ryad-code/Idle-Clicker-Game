# Project Documentation: Idle Clicker Game

## Overview
This is a React-based idle clicker game where players place units on a grid to generate production points. The game features grid-based bonuses, upgrades, and persistent state via Supabase.

## Architecture
- **Frontend**: React with TypeScript, using Context API for state management.
- **Backend**: Supabase for database persistence.
- **Build Tool**: Vite for development and building.
- **Styling**: Styled-components with a custom theme.

## Project Structure
```
src/
├── components/          # UI components (UnitPanel, ClickerPanel, etc.)
├── contexts/            # State management (GameProvider, hooks)
├── game/
│   ├── config/          # Game data (units, upgrades)
│   ├── core/            # Game logic (calculations, bonuses, types)
│   └── services/        # Database interactions
├── styles/              # Theme and global styles
└── main.tsx             # App entry point
```

## Key Features
- **Grid-Based Gameplay**: Place units on a 5x5 grid to earn production points.
- **Unit Bonuses**: Each unit has unique grid-based bonuses (e.g., adjacency, clusters).
- **Upgrades**: Temporary multipliers for production or click value.
- **Persistence**: Auto-save/load game state to/from Supabase.
- **Real-Time Updates**: Production updates every second; bonuses apply immediately.

## How to Run
1. Install dependencies: `npm install`
2. Set up Supabase (add your URL and anon key to [`.env`](.env ))
3. Start dev server: `npm run dev`
4. Build for production: `npm run build`

## Core Mechanics
- **Production**: Calculated from unit values, grid bonuses, and active upgrades.
- **Clicking**: Earns points based on production with upgrade multipliers.
- **Bonuses**: Triggered by unit positions (e.g., chains, clusters, synergies).
- **Upgrades**: Purchased with points; expire after time.

## API Reference
- **calculateProduction(grid, activeUpgrades)**: Computes total production.
- **getUnitBonusMultiplier(grid, x, y)**: Gets bonus multiplier for a unit position.
- **updateUnitsBonusState(grid)**: Updates grid with active bonuses.

## Dependencies
- React, TypeScript, Supabase, Styled-components, Vite.

For more details, refer to inline code comments or contact the maintainer.
