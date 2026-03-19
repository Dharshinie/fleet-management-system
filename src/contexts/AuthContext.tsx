import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  isFirebaseConfigured,
  firebaseCreateUser,
  firebaseGetValueOnce,
  firebaseSignIn,
  firebaseSignOut,
  firebaseOnAuthStateChanged,
  firebaseSetValue,
} from '@/firebase';

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
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, role: UserRole, name: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'fleetcommand_user';

export const getDashboardRouteByRole = (role: UserRole) => {
  const roleRoutes: Record<UserRole, string> = {
    'super-admin': '/super-admin',
    'admin': '/admin',
    'driver': '/driver',
  };

  return roleRoutes[role];
};

const normalizeRole = (role?: string | null): UserRole | null => {
  if (role === 'super-admin' || role === 'admin' || role === 'driver') {
    return role;
  }

  return null;
};

const inferRoleFromEmail = (email?: string | null): UserRole => {
  const normalizedEmail = email?.toLowerCase() ?? '';

  if (normalizedEmail.includes('super')) {
    return 'super-admin';
  }

  if (normalizedEmail.includes('admin')) {
    return 'admin';
  }

  return 'driver';
};

const resolveUserRole = (profileRole?: string | null, email?: string | null): UserRole => {
  return normalizeRole(profileRole) ?? inferRoleFromEmail(email);
};

const buildUserFromFirebase = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    const profile = await firebaseGetValueOnce<{ email?: string; role?: UserRole; name?: string }>(
      `users/${firebaseUser.uid}`
    );

    const resolvedEmail = firebaseUser.email ?? profile?.email ?? '';

    if (!profile) {
      return {
        id: firebaseUser.uid,
        email: resolvedEmail,
        role: resolveUserRole(undefined, resolvedEmail),
        name: resolvedEmail.split('@')[0] ?? 'User',
      };
    }

    return {
      id: firebaseUser.uid,
      email: resolvedEmail,
      role: resolveUserRole(profile.role, resolvedEmail),
      name: profile.name ?? resolvedEmail.split('@')[0] ?? 'User',
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);

    const resolvedEmail = firebaseUser.email ?? '';

    return {
      id: firebaseUser.uid,
      email: resolvedEmail,
      role: resolveUserRole(undefined, resolvedEmail),
      name: resolvedEmail.split('@')[0] ?? 'User',
    };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = firebaseOnAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const appUser = await buildUserFromFirebase(firebaseUser);
          setUser(appUser);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appUser));
        } else {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Auth state error:', error);
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }

    setLoading(true);

    try {
      const firebaseUser = await firebaseSignIn(email, password);
      const appUser = await buildUserFromFirebase(firebaseUser);

      setUser(appUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appUser));

      return appUser;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: UserRole, name: string) => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }

    setLoading(true);

    try {
      const firebaseUser = await firebaseCreateUser(email, password);
      const profile = {
        email,
        role,
        name,
        createdAt: Date.now(),
      };

      await firebaseSetValue(`users/${firebaseUser.uid}`, profile);

      const appUser: User = {
        id: firebaseUser.uid,
        email,
        role,
        name,
      };

      setUser(appUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appUser));

      return appUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await firebaseSignOut();
    }

    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
