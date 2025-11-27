import styled from 'styled-components';
import Clicker from '../components/Clicker';
import Home from '../components/Home';
import Dashboard from '../components/Dashboard'
import { ClickerProvider } from '../contexts/ClickerContext';
import { UnitsProvider } from '../contexts/UnitsContext';

const MainContainer = styled.main`
  background-color: white;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  padding-top: 50px;;
`;

function HomePage() {

  return (
    <ClickerProvider>
      <UnitsProvider>
        <MainContainer>
            <Clicker/>
            <Home/>
            <Dashboard/>
        </MainContainer>
      </UnitsProvider>
    </ClickerProvider>
  )
}

export default HomePage
