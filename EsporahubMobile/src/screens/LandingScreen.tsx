import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../components/ui/Button';
import { useThemeStore } from '../stores/themeStore';
import { getColors } from '../constants/Colors';
import { Fonts, FontSizes } from '../constants/Fonts';
import { RootStackParamList } from '../types/navigation';

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const { width, height } = Dimensions.get('window');

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const { isDark } = useThemeStore();
  const colors = getColors(isDark);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#000000', '#1a0b2e', '#000000']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>esporahub</Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Plataforma integral de gestión de campañas políticas
          </Text>

          {/* Login Button */}
          <Button
            title="Iniciar sesión"
            onPress={handleLogin}
            size="lg"
            style={styles.loginButton}
          />

          {/* Footer */}
          <Text style={styles.footer}>
            © 2025 Esporadix Team
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes['5xl'],
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -2,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  loginButton: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 40,
  },
  footer: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});

export default LandingScreen;