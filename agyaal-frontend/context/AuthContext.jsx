"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { authService } from "@/lib/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from token on mount
  useEffect(() => {
    const token = Cookies.get("agyaal_token");
    if (token) {
      authService.getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => Cookies.remove("agyaal_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    Cookies.set("agyaal_token", res.data.token, { expires: 30 });
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    Cookies.set("agyaal_token", res.data.token, { expires: 30 });
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    Cookies.remove("agyaal_token");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
