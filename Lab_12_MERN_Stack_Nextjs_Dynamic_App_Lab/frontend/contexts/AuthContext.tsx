"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { loginUser, registerUser } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "rustik-auth-token";
const STORAGE_USER_KEY = "rustik-auth-user";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem(STORAGE_KEY, response.token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(response.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await registerUser({ name, email, password });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem(STORAGE_KEY, response.token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
