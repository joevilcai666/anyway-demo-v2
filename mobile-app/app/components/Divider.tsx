// Divider Component - Visual separator
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

interface DividerProps {
  thickness?: number;
  color?: string;
  style?: any;
}

export const Divider: React.FC<DividerProps> = ({
  thickness = 1,
  color = Colors.neutral.border,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          height: thickness,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    marginVertical: Spacing.md,
  },
});
