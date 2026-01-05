/**
 * Pixel Art Retro Theme
 */

export const theme = {
  colors: {
    background: '#BA8AA3',
    text: '#D7A9A1',
    border: '#27495D',
    primary: '#747CA7',
    secondary: '#B2EDF2',
    danger: '#B2EDF2',
    success: '#F56363',
    panel: '#B2EDF2',
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
