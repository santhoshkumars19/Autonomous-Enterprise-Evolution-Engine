"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  name: string;
  email: string;
  company: string;
  role: string;
  avatar?: string;
  businessType: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  socialLogin: (data: { provider: "google" | "microsoft"; email: string; name?: string }) => Promise<{ success: boolean; token: string | null; user: User }>;
  adminLogin: (data: { email: string; password: string }) => Promise<{ success: boolean; token: string; refreshToken?: string; user: User }>;
  signup: (userData: Partial<User> & { password?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

export const defaultUser: User = {
  name: "User",
  email: "",
  company: "Enterprise Account",
  role: "Executive",
  businessType: "Enterprise AI System",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("evoai-token");
    const savedUser = localStorage.getItem("evoai-user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    if (savedToken) {
      setToken(savedToken);
      import("@/lib/api").then(({ authApi }) => {
        authApi.me(savedToken).then((res) => {
          if (res.success && res.user) {
            const u = res.user as any;
            const updatedUser: User = {
              name: u.name || "User",
              email: u.email || "",
              company: u.company || "Enterprise Account",
              role: u.role || "Executive",
              businessType: "Enterprise AI System",
            };
            setUser(updatedUser);
            localStorage.setItem("evoai-user", JSON.stringify(updatedUser));
          }
        }).catch(() => {});
      });
    }
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const { authApi } = await import("@/lib/api");
      const res = await authApi.login({ email, password: password || "password123" });
      if (res.success && res.token) {
        setToken(res.token);
        localStorage.setItem("evoai-token", res.token);

        let profileName = res.user.name;
        let profileCompany = (res.user as Record<string, string>).company;

        if (!profileName || !profileCompany) {
          const meRes = await authApi.me(res.token).catch(() => null);
          if (meRes?.success && meRes.user) {
            const u = meRes.user as any;
            profileName = u.name || profileName;
            profileCompany = u.company || profileCompany;
          }
        }

        const fallbackName = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const newUser: User = {
          name: profileName || fallbackName || "User",
          email: res.user.email || email,
          company: profileCompany || "Enterprise Account",
          role: res.user.role || "Executive",
          businessType: "Enterprise AI Infrastructure",
        };
        setUser(newUser);
        localStorage.setItem("evoai-user", JSON.stringify(newUser));
        return;
      }
    } catch {
      // Backend unavailable or offline fallback
    }

    const fallbackName = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: User = {
      name: fallbackName || "User",
      email,
      company: "Enterprise Account",
      role: "Strategic Executive Officer",
      businessType: "Enterprise AI Infrastructure",
    };
    setUser(newUser);
    localStorage.setItem("evoai-user", JSON.stringify(newUser));
  };

  const adminLogin = async (data: { email: string; password: string }) => {
    const { authApi } = await import("@/lib/api");
    const res = await authApi.adminLogin(data);

    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem("evoai-token", res.token);
      if (res.refreshToken) {
        localStorage.setItem("evoai-refresh-token", res.refreshToken);
      }
      const adminUser: User = {
        name: res.user.name || "EvoAI System Admin",
        email: res.user.email || data.email,
        company: res.user.company || "EvoAI Corporation",
        role: res.user.role || "Admin",
        businessType: "Autonomous AI Enterprise System",
      };
      setUser(adminUser);
      localStorage.setItem("evoai-user", JSON.stringify(adminUser));
      return { success: true, token: res.token, refreshToken: res.refreshToken, user: adminUser };
    }
    throw new Error(res.message || "Admin authentication failed");
  };

  const signup = async (userData: Partial<User> & { password?: string }) => {
    try {
      const { authApi } = await import("@/lib/api");
      const res = await authApi.register({
        name: userData.name || "Enterprise Leader",
        email: userData.email || "leader@vanguard.ai",
        password: userData.password || "password123",
        company: userData.company,
      });
      if (res.success && res.token) {
        setToken(res.token);
        localStorage.setItem("evoai-token", res.token);
        const newUser: User = {
          name: res.user.name || "Enterprise Leader",
          email: res.user.email || "leader@vanguard.ai",
          company: (res.user as Record<string, string>).company || "Apex Global Dynamics",
          role: res.user.role || "Strategic Executive Officer",
          businessType: userData.businessType || "Enterprise AI Infrastructure",
        };
        setUser(newUser);
        localStorage.setItem("evoai-user", JSON.stringify(newUser));
        return;
      }
    } catch {
      // Backend offline fallback
    }

    const newUser: User = {
      name: userData.name || "Enterprise Leader",
      email: userData.email || "leader@vanguard.ai",
      company: userData.company || "Apex Global Dynamics",
      role: "Strategic Executive Officer",
      businessType: userData.businessType || "Enterprise AI Infrastructure",
    };
    setUser(newUser);
    localStorage.setItem("evoai-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("evoai-user");
      localStorage.removeItem("evoai-token");
      localStorage.removeItem("evoai-refresh-token");
      localStorage.clear();
      sessionStorage.clear();

      if (typeof document !== "undefined") {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
        });
      }
    } catch {}
  };

  const updateProfile = (updatedData: Partial<User>) => {
    const current = user || defaultUser;
    const updated = { ...current, ...updatedData };
    setUser(updated);
    localStorage.setItem("evoai-user", JSON.stringify(updated));
  };

  const socialLogin = async (data: { provider: "google" | "microsoft"; email: string; name?: string }) => {
    try {
      const { authApi } = await import("@/lib/api");
      const res = await authApi.socialLogin(data);
      if (res.success && res.token) {
        setToken(res.token);
        localStorage.setItem("evoai-token", res.token);
        const newUser: User = {
          name: res.user.name || data.name || data.email.split("@")[0],
          email: res.user.email || data.email,
          company: res.user.company || `${data.email.split("@")[0]}'s Enterprise`,
          role: res.user.role || "user",
          businessType: "Enterprise AI Solutions",
        };
        setUser(newUser);
        localStorage.setItem("evoai-user", JSON.stringify(newUser));
        return { success: true, token: res.token, user: newUser };
      }
    } catch {}

    const fallbackName = data.name || data.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: User = {
      name: fallbackName,
      email: data.email,
      company: `${fallbackName}'s Enterprise`,
      role: "user",
      businessType: "Enterprise AI Solutions",
    };
    setUser(newUser);
    localStorage.setItem("evoai-user", JSON.stringify(newUser));
    return { success: true, token: null, user: newUser };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        socialLogin,
        adminLogin,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
