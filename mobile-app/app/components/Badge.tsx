// Badge Component - Status indicators
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, FontSizes } from '../theme/spacing';

type BadgeVariant = 'success' | 'failed' | 'running' | 'warning' | 'draft' | 'published' | 'archived';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'draft',
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
      case 'published':
        return {
          backgroundColor: Colors.semantic.success.background,
          color: Colors.semantic.success.text,
        };
      case 'failed':
        return {
          backgroundColor: Colors.semantic.error.background,
          color: Colors.semantic.error.text,
        };
      case 'running':
        return {
          backgroundColor: Colors.semantic.running.background,
          color: Colors.semantic.running.text,
        };
      case 'warning':
        return {
          backgroundColor: Colors.semantic.warning.background,
          color: Colors.semantic.warning.text,
        };
      case 'draft':
      case 'archived':
      default:
        return {
          backgroundColor: '#F5F5F5',
          color: '#757575',
        };
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBadgeStyle().backgroundColor }]}>
      <Text style={[styles.text, { color: getBadgeStyle().color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
