import { useGameStore } from "../game/gameStore";
import { formatDecimal } from "../utils/formatters";
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/pixelact-ui/tooltip';

function StatsDisplay() {
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const totalClicks = useGameStore(state => state.totalClicks);

  return (
    <div className="space-y-1 text-xs">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-between cursor-help">
            <span className="text-muted-foreground">Per Second:</span>
            <span className="font-bold">{formatDecimal(pointsPerSecond)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-[10px]">Points generated automatically every second from all your units</div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-between cursor-help">
            <span className="text-muted-foreground">Click Value:</span>
            <span className="font-bold">{formatDecimal(clickValue)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-[10px]">Points earned per click, boosted by active upgrades</div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-between cursor-help">
            <span className="text-muted-foreground">Total Clicks:</span>
            <span className="font-bold">{totalClicks.toLocaleString()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-[10px]">Total number of clicks you've made since starting</div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default StatsDisplay;
