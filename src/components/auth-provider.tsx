"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id?: string;
  name: string;
  email: string;
  company: string;
  company_id?: string;
  role: string;
  avatar?: string;
  businessType: string;
  business_setup_completed?: boolean;
  setup_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; token: string; user: User; setupCompleted: boolean; role: string }>;
  socialLogin: (data: { provider: "google" | "microsoft"; email: string; name?: string }) => Promise<{ success: boolean; token: string | null; user: User; setupCompleted: boolean; role: string }>;
  googleLogin: (credentialOrToken: string | { credential?: string; access_token?: string }) => Promise<{ success: boolean; token: string; user: User; isNewUser: boolean; setupCompleted: boolean; role: string }>;
  adminLogin: (data: { email: string; password: string }) => Promise<{ success: boolean; token: string; refreshToken?: string; user: User }>;
  signup: (userData: Partial<User> & { password?: string }) => Promise<{ success: boolean; token: string; user: User; setupCompleted: boolean; role: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

export const defaultUser: User = {
  name: "User",
  email: "",
  company: "Enterprise Account",
  role: "user",
  businessType: "Enterprise AI System",
  business_setup_completed: false,
  setup_completed: false,
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
            const userRole = u.role || "user";
            const isSetupDone = Boolean(
              userRole === "admin" ||
              u.business_setup_completed === true ||
              u.setup_completed === true
            );
            const updatedUser: User = {
              id: u.id || u.user_id,
              name: u.name || "User",
              email: u.email || "",
              company: u.company || "Enterprise Account",
              company_id: u.company_id,
              role: userRole,
              businessType: "Enterprise AI System",
              business_setup_completed: isSetupDone,
              setup_completed: isSetupDone,
            };
            setUser(updatedUser);
            localStorage.setItem("evoai-user", JSON.stringify(updatedUser));
          }
        }).catch(() => {});
      });
    }
  }, []);

  const login = async (email: string, password?: string) => {
    const { authApi } = await import("@/lib/api");
    const res = await authApi.login({ email: email.trim(), password: password || "password123" });

    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem("evoai-token", res.token);
      if (res.refreshToken) {
        localStorage.setItem("evoai-refresh-token", res.refreshToken);
      }

      const userRole = res.role || res.user?.role || "user";
      const isSetupDone = Boolean(
        userRole === "admin" ||
        res.business_setup_completed === true ||
        res.setup_completed === true ||
        res.user?.business_setup_completed === true ||
        res.user?.setup_completed === true
      );

      const newUser: User = {
        id: res.user_id || res.user?.id,
        name: res.user?.name || email.split("@")[0],
        email: res.user?.email || email,
        company: res.user?.company || "Enterprise Account",
        company_id: res.company_id || res.user?.company_id,
        role: userRole,
        businessType: "Enterprise AI Infrastructure",
        business_setup_completed: isSetupDone,
        setup_completed: isSetupDone,
      };

      setUser(newUser);
      localStorage.setItem("evoai-user", JSON.stringify(newUser));
      return { success: true, token: res.token, user: newUser, setupCompleted: isSetupDone, role: userRole };
    }

    throw new Error(res.message || "Invalid credentials");
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
        id: res.user_id || res.user.id,
        name: res.user.name || "EvoAI System Admin",
        email: res.user.email || data.email,
        company: res.user.company || "EvoAI Corporation",
        company_id: res.company_id || res.user.company_id,
        role: res.user.role || "admin",
        businessType: "Autonomous AI Enterprise System",
        business_setup_completed: true,
        setup_completed: true,
      };
      setUser(adminUser);
      localStorage.setItem("evoai-user", JSON.stringify(adminUser));
      return { success: true, token: res.token, refreshToken: res.refreshToken, user: adminUser };
    }
    throw new Error(res.message || "Admin authentication failed");
  };

  const signup = async (userData: Partial<User> & { password?: string }) => {
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
      if (res.refreshToken) {
        localStorage.setItem("evoai-refresh-token", res.refreshToken);
      }

      const userRole = res.role || res.user?.role || "user";
      const isSetupDone = Boolean(
        userRole === "admin" ||
        res.business_setup_completed === true ||
        res.setup_completed === true ||
        res.user?.business_setup_completed === true ||
        res.user?.setup_completed === true
      );

      const newUser: User = {
        id: res.user_id || res.user?.id,
        name: res.user?.name || userData.name || "Enterprise Leader",
        email: res.user?.email || userData.email || "leader@vanguard.ai",
        company: res.user?.company || userData.company || "Apex Global Dynamics",
        company_id: res.company_id || res.user?.company_id,
        role: userRole,
        businessType: userData.businessType || "Enterprise AI Infrastructure",
        business_setup_completed: isSetupDone,
        setup_completed: isSetupDone,
      };

      setUser(newUser);
      localStorage.setItem("evoai-user", JSON.stringify(newUser));
      return { success: true, token: res.token, user: newUser, setupCompleted: isSetupDone, role: userRole };
    }

    throw new Error(res.message || "Registration failed");
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
    const { authApi } = await import("@/lib/api");
    const res = await authApi.socialLogin(data);
    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem("evoai-token", res.token);
      if (res.refreshToken) {
        localStorage.setItem("evoai-refresh-token", res.refreshToken);
      }
      const userRole = res.role || res.user?.role || "user";
      const isSetupDone = Boolean(
        userRole === "admin" ||
        res.business_setup_completed === true ||
        res.setup_completed === true ||
        res.user?.business_setup_completed === true ||
        res.user?.setup_completed === true
      );
      const newUser: User = {
        id: res.user_id || res.user.id,
        name: res.user.name || data.name || data.email.split("@")[0],
        email: res.user.email || data.email,
        company: res.user.company || `${data.email.split("@")[0]}'s Enterprise`,
        company_id: res.company_id || res.user.company_id,
        role: userRole,
        businessType: "Enterprise AI Solutions",
        business_setup_completed: isSetupDone,
        setup_completed: isSetupDone,
      };
      setUser(newUser);
      localStorage.setItem("evoai-user", JSON.stringify(newUser));
      return { success: true, token: res.token, user: newUser, setupCompleted: isSetupDone, role: userRole };
    }
    throw new Error(res.message || "Social login failed");
  };

  const googleLogin = async (credentialOrToken: string | { credential?: string; access_token?: string }) => {
    const { authApi } = await import("@/lib/api");
    const res = await authApi.googleLogin(credentialOrToken);
    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem("evoai-token", res.token);
      if (res.refreshToken) {
        localStorage.setItem("evoai-refresh-token", res.refreshToken);
      }
      const userRole = res.role || res.user?.role || "user";
      const isSetupDone = Boolean(
        userRole === "admin" ||
        res.business_setup_completed === true ||
        res.setup_completed === true ||
        res.user?.business_setup_completed === true ||
        res.user?.setup_completed === true
      );
      const isNew = Boolean(res.is_new_user);
      const newUser: User = {
        id: res.user_id || res.user.id,
        name: res.user.name || "Enterprise User",
        email: res.user.email,
        company: res.user.company || `${res.user.name}'s Enterprise`,
        company_id: res.company_id || res.user.company_id,
        role: userRole,
        businessType: "Enterprise AI Solutions",
        business_setup_completed: isSetupDone,
        setup_completed: isSetupDone,
      };
      setUser(newUser);
      localStorage.setItem("evoai-user", JSON.stringify(newUser));
      return { success: true, token: res.token, user: newUser, isNewUser: isNew, setupCompleted: isSetupDone, role: userRole };
    }
    throw new Error(res.message || "Google authentication failed");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        socialLogin,
        googleLogin,
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
