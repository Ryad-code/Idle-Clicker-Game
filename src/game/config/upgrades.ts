export interface Upgrade {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
  durationSeconds: number;
  description: string;
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
    durationSeconds: 120,
    description: 'Increases production by 10%',
  },
  {
    id: 'upgrade2',
    name: 'Flame',
    icon: '🔥',
    multiplier: 1.2,
    durationSeconds: 120,
    description: 'Increases production by 20%',
  },
  {
    id: 'upgrade3',
    name: 'Inferno',
    icon: '🌋',
    multiplier: 1.3,
    durationSeconds: 120,
    description: 'Increases production by 30%',
  },
  {
    id: 'upgrade4',
    name: 'Surge',
    icon: '💥',
    multiplier: 1.5,
    durationSeconds: 90,
    description: 'Increases production by 50%',
  },
  {
    id: 'upgrade5',
    name: 'Turbo',
    icon: '🚀',
    multiplier: 1.75,
    durationSeconds: 90,
    description: 'Increases production by 75%',
  },
  {
    id: 'upgrade6',
    name: 'Overdrive',
    icon: '⚙️',
    multiplier: 2.0,
    durationSeconds: 60,
    description: 'Doubles production',
  },
  {
    id: 'upgrade7',
    name: 'Blaze',
    icon: '🔆',
    multiplier: 2.5,
    durationSeconds: 60,
    description: 'Increases production by 150%',
  },
  {
    id: 'upgrade8',
    name: 'Supernova',
    icon: '✨',
    multiplier: 3.0,
    durationSeconds: 45,
    description: 'Triples production',
  },
  {
    id: 'upgrade9',
    name: 'Hyperdrive',
    icon: '🌟',
    multiplier: 3.5,
    durationSeconds: 45,
    description: 'Increases production by 250%',
  },
  {
    id: 'upgrade10',
    name: 'Apocalypse',
    icon: '💫',
    multiplier: 4.0,
    durationSeconds: 30,
    description: 'Quadruples production',
  },
  // Click upgrades mirroring production scaling
  {
    id: 'click1',
    name: 'Spark',
    icon: '⚡',
    multiplier: 1.1,
    durationSeconds: 120,
    description: 'Increases click value by 10%',
  },
  {
    id: 'click2',
    name: 'Flame',
    icon: '🔥',
    multiplier: 1.2,
    durationSeconds: 120,
    description: 'Increases click value by 20%',
  },
  {
    id: 'click3',
    name: 'Inferno',
    icon: '🌋',
    multiplier: 1.3,
    durationSeconds: 120,
    description: 'Increases click value by 30%',
  },
  {
    id: 'click4',
    name: 'Surge',
    icon: '💥',
    multiplier: 1.5,
    durationSeconds: 90,
    description: 'Increases click value by 50%',
  },
  {
    id: 'click5',
    name: 'Turbo',
    icon: '🚀',
    multiplier: 1.75,
    durationSeconds: 90,
    description: 'Increases click value by 75%',
  },
  {
    id: 'click6',
    name: 'Overdrive',
    icon: '⚙️',
    multiplier: 2.0,
    durationSeconds: 60,
    description: 'Doubles click value',
  },
  {
    id: 'click7',
    name: 'Blaze',
    icon: '🔆',
    multiplier: 2.5,
    durationSeconds: 60,
    description: 'Increases click value by 150%',
  },
  {
    id: 'click8',
    name: 'Supernova',
    icon: '✨',
    multiplier: 3.0,
    durationSeconds: 45,
    description: 'Triples click value',
  },
  {
    id: 'click9',
    name: 'Hyperdrive',
    icon: '🌟',
    multiplier: 3.5,
    durationSeconds: 45,
    description: 'Increases click value by 250%',
  },
  {
    id: 'click10',
    name: 'Apocalypse',
    icon: '💫',
    multiplier: 4.0,
    durationSeconds: 30,
    description: 'Quadruples click value',
  },
];

