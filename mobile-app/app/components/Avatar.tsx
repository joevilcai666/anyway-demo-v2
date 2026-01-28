// Avatar Component
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius } from '../theme/spacing';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 40,
  backgroundColor = Colors.brand.yellow,
}) => {
  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  // Get initials from name
  const initials = name
    ? name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?';

  return (
    <View
      style={[
        styles.avatar,
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.brand.black,
    fontWeight: '600',
  },
});
