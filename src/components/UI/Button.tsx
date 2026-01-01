import { StyledButton } from "../../styles/components/button.styles";
import Tooltip from "./Tooltip";

interface ButtonProps {
  label: string;
  onClick: () => void;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A minimal Apple-like button with soft shadows and subtle hover feedback.
 * Designed for white and light-gray UIs.
 * Optionally displays a tooltip on hover.
 */
function Button({ label, onClick, tooltip, tooltipPosition = 'top' }: ButtonProps) {
  const button = <StyledButton onClick={onClick}>{label}</StyledButton>;
  
  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }
  
  return button;
}

export default Button;
