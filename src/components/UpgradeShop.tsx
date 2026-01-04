import { useState } from "react";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import type { ActiveUpgrade } from "../game/core/types";
import { calculateUpgradeCost } from "../game/core/calculations";
import { UPGRADES, type Upgrade } from "../game/config/upgrades";
import { formatDecimal } from "../utils/formatters";
import {
  UpgradeGrid,
  UpgradeCard,
  SectionTitle,
  Button
} from "../styles/components";

function UpgradeShop() {
  const points = useGameStore(state => state.points);
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const activeUpgrades = useGameStore(state => state.activeUpgrades);

  const [selectedUpgrades, setSelectedUpgrades] = useState(() =>
    [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3)
  );

  const handleReloadUpgrades = () => {
    setSelectedUpgrades([...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3));
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    gameEngine.buyUpgrade(upgradeId);
    useGameStore.getState().syncWithEngine();
  };

  return (
    <div style={{ border: '2px solid #0066cc', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionTitle>UPGRADES</SectionTitle>
        <Button onClick={handleReloadUpgrades}>
          🔄 Reload
        </Button>
      </div>
      <UpgradeGrid>
        {selectedUpgrades.map((upgrade: Upgrade) => {
          const isActive = activeUpgrades.some((au: ActiveUpgrade) => au.upgradeId === upgrade.id);
          const cost = calculateUpgradeCost(upgrade.id, pointsPerSecond, clickValue);
          const canAfford = points.gte(cost);
          const canBuy = canAfford && !isActive;

          return (
              <UpgradeCard
                key={upgrade.id}
                onClick={() => canBuy && handleBuyUpgrade(upgrade.id)}
                style={{
                  cursor: canBuy ? 'pointer' : 'not-allowed',
                  opacity: canBuy ? 1 : 0.5,
                }}
                title={`${upgrade.description} (Duration: ${upgrade.durationSeconds}s)`}
              >
                <div style={{ fontSize: '24px' }}>{upgrade.icon}</div>
                <h4 style={{ margin: '8px 0' }}>{upgrade.id}</h4>
                <div style={{ fontSize: '12px' }}>
                  <span>×{upgrade.multiplier}</span>
                  <br />
                  <span>{formatDecimal(cost)} pts</span>
                  <br />
                  <span>{upgrade.durationSeconds}s</span>
                </div>
              </UpgradeCard>
          );
        })}
      </UpgradeGrid>
    </div>
  );
}

export default UpgradeShop;