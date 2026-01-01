import React, { useState } from 'react';
import { StyledTooltip, TooltipContainer, TooltipText } from '../../styles/components/tooltip.styles';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A minimal tooltip component that displays hover information consistently across the app.
 * Follows the global design system with subtle shadows and smooth transitions.
 */
function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <StyledTooltip $isVisible={isVisible} $position={position}>
        <TooltipText>{content}</TooltipText>
      </StyledTooltip>
    </TooltipContainer>
  );
}

export default Tooltip;