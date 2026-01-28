// Anyway Design System - Color Palette
// Based on "Engineering Precision" design philosophy

export const Colors = {
  // Brand Colors
  brand: {
    yellow: '#FFD500',      // Anyway Yellow - Primary brand color
    black: '#000000',       // Accent Black - Primary text and buttons
  },

  // Semantic Colors
  semantic: {
    success: {
      background: '#E8F5E9',
      text: '#2E7D32',
    },
    error: {
      background: '#FFEBEE',
      text: '#C62828',
    },
    running: {
      background: '#E3F2FD',
      text: '#1976D2',
    },
    warning: {
      background: '#FFF3E0',
      text: '#F57C00',
    },
  },

  // Neutrals
  neutral: {
    surface: '#FFFFFF',      // Pure white for cards and backgrounds
    surfaceAlt: '#FAFAFA',   // Very light gray for alternating backgrounds
    border: '#E0E0E0',       // Light gray for borders and dividers
    text: {
      primary: '#1A1A1A',   // Near black for headings and body
      secondary: '#666666', // Dark gray for secondary information
      tertiary: '#999999',  // Light gray for placeholders and disabled
    },
    overlay: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },

  // Button Colors
  button: {
    primary: {
      background: '#000000',
      text: '#FFFFFF',
      disabled: '#CCCCCC',
    },
    secondary: {
      background: 'transparent',
      text: '#1A1A1A',
      border: '#E0E0E0',
    },
    ghost: {
      background: 'transparent',
      text: '#1A1A1A',
      hover: '#F5F5F5',
    },
  },

  // Card Colors
  card: {
    background: '#FFFFFF',
    border: '#E0E0E0',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },

  // Status Colors for Badges
  status: {
    success: '#2E7D32',
    failed: '#C62828',
    running: '#1976D2',
    draft: '#757575',
    published: '#2E7D32',
    archived: '#9E9E9E',
  },
} as const;

export type ColorKeys = typeof Colors;
