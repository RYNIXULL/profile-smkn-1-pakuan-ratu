import { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../lib/api';
import { toast } from './toastStore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

let globalState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

const listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const authStore = {
  getState() {
    return globalState;
  },

  setUser(user: User | null) {
    globalState = {
      ...globalState,
      user,
      isAuthenticated: !!user,
      isLoading: false,
    };
    emitChange();
  },

  setLoading(isLoading: boolean) {
    globalState = { ...globalState, isLoading };
    emitChange();
  },

  async checkAuth() {
    try {
      this.setLoading(true);
      const user = await api.get<User>('/auth/me');
      this.setUser(user);
    } catch {
      this.setUser(null);
    }
  },

  async login(email: string, password: string): Promise<User> {
    const result = await api.post<{ user: User }>('/auth/login', { email, password });
    this.setUser(result.user);
    toast.success(`Selamat datang kembali, ${result.user.name}!`);
    return result.user;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      this.setUser(null);
      toast.info('Anda telah keluar dari sistem.');
    }
  },
};

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
} {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    const listener = () => setState(authStore.getState());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    ...state,
    login: authStore.login.bind(authStore),
    logout: authStore.logout.bind(authStore),
    checkAuth: authStore.checkAuth.bind(authStore),
  };
}
