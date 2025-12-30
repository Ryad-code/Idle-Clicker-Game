import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../UI/Button';
import { supabase } from '../../supabaseClient';
import { useGameActions } from '../../contexts';
import { HeaderContainer, NavBar, HomeBar } from '../../styles/components/layout.styles';
import { theme } from '../../styles/theme';

const SaveIconButton = styled.button`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.radius.md};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.lg};
  cursor: pointer;
  transition: all ${theme.transition.fast};
  font-family: ${theme.typography.fontFamily};

  &:hover {
    background: ${theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

function Header() {
  const navigate = useNavigate();
  const { save } = useGameActions();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/auth');
  }

  const handleManualSave = async () => {
    await save();
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
        <Button label="Page2" onClick={() => navigate('/page2')} />
        <Button label="Logout" onClick={handleLogout} />
      </NavBar>
    </HeaderContainer>
  );
}

export default Header;

