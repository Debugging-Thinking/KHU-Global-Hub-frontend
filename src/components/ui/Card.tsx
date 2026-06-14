import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Radius, Shadow, Spacing, type ThemeColors } from '../../../constants/theme';
import { useThemedStyles } from '@/src/theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof Spacing;
}

export function Card({ children, onPress, style, padding = 4 }: Props) {
  const styles = useThemedStyles(makeStyles);
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { padding: Spacing[padding] },
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, { padding: Spacing[padding] }, style]}>
      {children}
    </View>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    ...Shadow.sm,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
