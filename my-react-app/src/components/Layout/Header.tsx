import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { supabase } from '../../supabaseClient'; // ✅ import supabase

const HeaderContainer = styled.header`
  height: 60px;
  width: 100%;
  display: flex;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: space-between;
`;

const NavBar = styled.nav`
  width: 80%;
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  padding-right: 30px;
`;

const HomeBar = styled.div`
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Header() {
  const navigate = useNavigate();

  // ✅ Logout function
  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/auth'); // redirect to login page
  }

  return (
    <HeaderContainer>
      <HomeBar>
        <Button label="Home" onClick={() => navigate('/')} />
      </HomeBar>
      <NavBar>
        <Button label="Page1" onClick={() => navigate('/page1')} />
        <Button label="Page2" onClick={() => navigate('/page2')} />
        {/* Logout button */}
        <Button label="Logout" onClick={handleLogout} />
      </NavBar>
    </HeaderContainer>
  );
}

export default Header;

