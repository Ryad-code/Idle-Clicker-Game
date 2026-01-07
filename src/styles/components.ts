import styled from "styled-components";
import { theme } from "./theme";

// ============================================================================
// LAYOUT
// ============================================================================

export const LayoutContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
`;

export const HeaderContainer = styled.header`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.panel};
  border-bottom: 4px solid ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

export const NavBar = styled.nav`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const HomeBar = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const BodyContainer = styled.main`
  flex: 1;
  overflow: auto;
`;

export const FooterContainer = styled.footer<{ $isVisible: boolean }>`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.panel};
  border-top: 4px solid ${theme.colors.primary};
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
  justify-content: center;
`;

// ============================================================================
// BUTTONS
// ============================================================================

export const Button = styled.button<{ 
  $variant?: 'primary' | 'success' | 'danger';
  $disabled?: boolean;
  $fullWidth?: boolean;
}>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  background: ${props => {
    if (props.$disabled) return theme.colors.text;
    if (props.$variant === 'success') return theme.colors.success;
    if (props.$variant === 'danger') return theme.colors.danger;
    return theme.colors.primary;
  }};
  color: ${props => props.$disabled ? theme.colors.text : theme.colors.text};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  &:hover {
    background: ${props => {
      if (props.$disabled) return theme.colors.text;
      if (props.$variant === 'success') return theme.colors.success;
      if (props.$variant === 'danger') return theme.colors.danger;
      return theme.colors.primary;
    }};
    opacity: ${props => props.$disabled ? 0.5 : 0.8};
  }
`;

// ============================================================================
// CLICKER PANEL
// ============================================================================

export const ClickerContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing.md};
  align-items: center;
`;

export const PointsDisplay = styled.div`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.panel};
  text-align: center;
`;

export const PointsValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: ${theme.colors.success};
  text-shadow: 2px 2px 0px rgba(0, 255, 0, 0.3);
`;

export const StatsContainer = styled.div`
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.panel};
`;

export const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${theme.spacing.sm} 0;
  font-size: 10px;
  padding: 4px 0;
`;

export const ClickButton = styled.button`
  width: 100px;
  height: 100px;
  border: none;
  background: ${theme.colors.primary};
  color: white;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    opacity: 0.8;
  }
`;

export const ActiveUpgradesContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.panel};
  padding: ${theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const ActiveUpgradeBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
  background: ${theme.colors.panel};
  border: 2px solid ${theme.colors.secondary};
  color: ${theme.colors.text};
  padding: ${theme.spacing.sm};
  font-size: 10px;
`;

// ============================================================================
// SHOP PANELS
// ============================================================================

export const ShopContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ShopSection = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h3`
  margin: ${theme.spacing.md} 0 ${theme.spacing.sm};
`;

// ============================================================================
// UNIT DISPLAYS
// ============================================================================

export const UnitRow = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  margin-bottom: 8px;
`;

export const UnitRowButton = styled.button<{ 
  $variant?: 'buy' | 'sell';
  $disabled?: boolean;
}>`
  padding: ${theme.spacing.sm};
  border: 2px solid transparent;
  background: ${props => {
    if (props.$disabled) return theme.colors.panel;
    return props.$variant === 'sell' ? theme.colors.danger : theme.colors.success;
  }};
  color: ${props => props.$disabled ? theme.colors.border : theme.colors.text};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  width: ${props => props.$variant === 'sell' ? '33.33%' : '100%'};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 10px;

  &:hover {
    background: ${props => {
      if (props.$disabled) return theme.colors.panel;
      return props.$variant === 'sell' ? theme.colors.danger : theme.colors.success;
    }};
    border-color: ${props => props.$disabled ? 'transparent' : theme.colors.text};
  }
`;

export const GridContainer = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 48px);
  grid-template-rows: repeat(${props => props.size}, 48px);
  gap: 3px;
  margin: ${theme.spacing.md} 0;
`;

export const GridCell = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background-color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
`;

export const UnitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

export const StatBox = styled.div`
  padding: ${theme.spacing.sm};
  margin: ${theme.spacing.sm} 0;
  background-color: ${theme.colors.panel};
`;

// ============================================================================
// UPGRADES
// ============================================================================

export const UpgradeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing.md};
`;

export const UpgradeCard = styled.div`
  padding: ${theme.spacing.md};
  background-color: #2d2416;
  text-align: center;
`;

// ============================================================================
// UTILITY
// ============================================================================

export const EmptyState = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  background-color: #2a2e33;
`;
