"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BrainCircuit,
  Target,
  TrendingUp,
  Megaphone,
  BarChart3,
  CheckSquare,
  FileText,
  Zap,
  Activity,
  Settings,
  User,
  Shield,
  Cpu,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  Search,
  Sparkles,
  ChevronRight,
  Building2,
  Layers,
} from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { DashboardProvider, useDashboard } from "@/context/dashboard-context";
import { Badge } from "@/components/ui/badge";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab, tasks, agents } = useDashboard();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "Finance Agent (Vault-X)",
      desc: "Reallocated $450k into high-yield enterprise liquidity pool.",
      time: "2m ago",
      read: false,
    },
    {
      id: "n-2",
      title: "CEO Agent (Aura-1)",
      desc: "Generated Q4 APAC Expansion Strategy Report.",
      time: "14m ago",
      read: false,
    },
    {
      id: "n-3",
      title: "Competitor Intel Alert",
      desc: "QuantumSaaS shifted API Gateway bundle pricing.",
      time: "1h ago",
      read: false,
    },
    {
      id: "n-4",
      title: "Operations Agent (Nexus-Ops)",
      desc: "Autoscaled multi-region Kubernetes clusters (latency -14ms).",
      time: "3h ago",
      read: true,
    },
  ]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  useEffect(() => {
    if (user?.role === "admin") return;
    const token = localStorage.getItem("evoai-token");
    if (!token) return;
    import("@/lib/api").then(({ businessApi }) => {
      businessApi.getSetup(token).then((res) => {
        if ((res as any).role === "admin") return;
        if (res.success && res.setupCompleted === false && pathname !== "/business-setup") {
          router.push("/business-setup");
        }
      }).catch(() => {});
    });
  }, [pathname, router, user?.role]);

  const isMainDashboard = pathname === "/dashboard";

  const moduleNavItems = [
    { id: "dashboard", name: "Executive Dashboard", icon: LayoutDashboard },
    { id: "agents", name: "AI CEO & Agents", icon: BrainCircuit },
    { id: "competitors", name: "Competitors", icon: Target },
    { id: "trends", name: "Market Trends", icon: TrendingUp },
    { id: "marketing", name: "Marketing Studio", icon: Megaphone },
    { id: "analytics", name: "Financial Analytics", icon: BarChart3 },
    { id: "task-manager", name: "AI Task Planner", icon: CheckSquare },
    { id: "reports", name: "Reports Center", icon: FileText },
    { id: "strategy", name: "AI Business Chat", icon: Zap, badge: "AI" },
    { id: "forecast", name: "Financial Forecast", icon: Activity },
  ];

  const systemNavItems = [
    { name: "Business Setup", href: "/business-setup", icon: Building2 },
    { name: "Daily Business Data Entry", href: "/dashboard/business-operations", icon: Layers },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "User Profile", href: "/dashboard/profile", icon: User },
  ];

  const handleModuleClick = (tabId: string) => {
    setActiveTab(tabId);
    if (!isMainDashboard) {
      router.push("/dashboard");
    }
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    const isAdmin = user?.role === "admin";
    logout();
    router.push(isAdmin ? "/" : "/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Logo */}
          <div className="flex items-center justify-between pb-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  EvoAI Console
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Enterprise Engine v4.0</span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Nav Links */}
          <div className="space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Cognitive Modules
            </div>
            {moduleNavItems.map((item) => {
              const Icon = item.icon;
              const isSelected = isMainDashboard && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleModuleClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-400">
                      {item.badge}
                    </span>
                  )}
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </button>
              );
            })}
          </div>

          {/* System Settings Links */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Controls
            </div>
            {systemNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-2.5 px-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow shrink-0">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user?.company || "Enterprise Account"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs text-slate-400 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all w-72 shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 truncate">
                  Search modules, tasks, telemetry...
                </span>
              </div>
              <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 w-auto sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-500" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Live Notifications</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400">
                        {notifications.filter((n) => !n.read).length} new
                      </span>
                    </div>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleNotificationRead(item.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          item.read
                            ? "border-transparent bg-slate-50/50 dark:bg-slate-800/30 opacity-75"
                            : "border-indigo-500/30 bg-indigo-500/10 dark:bg-indigo-950/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            {!item.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />}
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark & Light Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>

        {/* Global Search Command Palette Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <div
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-24 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden space-y-0"
              >
                {/* Search Input Header */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
                  <Search className="w-5 h-5 text-indigo-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search modules, tasks, AI agents, financial telemetry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSearchOpen(false);
                      }
                    }}
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    title="Close search (ESC)"
                    className="text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded px-2 py-1 font-mono shrink-0 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    <span>ESC</span>
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                {/* Search Results List */}
                {(() => {
                  const query = searchQuery.trim().toLowerCase();

                  const filteredModules = moduleNavItems.filter((item) =>
                    !query || item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
                  );

                  const filteredTasks = (tasks || []).filter((task) =>
                    !query ||
                    task.title.toLowerCase().includes(query) ||
                    task.category.toLowerCase().includes(query) ||
                    task.assigneeAgent.toLowerCase().includes(query)
                  );

                  const filteredAgents = (agents || []).filter((agent) =>
                    !query ||
                    agent.name.toLowerCase().includes(query) ||
                    agent.role.toLowerCase().includes(query) ||
                    agent.currentTask.toLowerCase().includes(query)
                  );

                  const telemetryItems = [
                    { name: "Monthly Revenue ($2.84M)", tab: "analytics", desc: "+38% YoY Growth" },
                    { name: "Monthly Expenses ($1.94M)", tab: "analytics", desc: "Operational Spend" },
                    { name: "Net Profit Margin (31.4%)", tab: "analytics", desc: "Gross Profitability" },
                    { name: "Business Health Score (92/100)", tab: "dashboard", desc: "Executive Health Index" },
                  ].filter((m) => !query || m.name.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query));

                  const totalCount = filteredModules.length + filteredTasks.length + filteredAgents.length + telemetryItems.length;

                  if (query && totalCount === 0) {
                    return (
                      <div className="p-12 text-center space-y-2">
                        <Search className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-sm font-bold text-slate-300">No results found for &quot;{searchQuery}&quot;</p>
                        <p className="text-xs text-slate-500">Try searching for &quot;Revenue&quot;, &quot;Marketing&quot;, or &quot;CEO Agent&quot;</p>
                      </div>
                    );
                  }

                  return (
                    <div className="max-h-[380px] overflow-y-auto p-3 space-y-4 divide-y divide-slate-800/60">
                      {/* Navigation Modules */}
                      {filteredModules.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-2 block">
                            Platform Modules ({filteredModules.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                            {filteredModules.map((mod) => {
                              const IconComp = mod.icon;
                              return (
                                <button
                                  key={mod.id}
                                  onClick={() => {
                                    handleModuleClick(mod.id);
                                    setIsSearchOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-700/50"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                      <IconComp className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                                      {mod.name}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* AI Tasks */}
                      {filteredTasks.length > 0 && (
                        <div className="space-y-1 pt-3">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 block">
                            AI Tasks ({filteredTasks.length})
                          </span>
                          <div className="space-y-1 mt-1">
                            {filteredTasks.slice(0, 4).map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  handleModuleClick("task-manager");
                                  setIsSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-700/50"
                              >
                                <div className="flex items-center gap-2.5">
                                  <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                                  <div>
                                    <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                                      {t.title}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {t.assigneeAgent} · {t.priority} Priority
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                                  {t.status}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Agents */}
                      {filteredAgents.length > 0 && (
                        <div className="space-y-1 pt-3">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-2 block">
                            AI Executive Agents ({filteredAgents.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                            {filteredAgents.slice(0, 4).map((agent) => (
                              <button
                                key={agent.id}
                                onClick={() => {
                                  handleModuleClick("agents");
                                  setIsSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-700/50"
                              >
                                <div className="flex items-center gap-2.5">
                                  <BrainCircuit className="w-4 h-4 text-purple-400 shrink-0" />
                                  <div>
                                    <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                                      {agent.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{agent.role}</span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-400">
                                  {agent.efficiencyScore}%
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Telemetry Metrics */}
                      {telemetryItems.length > 0 && (
                        <div className="space-y-1 pt-3">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 block">
                            Financial Telemetry ({telemetryItems.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                            {telemetryItems.map((m, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  handleModuleClick(m.tab);
                                  setIsSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-700/50"
                              >
                                <div className="flex items-center gap-2.5">
                                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <div>
                                    <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                                      {m.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{m.desc}</span>
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Modal Footer */}
                <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Press <kbd className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-bold">ESC</kbd> or click to exit search
                  </button>
                  <span>Autonomous Enterprise Search Engine</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}

