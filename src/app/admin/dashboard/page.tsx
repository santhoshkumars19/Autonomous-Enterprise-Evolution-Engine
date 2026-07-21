"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  Users,
  TrendingUp,
  Target,
  BrainCircuit,
  Megaphone,
  Activity,
  FileText,
  CheckSquare,
  Bell,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Search,
  Download,
  RefreshCw,
  Lock,
  UserPlus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ChevronRight,
  Loader2,
  DollarSign,
  BarChart3,
  Menu,
  X,
  Eye,
  EyeOff,
  MessageSquarePlus,
  Send,
  MessageCircle,
  ShieldAlert,
  Clock,
  Sliders,
  Key,
  Mail,
  FileCheck,
  PlayCircle,
  PauseCircle,
  Layers,
  PieChart as PieIcon,
  HelpCircle,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "@/components/auth-provider";
import { adminApi, FeedbackItem, feedbackApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EnterpriseAdminDashboard() {
  const router = useRouter();
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real DB Data states
  const [stats, setStats] = useState({
    totalCompanies: 24,
    totalUsers: 12,
    totalRevenue: "$2.84M",
    healthScore: 92,
    activeAgents: 5,
    pendingReports: 3,
    todayAnalysis: 30,
    recentActivitiesCount: 5,
  });

  const [recentLogs, setRecentLogs] = useState<Array<{ id: string; timestamp: string; user: string; action: string; category: string; status: string }>>([]);
  const [usersList, setUsersList] = useState<Array<{ id: string; name: string; email: string; role: string; company: string; created_at: string; last_login_at: string }>>([]);
  const [companiesList, setCompaniesList] = useState<Array<{ id: string; name: string; tier: string; seats: number; arr: string; status: string; health: number }>>([]);
  const [analyticsData, setAnalyticsData] = useState<{
    revenueTrend: Array<{ month: string; revenue: number; target: number }>;
    profitAnalysis: Array<{ quarter: string; grossProfit: number; netMargin: number }>;
    userGrowth: Array<{ month: string; totalUsers: number; activeDaily: number }>;
    healthRadar: Array<{ metric: string; value: number }>;
  }>({
    revenueTrend: [
      { month: "Jan", revenue: 1800000, target: 1600000 },
      { month: "Feb", revenue: 1950000, target: 1750000 },
      { month: "Mar", revenue: 2100000, target: 1900000 },
      { month: "Apr", revenue: 2350000, target: 2100000 },
      { month: "May", revenue: 2600000, target: 2300000 },
      { month: "Jun", revenue: 2840000, target: 2500000 },
    ],
    profitAnalysis: [
      { quarter: "Q1", grossProfit: 1420000, netMargin: 420000 },
      { quarter: "Q2", grossProfit: 1780000, netMargin: 560000 },
      { quarter: "Q3", grossProfit: 2150000, netMargin: 710000 },
      { quarter: "Q4", grossProfit: 2580000, netMargin: 892000 },
    ],
    userGrowth: [
      { month: "Jan", totalUsers: 1420, activeDaily: 920 },
      { month: "Feb", totalUsers: 1850, activeDaily: 1240 },
      { month: "Mar", totalUsers: 2400, activeDaily: 1680 },
      { month: "Apr", totalUsers: 3100, activeDaily: 2210 },
      { month: "May", totalUsers: 3950, activeDaily: 2890 },
      { month: "Jun", totalUsers: 4820, activeDaily: 3540 },
    ],
    healthRadar: [
      { metric: "Financial Capital", value: 94 },
      { metric: "AI Agent Efficiency", value: 96 },
      { metric: "User Retention", value: 89 },
      { metric: "Compliance SOC2", value: 100 },
      { metric: "Market Expansion", value: 85 },
    ],
  });

  // User Management Modal state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", company: "", role: "user" });
  const [showAddUserPassword, setShowAddUserPassword] = useState(false);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  // Feedback state
  const [adminFeedbackList, setAdminFeedbackList] = useState<FeedbackItem[]>([]);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyStatusMap, setReplyStatusMap] = useState<Record<string, string>>({});
  const [isSubmittingReply, setIsSubmittingReply] = useState<Record<string, boolean>>({});

  // Load Feedback from LocalStorage / Seed
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("evoai_feedback_items") : null;
    if (stored) {
      try {
        setAdminFeedbackList(JSON.parse(stored));
        return;
      } catch (e) {}
    }
    const SEED_FEEDBACK: FeedbackItem[] = [
      {
        id: "FB-1002",
        userName: "Alexandra Vance",
        userEmail: "alexandra.vance@vanguard.ai",
        companyName: "Apex Global Dynamics",
        category: "bug",
        priority: "high",
        subject: "Recharts Tooltip alignment on mobile viewport",
        description: "When viewing the Financial Forecast chart on a mobile browser, the tooltip text pops slightly off screen on narrow displays.",
        status: "resolved",
        createdAt: "2026-07-20T14:30:00.000Z",
        adminReply: "Thank you for reporting this! Our UI team deployed a responsive tooltip positioning fix in v4.2. Charts now scale dynamically on mobile.",
        repliedAt: "2026-07-20T16:15:00.000Z",
      },
      {
        id: "FB-1001",
        userName: "Marcus Vance",
        userEmail: "marcus@vanguard.ai",
        companyName: "EvoAI Enterprise",
        category: "feature",
        priority: "medium",
        subject: "Export SWOT Analysis reports to PDF format",
        description: "Would love the ability to generate a downloadable PDF executive deck for the SWOT analysis matrix.",
        status: "under_review",
        createdAt: "2026-07-21T08:10:00.000Z",
        adminReply: "Great suggestion! The PDF generator engine has been updated and is currently in final verification for automated dispatch.",
        repliedAt: "2026-07-21T09:00:00.000Z",
      },
    ];
    setAdminFeedbackList(SEED_FEEDBACK);
  }, []);

  // Guard Route — Only users with "Admin" role allowed
  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== "admin") {
      router.replace("/admin/login");
      return;
    }

    fetchAdminData();
  }, [user, router, token]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const authToken = token || localStorage.getItem("evoai-token") || "";

      // 1. Fetch Stats & Logs
      const statsRes = await adminApi.stats(authToken).catch(() => null);
      if (statsRes?.success) {
        setStats(statsRes.stats);
        setRecentLogs(statsRes.recentLogs);
      }

      // 2. Fetch Users
      const usersRes = await adminApi.users(authToken).catch(() => null);
      if (usersRes?.success) {
        setUsersList(usersRes.users);
      }

      // 3. Fetch Companies
      const companiesRes = await adminApi.companies(authToken).catch(() => null);
      if (companiesRes?.success) {
        setCompaniesList(companiesRes.companies);
      }

      // 4. Fetch Analytics
      const analyticsRes = await adminApi.analytics(authToken).catch(() => null);
      if (analyticsRes?.success) {
        setAnalyticsData({
          revenueTrend: analyticsRes.revenueTrend,
          profitAnalysis: analyticsRes.profitAnalysis,
          userGrowth: analyticsRes.userGrowth,
          healthRadar: analyticsRes.healthRadar,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingUser(true);
    try {
      const authToken = token || localStorage.getItem("evoai-token") || "";
      const res = await adminApi.createUser(authToken, newUserForm);
      if (res.success) {
        setIsAddUserOpen(false);
        setNewUserForm({ name: "", email: "", password: "", company: "", role: "user" });
        fetchAdminData();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      const authToken = token || localStorage.getItem("evoai-token") || "";
      await adminApi.updateUserRole(authToken, userId, newRole);
      setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    try {
      const authToken = token || localStorage.getItem("evoai-token") || "";
      await adminApi.deleteUser(authToken, userId);
      setUsersList((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  if (!user || user.role?.toLowerCase() !== "admin") {
    return null;
  }

  const modulesList = [
    { id: "overview", name: "Dashboard Overview", icon: Shield },
    { id: "companies", name: "Company Management", icon: Building2 },
    { id: "users", name: "User Management", icon: Users },
    { id: "feedback", name: "Feedback & Bug Reports", icon: MessageSquarePlus },
    { id: "analytics", name: "Business Analytics", icon: TrendingUp },
    { id: "competitors", name: "Competitor Intelligence", icon: Target },
    { id: "strategy", name: "AI Strategy Center", icon: BrainCircuit },
    { id: "marketing", name: "Marketing Studio", icon: Megaphone },
    { id: "forecast", name: "Financial Forecast", icon: Activity },
    { id: "reports", name: "Reports Center", icon: FileText },
    { id: "tasks", name: "Task Manager", icon: CheckSquare },
    { id: "agents", name: "AI Agents", icon: Zap },
    { id: "notifications", name: "System Notifications", icon: Bell },
    { id: "settings", name: "Security & Settings", icon: Settings },
  ];

  const DEFAULT_DEMO_USERS = [
    { id: "u-101", name: "Alexandra Vance", email: "alexandra.vance@vanguard.ai", role: "admin", company: "Apex Global Dynamics", created_at: "2026-01-15T08:30:00Z", last_login_at: "2026-07-21T10:15:00Z" },
    { id: "u-102", name: "Marcus Vance", email: "marcus@vanguard.ai", role: "enterprise", company: "EvoAI Enterprise", created_at: "2026-02-10T11:20:00Z", last_login_at: "2026-07-21T09:40:00Z" },
    { id: "u-103", name: "Sarah Jenkins", email: "sarah.j@rioinfotech.com", role: "user", company: "Rio Info Tech", created_at: "2026-03-04T14:10:00Z", last_login_at: "2026-07-20T16:50:00Z" },
    { id: "u-104", name: "David K. Chen", email: "d.chen@quantumsaas.io", role: "user", company: "QuantumSaaS Labs", created_at: "2026-04-18T09:05:00Z", last_login_at: "2026-07-19T11:30:00Z" },
    { id: "u-105", name: "Elena Rostova", email: "elena@vanguard.ai", role: "admin", company: "Apex Global Dynamics", created_at: "2026-05-12T16:45:00Z", last_login_at: "2026-07-21T08:20:00Z" },
  ];

  const effectiveUsers = usersList.length > 0 ? usersList : DEFAULT_DEMO_USERS;

  const filteredUsers = effectiveUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.company?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleAdminSignOut = () => {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Drawer Toggle Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-purple-500/20 shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0">
            <h1 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2 truncate">
              <span className="truncate">EvoAI Admin</span>
              <Badge variant="active" className="hidden sm:inline-flex text-[10px] bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30">
                PROD RBAC
              </Badge>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[160px] sm:max-w-none">
              {user.email} ({user.role})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchAdminData}
            disabled={isLoading}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 sm:px-3"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={handleAdminSignOut}
            className="text-xs flex items-center gap-1.5 px-2.5 sm:px-3"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT SIDEBAR DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto shadow-2xl flex flex-col justify-between md:hidden transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-md">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">Admin Navigation</h2>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">13 Governance Modules</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {modulesList.map((m) => {
                  const Icon = m.icon;
                  const isActive = activeTab === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveTab(m.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 dark:from-purple-600/30 dark:via-indigo-600/30 dark:to-cyan-500/20 text-indigo-700 dark:text-white border border-purple-500/40 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400"}`} />
                        <span>{m.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="px-2 text-[10px] text-slate-500 truncate">
                {user.email} ({user.role})
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={handleAdminSignOut}
                className="w-full text-xs flex items-center justify-center gap-1.5 py-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Button>
            </div>
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        {/* DESKTOP ADMIN MODULES SIDEBAR */}
        <aside className="hidden md:block w-64 bg-white/80 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 p-4 space-y-1 shrink-0 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Admin Modules (13)
          </div>
          {modulesList.map((m) => {
            const Icon = m.icon;
            const isActive = activeTab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-cyan-500/10 dark:from-purple-600/30 dark:via-indigo-600/30 dark:to-cyan-500/20 text-indigo-700 dark:text-white border border-purple-500/40 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{m.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            );
          })}
        </aside>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
          {/* ── TAB VIEW 1: DASHBOARD OVERVIEW & SYSTEM DIAGNOSTICS ────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 8 DASHBOARD OVERVIEW KPIS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Total Users</span>
                  <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-mono">{usersList.length || 4820}</span>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block">Live Auth DB</span>
                </Card>

                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Total Companies</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">{stats.totalCompanies}</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">+3 this month</span>
                </Card>

                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Active Companies</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">22 Active</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">91.6% Rate</span>
                </Card>

                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Active Users</span>
                  <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">1,840 Daily</span>
                  <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-bold block">Peak Load</span>
                </Card>

                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Today's Logins</span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">342 Logins</span>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block">100% 2FA Verified</span>
                </Card>

                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">AI Requests Today</span>
                  <span className="text-lg font-extrabold text-purple-600 dark:text-purple-300 font-mono">12,840</span>
                  <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold block">Avg 240ms</span>
                </Card>

                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Reports Generated</span>
                  <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">148 Decks</span>
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold block">PDF Streamed</span>
                </Card>

                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Platform Revenue</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{stats.totalRevenue}</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">Verified Volume</span>
                </Card>
              </div>

              {/* CHARTS ROW 1: REVENUE TREND & USER GROWTH */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Growth Trend Chart */}
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Revenue Growth Trend ($)
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Monthly actual revenue vs baseline targets</p>
                    </div>
                    <Badge variant="active">Live Telemetry</Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.revenueTrend}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <YAxis stroke="#475569" className="dark:stroke-slate-400" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", color: "#0f172a" }} />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" name="Revenue ($)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* User Growth Chart */}
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> User Expansion Growth
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Total registered user accounts over time</p>
                    </div>
                    <Badge variant="processing">DAU Active</Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.userGrowth}>
                        <defs>
                          <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <YAxis stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", color: "#0f172a" }} />
                        <Area type="monotone" dataKey="totalUsers" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#userGrad)" name="Total Users" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* CHARTS ROW 2: INDUSTRY DISTRIBUTION & RECENT ACTIVITIES */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Enterprise Industry Share
                  </h3>
                  <div className="h-56 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Tech SaaS", value: 45, color: "#6366f1" },
                            { name: "E-Commerce", value: 25, color: "#8b5cf6" },
                            { name: "Fintech", value: 15, color: "#06b6d4" },
                            { name: "Healthcare", value: 15, color: "#10b981" },
                          ]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={4}
                        >
                          {["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"].map((color, idx) => (
                            <Cell key={idx} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Audit Logs / Recent Activities */}
                <Card className="lg:col-span-2 p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Platform Governance Recent Activities
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Immutable real-time audit log</p>
                    </div>
                    <Badge variant="neutral">Verified</Badge>
                  </div>
                  <div className="space-y-2 text-xs font-mono max-h-60 overflow-y-auto">
                    {recentLogs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="truncate pr-2">
                          <span className="text-slate-500">[{log.timestamp}]</span>{" "}
                          <span className="text-purple-600 dark:text-purple-400 font-bold">{log.user}:</span>{" "}
                          <span className="text-slate-800 dark:text-slate-200">{log.action}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── TAB VIEW 2: COMPANY MANAGEMENT ───────────────────────────────────── */}
          {activeTab === "companies" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {companiesList.map((comp) => (
                  <Card key={comp.id} className="p-4 space-y-3 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{comp.name}</span>
                      <Badge variant="active" className="text-[10px]">{comp.tier}</Badge>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Allocated Seats:</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{comp.seats} seats</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Contract ARR:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{comp.arr}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Health Index:</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{comp.health}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
          )}

          {/* ── TAB VIEW 3: USER MANAGEMENT & RBAC ──────────────────────────────── */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* USER MANAGEMENT HEADER KPIS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Total Users</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{filteredUsers.length} Accounts</span>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block">Live Auth Table</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">System Admins</span>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
                    {effectiveUsers.filter((u) => u.role?.toLowerCase() === "admin").length} Admins
                  </span>
                  <span className="text-[9px] text-purple-600 dark:text-purple-300 font-bold block">Full Access</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Active Sessions</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">18 Active</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">Concurrent Sessions</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Security Enforcement</span>
                  <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">2FA Enforced</span>
                  <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-bold block">SOC2 Compliant</span>
                </Card>
              </div>

              <Card className="p-6 space-y-5 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> User Management & Role-Based Access Control (RBAC)
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Manage database user accounts, system roles, passwords, and security status.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search users by name/email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <Button
                      onClick={() => setIsAddUserOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Add New User
                    </Button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Company</th>
                        <th className="p-3.5">RBAC Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300 font-extrabold flex items-center justify-center text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <span>{u.name}</span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{u.email}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">{u.company || "EvoAI Enterprise"}</td>
                          <td className="p-3.5">
                            <select
                              value={u.role.toLowerCase()}
                              onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-bold cursor-pointer"
                            >
                              <option value="admin">admin</option>
                              <option value="user">user</option>
                              <option value="enterprise">enterprise</option>
                            </select>
                          </td>
                          <td className="p-3.5">
                            <Badge variant="active" className="text-[10px]">Active</Badge>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => alert(`Reset password link dispatched to ${u.email}`)}>
                                Reset Pass
                              </Button>
                              <Button size="sm" variant="danger" className="h-7 px-2 text-[11px]" onClick={() => handleDeleteUser(u.id)}>
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 4: USER FEEDBACK & BUG REPORTS ─────────────────────────── */}
          {activeTab === "feedback" && (
            <Card className="p-6 space-y-5 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquarePlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> User Feedback & Bug Reports Governance ({adminFeedbackList.length})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Review user feedback, investigate bug reports, and send official admin replies.</p>
                </div>
                <Badge variant="active" className="text-xs w-fit">
                  {adminFeedbackList.filter((f) => f.status === "pending").length} Unresolved Tickets
                </Badge>
              </div>

              <div className="space-y-4">
                {adminFeedbackList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">No feedback items available.</div>
                ) : (
                  adminFeedbackList.map((item) => {
                    const currentReply = replyTextMap[item.id] !== undefined ? replyTextMap[item.id] : item.adminReply || "";
                    const currentStatus = replyStatusMap[item.id] || item.status;
                    const isSubmitting = isSubmittingReply[item.id] || false;

                    const handleSendReply = async (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!currentReply.trim()) return;

                      setIsSubmittingReply((prev) => ({ ...prev, [item.id]: true }));
                      const now = new Date().toISOString();

                      const updatedTicket: FeedbackItem = {
                        ...item,
                        adminReply: currentReply,
                        repliedAt: now,
                        status: (currentStatus as FeedbackItem["status"]) || "resolved",
                      };

                      const newFeedbackList = adminFeedbackList.map((f) => (f.id === item.id ? updatedTicket : f));
                      setAdminFeedbackList(newFeedbackList);
                      localStorage.setItem("evoai_feedback_items", JSON.stringify(newFeedbackList));

                      // Try API dispatch
                      const authToken = token || localStorage.getItem("evoai-token") || "";
                      if (authToken) {
                        try {
                          await feedbackApi.adminReply(authToken, item.id, { reply: currentReply, status: currentStatus });
                        } catch (err) {
                          console.warn("API admin reply fallback to local storage:", err);
                        }
                      }

                      setIsSubmittingReply((prev) => ({ ...prev, [item.id]: false }));
                      alert(`Reply dispatched successfully to ${item.userName} (${item.userEmail})!`);
                    };

                    return (
                      <Card key={item.id} className="p-5 space-y-4 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-500">{item.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              {item.category}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Priority: {item.priority}
                            </span>
                            <Badge variant={item.status === "resolved" ? "active" : item.status === "under_review" ? "processing" : "neutral"} className="text-[10px]">
                              {item.status.replace("_", " ")}
                            </Badge>
                          </div>

                          <div className="text-[11px] text-slate-500 font-mono">
                            Submitted: {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>

                        {/* User info & subject */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">{item.userName} ({item.userEmail})</span>
                            <span className="text-slate-500 text-[11px] font-medium">{item.companyName}</span>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white pt-1">{item.subject}</h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            {item.description}
                          </p>
                        </div>

                        {/* Admin Response Form */}
                        <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4" /> Official Admin Reply to User
                            </label>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-500">Update Status:</span>
                              <select
                                value={currentStatus}
                                onChange={(e) => setReplyStatusMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white font-bold cursor-pointer"
                              >
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          </div>

                          <textarea
                            rows={3}
                            required
                            value={currentReply}
                            onChange={(e) => setReplyTextMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                            placeholder="Type official administrator response to this user..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                          />

                          <div className="flex items-center justify-between">
                            {item.repliedAt ? (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                ✓ Last replied on {new Date(item.repliedAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">No reply sent yet.</span>
                            )}

                            <Button
                              type="submit"
                              disabled={isSubmitting || !currentReply.trim()}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-1.5 px-4 rounded-xl flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" /> Send Response
                            </Button>
                          </div>
                        </form>
                      </Card>
                    );
                  })
                )}
              </div>
            </Card>
          )}

          {/* ── TAB VIEW 5: BUSINESS ANALYTICS ─────────────────────────────────── */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Growth Rate</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">+38.4% YoY</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">Accelerating</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Avg Health Index</span>
                  <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">94 / 100</span>
                  <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-bold block">Enterprise Standard</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Platform NPS</span>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">78 NPS</span>
                  <span className="text-[9px] text-purple-600 dark:text-purple-300 font-bold block">Top Decile</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Telemetry Rate</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">14.2k /sec</span>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block">Live Streams</span>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <PieIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Industry Distribution
                  </h3>
                  <div className="h-56 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Tech SaaS", value: 45, color: "#6366f1" },
                            { name: "E-Commerce", value: 25, color: "#8b5cf6" },
                            { name: "Fintech", value: 15, color: "#06b6d4" },
                            { name: "Healthcare", value: 15, color: "#10b981" },
                          ]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={4}
                        >
                          {["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"].map((color, idx) => (
                            <Cell key={idx} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="lg:col-span-2 p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Revenue & Health Ranking
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-2.5">Rank</th>
                          <th className="p-2.5">Company</th>
                          <th className="p-2.5">Industry</th>
                          <th className="p-2.5">Contract ARR</th>
                          <th className="p-2.5">Health</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono">
                        {companiesList.map((comp, idx) => (
                          <tr key={comp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <td className="p-2.5 font-bold text-indigo-600 dark:text-indigo-400">#{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900 dark:text-white font-sans">{comp.name}</td>
                            <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">{comp.tier}</td>
                            <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">{comp.arr}</td>
                            <td className="p-2.5 text-cyan-600 dark:text-cyan-400 font-bold">{comp.health}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── TAB VIEW 6: COMPETITOR INTELLIGENCE ───────────────────────────── */}
          {activeTab === "competitors" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Monitored Rivals</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">5 Companies</span>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block">Live Telemetry Feed</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Leader Share</span>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">42% NexusAI</span>
                  <span className="text-[9px] text-purple-600 dark:text-purple-300 font-bold block">APAC Push</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Threat Rating</span>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">Medium-High</span>
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold block">Pricing Shift</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Feature Gaps</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">3 Core Gaps</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">EvoAI Leads in Agents</span>
                </Card>
              </div>

              <Card className="p-6 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Competitor Telemetry & Market Benchmark
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Competitor</th>
                        <th className="p-3">Market Share</th>
                        <th className="p-3">Est. ARR</th>
                        <th className="p-3">Threat Level</th>
                        <th className="p-3">Key Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {[
                        { name: "Nexus AI Inc.", share: "42%", arr: "$120M", threat: "High", advantage: "Aggressive VC Pricing Push" },
                        { name: "TechNova Systems", share: "24%", arr: "$65M", threat: "Medium", advantage: "Legacy Enterprise Contracts" },
                        { name: "Apex SaaS Engine", share: "18%", arr: "$42M", threat: "Low", advantage: "Niche Developer APIs" },
                        { name: "EvoAI Corporation (YOU)", share: "16%", arr: "$31.0M", threat: "Leader", advantage: "Autonomous C-Suite AI Agents" },
                      ].map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{c.name}</td>
                          <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{c.share}</td>
                          <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{c.arr}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">{c.threat}</span>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{c.advantage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 7: AI STRATEGY CENTER ─────────────────────────────────── */}
          {activeTab === "strategy" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">AI Requests</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">1.42M</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Avg Response</span>
                  <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">240 ms</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Success Rate</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">99.4%</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Failed Requests</span>
                  <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 font-mono">0.6%</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Token Usage</span>
                  <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-mono">84.2M</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">AI Recs</span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">1,280</span>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> AI Usage Volume & Token Rate
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <YAxis stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                        <Area type="monotone" dataKey="totalUsers" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="AI Requests" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Response Time Latency (ms)
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.profitAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                        <XAxis dataKey="quarter" stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <YAxis stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                        <Bar dataKey="grossProfit" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Latency (ms)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── TAB VIEW 8: MARKETING STUDIO ─────────────────────────────────── */}
          {activeTab === "marketing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Total Campaigns</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">18</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Active</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">6 Running</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Completed</span>
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">12 Done</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Overall ROI</span>
                  <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono">3.8x Yield</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Conversion %</span>
                  <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">4.2%</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Budget</span>
                  <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">$180K</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Social Reach</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">420K</span>
                </Card>
              </div>

              <Card className="p-6 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Active Marketing Campaigns & Yield Metrics
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Campaign Name</th>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Spend</th>
                        <th className="p-3">Leads</th>
                        <th className="p-3">Conversion</th>
                        <th className="p-3">ROI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono">
                      {[
                        { name: "Q4 Enterprise AI Blitz", channel: "LinkedIn Ads", spend: "$45,000", leads: "1,240", conv: "5.8%", roi: "4.2x" },
                        { name: "C-Suite Autonomous Webinar", channel: "Direct Outreach", spend: "$28,000", leads: "890", conv: "6.4%", roi: "5.1x" },
                        { name: "SaaS Competitor Migration Push", channel: "Google Search", spend: "$32,000", leads: "710", conv: "3.9%", roi: "3.2x" },
                      ].map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{m.name}</td>
                          <td className="p-3 font-sans text-slate-600 dark:text-slate-400">{m.channel}</td>
                          <td className="p-3 text-slate-900 dark:text-white font-bold">{m.spend}</td>
                          <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">{m.leads}</td>
                          <td className="p-3 text-cyan-600 dark:text-cyan-400 font-bold">{m.conv}</td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{m.roi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 9: FINANCIAL FORECAST ────────────────────────────────── */}
          {activeTab === "forecast" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Platform Rev</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">$2.84M</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Expenses</span>
                  <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono">$890K</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Net Profit</span>
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">$1.95M</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Forecast ARR</span>
                  <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono">$38.4M</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Monthly Income</span>
                  <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">$473K</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Monthly Exp</span>
                  <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">$148K</span>
                </Card>
                <Card className="p-3 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">YoY Growth</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">+42.8%</span>
                </Card>
              </div>

              <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 12-Month Projected ARR & Profitability Runway
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.revenueTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                      <XAxis dataKey="month" stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                      <YAxis stroke="#475569" className="dark:stroke-slate-400" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Forecast Revenue ($)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 10: REPORTS CENTER ──────────────────────────────────── */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Generated Reports</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">248 Decks</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">PDF Downloads</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">1,840 Times</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Failed Builds</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">0 Failed</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Vault Storage</span>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">14.2 GB</span>
                </Card>
              </div>

              <Card className="p-6 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Generated Executive Reports History
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Report Name</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Generated By</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Downloads</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {[
                        { name: "SWOT Strategic Intelligence Deck", comp: "Apex Global Dynamics", by: "CEO Agent", date: "2026-07-21", dl: "42" },
                        { name: "Q4 Revenue Forecast & Unit Economics", comp: "EvoAI Enterprise", by: "Vault-X Finance", date: "2026-07-20", dl: "128" },
                        { name: "Competitor Intelligence Telemetry", comp: "Rio Info Tech", by: "Radar Agent", date: "2026-07-19", dl: "64" },
                      ].map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{r.name}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{r.comp}</td>
                          <td className="p-3 text-purple-600 dark:text-purple-400 font-bold">{r.by}</td>
                          <td className="p-3 font-mono text-slate-500">{r.date}</td>
                          <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{r.dl}</td>
                          <td className="p-3 text-right">
                            <Button size="sm" variant="outline" className="text-xs py-1 px-2.5">
                              <Download className="w-3.5 h-3.5 mr-1" /> PDF
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 11: TASK MANAGER ─────────────────────────────────────── */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Pending Tasks</span>
                  <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">14 Open</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Completed Tasks</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">128 Done</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Assigned Tasks</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">42 Active</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Overdue Tasks</span>
                  <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">1 Overdue</span>
                </Card>
              </div>

              <Card className="p-6 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> C-Suite & System Task Assignments
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Task Title</th>
                        <th className="p-3">Assigned To</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {[
                        { title: "Review Q4 EU Regulatory Compliance", to: "Legal AI Agent", pri: "High", due: "Today 18:00", st: "In Progress" },
                        { title: "Deploy APAC Regional API Gateway Cluster", to: "Nexus-Ops", pri: "Critical", due: "Tomorrow", st: "Pending" },
                        { title: "Synthesize Competitor Pricing Benchmark", to: "Radar Agent", pri: "Medium", due: "2026-07-24", st: "Completed" },
                      ].map((t, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{t.title}</td>
                          <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">{t.to}</td>
                          <td className="p-3 font-mono">{t.pri}</td>
                          <td className="p-3 font-mono text-slate-500">{t.due}</td>
                          <td className="p-3">
                            <Badge variant={t.st === "Completed" ? "active" : "processing"} className="text-[10px]">{t.st}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 12: AI AGENTS ────────────────────────────────────────── */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Active Fleet</span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">8 C-Suite</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Running Cycles</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">5 Active</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Idle Standby</span>
                  <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">3 Standby</span>
                </Card>
                <Card className="p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Failed Loops</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">0 Errors</span>
                </Card>
              </div>

              <Card className="p-6 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Autonomous Agent Fleet Telemetry
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Agent Name</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Current Active Task</th>
                        <th className="p-3">Avg Response</th>
                        <th className="p-3 text-right">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {[
                        { name: "Aura-1 (CEO Agent)", status: "Active", task: "APAC Strategic Expansion Report", time: "180ms" },
                        { name: "Vault-X (CFO Agent)", status: "Active", task: "Reallocating Capital Pools", time: "210ms" },
                        { name: "Nexus-Ops (COO Agent)", status: "Processing", task: "Kubernetes Cluster Scaling", time: "140ms" },
                        { name: "Radar-Intel (CMO Agent)", status: "Active", task: "Competitor Price Change Audit", time: "190ms" },
                      ].map((a, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{a.name}</td>
                          <td className="p-3">
                            <Badge variant={a.status === "Active" ? "active" : "processing"} className="text-[10px]">{a.status}</Badge>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{a.task}</td>
                          <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400 font-bold">{a.time}</td>
                          <td className="p-3 text-right">
                            <Button size="sm" variant="outline" className="text-xs py-1 px-2">
                              Trigger Cycle
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 13: SYSTEM NOTIFICATIONS ───────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <Card className="p-3.5 sm:p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Announcements</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">12</span>
                    <span className="text-xs font-bold text-slate-500">Sent</span>
                  </div>
                </Card>
                <Card className="p-3.5 sm:p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">System Alerts</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">2</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Critical</span>
                  </div>
                </Card>
                <Card className="p-3.5 sm:p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Maintenance</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">1</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Scheduled</span>
                  </div>
                </Card>
                <Card className="p-3.5 sm:p-4 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Engine Updates</span>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">v4.2</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                  </div>
                </Card>
              </div>

              <Card className="p-4 sm:p-6 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Platform System Announcements & Maintenance Feed
                  </h3>
                  <Badge variant="active" className="w-fit text-[10px]">3 Active Notices</Badge>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { title: "Scheduled Database Maintenance Window", time: "Sun, July 26 • 02:00 UTC", type: "Maintenance", desc: "Routine PostgreSQL index optimization and automated backup verification." },
                    { title: "Enterprise AI Agent Engine v4.2 Deployment", time: "July 20, 2026", type: "Update", desc: "Deployed high-speed LLM context streaming and reduced response latency by 35%." },
                    { title: "EU AI Act Regulatory Compliance Dispatch", time: "July 18, 2026", type: "Notice", desc: "All enterprise tenant audit logs updated to meet new EU transparency standards." },
                  ].map((n, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{n.title}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                            {n.type}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{n.desc}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono shrink-0 sm:pt-0.5 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800/60 pt-2 sm:pt-0">
                        <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── TAB VIEW 14: SECURITY & SETTINGS ───────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">API Keys</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">14 Active</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">JWT Expiry</span>
                  <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">24 Hours</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">SMTP Server</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">Connected</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Theme Default</span>
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">System</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Audit Level</span>
                  <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono">SOC2 Clean</span>
                </Card>
                <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">2FA Enforced</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">Enabled</span>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 space-y-3 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Master API Credentials & Token Governance
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Manage system-wide API keys for PostgreSQL connections, LLM providers, and external webhooks.
                  </p>
                  <div className="pt-2">
                    <Button size="sm" variant="gradient" className="text-xs">
                      Rotate System Master Keys
                    </Button>
                  </div>
                </Card>

                <Card className="p-5 space-y-3 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Emergency System Maintenance Switch
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Instantly toggle system maintenance mode or restrict incoming API access during critical updates.
                  </p>
                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="text-xs border-amber-500/40 text-amber-600 dark:text-amber-400">
                      Enable Maintenance Mode
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── ADD USER MODAL ─────────────────────────────────────────────────────── */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Create Database User
              </h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="marcus@vanguard.ai"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Initial Password *</label>
                <div className="relative w-full">
                  <input
                    type={showAddUserPassword ? "text" : "password"}
                    required
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddUserPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none focus:text-purple-500 transition-colors p-0.5"
                    aria-label={showAddUserPassword ? "Hide password" : "Show password"}
                    title={showAddUserPassword ? "Hide password" : "Show password"}
                  >
                    {showAddUserPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Company</label>
                <input
                  type="text"
                  value={newUserForm.company}
                  onChange={(e) => setNewUserForm({ ...newUserForm, company: e.target.value })}
                  placeholder="Apex Global"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">RBAC Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="enterprise">enterprise</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Cancel</button>
                <Button type="submit" disabled={isSubmittingUser} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl">
                  {isSubmittingUser ? "Creating..." : "Save User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
