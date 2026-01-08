import { useState } from "react";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import type { ActiveUpgrade } from "../game/core/types";
import { calculateUpgradeCost } from "../game/core/calculations";
import { UPGRADES, type Upgrade } from "../game/config/upgrades";
import { formatDecimal } from "../utils/formatters";
import { Button } from "./ui/pixelact-ui/button";
import { Card } from "./ui/pixelact-ui/card";

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
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold">UPGRADES</h3>
        <Button onClick={handleReloadUpgrades} variant="secondary" size="sm">
          🔄
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {selectedUpgrades.map((upgrade: Upgrade) => {
          const isActive = activeUpgrades.some((au: ActiveUpgrade) => au.upgradeId === upgrade.id);
          const cost = calculateUpgradeCost(upgrade.id, pointsPerSecond, clickValue);
          const canAfford = points.gte(cost);
          const canBuy = canAfford && !isActive;
          
          return (
            <Button
            key={upgrade.id}
              onClick={() => canBuy && handleBuyUpgrade(upgrade.id)}
              disabled={!canBuy}
              className={`text-center p-2 border-2 border-foreground transition-all ${
                canBuy ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
              title={`${upgrade.description} (Duration: ${upgrade.durationSeconds}s)`}
            >
              <div className="text-2xl mb-1">{upgrade.icon}</div>
              <div className="text-[8px] mb-1">{upgrade.id}</div>
              <div className="text-[8px] space-y-0.5">
                <div>×{upgrade.multiplier}</div>
                <div>{formatDecimal(cost)}</div>
                <div>{upgrade.durationSeconds}s</div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}

export default UpgradeShop;