import { useGameState, useGameActions } from "../contexts";
import { getUpgradeKind, UPGRADES } from "../game/config/upgrades";
import { 
  ClickerContainer, 
  PointsDisplay, 
  PointsTitle, 
  PointsValue,
  StatsContainer,
  StatRow,
  StatLabel,
  StatValue,
  ClickButton
  ,
  ActiveUpgradesContainer,
  ActiveUpgradesTitle,
  ActiveUpgradeBadge,
  BadgeLeft,
  BadgeType,
  BadgeRight
} from "../styles/components/clickerPanel.styles";
import ErrorMessage from "./UI/ErrorMessage";

function ClickerPanel() {
  const { currency, production, upgrades, ui } = useGameState();
  const { click, setPoints } = useGameActions();
  
  // Format active upgrades for display with remaining time
  const now = Date.now();
  const upgradeMap = new Map(UPGRADES.map(u => [u.id, u]));
  
  const activeUpgrades = upgrades.active
    .map(pu => {
      const upgrade = upgradeMap.get(pu.upgradeId);
      if (!upgrade) return null;
      
      const expiresAt = pu.purchasedAt.getTime() + upgrade.durationSeconds * 1000;
      const remainingMs = expiresAt - now;
      if (remainingMs <= 0) return null;
      
      return {
        ...upgrade,
        kind: getUpgradeKind(upgrade.id),
        remainingSeconds: Math.ceil(remainingMs / 1000),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPoints(value);
    }
  };

  return (
    <ClickerContainer>
      {ui.error && <ErrorMessage message={ui.error} />}
      <PointsDisplay>
        <PointsTitle>Points</PointsTitle>
        <PointsValue>{Math.floor(currency.points).toLocaleString()}</PointsValue>
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
          <StatValue>{Math.floor(production.pointsPerSecond)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Click Value:</StatLabel>
          <StatValue>{Math.floor(production.clickValue)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Clicks:</StatLabel>
          <StatValue>{currency.totalClicks.toLocaleString()}</StatValue>
        </StatRow>
      </StatsContainer>

      {activeUpgrades.length > 0 && (
        <ActiveUpgradesContainer>
          <ActiveUpgradesTitle>Active Upgrades</ActiveUpgradesTitle>
          {activeUpgrades.map(upgrade => (
            <ActiveUpgradeBadge key={upgrade.id}>
              <BadgeLeft>
                <span>{upgrade.icon}</span>
                <span>{upgrade.name}</span>
                <BadgeType>{upgrade.kind}</BadgeType>
              </BadgeLeft>
              <BadgeRight>
                <span>×{upgrade.multiplier}</span>
                <span>{upgrade.remainingSeconds}s</span>
              </BadgeRight>
            </ActiveUpgradeBadge>
          ))}
        </ActiveUpgradesContainer>
      )}

      <ClickButton onClick={click}>
        CLICK
      </ClickButton>
    </ClickerContainer>
  )
}

export default ClickerPanel
