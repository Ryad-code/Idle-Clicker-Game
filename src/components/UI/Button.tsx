import { Button as StyledButton } from "../../styles/components";

interface ButtonProps {
  label: string;
  onClick: () => void;
  tooltip?: string;
}

/**
 * A minimal Apple-like button with soft shadows and subtle hover feedback.
 * Designed for white and light-gray UIs.
 * Optionally displays a tooltip on hover.
 */
function Button({ label, onClick, tooltip }: ButtonProps) {
  return <StyledButton onClick={onClick} title={tooltip}>{label}</StyledButton>;
}

export default Button;
