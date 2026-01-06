import { useGameStore } from "../game/gameStore";
import { formatDecimal } from "../utils/formatters";
import { StatRow } from "../styles/components";

function StatsDisplay() {
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const totalClicks = useGameStore(state => state.totalClicks);

  return (
    <div>
      <StatRow title="Points generated automatically every second from all your units">
        <span>Per Second:</span>
        <span style={{ fontWeight: 'bold' }}>{formatDecimal(pointsPerSecond)}</span>
      </StatRow>
      <StatRow title="Points earned per click, boosted by active upgrades">
        <span>Click Value:</span>
        <span style={{ fontWeight: 'bold' }}>{formatDecimal(clickValue)}</span>
      </StatRow>
      <StatRow title="Total number of clicks you've made since starting">
        <span>Total Clicks:</span>
        <span style={{ fontWeight: 'bold' }}>{totalClicks.toLocaleString()}</span>
      </StatRow>
    </div>
  );
}

export default StatsDisplay;
