import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";
import { UPGRADES } from "../game/config/upgrades";
import { formatBigInt } from "../utils/formatters";
import { 
  ClickerContainer, 
  PointsDisplay, 
  PointsTitle, 
  PointsValue,
  StatsContainer,
  StatRow,
  StatLabel,
  StatValue,
  ClickButton,
  ActiveUpgradesContainer,
  ActiveUpgradesTitle,
  ActiveUpgradeBadge,
  BadgeLeft,
  BadgeRight
} from "../styles/components/clickerPanel.styles";
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

  return (
    <ClickerContainer>
      {error && <ErrorMessage message={error} />}
      <PointsDisplay>
        <PointsTitle>Points</PointsTitle>
        <PointsValue>{formatBigInt(points)}</PointsValue>
        <input 
          type="number" 
          placeholder="Set points (test)" 
          onChange={handlePointsChange}
          style={{
            marginTop: '8px',
            padding: '8px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #E5E5E5',
            width: '100%'
          }}
        />
      </PointsDisplay>
      
      <StatsContainer>
        <StatRow>
          <StatLabel>Per Second:</StatLabel>
          <StatValue>{formatBigInt(pointsPerSecond)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Click Value:</StatLabel>
          <StatValue>{formatBigInt(clickValue)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Clicks:</StatLabel>
          <StatValue>{totalClicks.toLocaleString()}</StatValue>
        </StatRow>
      </StatsContainer>

      {activeUpgradeDisplays.length > 0 && (
        <ActiveUpgradesContainer>
          <ActiveUpgradesTitle>Active Upgrades</ActiveUpgradesTitle>
          {activeUpgradeDisplays.map((item) => (
            <ActiveUpgradeBadge key={item?.upgradeId}>
              <BadgeLeft>
                <span>{item?.icon}</span>
                <span>{item?.upgradeId}</span>
              </BadgeLeft>
              <BadgeRight>
                <span>{item?.remainingSeconds}s</span>
              </BadgeRight>
            </ActiveUpgradeBadge>
          ))}
        </ActiveUpgradesContainer>
      )}

      <ClickButton onClick={handleClick}>
        CLICK
      </ClickButton>
    </ClickerContainer>
  )
}

export default ClickerPanel
