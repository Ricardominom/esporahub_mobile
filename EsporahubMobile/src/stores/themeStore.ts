import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

interface ThemeActions {
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
  mode: 'auto',
  isDark: Appearance.getColorScheme() === 'dark',

  setTheme: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      
      let isDark: boolean;
      if (mode === 'auto') {
        isDark = Appearance.getColorScheme() === 'dark';
      } else {
        isDark = mode === 'dark';
      }
      
      set({ mode, isDark });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  toggleTheme: async () => {
    const { mode } = get();
    const newMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    await get().setTheme(newMode);
  },

  initializeTheme: async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode') as ThemeMode;
      const mode = savedMode || 'auto';
      
      let isDark: boolean;
      if (mode === 'auto') {
        isDark = Appearance.getColorScheme() === 'dark';
      } else {
        isDark = mode === 'dark';
      }
      
      set({ mode, isDark });
      
      // Listen for system theme changes
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (get().mode === 'auto') {
          set({ isDark: colorScheme === 'dark' });
        }
      });
      
      return subscription;
    } catch (error) {
      console.error('Error initializing theme:', error);
      set({ mode: 'auto', isDark: false });
    }
  },
}));