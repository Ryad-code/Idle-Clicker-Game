import styled from 'styled-components';
import { theme } from '../styles/theme';
import ClickerPanel from '../components/ClickerPanel';
import UnitPanel from '../components/UnitPanel';
import ShopPanel from '../components/ShopPanel';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Grid = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    & > *:last-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.md};
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
