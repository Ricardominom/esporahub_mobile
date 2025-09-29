import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../stores/themeStore';
import { getColors } from '../../constants/Colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: boolean;
  intensity?: number;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  blur = false, 
  intensity = 80 
}) => {
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  if (blur) {
    return (
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.card, { borderColor: colors.border }, style]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
        shadowColor: colors.text,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default Card;