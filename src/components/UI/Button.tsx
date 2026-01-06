import { Button as PixelButton } from 'pixel-retroui';

interface ButtonProps {
  label: string;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
  variant?: 'primary' | 'success' | 'danger';
}

/**
 * Pixel art styled button using pixel-retroui.
 */
function Button({ label, onClick, tooltip, disabled }: ButtonProps) {
  return (
    <PixelButton 
      onClick={onClick} 
      title={tooltip}
      disabled={disabled}
    >
      {label}
    </PixelButton>
  );
}

export default Button;
