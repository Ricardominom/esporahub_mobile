import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../stores/themeStore';
import { getColors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Fonts';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon
}) => {
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: size === 'sm' ? 8 : size === 'md' ? 12 : 16,
      paddingHorizontal: size === 'sm' ? 16 : size === 'md' ? 24 : 32,
      paddingVertical: size === 'sm' ? 8 : size === 'md' ? 12 : 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: Fonts.semibold,
      fontSize: size === 'sm' ? FontSizes.sm : size === 'md' ? FontSizes.base : FontSizes.lg,
      textAlign: 'center',
    };

    switch (variant) {
      case 'outline':
      case 'ghost':
        return {
          ...baseTextStyle,
          color: colors.primary,
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: colors.text,
        };
      default:
        return {
          ...baseTextStyle,
          color: '#FFFFFF',
        };
    }
  };

  const buttonStyle = getButtonStyle();
  const finalTextStyle = { ...getTextStyle(), ...textStyle };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.button, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDark ? ['#0A84FF', '#5AC8FA'] : ['#007AFF', '#5AC8FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[buttonStyle, disabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              {icon}
              <Text style={finalTextStyle}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, buttonStyle, disabled && styles.disabled, style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text style={finalTextStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;