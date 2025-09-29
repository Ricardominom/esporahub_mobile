// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'user';
  permissions: string[];
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Task types
export interface TaskAssignment {
  itemId: string;
  userId: string;
  concept: string;
  dueDate: string;
  section: string;
  sectionId?: string;
  completed?: boolean;
  code?: string;
}

// Account types
export interface Account {
  id: number;
  name: string;
  position: string;
  color: string;
  isActive: boolean;
}

// Checklist types
export interface ChecklistItem {
  id: string;
  concept: string;
  section: string;
  sectionId: string;
  completed: boolean;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';