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
  const { player, click } = useGame();

  return (
    <ClickerContainer>
      <PointsDisplay>
        <PointsTitle>Points</PointsTitle>
        <PointsValue>{Math.floor(player.points).toLocaleString()}</PointsValue>
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
