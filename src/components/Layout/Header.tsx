import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/pixelact-ui/button';
import { useGameStore } from '../../game/gameStore';
import { gameEngine } from '../../game/gameEngine';

function Header() {
  const navigate = useNavigate();
  const syncWithEngine = useGameStore(state => state.syncWithEngine);

  const handleManualSave = async () => {
    await gameEngine.save();
    syncWithEngine();
  };

  return (
    <header className="p-4 border-b-4 border-primary flex items-center justify-between gap-4">
      <div className="flex gap-2">
        <Button onClick={() => navigate('/')}>HOME</Button>
      </div>
      <nav className="flex gap-2">
        <Button onClick={handleManualSave} title="Save">
          💾
        </Button>
        <Button onClick={() => navigate('/stats')}>STATS</Button>
      </nav>
    </header>
  );
}

export default Header;

