/**
 * EvoAI API Client — connects Next.js frontend to Node.js Express API (port 4000)
 */

const getApiBase = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    return "";
  }
  return "http://localhost:4000";
};

const API_BASE = getApiBase();

type FetchOptions = RequestInit & { token?: string };

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; company?: string }) =>
    apiFetch<{
      success: boolean;
      token: string;
      refreshToken?: string;
      role?: string;
      company_id?: string;
      user_id?: string;
      business_setup_completed?: boolean;
      setup_completed?: boolean;
      user: Record<string, any>;
      message?: string;
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{
      success: boolean;
      token: string;
      refreshToken?: string;
      role?: string;
      company_id?: string;
      user_id?: string;
      business_setup_completed?: boolean;
      setup_completed?: boolean;
      user: Record<string, any>;
      message?: string;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  socialLogin: (data: { provider: "google" | "microsoft"; email: string; name?: string }) =>
    apiFetch<{
      success: boolean;
      token: string;
      refreshToken?: string;
      role?: string;
      company_id?: string;
      user_id?: string;
      business_setup_completed?: boolean;
      setup_completed?: boolean;
      is_new_user?: boolean;
      user: { id: string; name: string; email: string; role: string; company?: string; company_id?: string; business_setup_completed?: boolean; setup_completed?: boolean };
      message?: string;
    }>("/api/auth/social-login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  googleLogin: (credentialOrToken: string | { credential?: string; access_token?: string }) =>
    apiFetch<{
      success: boolean;
      token: string;
      refreshToken?: string;
      role?: string;
      company_id?: string;
      user_id?: string;
      business_setup_completed?: boolean;
      setup_completed?: boolean;
      is_new_user?: boolean;
      user: { id: string; name: string; email: string; role: string; company?: string; company_id?: string; business_setup_completed?: boolean; setup_completed?: boolean };
      message?: string;
    }>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify(
        typeof credentialOrToken === "string"
          ? { token: credentialOrToken, idToken: credentialOrToken }
          : credentialOrToken
      ),
    }),

  adminLogin: (data: { email: string; password: string }) =>
    apiFetch<{
      success: boolean;
      token: string;
      refreshToken: string;
      role?: string;
      company_id?: string;
      user_id?: string;
      business_setup_completed?: boolean;
      setup_completed?: boolean;
      user: { id: string; name: string; email: string; role: string; company: string; company_id?: string; business_setup_completed?: boolean; setup_completed?: boolean };
      message?: string;
    }>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    apiFetch<{ success: boolean; user: Record<string, unknown> }>("/api/auth/me", { token }),

  verifyEmail: (email: string) =>
    apiFetch<{ success: boolean; message: string; user?: { id: string; email: string; name: string } }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (data: { email: string; newPassword: string }) =>
    apiFetch<{ success: boolean; message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Business Setup & Operations ──────────────────────────────────────────────
export const businessApi = {
  getSetup: (token: string) =>
    apiFetch<{
      success: boolean;
      setupCompleted: boolean;
      userCompany?: string;
      company?: Record<string, any>;
      metrics?: Record<string, any>;
    }>("/api/business/setup", { token }),

  submitSetup: (token: string, data: Record<string, any>) =>
    apiFetch<{ success: boolean; message: string; setupCompleted: boolean; analysis?: Record<string, any> }>("/api/business/setup", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  saveSetup: (data: Record<string, any>, token: string) =>
    apiFetch<{ success: boolean; message: string; setupCompleted: boolean; analysis?: Record<string, any> }>("/api/business/setup", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  submitOperations: (token: string, data: { businessType: string; metricsData: Record<string, any> }) =>
    apiFetch<{ success: boolean; message: string; operation?: Record<string, any>; analysis?: Record<string, any> }>("/api/business/operations", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  getOperations: (token: string) =>
    apiFetch<{ success: boolean; operations: Array<Record<string, any>> }>("/api/business/operations", { token }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  stats: (token: string) =>
    apiFetch<{
      success: boolean;
      stats: {
        totalCompanies: number;
        totalUsers: number;
        totalRevenue: string;
        healthScore: number;
        activeAgents: number;
        pendingReports: number;
        todayAnalysis: number;
        recentActivitiesCount: number;
      };
      recentLogs: Array<{ id: string; timestamp: string; user: string; action: string; category: string; status: string }>;
    }>("/api/admin/stats", { token }),

  users: (token: string) =>
    apiFetch<{
      success: boolean;
      users: Array<{ id: string; name: string; email: string; role: string; company: string; created_at: string; last_login_at: string }>;
    }>("/api/admin/users", { token }),

  createUser: (token: string, data: { name: string; email: string; password: string; company?: string; role: string }) =>
    apiFetch<{ success: boolean; message: string; user: Record<string, unknown> }>("/api/admin/users", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  updateUserRole: (token: string, userId: string, role: string) =>
    apiFetch<{ success: boolean; message: string; user: Record<string, unknown> }>(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      token,
      body: JSON.stringify({ role }),
    }),

  deleteUser: (token: string, userId: string) =>
    apiFetch<{ success: boolean; message: string }>(`/api/admin/users/${userId}`, {
      method: "DELETE",
      token,
    }),

  companies: (token: string) =>
    apiFetch<{
      success: boolean;
      companies: Array<{ id: string; name: string; tier: string; seats: number; arr: string; status: string; health: number }>;
    }>("/api/admin/companies", { token }),

  analytics: (token: string) =>
    apiFetch<{
      success: boolean;
      revenueTrend: Array<{ month: string; revenue: number; target: number }>;
      profitAnalysis: Array<{ quarter: string; grossProfit: number; netMargin: number }>;
      userGrowth: Array<{ month: string; totalUsers: number; activeDaily: number }>;
      healthRadar: Array<{ metric: string; value: number }>;
    }>("/api/admin/analytics", { token }),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasksApi = {
  list: (token: string, filters?: Record<string, string>) => {
    const params = filters ? `?${new URLSearchParams(filters)}` : "";
    return apiFetch<{ success: boolean; tasks: unknown[]; industry?: string; businessType?: string }>(`/api/tasks${params}`, { token });
  },

  create: (token: string, data: Record<string, unknown>) =>
    apiFetch<{ success: boolean; task: unknown }>("/api/tasks", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  update: (token: string, id: string, data: Record<string, unknown>) =>
    apiFetch<{ success: boolean; task: unknown }>(`/api/tasks/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    }),

  delete: (token: string, id: string) =>
    apiFetch<{ success: boolean }>(`/api/tasks/${id}`, { method: "DELETE", token }),
};

// ─── Financial ────────────────────────────────────────────────────────────────
export const financialApi = {
  overview: (token: string) =>
    apiFetch<{ success: boolean; kpis: unknown }>("/api/financial/overview", { token }),
  revenueForecast: (token: string) =>
    apiFetch<{ success: boolean; data: unknown[] }>("/api/financial/revenue-forecast", { token }),
  cashflow: (token: string) =>
    apiFetch<{ success: boolean; data: unknown[] }>("/api/financial/cashflow", { token }),
  expenses: (token: string) =>
    apiFetch<{ success: boolean; data: unknown[] }>("/api/financial/expenses", { token }),
  roi: (token: string) =>
    apiFetch<{ success: boolean; data: unknown[] }>("/api/financial/roi", { token }),
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export const reportsApi = {
  list: (token: string) =>
    apiFetch<{ success: boolean; reports: unknown[] }>("/api/reports", { token }),
  swot: (token: string) =>
    apiFetch<{ success: boolean; swot: unknown }>("/api/reports/swot", { token }),
  health: (token: string) =>
    apiFetch<{ success: boolean; score: number; radarData: unknown[] }>("/api/reports/health", { token }),
  generate: (token: string, data: { title: string; type: string; period?: string }) =>
    apiFetch<{ success: boolean; report: unknown }>("/api/reports/generate", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),
};

// ─── Competitor ───────────────────────────────────────────────────────────────
export const competitorApi = {
  overview: (token: string) =>
    apiFetch<{ success: boolean; competitors: unknown[]; matrix: unknown[]; pricing: unknown[] }>(
      "/api/competitor/overview", { token }
    ),
  activity: (token: string) =>
    apiFetch<{ success: boolean; feed: unknown[] }>("/api/competitor/activity", { token }),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatApi = {
  send: (token: string, data: { message: string; session_id?: string; provider?: string }) =>
    apiFetch<{ success: boolean; response: string; session_id: string; provider: string }>("/api/chat", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  history: (token: string, limit = 50) =>
    apiFetch<{ success: boolean; messages: unknown[] }>(`/api/chat/history?limit=${limit}`, { token }),

  suggestedQuestions: (token: string) =>
    apiFetch<{ success: boolean; industry: string; businessType: string; companyName: string; questions: string[] }>(
      "/api/chat/suggested-questions",
      { token }
    ),
};

// ─── Feedback & Bug Report ───────────────────────────────────────────────────
export interface FeedbackItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  companyName: string;
  category: "bug" | "feature" | "ui" | "performance" | "other";
  priority: "low" | "medium" | "high" | "critical";
  subject: string;
  description: string;
  status: "pending" | "under_review" | "resolved" | "closed";
  createdAt: string;
  adminReply?: string;
  repliedAt?: string;
}

export const feedbackApi = {
  submit: (token: string, data: Partial<FeedbackItem>) =>
    apiFetch<{ success: boolean; feedback: FeedbackItem }>("/api/feedback", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),

  list: (token: string) =>
    apiFetch<{ success: boolean; feedbackList: FeedbackItem[] }>("/api/feedback", { token }),

  adminReply: (token: string, feedbackId: string, data: { reply: string; status?: string }) =>
    apiFetch<{ success: boolean; feedback: FeedbackItem }>(`/api/feedback/${feedbackId}/reply`, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    }),
};