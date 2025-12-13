import styled from "styled-components";
import { theme } from "../theme";

export const LayoutContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background};
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.textPrimary};
`;

export const HeaderContainer = styled.header`
  height: 64px;
  width: 100%;
  display: flex;
  background-color: ${theme.colors.surface};
  box-shadow: ${theme.shadows.sm};
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
`;

export const NavBar = styled.nav`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

export const HomeBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.textPrimary};
`;

export const BodyContainer = styled.main`
  background-color: ${theme.colors.background};
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: ${theme.spacing.lg};
  overflow-y: auto;
`;

export const FooterContainer = styled.footer<{ visible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  background-color: ${theme.colors.surface};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform ${theme.transition.slow};
  transform: ${({ visible }) => (visible ? "translateY(0)" : "translateY(100%)")};
  z-index: 1000;
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.textTertiary};
  border-top: 1px solid ${theme.colors.border};
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
`;

export const HoverZone = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 999;
`;
