import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Obtener item del AsyncStorage
  getItem: async <T>(key: string, defaultValue?: T): Promise<T | null> => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing AsyncStorage item "${key}":`, error);
      return defaultValue || null;
    }
  },

  // Guardar item en AsyncStorage
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting AsyncStorage item "${key}":`, error);
    }
  },

  // Eliminar item del AsyncStorage
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing AsyncStorage item "${key}":`, error);
    }
  },

  // Limpiar todo el AsyncStorage
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },

  // Verificar si una clave existe
  hasItem: async (key: string): Promise<boolean> => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item !== null;
    } catch (error) {
      console.error(`Error checking AsyncStorage item "${key}":`, error);
      return false;
    }
  },

  // Obtener todas las claves
  getAllKeys: async (): Promise<string[]> => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all AsyncStorage keys:', error);
      return [];
    }
  },
};