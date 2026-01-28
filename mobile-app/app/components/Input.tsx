// Input Component - Text, email, number inputs
import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSizes } from '../theme/spacing';
import { Caption } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={Colors.neutral.text.tertiary}
        {...rest}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '500',
    color: Colors.neutral.text.primary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.body,
    color: Colors.neutral.text.primary,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  inputError: {
    borderColor: Colors.semantic.error.text,
  },
  errorText: {
    fontSize: FontSizes.caption,
    color: Colors.semantic.error.text,
    marginTop: Spacing.xs,
  },
});
