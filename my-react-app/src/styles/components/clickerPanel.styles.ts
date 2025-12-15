import styled from "styled-components";
import { theme } from "../theme";

export const ClickerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

export const PointsDisplay = styled.div`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  width: 100%;
  text-align: center;
`;

export const PointsTitle = styled.h2`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PointsValue = styled.div`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
  font-variant-numeric: tabular-nums;
`;

export const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  width: 100%;
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
`;

export const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;

export const StatLabel = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const StatValue = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
`;

export const ClickButton = styled.button`
  width: 120px;
  height: 120px;
  border-radius: ${theme.radius.full};
  border: none;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover});
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: all ${theme.transition.fast};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(33, 150, 243, 0.3);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: ${theme.shadows.md};
  }
`;

export const ActiveUpgradesContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const ActiveUpgradesTitle = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ActiveUpgradeBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  background: ${theme.colors.muted};
  color: ${theme.colors.textPrimary};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
`;

export const BadgeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

export const BadgeType = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  text-transform: uppercase;
  color: ${theme.colors.textSecondary};
`;

export const BadgeRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-variant-numeric: tabular-nums;
  color: ${theme.colors.textSecondary};
`;
