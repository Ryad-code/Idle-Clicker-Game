import { useGame } from "../contexts";
import { UPGRADES, getUpgradeKind } from "../game/upgradeConfig";
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
  const { player, click, setPoints, error } = useGame();
  const activeUpgrades = (() => {
    const now = Date.now();
    const byId = new Map(UPGRADES.map(u => [u.id, u]));
    return (player.activeUpgrades || [])
      .map(pu => {
        const upgrade = byId.get(pu.upgradeId);
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
      .filter(Boolean) as Array<ReturnType<typeof Object.assign> & { kind: 'production' | 'click'; remainingSeconds: number }>;
  })();

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPoints(value);
    }
  };

  return (
    <ClickerContainer>
      {error && <ErrorMessage message={error} />}
      <PointsDisplay>
        <PointsTitle>Points</PointsTitle>
        <PointsValue>{Math.floor(player.points).toLocaleString()}</PointsValue>
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
          <StatValue>{player.calculatePointsPerSecond()}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Click Value:</StatLabel>
          <StatValue>{player.clickValue}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Clicks:</StatLabel>
          <StatValue>{player.totalClicks.toLocaleString()}</StatValue>
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
