export const UnitRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  align-items: center;
`;

export const GridContainer = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 32px);
  grid-template-rows: repeat(${props => props.size}, 32px);
  gap: 2px;
  margin: 16px 0;
`;

import styled from "styled-components";
import { theme } from "../theme";

export const GridUnitCard = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background-color: ${props => props.$color};
  color: ${theme.colors.white};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid #bbb;
  transition: all ${theme.transition.fast};
  &:hover {
    transform: scale(1.08);
    z-index: 1;
  }
`;

export const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
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


