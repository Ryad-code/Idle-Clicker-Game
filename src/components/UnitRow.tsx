import type { UnitType, Unit } from "../game/core/types";
import { getMaxCapacity } from "../game/core/types";
import { UNIT_CONFIG } from "../game/config/units";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { calculateUnitCost } from "../game/core/calculations";
import { formatDecimal } from "../utils/formatters";
import { Button } from 'pixel-retroui';
import { theme } from "../styles/theme";
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
  
  // Calculate total units and active bonuses for this type
  const unitsOfType = allUnits.filter(u => u.type === unitType);
  const totalUnits = unitsOfType.reduce((sum, u) => sum + u.stackedCount, 0);
  const activeBonuses = unitsOfType.filter(u => u.bonusActive).reduce((sum, u) => sum + u.stackedCount, 0);
  const totalProduction = unitsOfType.reduce((sum, u) => {
    return sum + (meta.value * u.stackedCount * (u.bonusActive ? meta.bonus : 1));
  }, 0);
  const level = unitLevels[unitType];

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
        title={`${meta.description}\n${meta.bonusDescription}\nProduces ${meta.value} points/s per unit\nBonus multiplier: x${meta.bonus}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          gap: '10px',
          fontSize: '12px',
          padding: '8px',
          overflow: 'visible'
        }}
        bg={canAfford ? theme.colors.success : theme.colors.panel}
      >
        {meta.emoji.startsWith('/') ? (
          <img src={meta.emoji} alt={meta.name} style={{height: 'calc(100% - 8px)', width: 'auto', maxWidth: '64px', flexShrink: 0, objectFit: 'contain'}} />
        ) : (
          <span style={{fontSize: '36px', lineHeight: 1, flexShrink: 0}}>{meta.emoji}</span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0, gap: '4px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: meta.color }}>{meta.name}</div>
          <div style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
            Cost: <b>{formatDecimal(cost)}</b>
          </div>
          <div style={{ fontSize: '11px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>Units: <b>{totalUnits}</b></span>
            <span>Lvl: <b>{level}</b></span>
            <span>Prod: <b>{totalProduction.toFixed(1)}/s</b></span>
            <span style={{ color: activeBonuses > 0 ? theme.colors.success : theme.colors.border }}>
              Bonus: <b>{activeBonuses}/{totalUnits}</b>
            </span>
          </div>
        </div>
      </Button>
      <Button
        onClick={handleSellUnit}
        disabled={!canSell}
        title={`Sell one ${meta.name} for ${meta.refund} points`}
        style={{ width: '33.33%', height: '100%', fontSize: '12px' }}
        bg={canSell ? theme.colors.danger : theme.colors.panel}
      >
        Sell
      </Button>
      <Button
        onClick={handleUpgradeUnitType}
        disabled={!canLevelUp}
        title={`Double the stacking capacity of all ${meta.name} units (requires even number of units and all fully stacked)`}
        style={{ width: '33.33%', height: '100%', fontSize: '12px' }}
        bg={canLevelUp ? theme.colors.danger : theme.colors.panel}
      >
        Level Up
      </Button>
    </UnitRowContainer>
  );
}

export default UnitRow;
