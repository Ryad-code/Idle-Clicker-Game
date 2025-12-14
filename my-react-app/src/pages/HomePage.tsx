import styled from 'styled-components';
import { theme } from '../styles/theme';
import ClickerPanel from '../components/ClickerPanel';
import UnitPanel from '../components/UnitPanel';
import ShopPanel from '../components/ShopPanel'

const MainContainer = styled.main`
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl};
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

function HomePage() {

  return (
        <MainContainer>
            <ClickerPanel/>
            <UnitPanel/>
            <ShopPanel/>
        </MainContainer>
  )
}

export default HomePage
