import styled from 'styled-components';
import { theme } from '../styles/theme';
import Clicker from '../components/Clicker';
import Home from '../components/Home';
import Dashboard from '../components/Dashboard'

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
            <Clicker/>
            <Home/>
            <Dashboard/>
        </MainContainer>
  )
}

export default HomePage
