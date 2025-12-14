import styled from "styled-components";
import { theme } from "../theme";

export const HomeContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const UnitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: ${theme.spacing.sm};
  width: 100%;
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
`;

export const UnitCard = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.xl};
  background-color: ${props => props.$color};
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transition.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

export const UnitStats = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
`;

export const StatBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.background};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const StatEmoji = styled.span`
  font-size: ${theme.typography.fontSize.lg};
`;

export const EmptyState = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.textTertiary};
  font-size: ${theme.typography.fontSize.sm};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.radius.lg};
  border: 1px solid ${theme.colors.border};
`;

export const Title = styled.h2`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

export const Subtitle = styled.h3`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  margin: 0;
`;
