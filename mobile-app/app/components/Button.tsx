// Button Component - 3 variants: primary, secondary, ghost
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSizes } from '../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      opacity: disabled || loading ? 0.5 : 1,
    };

    const variantStyle = {
      primary: {
        backgroundColor: Colors.button.primary.background,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: Colors.button.secondary.background,
        borderWidth: 1,
        borderColor: Colors.button.secondary.border,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    }[variant];

    const sizeStyle = {
      sm: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
      },
      md: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
      },
      lg: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
      },
    }[size];

    return {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      width: fullWidth ? '100%' : 'auto',
    };
  };

  const getTextStyle = () => {
    const color = {
      primary: Colors.button.primary.text,
      secondary: Colors.button.secondary.text,
      ghost: Colors.button.ghost.text,
    }[variant];

    return {
      color,
      fontSize: size === 'sm' ? FontSizes.bodySmall : FontSizes.body,
      fontWeight: '600' as const,
    };
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} size="small" />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    textAlign: 'center',
  },
});
