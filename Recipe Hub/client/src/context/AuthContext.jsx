import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../services/recipeApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rh_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("rh_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem("rh_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const data = await authApi.register({ email, password, name });
    localStorage.setItem("rh_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("rh_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
