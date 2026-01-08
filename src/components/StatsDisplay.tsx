import { useGameStore } from "../game/gameStore";
import { formatDecimal } from "../utils/formatters";

function StatsDisplay() {
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const totalClicks = useGameStore(state => state.totalClicks);

  return (
    <div className="space-y-1 text-xs">
      <div className="flex justify-between" title="Points generated automatically every second from all your units">
        <span className="text-muted-foreground">Per Second:</span>
        <span className="font-bold">{formatDecimal(pointsPerSecond)}</span>
      </div>
      <div className="flex justify-between" title="Points earned per click, boosted by active upgrades">
        <span className="text-muted-foreground">Click Value:</span>
        <span className="font-bold">{formatDecimal(clickValue)}</span>
      </div>
      <div className="flex justify-between" title="Total number of clicks you've made since starting">
        <span className="text-muted-foreground">Total Clicks:</span>
        <span className="font-bold">{totalClicks.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default StatsDisplay;
