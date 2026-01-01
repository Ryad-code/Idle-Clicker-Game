import styled from "styled-components";
import { theme } from "../theme";

interface StyledTooltipProps {
  $isVisible: boolean;
  $position: 'top' | 'bottom' | 'left' | 'right';
}

export const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledTooltip = styled.div<StyledTooltipProps>`
  position: absolute;
  background-color: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.normal};
  font-family: ${theme.typography.fontFamily};
  box-shadow: ${theme.shadows.md};
  z-index: 1000;
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: opacity ${theme.transition.fast}, visibility ${theme.transition.fast};
  white-space: normal;
  max-width: 400px;
  min-width: 200px;
  word-wrap: break-word;
  text-align: left;

  ${({ $position }) => {
    switch ($position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-${theme.spacing.xs});
          margin-bottom: ${theme.spacing.xs};
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(${theme.spacing.xs});
          margin-top: ${theme.spacing.xs};
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-${theme.spacing.xs});
          margin-right: ${theme.spacing.xs};
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(${theme.spacing.xs});
          margin-left: ${theme.spacing.xs};
        `;
      default:
        return '';
    }
  }}

  /* Arrow for the tooltip */
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;

    ${({ $position }) => {
      switch ($position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: ${theme.spacing.sm} ${theme.spacing.sm} 0 ${theme.spacing.sm};
            border-color: ${theme.colors.border} transparent transparent transparent;
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm};
            border-color: transparent transparent ${theme.colors.border} transparent;
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: ${theme.spacing.sm} 0 ${theme.spacing.sm} ${theme.spacing.sm};
            border-color: transparent transparent transparent ${theme.colors.border};
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-width: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} 0;
            border-color: transparent ${theme.colors.border} transparent transparent;
          `;
        default:
          return '';
      }
    }}
  }
`;

export const TooltipText = styled.span`
  display: block;
  line-height: 1.5;
  text-align: left;
`;