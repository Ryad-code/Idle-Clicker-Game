import styled from "styled-components";

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

const StyledButton = styled.button`
  background-color: #f9f9f9; /* gentle contrast on white */
  color: #333;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  appearance: none;
  flex-shrink: 0;
  transition: all 0.2s ease;

  /* soft lighting: highlight on top, shadow below */
  /*box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 1px 3px rgba(0, 0, 0, 0.08);
*/
  &:hover {
    background-color: #f2f2f2;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      0 2px 5px rgba(0, 0, 0, 0.12);
  }

  &:active {
    background-color: #eaeaea;
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.05);
    transform: translateY(1px); /* slight press feedback */
  }

  &:focus {
    outline: none;
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.08);
  }
`;

