import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { UPGRADES } from "../game/config/upgrades";
import { formatDecimal } from "../utils/formatters";
import { 
  ClickerContainer, 
  PointsDisplay, 
  PointsValue,
  StatsContainer,
  StatRow,
  ClickButton,
  ActiveUpgradesContainer,
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
      <PointsDisplay>
        <h2 style={{ margin: '0 0 8px' }}>Points</h2>
        <PointsValue>{formatDecimal(points)}</PointsValue>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input 
            type="number" 
            placeholder="Set points (test)" 
            onChange={handlePointsChange}
            style={{
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #E5E5E5',
              flex: 1
            }}
          />
          <button
            onClick={handleReset}
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#ff4444',
              color: 'white',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Reset
          </button>
        </div>
      </PointsDisplay>
      
      <StatsContainer>
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
      </StatsContainer>

      {activeUpgradeDisplays.length > 0 && (
        <ActiveUpgradesContainer>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>Active Upgrades</div>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                    <span>{item?.remainingSeconds}s</span>
                  </div>
                </ActiveUpgradeBadge>
            );
          })}
        </ActiveUpgradesContainer>
      )}

      <ClickButton onClick={handleClick}>
        CLICK
      </ClickButton>
    </ClickerContainer>
  )
}

export default ClickerPanel
