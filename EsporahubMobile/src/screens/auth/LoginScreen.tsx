import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { getColors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Fonts';
import { RootStackParamList } from '../../types/navigation';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const colors = getColors(isDark);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      navigation.navigate('Menu');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, { backgroundColor: colors.surface }]}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.themeButton, { backgroundColor: colors.surface }]}
            >
              <Ionicons 
                name={isDark ? "sunny" : "moon"} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoSection}>
            <Text style={[styles.appName, { color: colors.text }]}>Esporahub</Text>
          </View>

          {/* Login Form */}
          <Card style={styles.loginCard} blur>
            <Text style={[styles.title, { color: colors.text }]}>Iniciar sesión</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Inicia sesión con tu cuenta de Espora
            </Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text 
                  }]}
                  placeholder="Correo electrónico"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text 
                  }]}
                  placeholder="Contraseña"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Button
                title="Iniciar sesión"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
              />
            </View>

            {/* Demo Accounts */}
            <View style={styles.demoSection}>
              <Text style={[styles.demoTitle, { color: colors.textSecondary }]}>
                Cuentas de prueba
              </Text>
              
              <View style={styles.demoGrid}>
                <TouchableOpacity
                  style={[styles.demoItem, { backgroundColor: colors.surface }]}
                  onPress={() => quickLogin('admin@espora.com', 'password')}
                >
                  <Text style={[styles.demoRole, { color: colors.primary }]}>Admin</Text>
                  <Text style={[styles.demoEmail, { color: colors.textSecondary }]}>
                    admin@espora.com
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoItem, { backgroundColor: colors.surface }]}
                  onPress={() => quickLogin('operador@espora.com', 'espora2024')}
                >
                  <Text style={[styles.demoRole, { color: colors.success }]}>Operador</Text>
                  <Text style={[styles.demoEmail, { color: colors.textSecondary }]}>
                    operador@espora.com
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.demoItem, { backgroundColor: colors.surface }]}
                  onPress={() => quickLogin('capturista@espora.com', 'espora2024')}
                >
                  <Text style={[styles.demoRole, { color: colors.warning }]}>Capturista</Text>
                  <Text style={[styles.demoEmail, { color: colors.textSecondary }]}>
                    capturista@espora.com
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  appName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes['4xl'],
    letterSpacing: -1,
  },
  loginCard: {
    marginBottom: 40,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes['2xl'],
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    borderWidth: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 15,
  },
  loginButton: {
    marginTop: 12,
  },
  demoSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(142, 142, 147, 0.2)',
  },
  demoTitle: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.sm,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoGrid: {
    gap: 12,
  },
  demoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  demoRole: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.base,
  },
  demoEmail: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
  },
});

export default LandingScreen;