import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useGameStore } from '../game/gameStore';
import { formatDecimal } from '../utils/formatters';
import { useEffect, useState } from 'react';
import { Unit } from '../game/core/types';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StatsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
  grid-template-columns: repeat(2, 1fr);
`;

const StatCard = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: ${theme.spacing.sm};
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

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
    <Container>
      <StatsContainer>
        <Title>Game Statistics</Title>
        <StatsGrid>
          <StatCard>
            <StatLabel>Game Duration</StatLabel>
            <StatValue>{duration}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Total Points Earned</StatLabel>
            <StatValue>{formatDecimal(points)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Total Clicks</StatLabel>
            <StatValue>{totalClicks.toLocaleString()}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Points Per Second</StatLabel>
            <StatValue>{formatDecimal(pointsPerSecond)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Click Value</StatLabel>
            <StatValue>{formatDecimal(clickValue)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Total Units Owned</StatLabel>
            <StatValue>{grid.flat().filter((u): u is Unit => u !== null).length.toLocaleString()}</StatValue>
          </StatCard>
        </StatsGrid>
      </StatsContainer>
    </Container>
  );
}

export default Stats;