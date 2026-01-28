// Anyway Design System - Typography
// Based on "Engineering Precision" design philosophy

import { TextStyle } from 'react-native';

export const Fonts = {
  // UI Font: System default sans-serif
  ui: 'System',
  // Monospace Font for numbers, IDs, code, and API keys
  mono: 'Courier New', // Fallback to system monospace
};

export const FontSizes = {
  // Type Scale
  h1: 32,      // Page title
  h2: 24,      // Section header
  h3: 20,      // Subsection header
  body: 16,    // Default body text
  bodySmall: 14, // Secondary information
  caption: 12,  // Captions and tiny labels
  mono: 14,     // Monospace for numbers/IDs
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

export const Typography = {
  // Heading Styles
  h1: {
    fontFamily: Fonts.ui,
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h1 * LineHeights.tight,
    color: '#1A1A1A',
  } as TextStyle,

  h2: {
    fontFamily: Fonts.ui,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h2 * LineHeights.tight,
    color: '#1A1A1A',
  } as TextStyle,

  h3: {
    fontFamily: Fonts.ui,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h3 * LineHeights.tight,
    color: '#1A1A1A',
  } as TextStyle,

  // Body Styles
  body: {
    fontFamily: Fonts.ui,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: '#1A1A1A',
  } as TextStyle,

  bodySmall: {
    fontFamily: Fonts.ui,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: '#666666',
  } as TextStyle,

  bodyBold: {
    fontFamily: Fonts.ui,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.body * LineHeights.normal,
    color: '#1A1A1A',
  } as TextStyle,

  // Caption Styles
  caption: {
    fontFamily: Fonts.ui,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.caption * LineHeights.normal,
    color: '#999999',
  } as TextStyle,

  // Monospace Styles (for numbers, IDs, code, API keys)
  mono: {
    fontFamily: Fonts.mono,
    fontSize: FontSizes.mono,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.mono * LineHeights.normal,
    color: '#1A1A1A',
  } as TextStyle,

  monoSmall: {
    fontFamily: Fonts.mono,
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.bodySmall * LineHeights.normal,
    color: '#666666',
  } as TextStyle,
} as const;
