import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../UI/Button';
import { supabase } from '../../supabaseClient';
import { useGameStore } from '../../game/gameStore';
import { gameEngine } from '../../game/gameEngine';
import { HeaderContainer, NavBar, HomeBar } from '../../styles/components';
import { theme } from '../../styles/theme';

const SaveIconButton = styled.button`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.primary};
  color: white;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

function Header() {
  const navigate = useNavigate();
  const syncWithEngine = useGameStore(state => state.syncWithEngine);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/auth');
  }

  const handleManualSave = async () => {
    await gameEngine.save();
    syncWithEngine();
  };

  return (
    <HeaderContainer>
      <HomeBar>
        <Button label="Home" onClick={() => navigate('/')} />
      </HomeBar>
      <NavBar>
        <SaveIconButton onClick={handleManualSave} title="Save">
          💾
        </SaveIconButton>
        <Button label="Stats" onClick={() => navigate('/stats')} />
        <Button label="Logout" onClick={handleLogout} />
      </NavBar>
    </HeaderContainer>
  );
}

export default Header;

