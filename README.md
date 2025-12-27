# Idle Clicker Game

## Overview
This is a React-based idle clicker game where players place units on a grid to generate production points. The game features grid-based bonuses, upgrades, authentication, and persistent state via Supabase. Players can sign up, log in, and track their progress across sessions.

## Architecture
- **Frontend**: React with TypeScript, using Context API for state management and React Router for navigation.
- **Backend**: Supabase for authentication and database persistence.
- **Build Tool**: Vite for development and building.
- **Styling**: Styled-components with a custom theme.

## Project Structure
```
my-react-app/
├── src/
│   ├── components/          # UI components (UnitPanel, ClickerPanel, ShopPanel, Layout, UI)
│   ├── contexts/            # State management (GameProvider, gameActions, hooks)
│   ├── game/
│   │   ├── config/          # Game data (units, upgrades, constants, grid)
│   │   ├── core/            # Game logic (calculations, bonuses, state, types)
│   │   └── services/        # Database interactions
│   ├── hooks/               # Custom hooks (useAuth, useGamePersistence, useGameTick)
│   ├── pages/               # Page components (AuthPage, HomePage, Stats)
│   ├── styles/              # Theme and component-specific styles
│   ├── utils/               # Utility functions (errorUtils, formatters)
│   ├── supabaseClient.ts    # Supabase client configuration
│   └── main.tsx             # App entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── README.md                # (This file, moved from here)
```

## Key Features
- **Authentication**: User signup and login with Supabase Auth.
- **Grid-Based Gameplay**: Place units on a 11x11 grid to earn production points.
- **Unit Bonuses**: Each unit has unique grid-based bonuses (e.g., adjacency, clusters).
- **Upgrades**: Temporary multipliers for production or click value.
- **Persistence**: Auto-save/load game state to/from Supabase.
- **Real-Time Updates**: Production updates every second; bonuses apply immediately.
- **Statistics**: View game progress and stats on the Stats page.

## Pages
- **AuthPage**: Handles user login and signup.
- **HomePage**: Main game interface with clicker, unit placement, and shop panels.
- **Stats**: Displays game statistics and progress.

## How to Run
1. Navigate to the app directory: `cd my-react-app`
2. Install dependencies: `npm install`
3. Set up Supabase (add your URL and anon key to `.env`)
4. Start dev server: `npm run dev`
5. Build for production: `npm run build`

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
- React, React DOM, React Router DOM, TypeScript, Supabase, Styled-components, Vite.

For more details, refer to inline code comments or contact the maintainer.
