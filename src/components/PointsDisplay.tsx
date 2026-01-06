import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { formatDecimal } from "../utils/formatters";
import { Button, Card, Input } from 'pixel-retroui';
import { theme } from "../styles/theme";
import { PointsValue } from "../styles/components";
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
    <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '0 0 16px' }}>
      <h2 style={{ margin: '0 0 8px' }}>Points</h2>
      <PointsValue>{formatDecimal(points)}</PointsValue>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Input 
          type="number" 
          placeholder="Set points" 
          onChange={handlePointsChange}
          style={{ flex: 1 }}
        />
        <Button
          onClick={handleReset}
          style={{ backgroundColor: theme.colors.danger, color: theme.colors.text }}
        >
          Reset
        </Button>
      </div>
        <StatsDisplay />
    </Card>
  );
}

export default PointsDisplay;
