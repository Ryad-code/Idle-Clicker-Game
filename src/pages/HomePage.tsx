import styled from 'styled-components';
import ClickerPanel from '../components/ClickerPanel';
import UnitPanel from '../components/UnitPanel';
import ShopPanel from '../components/ShopPanel';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0d1117;
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
        <ShopPanel />
      </Grid>
    </Container>
  );
}

export default HomePage;
