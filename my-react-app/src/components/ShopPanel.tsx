import { useState } from "react";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/config/units";
import { useGameState, useGameActions } from "../contexts";
import type { UnitType } from "../game/core/types";
import { calculateUnitCost } from "../game/core/calculations";
import { UPGRADES, type Upgrade } from "../game/config/upgrades";
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
  const { currency, grid, upgrades, ui } = useGameState();
  const allUnits = grid.flat().filter(u => u !== null);
  const { buyUnit, sellUnit, buyUpgrade } = useGameActions();
  const [selectedUpgrades, setSelectedUpgrades] = useState(() => 
    [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3)
  );

  const handleReloadUpgrades = () => {
    setSelectedUpgrades([...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3));
  };

  // Show unit if player owns it, can almost afford it, or it's one of the first two units
  const isUnlocked = (unitType: UnitType) => {
    if (unitType === 'unit1' || unitType === 'unit2') return true;
    const meta = UNIT_CONFIG[unitType];
    const cost = calculateUnitCost(allUnits, unitType, meta.cost);
    const owned = allUnits.filter(u => u.type === unitType).length;
    return owned > 0 || currency.points >= cost * 0.9;
  };

  const availableUnits = UNIT_TYPES.filter(isUnlocked);

  return (
    <DashboardContainer>
      {ui.error && <ErrorMessage message={ui.error} />}
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
              const isActive = upgrades.active.some(au => au.upgradeId === upgrade.id);
              const canAfford = currency.points >= upgrade.cost;
              const canBuy = canAfford && !isActive;
              
              return (
                <UpgradeCard
                  key={upgrade.id}
                  onClick={() => canBuy && buyUpgrade(upgrade.id)}
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
                    <UpgradeCost>{upgrade.cost} pts</UpgradeCost>
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
          const canAfford = currency.points >= cost;
          const owned = allUnits.filter(u => u.type === unitType).length;
          const canSell = owned > 0;
          return (
            <UnitRow key={unitType}>
              <BuyButton 
                onClick={() => buyUnit(unitType)}
                $disabled={!canAfford}
                title={meta.description + meta.value}
              >
                <ButtonLabel>
                  <span>{meta.emoji}</span>
                  <span>{meta.name}</span>
                  <ButtonInfo>({owned})</ButtonInfo>
                </ButtonLabel>
                <ButtonPrice>{cost}</ButtonPrice>
              </BuyButton>
              <SmallSellButton 
                onClick={() => sellUnit(unitType)}
                $disabled={!canSell}
                title={`Sell for ${meta.refund} pts`}
              >
                Sell ({meta.refund})
              </SmallSellButton>
            </UnitRow>
          );
        })}
      </ShopContainer>
    </DashboardContainer>
  );
}

export default ShopPanel;