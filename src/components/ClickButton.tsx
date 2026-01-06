import { useGameStore } from "../game/gameStore";
import { gameEngine } from "../game/gameEngine";

function ClickButton() {
  const syncWithEngine = useGameStore(state => state.syncWithEngine);

  const handleClick = () => {
    gameEngine.click();
    syncWithEngine();
  };

  return (
    <div 
      onClick={handleClick} 
    >
      <img 
        src="/play_button.png" 
        alt="Play Button" 
        style={{ width: '64px', height: '64px' }} 
      />
    </div>
  );
}

export default ClickButton;
