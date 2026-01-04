/**
 * Pixel Art Retro Theme
 */

export const theme = {
  colors: {
    background: '#000000',
    text: '#ffffff',
    border: '#444444',
    primary: '#00ff00',
    secondary: '#0099ff',
    danger: '#ff0033',
    success: '#00ff00',
    panel: '#1a1a1a',
  },
  
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  
  fonts: {
    pixel: '"Press Start 2P", monospace',
  },
};

export type Theme = typeof theme;
