import styled from "styled-components";
import { theme } from "../theme";

export const StyledButton = styled.button`
  background-color: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  font-family: ${theme.typography.fontFamily};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  user-select: none;
  appearance: none;
  flex-shrink: 0;
  transition: all ${theme.transition.fast};
  box-shadow: ${theme.shadows.sm};

  &:hover {
    background-color: ${theme.colors.background};
    border-color: ${theme.colors.textTertiary};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${theme.shadows.sm};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;
