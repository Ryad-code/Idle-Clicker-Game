import type { UnitType, Unit } from "../game/core/types";
import { getMaxCapacity } from "../game/core/types";
import { UNIT_CONFIG } from "../game/config/units";
import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { calculateUnitCost } from "../game/core/calculations";
import { formatDecimal } from "../utils/formatters";
import { Button } from './ui/pixelact-ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/pixelact-ui/tooltip';

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
    <div className="flex gap-1 h-20">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleBuyUnit}
            disabled={!canAfford}
            className="flex-[2] flex items-center justify-start gap-2 p-2 text-left"
          >
        {meta.emoji.startsWith('/') ? (
          <img src={meta.emoji} alt={meta.name} className="h-full w-auto max-w-[48px] object-contain flex-shrink-0" />
        ) : (
          <span className="text-3xl flex-shrink-0">{meta.emoji}</span>
        )}
        <div className="flex flex-col flex-1 min-w-0 gap-0.5 text-[10px]">
          <div className="font-bold text-xs" style={{ color: meta.color }}>{meta.name}</div>
          <div className="truncate">Cost: <b>{formatDecimal(cost)}</b></div>
          <div className="flex gap-2 flex-wrap">
            <span>U: <b>{totalUnits}</b></span>
            <span>L: <b>{level}</b></span>
            <span>P: <b>{totalProduction.toFixed(1)}/s</b></span>
            <span className={activeBonuses > 0 ? 'text-success' : 'text-muted-foreground'}>
              B: <b>{activeBonuses}/{totalUnits}</b>
            </span>
          </div>
        </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-[10px] max-w-xs">
            <div>{meta.description}</div>
            <div>{meta.bonusDescription}</div>
            <div>Produces {meta.value} points/s per unit</div>
            <div>Bonus multiplier: x{meta.bonus}</div>
          </div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSellUnit}
            disabled={!canSell}
            variant="secondary"
            size="sm"
            className="flex-1 text-[10px]"
          >
            Sell
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-[10px]">Sell one {meta.name} for {meta.refund} points</div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleUpgradeUnitType}
            disabled={!canLevelUp}
            variant="success"
            size="sm"
            className="flex-1 text-[10px]"
          >
            Lvl+
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-[10px] max-w-xs">Double the stacking capacity of all {meta.name} units (requires even number of units and all fully stacked)</div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default UnitRow;
