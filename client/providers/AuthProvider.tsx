"use client";

import * as React from "react";

import {
  clearStoredSession,
  getStoredToken,
  getStoredUser,
  setStoredSession,
} from "@/lib/api";
import { login as loginRequest } from "@/services/auth.service";
import type {
  AuthUser,
  LoginCredentials,
  LoginResult,
} from "@/types/auth";

interface AuthContextValue {
  hydrated: boolean;
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);

  React.useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser<AuthUser>();

    setToken(storedToken);
    setUser(storedUser);
    setHydrated(true);
  }, []);

  const login = React.useCallback(async (credentials: LoginCredentials) => {
    const result = await loginRequest(credentials);

    setStoredSession(result.token, result.user);
    setToken(result.token);
    setUser(result.user);

    return result;
  }, []);

  const logout = React.useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({
      hydrated,
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [hydrated, token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}