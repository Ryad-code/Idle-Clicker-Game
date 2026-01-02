/**
 * Design System - Minimalistic Theme
 * Single source of truth for colors, spacing, and design tokens
 */

export const theme = {
  // Color palette - minimal, clean
  colors: {
    // Neutrals
    white: '#FFFFFF',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#E5E5E5',
    muted: '#F5F5F5',
    
    // Text
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Accent
    primary: '#2196F3',
    primaryHover: '#1976D2',
    
    // Semantic
    success: '#4CAF50',
    successHover: '#388E3C',
    error: '#F44336',
    errorHover: '#D32F2F',
    warning: '#FF9800',
  },
  
  // Spacing scale (8px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Border radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows - subtle
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 8px rgba(0, 0, 0, 0.08)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.12)',
  },
  
  // Transitions
  transition: {
    fast: '150ms ease',
    base: '200ms ease',
    slow: '300ms ease',
  },
};

export type Theme = typeof theme;
