import styled from 'styled-components';
import Clicker from '../components/Clicker';
import Home from '../components/Home';
import Dashboard from '../components/Dashboard'

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
        <MainContainer>
            <Clicker/>
            <Home/>
            <Dashboard/>
        </MainContainer>
  )
}

export default HomePage
