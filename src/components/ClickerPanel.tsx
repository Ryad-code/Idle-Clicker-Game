import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { UPGRADES } from "../game/config/upgrades";
import { formatDecimal } from "../utils/formatters";
import { Button, Card, Input } from 'pixel-retroui';
import { theme } from "../styles/theme";
import { 
  ClickerContainer, 
  PointsValue,
  StatRow,
  ActiveUpgradeBadge
} from "../styles/components";
import ErrorMessage from "./UI/ErrorMessage";

function ClickerPanel() {
  const points = useGameStore(state => state.points);
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const activeUpgrades = useGameStore(state => state.activeUpgrades);
  const totalClicks = useGameStore(state => state.totalClicks);
  const error = useGameStore(state => state.error);
  const syncWithEngine = useGameStore(state => state.syncWithEngine);
  
  const upgradeMap = new Map(UPGRADES.map(u => [u.id, u]));
  const now = Date.now();
  
  const activeUpgradeDisplays = activeUpgrades
    .map((pu) => {
      const upgrade = upgradeMap.get(pu.upgradeId);
      if (!upgrade) return null;
      const expiresAt = pu.purchasedAt.getTime() + upgrade.durationSeconds * 1000;
      const remainingMs = expiresAt - now;
      if (remainingMs <= 0) return null;
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      return { upgradeId: pu.upgradeId, icon: upgrade.icon, remainingSeconds };
    })
    .filter(Boolean);
  
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      gameEngine.setPoints(value);
      syncWithEngine();
    }
  };

  const handleClick = () => {
    gameEngine.click();
    syncWithEngine();
  };

  const handleReset = () => {
    gameEngine.resetGame();
    syncWithEngine();
  };

  return (
    <ClickerContainer>
      
      {error && <ErrorMessage message={error} />}
      <Card style={{ margin: '0 0 16px' }}>
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
      </Card>
      
      <Card style={{ margin: '0 0 16px' }}>
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
      </Card>

      {activeUpgradeDisplays.length > 0 && (
        <Card style={{ margin: '0 0 16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Active Upgrades</div>
          {activeUpgradeDisplays.map((item) => {
            const upgrade = upgradeMap.get(item?.upgradeId || '');
            if (!upgrade) return null;
            return (
                <ActiveUpgradeBadge
                  key={item?.upgradeId}
                  title={`${upgrade.description} - ${item?.remainingSeconds}s remaining`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <span>{item?.icon}</span>
                    <span>{item?.upgradeId}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.border }}>
                    <span>{item?.remainingSeconds}s</span>
                  </div>
                </ActiveUpgradeBadge>
            );
          })}
        </Card>
      )}

      <Button onClick={handleClick} style={{ padding: '24px 48px', fontSize: '20px', backgroundColor: theme.colors.success, color: theme.colors.background }}>
        CLICK
      </Button>
    </ClickerContainer>
  )
}

export default ClickerPanel
