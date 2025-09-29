import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

// Screens
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import MenuScreen from './src/screens/menu/MenuScreen';
import OverviewScreen from './src/screens/overview/OverviewScreen';
import WorkHubScreen from './src/screens/workhub/WorkHubScreen';
import AccountsScreen from './src/screens/accounts/AccountsScreen';
import ChecklistScreen from './src/screens/checklist/ChecklistScreen';

// Components
import ProtectedRoute from './src/components/ProtectedRoute';

// Stores
import { useAuthStore } from './src/stores/authStore';

// Types
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'SF-Pro-Display-Regular': require('./assets/fonts/SF-Pro-Display-Regular.otf'),
          'SF-Pro-Display-Medium': require('./assets/fonts/SF-Pro-Display-Medium.otf'),
          'SF-Pro-Display-Semibold': require('./assets/fonts/SF-Pro-Display-Semibold.otf'),
          'SF-Pro-Display-Bold': require('./assets/fonts/SF-Pro-Display-Bold.otf'),
        });
      } catch (error) {
        console.log('Error loading fonts:', error);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadFonts();
    initializeAuth();
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Overview" component={OverviewScreen} />
            <Stack.Screen name="WorkHub" component={WorkHubScreen} />
            <Stack.Screen name="Accounts" component={AccountsScreen} />
            <Stack.Screen name="Checklist" component={ChecklistScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}