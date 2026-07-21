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

  const filteredUsers = usersList.filter(
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
          {/* ── 8 STATS METRIC CARDS ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Total Companies</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">{stats.totalCompanies}</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">+3 new this month</span>
            </Card>

            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Total Users</span>
              <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-mono">{usersList.length || stats.totalUsers}</span>
              <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block">Live DB Users</span>
            </Card>

            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Total Revenue</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{stats.totalRevenue}</span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block">+38% YoY ARR</span>
            </Card>

            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Health Score</span>
              <span className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{stats.healthScore}/100</span>
              <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-bold block">Executive Index</span>
            </Card>

            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Active Agents</span>
              <span className="text-lg font-extrabold text-purple-600 dark:text-purple-300 font-mono">{stats.activeAgents}</span>
              <span className="text-[9px] text-purple-600 dark:text-purple-400 font-bold block">Autonomous C-Suite</span>
            </Card>

            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Pending Reports</span>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">{stats.pendingReports}</span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold block">In Synthesis</span>
            </Card>

            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Today Analysis</span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{stats.todayAnalysis}</span>
              <span className="text-[9px] text-indigo-600 dark:text-indigo-300 font-bold block">Telemetry Scans</span>
            </Card>

            <Card className="p-3.5 space-y-1 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase block">Audit Logs</span>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">{recentLogs.length || stats.recentActivitiesCount}</span>
              <span className="text-[9px] text-slate-600 dark:text-slate-400 font-bold block">Passed Clean</span>
            </Card>
          </div>

          {/* ── TAB VIEW 1: DASHBOARD OVERVIEW & SYSTEM DIAGNOSTICS ────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* CHARTS ROW 1: REVENUE TREND & PROFIT ANALYSIS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
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

                {/* Profit Analysis Chart */}
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Quarterly Profit & Margin Breakdown
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Gross profit vs net retained margin</p>
                    </div>
                    <Badge variant="gradient">Enterprise Q4</Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.profitAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                        <XAxis dataKey="quarter" stroke="#475569" className="dark:stroke-slate-400" fontSize={11} />
                        <YAxis stroke="#475569" className="dark:stroke-slate-400" fontSize={11} tickFormatter={(v) => `$${v / 1000}K`} />
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", color: "#0f172a" }} />
                        <Bar dataKey="grossProfit" fill="#6366f1" radius={[4, 4, 0, 0]} name="Gross Profit ($)" />
                        <Bar dataKey="netMargin" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Net Margin ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* CHARTS ROW 2: USER GROWTH & RECENT ACTIVITY LOGS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Platform User Adoption Growth
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Total registered enterprise seats vs daily active leaders</p>
                    </div>
                    <Badge variant="active">+14% MoM</Badge>
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

                {/* Audit Logs */}
                <Card className="p-5 space-y-4 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" /> System Activity Audit Log
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">Immutable governance ledger</p>
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

          {/* ── TAB VIEW 2: USER MANAGEMENT & RBAC ──────────────────────────────── */}
          {activeTab === "users" && (
            <Card className="p-6 space-y-5 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> User Management & Role-Based Access Control (RBAC)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Manage real database users, assign system roles, and revoke access.</p>
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
                      <th className="p-3.5">Created At</th>
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
                        <td className="p-3.5 text-slate-500 font-mono">
                          {new Date(u.created_at || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── TAB VIEW 3: COMPANY MANAGEMENT ───────────────────────────────────── */}
          {activeTab === "companies" && (
            <Card className="p-6 space-y-5 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> Managed Enterprise Companies ({companiesList.length})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Enterprise subscriptions, ARR allocations, and seat governance.</p>
                </div>
              </div>

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
            </Card>
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

          {/* ── OTHER ADMIN TABS: ANALYTICS, COMPETITORS, STRATEGY, MARKETING, FORECAST, REPORTS, TASKS, AGENTS, NOTIFICATIONS, SETTINGS ── */}
          {["analytics", "competitors", "strategy", "marketing", "forecast", "reports", "tasks", "agents", "notifications", "settings"].includes(activeTab) && (
            <Card className="p-6 space-y-5 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" /> System Module: {activeTab}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Admin management interface and PostgreSQL system diagnostic parameters.</p>
                </div>
                <Badge variant="active" className="text-xs">
                  Active DB Telemetry ({usersList.length} Accounts)
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Live DB Users</span>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{usersList.length}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">PostgreSQL Auth Table</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Managed Companies</span>
                  <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">{companiesList.length || stats.totalCompanies}</p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Active Tenants</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Platform Telemetry</span>
                  <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">{stats.totalRevenue}</p>
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">Verified System Volume</p>
                </div>
              </div>
            </Card>
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
