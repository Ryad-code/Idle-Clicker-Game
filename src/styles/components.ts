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
  background-color: #111111;
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
  background-color: #111111;
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
    if (props.$disabled) return '#f0f0f0';
    if (props.$variant === 'success') return '#00aa00';
    if (props.$variant === 'danger') return '#cc0000';
    return theme.colors.primary;
  }};
  color: ${props => props.$disabled ? '#999' : 'white'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  &:hover {
    background: ${props => {
      if (props.$disabled) return '#f0f0f0';
      if (props.$variant === 'success') return '#008800';
      if (props.$variant === 'danger') return '#aa0000';
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
  background-color: #0a0a0a;
  padding: ${theme.spacing.md};
  align-items: center;
`;

export const PointsDisplay = styled.div`
  padding: ${theme.spacing.md};
  background-color: #2d3e50;
  text-align: center;
`;

export const PointsValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.primary};
  text-shadow: 2px 2px 0px rgba(0, 255, 0, 0.3);
`;

export const StatsContainer = styled.div`
  padding: ${theme.spacing.md};
  background-color: #252d3a;
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
  background-color: #2a1f1f;
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
  background: #222222;
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
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ShopSection = styled.div`
  flex: 1;
  min-height: 0;
  background-color: #111111;
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
  height: 60px;
  background-color: #1a1a1a;
  border: 2px solid #333333;
  margin-bottom: 4px;
`;

export const UnitRowButton = styled.button<{ 
  $variant?: 'buy' | 'sell';
  $disabled?: boolean;
}>`
  padding: ${theme.spacing.sm};
  border: 2px solid transparent;
  background: ${props => {
    if (props.$disabled) return '#222222';
    return props.$variant === 'sell' ? '#cc0000' : '#00aa00';
  }};
  color: ${props => props.$disabled ? '#666' : '#ffffff'};
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
      if (props.$disabled) return '#222222';
      return props.$variant === 'sell' ? '#aa0000' : '#008800';
    }};
    border-color: ${props => props.$disabled ? 'transparent' : '#ffffff'};
  }
`;

export const GridContainer = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 32px);
  grid-template-rows: repeat(${props => props.size}, 32px);
  gap: 2px;
  margin: ${theme.spacing.md} 0;
`;

export const GridCell = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  background-color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UnitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.md};
  background-color: #1e2f3d;
  margin-bottom: ${theme.spacing.md};
`;

export const StatBox = styled.div`
  padding: ${theme.spacing.sm};
  margin: ${theme.spacing.sm} 0;
  background-color: #1e2f3d;
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
// AUTH PAGE
// ============================================================================

export const AuthContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at 20% 20%, #222 0, #111 50%, #0b0b0b 100%);
  color: #f5f5f5;
  padding: ${theme.spacing.md};
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 360px;
  padding: ${theme.spacing.lg};
  border-radius: 16px;
  background: #151515;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    padding: 20px;
    gap: 12px;
  }
`;

export const AuthInput = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #f5f5f5;
  font-size: 15px;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;

  &:focus {
    border-color: #5dd0ff;
    box-shadow: 0 0 0 3px rgba(93, 208, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const AuthButton = styled.button<{ $variant?: 'ghost' | 'solid' }>`
  flex: 1;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ $variant }) => ($variant === 'ghost' ? 'rgba(255, 255, 255, 0.25)' : '#5dd0ff')};
  background: ${({ $variant }) => ($variant === 'ghost' ? 'transparent' : 'linear-gradient(135deg, #5dd0ff, #4ba3f5)')};
  color: ${({ $variant }) => ($variant === 'ghost' ? '#e0e0e0' : '#0b0b0b')};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 120ms ease, background 150ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  }
`;

// ============================================================================
// UTILITY
// ============================================================================

export const EmptyState = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  background-color: #2a2e33;
`;
