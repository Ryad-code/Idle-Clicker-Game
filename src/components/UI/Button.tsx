import { StyledButton } from "../../styles/components/button.styles";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

/**
 * A minimal Apple-like button with soft shadows and subtle hover feedback.
 * Designed for white and light-gray UIs.
 */
function Button({ label, onClick }: ButtonProps) {
  return <StyledButton onClick={onClick}>{label}</StyledButton>;
}

export default Button;
