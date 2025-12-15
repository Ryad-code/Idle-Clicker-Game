import { useState } from "react";
import { UNIT_CONFIG, UNIT_TYPES } from "../game/unitConfig";
import { useGame } from "../contexts";
import type { UnitType } from "../game/types";
import { UPGRADES, type Upgrade } from "../game/upgradeConfig";
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
  const { player, buyUnit, sellUnit, buyUpgrade, error } = useGame();
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
    const cost = player.calculateUnitCost(unitType, meta.cost);
    const owned = player.getUnitCount(unitType);
    return owned > 0 || player.points >= cost * 0.9;
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
              const canAfford = player.canAfford(upgrade.cost);
              return (
                <UpgradeCard
                  key={upgrade.id}
                  onClick={() => canAfford && buyUpgrade(upgrade.id)}
                  style={{
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    opacity: canAfford ? 1 : 0.5,
                  }}
                  title={canAfford ? 'Click to buy' : 'Not enough points'}
                >
                  <UpgradeIcon>{upgrade.icon}</UpgradeIcon>
                  <UpgradeName>{upgrade.name}</UpgradeName>
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
        <SectionTitle>SHOP</SectionTitle>
        {availableUnits.map((unitType: UnitType) => {
          const meta = UNIT_CONFIG[unitType];
          const cost = player.calculateUnitCost(unitType, meta.cost);
          const canAfford = player.canAfford(cost);
          const owned = player.getUnitCount(unitType);
          const canSell = owned > 0;
          
          return (
            <UnitRow key={unitType}>
              <BuyButton 
                onClick={() => buyUnit(unitType)}
                $disabled={!canAfford}
                title={meta.description}
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