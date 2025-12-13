import { UNIT_CONFIG, UNIT_TYPES } from "../game/gameConfig";
import { useGame } from "../contexts";
import type { UnitType } from "../game/types";
import {
  DashboardContainer,
  ShopContainer,
  ActionButton,
  SellButton,
  ButtonLabel,
  ButtonPrice,
  ButtonInfo,
  SectionTitle,
  SaveButton
} from "../styles/components/dashboard.styles";

function Dashboard() {
  const { player, buyUnit, sellUnit, save } = useGame();

  const handleManualSave = async () => {
    await save();
  };

  return (
    <DashboardContainer>
      <SaveButton onClick={handleManualSave}>
        💾 Save Progress
      </SaveButton>
      <ShopContainer>
        <SectionTitle>BUY UNITS</SectionTitle>
        {UNIT_TYPES.map((unitType: UnitType) => {
          const meta = UNIT_CONFIG[unitType];
          const cost = player.calculateUnitCost(unitType, meta.cost);
          const canAfford = player.canAfford(cost);
          const owned = player.getUnitCount(unitType);
          
          return (
            <ActionButton 
              key={`buy-${unitType}`}
              onClick={() => buyUnit(unitType)}
              $disabled={!canAfford}
              title={meta.description}
            >
              <ButtonLabel>
                <span>{meta.emoji}</span>
                <span>{meta.name}</span>
                <ButtonInfo>({owned} owned)</ButtonInfo>
              </ButtonLabel>
              <ButtonPrice>{cost} pts</ButtonPrice>
            </ActionButton>
          );
        })}
        
        <SectionTitle>SELL UNITS</SectionTitle>
        {UNIT_TYPES.map((unitType: UnitType) => {
          const meta = UNIT_CONFIG[unitType];
          const owned = player.getUnitCount(unitType);
          const canSell = owned > 0;
          
          return (
            <SellButton 
              key={`sell-${unitType}`}
              onClick={() => sellUnit(unitType)}
              $disabled={!canSell}
            >
              <ButtonLabel>
                <span>{meta.emoji}</span>
                <span>Sell {meta.name}</span>
              </ButtonLabel>
              <ButtonPrice>+{meta.refund} pts</ButtonPrice>
            </SellButton>
          );
        })}
      </ShopContainer>
    </DashboardContainer>
  );
}

export default Dashboard