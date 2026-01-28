// Loading Spinner Component
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = Colors.brand.yellow,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: center,
    padding: Spacing.lg,
  },
});
