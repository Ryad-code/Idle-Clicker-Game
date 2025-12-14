import { UNIT_CONFIG, UNIT_TYPES } from "../game/unitConfig";
import { useGame } from "../contexts";
import type { UnitType } from "../game/types";
import {
  DashboardContainer,
  ShopContainer,
  ButtonLabel,
  ButtonPrice,
  ButtonInfo,
  SectionTitle,
  SaveButton,
  UnitRow,
  BuyButton,
  SmallSellButton
} from "../styles/components/shopPanel.styles";

function ShopPanel() {
  const { player, buyUnit, sellUnit, save } = useGame();

  const handleManualSave = async () => {
    await save();
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
      <SaveButton onClick={handleManualSave}>
        💾 Save Progress
      </SaveButton>
      <ShopContainer>
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