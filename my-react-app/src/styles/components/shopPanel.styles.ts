import styled from "styled-components";
import { theme } from "../theme";

export const DashboardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
`;

export const ActionButton = styled.button<{ $disabled?: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  border-radius: ${theme.radius.md};
  border: 1px solid ${props => props.$disabled ? theme.colors.border : theme.colors.success};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.4 : 1};
  transition: all ${theme.transition.fast};
  background: ${props => props.$disabled ? theme.colors.background : theme.colors.success};
  color: ${props => props.$disabled ? theme.colors.textTertiary : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &:hover {
    background: ${props => props.$disabled ? theme.colors.background : theme.colors.successHover};
    border-color: ${props => props.$disabled ? theme.colors.border : theme.colors.successHover};
    transform: ${props => props.$disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.$disabled ? 'none' : theme.shadows.md};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'translateY(0)'};
  }
`;

export const SellButton = styled(ActionButton)`
  background: ${props => props.$disabled ? theme.colors.background : theme.colors.error};
  border-color: ${props => props.$disabled ? theme.colors.border : theme.colors.error};
  
  &:hover {
    background: ${props => props.$disabled ? theme.colors.background : theme.colors.errorHover};
    border-color: ${props => props.$disabled ? theme.colors.border : theme.colors.errorHover};
  }
`;

export const ButtonLabel = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const ButtonPrice = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  background: rgba(0, 0, 0, 0.15);
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
`;

export const ButtonInfo = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  opacity: 0.7;
`;

export const SectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin: ${theme.spacing.md} 0 ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:first-child {
    margin-top: 0;
  }
`;

export const UnitRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: stretch;
`;

export const BuyButton = styled.button<{ $disabled?: boolean }>`
  flex: 2;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  border-radius: ${theme.radius.md};
  border: 1px solid ${props => props.$disabled ? theme.colors.border : theme.colors.success};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.4 : 1};
  transition: all ${theme.transition.fast};
  background: ${props => props.$disabled ? theme.colors.background : theme.colors.success};
  color: ${props => props.$disabled ? theme.colors.textTertiary : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${props => props.$disabled ? theme.colors.background : theme.colors.successHover};
    border-color: ${props => props.$disabled ? theme.colors.border : theme.colors.successHover};
    transform: ${props => props.$disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.$disabled ? 'none' : theme.shadows.md};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'translateY(0)'};
  }
`;

export const SmallSellButton = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  border-radius: ${theme.radius.md};
  border: 1px solid ${props => props.$disabled ? theme.colors.border : theme.colors.error};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.4 : 1};
  transition: all ${theme.transition.fast};
  background: ${props => props.$disabled ? theme.colors.background : theme.colors.error};
  color: ${props => props.$disabled ? theme.colors.textTertiary : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.$disabled ? theme.colors.background : theme.colors.errorHover};
    border-color: ${props => props.$disabled ? theme.colors.border : theme.colors.errorHover};
    transform: ${props => props.$disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.$disabled ? 'none' : theme.shadows.md};
  }

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'translateY(0)'};
  }
`;

export const SaveButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.md};
  cursor: pointer;
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  font-family: ${theme.typography.fontFamily};
  transition: all ${theme.transition.fast};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  align-self: center;

  &:hover {
    background: ${theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;
