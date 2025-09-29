import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials } from '../types';

// Mock users data (same as web version)
const users = [
  {
    id: '1',
    email: 'admin@espora.com',
    password: 'password',
    name: 'Super Administrador',
    role: 'super_admin' as const,
    permissions: [
      'create_accounts',
      'edit_accounts',
      'delete_accounts',
      'view_all_accounts',
      'manage_users',
      'assign_tasks',
      'view_reports',
      'edit_expediente',
      'edit_checklist',
      'edit_presentacion'
    ],
  },
  {
    id: '2',
    email: 'operador@espora.com',
    password: 'espora2024',
    name: 'Operador EHO',
    role: 'admin' as const,
    permissions: [
      'view_accounts',
      'edit_checklist',
      'view_reports',
      'assign_tasks'
    ],
  },
  {
    id: '3',
    email: 'capturista@espora.com',
    password: 'espora2024',
    name: 'Capturista',
    role: 'user' as const,
    permissions: [
      'view_accounts',
      'edit_checklist'
    ],
  }
];

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user
      const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

      if (user) {
        const { password, ...userWithoutPassword } = user;
        const fakeToken = `token_${Math.random().toString(36).substring(2)}`;
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('authToken', fakeToken);
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        set({
          user: userWithoutPassword as User,
          token: fakeToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      set({
        error: error.message || 'Error al iniciar sesión',
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userString = await AsyncStorage.getItem('user');
      
      if (token && userString) {
        const user = JSON.parse(userString);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },
}));