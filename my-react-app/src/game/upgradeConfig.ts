export interface Upgrade {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
  cost: number;
  durationSeconds: number;
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
];

export interface ActiveUpgrade {
  id: string;
  purchasedAt: Date;
  expiresAt: Date;
  multiplier: number;
}

export function getCurrentWindowStart(): Date {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  return start;
}

export function isInUpgradeWindow(): boolean {
  const now = new Date();
  const windowStart = getCurrentWindowStart();
  const windowEnd = new Date(windowStart.getTime() + 10 * 60 * 1000);
  return now >= windowStart && now < windowEnd;
}

export function getTimeUntilNextWindow(): number {
  const now = new Date();
  const nextWindowStart = new Date(now);
  nextWindowStart.setHours(nextWindowStart.getHours() + 1);
  nextWindowStart.setMinutes(0);
  nextWindowStart.setSeconds(0);
  nextWindowStart.setMilliseconds(0);
  return Math.max(0, nextWindowStart.getTime() - now.getTime());
}

export function selectUpgradesForWindow(windowStart: Date): string[] {
  const seed = Math.floor(windowStart.getTime() / 1000);
  const indices: number[] = [];
  
  // Seeded selection of 3 unique random upgrades
  for (let i = 0; i < 3; i++) {
    let randomIndex: number;
    do {
      const x = Math.sin(seed + i) * 10000;
      const rand = x - Math.floor(x);
      randomIndex = Math.floor(rand * UPGRADES.length);
    } while (indices.includes(randomIndex));
    indices.push(randomIndex);
  }

  return indices.map(i => UPGRADES[i].id);
}
