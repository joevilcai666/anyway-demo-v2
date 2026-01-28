// Safe Screen Component - Device-safe wrapper
import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '../theme/spacing';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: any;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

export const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  edges = ['top', 'right', 'left'],
}) => {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
});
