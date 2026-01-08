import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { formatDecimal } from "../utils/formatters";
import { Button } from './ui/pixelact-ui/button';
import { Input } from './ui/pixelact-ui/input';
import StatsDisplay from "./StatsDisplay";

function PointsDisplay() {
  const points = useGameStore(state => state.points);
  const syncWithEngine = useGameStore(state => state.syncWithEngine);

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      gameEngine.setPoints(value);
      syncWithEngine();
    }
  };

  const handleReset = () => {
    gameEngine.resetGame();
    syncWithEngine();
  };

  return (
    <div className="w-full max-w-sm mb-4">
      <div className="text-center">
        <h2 className="text-xs mb-2">POINTS</h2>
        <div className="text-2xl font-bold mb-4">{formatDecimal(points)}</div>
      </div>
      <div className="flex gap-2 mb-4">
        <Input 
          type="number" 
          placeholder="Set points" 
          onChange={handlePointsChange}
          className="flex-1"
        />
        <Button
          onClick={handleReset}
          variant="destructive"
        >
          Reset
        </Button>
      </div>
      <StatsDisplay />
    </div>
  );
}

export default PointsDisplay;
