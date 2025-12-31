import { useState } from "react";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/config/units";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import type { UnitType, Unit, ActiveUpgrade } from "../game/core/types";
import { calculateUnitCost, calculateUpgradeCost } from "../game/core/calculations";
import { UPGRADES, type Upgrade } from "../game/config/upgrades";
import { formatBigInt } from "../utils/formatters";
import ErrorMessage from "./UI/ErrorMessage";
import {
  DashboardContainer,
  ShopContainer,
  ButtonLabel,
  ButtonPrice,
  ButtonInfo,
  SectionTitle,
  UnitRow,
  BuyButton,
  SmallSellButton,
  UpgradeSection,
  UpgradeGrid,
  UpgradeCard,
  UpgradeIcon,
  UpgradeName,
  UpgradeInfo,
  UpgradeMultiplier,
  UpgradeCost,
  ReloadButton
} from "../styles/components/shopPanel.styles";

function ShopPanel() {
  const points = useGameStore(state => state.points);
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const grid = useGameStore(state => state.grid);
  const activeUpgrades = useGameStore(state => state.activeUpgrades);
  const error = useGameStore(state => state.error);
  const allUnits = grid.flat().filter((u): u is Unit => u !== null);

  const [selectedUpgrades, setSelectedUpgrades] = useState(() => 
    [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3)
  );

  const handleReloadUpgrades = () => {
    setSelectedUpgrades([...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3));
  };

  // Action handlers - call gameEngine methods directly and sync store
  const handleBuyUnit = (type: UnitType) => {
    gameEngine.buyUnit(type);
    useGameStore.getState().syncWithEngine();
  };

  const handleSellUnit = (type: UnitType) => {
    gameEngine.sellUnit(type);
    useGameStore.getState().syncWithEngine();
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    gameEngine.buyUpgrade(upgradeId);
    useGameStore.getState().syncWithEngine();
  };

  const handleUpgradeUnitType = (type: UnitType) => {
    gameEngine.upgradeUnitType(type);
    useGameStore.getState().syncWithEngine();
  };

  // Show unit if player owns it, can almost afford it, or it's one of the first two units
  const isUnlocked = (unitType: UnitType) => {
    if (unitType === 'unit1' || unitType === 'unit2') return true;
    const meta = UNIT_CONFIG[unitType];
    const cost = calculateUnitCost(allUnits, unitType, meta.cost);
    const owned = allUnits.filter(u => u.type === unitType).length;
    return owned > 0 || points >= cost * 9n / 10n;
  };

  const availableUnits = UNIT_TYPES.filter(isUnlocked);

  return (
    <DashboardContainer>
      {error && <ErrorMessage message={error} />}
      <ShopContainer>
      
        <UpgradeSection>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionTitle>UPGRADES</SectionTitle>
            <ReloadButton onClick={handleReloadUpgrades}>
              🔄 Reload
            </ReloadButton>
          </div>
          <UpgradeGrid>
            {selectedUpgrades.map((upgrade: Upgrade) => {
              const isActive = activeUpgrades.some((au: ActiveUpgrade) => au.upgradeId === upgrade.id);
              const cost = calculateUpgradeCost(upgrade.id, pointsPerSecond, clickValue);
              const canAfford = points >= cost;
              const canBuy = canAfford && !isActive;
              
              return (
                <UpgradeCard
                  key={upgrade.id}
                  onClick={() => canBuy && handleBuyUpgrade(upgrade.id)}
                  style={{
                    cursor: canBuy ? 'pointer' : 'not-allowed',
                    opacity: canBuy ? 1 : 0.5,
                  }}
                  title={
                    isActive ? 'Already active' : 
                    canAfford ? 'Click to buy' : 
                    'Not enough points'
                  }
                >
                  <UpgradeIcon>{upgrade.icon}</UpgradeIcon>
                  <UpgradeName>{upgrade.id}</UpgradeName>
                  <UpgradeInfo>
                    <UpgradeMultiplier>×{upgrade.multiplier}</UpgradeMultiplier>
                    <UpgradeCost>{formatBigInt(cost)} pts</UpgradeCost>
                    <span>{upgrade.durationSeconds}s</span>
                  </UpgradeInfo>
                </UpgradeCard>
              );
            })}
          </UpgradeGrid>
        </UpgradeSection>
        <SectionTitle>UNITS</SectionTitle>
        {availableUnits.map((unitType: UnitType) => {
          const meta = UNIT_CONFIG[unitType];
          const cost = calculateUnitCost(allUnits, unitType, meta.cost);
          const canAfford = points >= cost;
          const owned = allUnits.filter(u => u.type === unitType).reduce((sum, u) => sum + u.stackedCount, 0);
          const canSell = owned > 0;
          return (
            <UnitRow key={unitType}>
              <BuyButton 
                onClick={() => handleBuyUnit(unitType)}
                $disabled={!canAfford}
                title={meta.description + meta.value}
              >
                <ButtonLabel>
                  <span>{meta.emoji}</span>
                  <span>{meta.name}</span>
                  <ButtonInfo>({owned})</ButtonInfo>
                </ButtonLabel>
                <ButtonPrice>{formatBigInt(cost)}</ButtonPrice>
              </BuyButton>
              <SmallSellButton 
                onClick={() => handleSellUnit(unitType)}
                $disabled={!canSell}
                title={`Sell for ${meta.refund} pts`}
              >
                Sell ({meta.refund})
              </SmallSellButton>
              <SmallSellButton 
                onClick={() => handleUpgradeUnitType(unitType)}
                $disabled={owned === 0}
                title={`Upgrade ${meta.name} capacity`}
              >
                Upgrade
              </SmallSellButton>
            </UnitRow>
          );
        })}
      </ShopContainer>
    </DashboardContainer>
  );
}

export default ShopPanel;