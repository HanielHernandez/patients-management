'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, setUnauthorizedHandler } from '@/lib/api';
import type { LoginResponse, User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    apiRequest<User>('/auth/me', {}, storedToken)
      .then((currentUser) => {
        setToken(storedToken);
        setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('accessToken', response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
    router.replace('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
    router.replace('/login');
  }, [router]);

  useEffect(() => {
    setUnauthorizedHandler(logout);

    return () => setUnauthorizedHandler(null);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
