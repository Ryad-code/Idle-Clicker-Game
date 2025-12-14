import { useGame } from "../contexts";
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
} from "../styles/components/clicker.styles";

function Clicker() {
  const { player, click, setPoints } = useGame();

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPoints(value);
    }
  };

  return (
    <ClickerContainer>
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

      <ClickButton onClick={click}>
        CLICK
      </ClickButton>
    </ClickerContainer>
  )
}

export default Clicker
