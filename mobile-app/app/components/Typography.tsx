// Text Component - Typography system
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Typography } from '../theme/typography';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'bodyBold' | 'caption' | 'mono' | 'monoSmall';

interface TypographyProps {
  variant?: TextVariant;
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  numberOfLines?: number;
}

export const TypographyText: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  style,
  color,
  numberOfLines,
}) => {
  const getTextStyle = (): TextStyle => {
    const baseStyle = {
      ...Typography[variant],
    };

    if (color) {
      baseStyle.color = color;
    }

    return baseStyle;
  };

  return (
    <Text style={[getTextStyle(), style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

// Convenience exports
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="h1" {...props} />
);
export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="h2" {...props} />
);
export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="h3" {...props} />
);
export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="body" {...props} />
);
export const BodySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="bodySmall" {...props} />
);
export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="caption" {...props} />
);
export const Mono: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="mono" {...props} />
);
export const MonoSmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <TypographyText variant="monoSmall" {...props} />
);
