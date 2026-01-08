import { useGameStore } from "../game/gameStore";
import { UPGRADES } from "../game/config/upgrades";
import { Card } from "./ui/pixelact-ui/card";

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
    <Card className="box-shadow-margin mb-4">
      <div className="text-xs font-bold mb-2">ACTIVE UPGRADES</div>
      <div className="space-y-2">
        {activeUpgradeDisplays.map((item) => {
          const upgrade = upgradeMap.get(item?.upgradeId || '');
          if (!upgrade) return null;
          return (
            <div
              key={item?.upgradeId}
              className="flex items-center justify-between p-2 bg-secondary text-secondary-foreground"
              title={`${upgrade.description} - ${item?.remainingSeconds}s remaining`}
            >
              <div className="flex items-center gap-2 text-xs">
                <span>{item?.icon}</span>
                <span>{item?.upgradeId}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <span>{item?.remainingSeconds}s</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ActiveUpgrades;
