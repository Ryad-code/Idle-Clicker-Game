import { useGameStore } from '../game/gameStore';
import { formatDecimal } from '../utils/formatters';
import { useEffect, useState } from 'react';
import { Unit } from '../game/core/types';
import { Card } from 'pixel-retroui';

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
  backgroundColor: '#0a0a0a',
};

const statsContainerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '24px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#00ff00',
  marginBottom: '24px',
  textShadow: '2px 2px 0px rgba(0, 255, 0, 0.3)',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(2, 1fr)',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#888',
  marginBottom: '8px',
};

const statValueStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#00ff00',
};

function Stats() {
  const points = useGameStore(state => state.points);
  const pointsPerSecond = useGameStore(state => state.pointsPerSecond);
  const clickValue = useGameStore(state => state.clickValue);
  const totalClicks = useGameStore(state => state.totalClicks);
  const createdAt = useGameStore(state => state.createdAt);
  const grid = useGameStore(state => state.grid);
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const updateDuration = () => {
      const elapsed = Date.now() - createdAt.getTime();
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      if (days > 0) {
        setDuration(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else if (hours > 0) {
        setDuration(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setDuration(`${minutes}m ${seconds}s`);
      } else {
        setDuration(`${seconds}s`);
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div style={containerStyle}>
      <div style={statsContainerStyle}>
        <h1 style={titleStyle}>Game Statistics</h1>
        <div style={statsGridStyle}>
          <Card>
            <div style={statLabelStyle}>Game Duration</div>
            <div style={statValueStyle}>{duration}</div>
          </Card>

          <Card>
            <div style={statLabelStyle}>Total Points Earned</div>
            <div style={statValueStyle}>{formatDecimal(points)}</div>
          </Card>

          <Card>
            <div style={statLabelStyle}>Total Clicks</div>
            <div style={statValueStyle}>{totalClicks.toLocaleString()}</div>
          </Card>

          <Card>
            <div style={statLabelStyle}>Points Per Second</div>
            <div style={statValueStyle}>{formatDecimal(pointsPerSecond)}</div>
          </Card>

          <Card>
            <div style={statLabelStyle}>Click Value</div>
            <div style={statValueStyle}>{formatDecimal(clickValue)}</div>
          </Card>

          <Card>
            <div style={statLabelStyle}>Total Units Owned</div>
            <div style={statValueStyle}>{grid.flat().filter((u): u is Unit => u !== null).length.toLocaleString()}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Stats;