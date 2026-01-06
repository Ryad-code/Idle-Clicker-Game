import styled from 'styled-components';
import ClickerPanel from '../components/ClickerPanel';
import UnitPanel from '../components/UnitPanel';
import DashboardPanel from '../components/DashboardPanel';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('/Gemini_Generated_Image_6tbrs96tbrs96tbr.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    & > *:last-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

function HomePage() {
  return (
    <Container>
      <Grid>
        <ClickerPanel />
        <UnitPanel />
        <DashboardPanel />
      </Grid>
    </Container>
  );
}

export default HomePage;
