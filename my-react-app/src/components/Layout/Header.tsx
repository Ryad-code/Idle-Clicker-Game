import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { supabase } from '../../supabaseClient';
import { HeaderContainer, NavBar, HomeBar } from '../../styles/components/layout.styles';

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
        <Button label="Logout" onClick={handleLogout} />
      </NavBar>
    </HeaderContainer>
  );
}

export default Header;

