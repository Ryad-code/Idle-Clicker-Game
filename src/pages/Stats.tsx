import styled from 'styled-components';
import { theme } from '../styles/theme';
import { useGameStore } from '../game/gameStore';
import { formatBigInt } from '../utils/formatters';
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

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};

  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};

  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize.lg};
  }
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
            <StatValue>{formatBigInt(points)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Total Clicks</StatLabel>
            <StatValue>{totalClicks.toLocaleString()}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Points Per Second</StatLabel>
            <StatValue>{formatBigInt(pointsPerSecond)}</StatValue>
          </StatCard>

          <StatCard>
            <StatLabel>Click Value</StatLabel>
            <StatValue>{formatBigInt(clickValue)}</StatValue>
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