import { UNIT_CONFIG, UNIT_TYPES } from "../game/config/units";
import { useGameStore } from "../game/gameStore";
import type { UnitType, Unit } from "../game/core/types";
import { calculateUnitCost } from "../game/core/calculations";
import UnitRow from "./UnitRow";

function UnitShop() {
  const points = useGameStore(state => state.points);
  const grid = useGameStore(state => state.grid);
  const allUnits = grid.flat().filter((u): u is Unit => u !== null);

  // Show unit if player owns it, can almost afford it, or it's one of the first two units
  const isUnlocked = (unitType: UnitType) => {
    if (unitType === 'unit1' || unitType === 'unit2') return true;
    const meta = UNIT_CONFIG[unitType];
    const cost = calculateUnitCost(allUnits, unitType, meta.cost);
    const owned = allUnits.filter(u => u.type === unitType).length;
    // Check if player owns units or has at least 90% of the cost
    return owned > 0 || points.gte(cost.times(0.9));
  };

  const availableUnits = UNIT_TYPES.filter(isUnlocked);

  return (
    <div>
      <h3 className="text-xs font-bold mb-4">UNITS</h3>
      <div className="space-y-2">
        {availableUnits.map((unitType: UnitType) => (
          <UnitRow key={unitType} unitType={unitType} />
        ))}
      </div>
    </div>
  );
}

export default UnitShop;