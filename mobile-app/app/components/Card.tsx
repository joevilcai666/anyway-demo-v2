// Card Component - Glassmorphism style card
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing, BorderRadius, Shadows } from '../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = Spacing.md,
}) => {
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          ...Shadows.md,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: '#E0E0E0',
        };
      default:
        return {};
    }
  };

  return (
    <View style={[styles.card, getCardStyle(), { padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
  },
});
