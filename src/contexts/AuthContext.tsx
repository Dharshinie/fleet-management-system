import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'super-admin' | 'admin' | 'driver';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // For demo purposes, we'll create a user based on email patterns
    let role: UserRole = 'driver';
    if (email.includes('admin')) {
      role = 'admin';
    } else if (email.includes('super')) {
      role = 'super-admin';
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      name: email.split('@')[0],
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signup = async (email: string, password: string, role: UserRole, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock validation
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      name,
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
