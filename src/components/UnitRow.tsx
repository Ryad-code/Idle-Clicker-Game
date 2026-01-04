import type { UnitType, Unit } from "../game/core/types";
import { getMaxCapacity } from "../game/core/types";
import { UNIT_CONFIG } from "../game/config/units";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { calculateUnitCost } from "../game/core/calculations";
import { formatDecimal } from "../utils/formatters";
import { Button } from 'pixel-retroui';
import { UnitRow as UnitRowContainer } from "../styles/components";

interface UnitRowProps {
  unitType: UnitType;
}

function UnitRow({ unitType }: UnitRowProps) {
  const points = useGameStore(state => state.points);
  const grid = useGameStore(state => state.grid);
  const unitLevels = useGameStore(state => state.unitLevels);
  const syncWithEngine = useGameStore(state => state.syncWithEngine);

  const meta = UNIT_CONFIG[unitType];
  const allUnits = grid.flat().filter((u): u is Unit => u !== null);
  const numEffectiveToBuy = getMaxCapacity(unitLevels[unitType]);
  const cost = calculateUnitCost(allUnits, unitType, meta.cost, numEffectiveToBuy);
  const canAfford = points.gte(cost);
  const owned = allUnits.filter(u => u.type === unitType).length;
  const canSell = owned > 0;
  const canLevelUp = owned > 0 && gameEngine.isUnitTypeFullyStacked(unitType) && owned % 2 === 0;

  const handleBuyUnit = () => {
    gameEngine.buyUnit(unitType);
    syncWithEngine();
  };

  const handleSellUnit = () => {
    gameEngine.sellUnit(unitType);
    syncWithEngine();
  };

  const handleUpgradeUnitType = () => {
    gameEngine.upgradeUnitType(unitType);
    syncWithEngine();
  };

  return (
    <UnitRowContainer>
      <Button
        onClick={handleBuyUnit}
        disabled={!canAfford}
        title={`${meta.description} - Produces ${meta.value} points per second`}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '10px' }}
        bg={canAfford ? '#00aa00' : '#222222'}
      >
        <div>
          <span>{meta.emoji}</span> <span>{meta.name}</span>
        </div>
        <div>{formatDecimal(cost)}</div>
      </Button>
      <Button
        onClick={handleSellUnit}
        disabled={!canSell}
        title={`Sell one ${meta.name} for ${meta.refund} points`}
        style={{ width: '33.33%', height: '100%', fontSize: '10px' }}
        bg={canSell ? '#cc0000' : '#222222'}
      >
        Sell
      </Button>
      <Button
        onClick={handleUpgradeUnitType}
        disabled={!canLevelUp}
        title={`Double the stacking capacity of all ${meta.name} units (requires even number of units and all fully stacked)`}
        style={{ width: '33.33%', height: '100%', fontSize: '10px' }}
        bg={canLevelUp ? '#cc0000' : '#222222'}
      >
        Level Up
      </Button>
    </UnitRowContainer>
  );
}

export default UnitRow;
