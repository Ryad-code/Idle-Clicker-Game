export interface Upgrade {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
  cost: number;
  durationSeconds: number;
}

export function getUpgradeKind(upgradeId: string): 'production' | 'click' {
  return upgradeId.toLowerCase().startsWith('click') ? 'click' : 'production';
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'upgrade1',
    name: 'Spark',
    icon: '⚡',
    multiplier: 1.1,
    cost: 10,
    durationSeconds: 120,
  },
  {
    id: 'upgrade2',
    name: 'Flame',
    icon: '🔥',
    multiplier: 1.2,
    cost: 20,
    durationSeconds: 120,
  },
  {
    id: 'upgrade3',
    name: 'Inferno',
    icon: '🌋',
    multiplier: 1.3,
    cost: 30,
    durationSeconds: 120,
  },
  {
    id: 'upgrade4',
    name: 'Surge',
    icon: '💥',
    multiplier: 1.5,
    cost: 50,
    durationSeconds: 90,
  },
  {
    id: 'upgrade5',
    name: 'Turbo',
    icon: '🚀',
    multiplier: 1.75,
    cost: 75,
    durationSeconds: 90,
  },
  {
    id: 'upgrade6',
    name: 'Overdrive',
    icon: '⚙️',
    multiplier: 2.0,
    cost: 100,
    durationSeconds: 60,
  },
  {
    id: 'upgrade7',
    name: 'Blaze',
    icon: '🔆',
    multiplier: 2.5,
    cost: 150,
    durationSeconds: 60,
  },
  {
    id: 'upgrade8',
    name: 'Supernova',
    icon: '✨',
    multiplier: 3.0,
    cost: 200,
    durationSeconds: 45,
  },
  {
    id: 'upgrade9',
    name: 'Hyperdrive',
    icon: '🌟',
    multiplier: 3.5,
    cost: 250,
    durationSeconds: 45,
  },
  {
    id: 'upgrade10',
    name: 'Apocalypse',
    icon: '💫',
    multiplier: 4.0,
    cost: 300,
    durationSeconds: 30,
  },
  // Click upgrades mirroring production scaling
  {
    id: 'click1',
    name: 'Spark',
    icon: '⚡',
    multiplier: 1.1,
    cost: 10,
    durationSeconds: 120,
  },
  {
    id: 'click2',
    name: 'Flame',
    icon: '🔥',
    multiplier: 1.2,
    cost: 20,
    durationSeconds: 120,
  },
  {
    id: 'click3',
    name: 'Inferno',
    icon: '🌋',
    multiplier: 1.3,
    cost: 30,
    durationSeconds: 120,
  },
  {
    id: 'click4',
    name: 'Surge',
    icon: '💥',
    multiplier: 1.5,
    cost: 50,
    durationSeconds: 90,
  },
  {
    id: 'click5',
    name: 'Turbo',
    icon: '🚀',
    multiplier: 1.75,
    cost: 75,
    durationSeconds: 90,
  },
  {
    id: 'click6',
    name: 'Overdrive',
    icon: '⚙️',
    multiplier: 2.0,
    cost: 100,
    durationSeconds: 60,
  },
  {
    id: 'click7',
    name: 'Blaze',
    icon: '🔆',
    multiplier: 2.5,
    cost: 150,
    durationSeconds: 60,
  },
  {
    id: 'click8',
    name: 'Supernova',
    icon: '✨',
    multiplier: 3.0,
    cost: 200,
    durationSeconds: 45,
  },
  {
    id: 'click9',
    name: 'Hyperdrive',
    icon: '🌟',
    multiplier: 3.5,
    cost: 250,
    durationSeconds: 45,
  },
  {
    id: 'click10',
    name: 'Apocalypse',
    icon: '💫',
    multiplier: 4.0,
    cost: 300,
    durationSeconds: 30,
  },
];

