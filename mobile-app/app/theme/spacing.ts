// Anyway Design System - Spacing & Grid
// 8px Grid System: All spacing should be multiples of 4px or 8px

export const Spacing = {
  xs: 4,      // 4px  - Very small gaps
  sm: 8,      // 8px  - Small padding/margin
  md: 16,     // 16px - Standard padding/margin
  lg: 24,     // 24px - Large padding/margin
  xl: 32,     // 32px - Extra large padding/margin
  xxl: 48,    // 48px - Very large spacing
  xxxl: 64,   // 64px - Maximum spacing
} as const;

export const BorderRadius = {
  sm: 4,      // 4px  - Small elements (badges, tags)
  md: 8,      // 8px  - Cards, buttons
  lg: 12,     // 12px - Large cards
  xl: 16,     // 16px - Modals
  full: 999,  // Pill shape
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const Elevation = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 8,
} as const;
