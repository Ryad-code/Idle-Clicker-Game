import { useGameStore } from "../game/gameStore";
import { UPGRADES } from "../game/config/upgrades";
import { Card } from 'pixel-retroui';
import { theme } from "../styles/theme";
import { ActiveUpgradeBadge } from "../styles/components";

function ActiveUpgrades() {
  const activeUpgrades = useGameStore(state => state.activeUpgrades);
  
  const upgradeMap = new Map(UPGRADES.map(u => [u.id, u]));
  const now = Date.now();
  
  const activeUpgradeDisplays = activeUpgrades
    .map((pu) => {
      const upgrade = upgradeMap.get(pu.upgradeId);
      if (!upgrade) return null;
      const expiresAt = pu.purchasedAt.getTime() + upgrade.durationSeconds * 1000;
      const remainingMs = expiresAt - now;
      if (remainingMs <= 0) return null;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      return { upgradeId: pu.upgradeId, icon: upgrade.icon, remainingSeconds };
    })
    .filter(Boolean);

  if (activeUpgradeDisplays.length === 0) {
    return null;
  }

  return (
    <Card style={{ margin: '0 0 16px' }}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Active Upgrades</div>
      {activeUpgradeDisplays.map((item) => {
        const upgrade = upgradeMap.get(item?.upgradeId || '');
        if (!upgrade) return null;
        return (
          <ActiveUpgradeBadge
            key={item?.upgradeId}
            title={`${upgrade.description} - ${item?.remainingSeconds}s remaining`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <span>{item?.icon}</span>
              <span>{item?.upgradeId}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.border }}>
              <span>{item?.remainingSeconds}s</span>
            </div>
          </ActiveUpgradeBadge>
        );
      })}
    </Card>
  );
}

export default ActiveUpgrades;
