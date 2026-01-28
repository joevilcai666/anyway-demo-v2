// Tag/Label Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, FontSizes } from '../theme/spacing';

type TagVariant = 'default' | 'primary' | 'outline';

interface TagProps {
  label: string;
  variant?: TagVariant;
  onPress?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'default',
  onPress,
}) => {
  const getTagStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: Colors.brand.yellow,
          color: Colors.brand.black,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.neutral.border,
          color: Colors.neutral.text.primary,
        };
      default:
        return {
          backgroundColor: Colors.neutral.surfaceAlt,
          color: Colors.neutral.text.secondary,
        };
    }
  };

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: getTagStyle().backgroundColor,
          ...(variant === 'outline' && { borderColor: getTagStyle().borderColor as string }),
        },
      ]}
    >
      <Text style={[styles.text, { color: getTagStyle().color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
  },
});
