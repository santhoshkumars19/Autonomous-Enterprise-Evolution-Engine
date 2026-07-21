"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateBusinessReport } from "@/lib/pdf-generator";
import { useAuth } from "@/components/auth-provider";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  LayoutDashboard,
  TrendingUp,
  Shield,
  ShieldAlert,
  BrainCircuit,
  Zap,
  DollarSign,
  Target,
  CheckSquare,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Download,
  Printer,
  Activity,
  Plus,
  Layers,
  Globe,
  Flame,
  Check,
  Megaphone,
  BarChart3,
  Clock,
  ExternalLink,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useDashboard, ModuleData } from "@/context/dashboard-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const revenueData = [
  { month: "Jan", revenue: 1800000, profit: 540000, expenses: 1260000 },
  { month: "Feb", revenue: 2100000, profit: 670000, expenses: 1430000 },
  { month: "Mar", revenue: 2350000, profit: 750000, expenses: 1600000 },
  { month: "Apr", revenue: 2200000, profit: 690000, expenses: 1510000 },
  { month: "May", revenue: 2600000, profit: 820000, expenses: 1780000 },
  { month: "Jun", revenue: 2840500, profit: 892100, expenses: 1948400 },
];

const expenseBreakdown = [
  { name: "Cloud Infrastructure", value: 45, color: "#6366f1" },
  { name: "R&D AI Engineering", value: 25, color: "#a855f7" },
  { name: "Customer Acquisition", value: 15, color: "#ec4899" },
  { name: "Executive Payroll", value: 15, color: "#10b981" },
];

const forecastData = [
  { month: "Jul '26", projected: 3100000, baseline: 2900000 },
  { month: "Aug '26", projected: 3450000, baseline: 3000000 },
  { month: "Sep '26", projected: 3900000, baseline: 3150000 },
  { month: "Oct '26", projected: 4300000, baseline: 3300000 },
  { month: "Nov '26", projected: 4800000, baseline: 3450000 },
  { month: "Dec '26", projected: 5400000, baseline: 3600000 },
];

const industryTrendData = [
  { quarter: "Q1 '23", aiAdoption: 34, cloudSpend: 41, automation: 58, cybersecurity: 68 },
  { quarter: "Q2 '23", aiAdoption: 42, cloudSpend: 48, automation: 63, cybersecurity: 71 },
  { quarter: "Q3 '23", aiAdoption: 51, cloudSpend: 56, automation: 69, cybersecurity: 75 },
  { quarter: "Q4 '23", aiAdoption: 60, cloudSpend: 64, automation: 74, cybersecurity: 79 },
  { quarter: "Q1 '24", aiAdoption: 68, cloudSpend: 71, automation: 79, cybersecurity: 83 },
  { quarter: "Q2 '24", aiAdoption: 76, cloudSpend: 78, automation: 84, cybersecurity: 87 },
  { quarter: "Q3 '24", aiAdoption: 82, cloudSpend: 84, automation: 88, cybersecurity: 90 },
];

const competitorData = [
  { name: "TechNova Corp", share: "28.4%", revenue: "$8.2B", growth: "+14%", pricing: "$299/mo", threat: "High Threat", level: "high", color: "#8b5cf6" },
  { name: "Nexus AI", share: "22.1%", revenue: "$6.1B", growth: "+31%", pricing: "$199/mo", threat: "Critical Threat", level: "critical", color: "#06b6d4" },
  { name: "CoreSystems", share: "18.7%", revenue: "$5.4B", growth: "+7%", pricing: "$349/mo", threat: "Medium Threat", level: "medium", color: "#14b8a6" },
  { name: "Vertex Platform", share: "11.3%", revenue: "$3.2B", growth: "+22%", pricing: "$249/mo", threat: "Medium Threat", level: "medium", color: "#84cc16" },
  { name: "You (EvoAI)", share: "9.8%", revenue: "$2.8B", growth: "+38%", pricing: "$179/mo", threat: "YOU", level: "you", color: "#d946ef", isUser: true },
];

const marketShareDistribution = [
  { name: "TechNova Corp", value: 28.4, color: "#8b5cf6" },
  { name: "Nexus AI", value: 22.1, color: "#06b6d4" },
  { name: "CoreSystems", value: 18.7, color: "#14b8a6" },
  { name: "Vertex Platform", value: 11.3, color: "#84cc16" },
  { name: "A3E (You)", value: 9.8, color: "#d946ef" },
];

const pricingComparisonData = [
  { name: "A3E (You)", starter: 80, pro: 179 },
  { name: "Nexus AI", starter: 100, pro: 199 },
  { name: "TechNova", starter: 130, pro: 299 },
  { name: "CoreSystems", starter: 150, pro: 349 },
  { name: "Vertex", starter: 90, pro: 249 },
];

const competitorActivitiesList = [
  { company: "Nexus AI", text: "Launched $199/mo APAC pricing campaign", time: "2 hr ago", badgeColor: "bg-rose-500" },
  { company: "TechNova Corp", text: "Acquired VistaData for $340M", time: "1 day ago", badgeColor: "bg-amber-500" },
  { company: "CoreSystems", text: "Released v8.0 with AI integration", time: "2 days ago", badgeColor: "bg-indigo-500" },
  { company: "Vertex Platform", text: "Closed $120M Series C funding", time: "3 days ago", badgeColor: "bg-cyan-500" },
  { company: "Nexus AI", text: "Hired VP of Enterprise from Salesforce", time: "5 days ago", badgeColor: "bg-emerald-500" },
];

const marketingCampaigns = [
  {
    title: "Q4 AI Awareness",
    type: "Multi-channel",
    status: "Active",
    budget: "$45,000",
    spent: "$28,420",
    roi: "312%",
    reach: "2.4M",
    usedPercent: 63,
  },
  {
    title: "Enterprise Outreach",
    type: "LinkedIn + Email",
    status: "Active",
    budget: "$30,000",
    spent: "$18,200",
    roi: "241%",
    reach: "420K",
    usedPercent: 61,
  },
  {
    title: "Product Launch 3.0",
    type: "Paid Search",
    status: "Scheduled",
    budget: "$60,000",
    spent: "$0",
    roi: "-",
    reach: "-",
    usedPercent: 0,
  },
];

const socialMediaCalendarData = [
  { day: "Mon", linkedin: 2, twitter: 3, instagram: 1 },
  { day: "Tue", linkedin: 1, twitter: 2, instagram: 2 },
  { day: "Wed", linkedin: 3, twitter: 4, instagram: 1 },
  { day: "Thu", linkedin: 2, twitter: 2, instagram: 3 },
  { day: "Fri", linkedin: 2, twitter: 3, instagram: 2 },
  { day: "Sat", linkedin: 0, twitter: 1, instagram: 2 },
  { day: "Sun", linkedin: 0, twitter: 1, instagram: 1 },
];

const adChannelPerformanceData = [
  { channel: "Search", impressions: 420000, clicks: 95000, conversions: 14200 },
  { channel: "Display", impressions: 1200000, clicks: 240000, conversions: 18000 },
  { channel: "Social", impressions: 70000, clicks: 15000, conversions: 1200 },
  { channel: "Email", impressions: 84000, clicks: 21000, conversions: 2100 },
  { channel: "Video", impressions: 650000, clicks: 120000, conversions: 8400 },
];

const financialForecastCurveData = [
  { quarter: "Q1 '24", aiForecast: 3.1, optimistic: 3.4 },
  { quarter: "Q2 '24", aiForecast: 3.8, optimistic: 4.1 },
  { quarter: "Q3 '24", aiForecast: 4.6, optimistic: 5.0 },
  { quarter: "Q4 '24", aiForecast: 5.8, optimistic: 6.6 },
  { quarter: "Q1 '25", aiForecast: 6.3, optimistic: 7.2 },
  { quarter: "Q2 '25", aiForecast: 7.1, optimistic: 8.5 },
];

const financialExpenseBreakdown = [
  { name: "Personnel", value: 42, color: "#8b5cf6" },
  { name: "Technology", value: 18, color: "#0284c7" },
  { name: "Marketing", value: 15, color: "#06b6d4" },
  { name: "Operations", value: 13, color: "#84cc16" },
  { name: "R&D", value: 12, color: "#d946ef" },
];

const cashFlowData = [
  { month: "Jan", inflow: 3.2, outflow: 2.1 },
  { month: "Feb", inflow: 3.5, outflow: 2.3 },
  { month: "Mar", inflow: 3.9, outflow: 2.4 },
  { month: "Apr", inflow: 3.7, outflow: 2.3 },
  { month: "May", inflow: 4.2, outflow: 2.6 },
  { month: "Jun", inflow: 4.4, outflow: 2.8 },
  { month: "Jul", inflow: 4.8, outflow: 2.9 },
];

const departmentRoiData = [
  { dept: "Marketing", invested: "$450K invested", roi: "312% ROI", widthPercent: 90 },
  { dept: "Sales", invested: "$620K invested", roi: "241% ROI", widthPercent: 75 },
  { dept: "Technology", invested: "$510K invested", roi: "198% ROI", widthPercent: 62 },
  { dept: "R&D", invested: "$380K invested", roi: "186% ROI", widthPercent: 58 },
  { dept: "Operations", invested: "$290K invested", roi: "134% ROI", widthPercent: 42 },
];

const taskPlannerDataset = [
  {
    id: "tp-1",
    title: "Complete Q4 Strategic Plan",
    desc: "Develop comprehensive Q4 strategy leveraging AI insights",
    priority: "Critical",
    status: "In Progress",
    assigneeName: "Sarah Chen",
    assigneeInitials: "SC",
    aiScore: 95,
    dueDate: "08/15",
    fullDueDate: "2024-08-15",
  },
  {
    id: "tp-2",
    title: "Review Competitor Intelligence Report",
    desc: "Analyze latest competitor movements and update threat matrix",
    priority: "High",
    status: "To Do",
    assigneeName: "Marcus Rodriguez",
    assigneeInitials: "MR",
    aiScore: 88,
    dueDate: "08/12",
    fullDueDate: "2024-08-12",
  },
  {
    id: "tp-3",
    title: "Launch APAC Expansion Study",
    desc: "Conduct feasibility study for Southeast Asia market entry",
    priority: "High",
    status: "To Do",
    assigneeName: "Aiko Tanaka",
    assigneeInitials: "AT",
    aiScore: 91,
    dueDate: "08/20",
    fullDueDate: "2024-08-20",
  },
  {
    id: "tp-4",
    title: "Optimize Pricing Model",
    desc: "Revise pricing tiers based on market research",
    priority: "Medium",
    status: "In Progress",
    assigneeName: "David Kim",
    assigneeInitials: "DK",
    aiScore: 79,
    dueDate: "08/25",
    fullDueDate: "2024-08-25",
  },
  {
    id: "tp-5",
    title: "Reduce Customer Churn",
    desc: "Deploy proactive intervention model for tier-2 accounts",
    priority: "Critical",
    status: "In Progress",
    assigneeName: "Sarah Chen",
    assigneeInitials: "SC",
    aiScore: 94,
    dueDate: "08/10",
    fullDueDate: "2024-08-10",
  },
  {
    id: "tp-6",
    title: "Board Presentation Q3 Results",
    desc: "Prepare comprehensive Q3 performance deck for board",
    priority: "High",
    status: "Done",
    assigneeName: "Marcus Rodriguez",
    assigneeInitials: "MR",
    aiScore: 92,
    dueDate: "08/01",
    fullDueDate: "2024-08-01",
  },
];

const teamProgressMembers = [
  { initials: "SC", name: "Sarah Chen", role: "CEO", completed: 12, active: 4, percent: 75 },
  { initials: "MR", name: "Marcus Rodriguez", role: "CFO", completed: 9, active: 3, percent: 75 },
  { initials: "AT", name: "Aiko Tanaka", role: "CTO", completed: 15, active: 6, percent: 71 },
  { initials: "DK", name: "David Kim", role: "CMO", completed: 11, active: 5, percent: 68 },
];

const swotMatrixData = {
  strengths: [
    "Industry-leading AI accuracy (94%)",
    "38% YoY growth rate",
    "NPS Score of 72 (best in class)",
    "Profitability at scale",
    "Strong enterprise pipeline",
  ],
  weaknesses: [
    "Limited brand recognition vs incumbents",
    "Small sales team (18 reps)",
    "No physical offices in APAC",
    "Limited ecosystem of integrations",
    "Single product dependency",
  ],
  opportunities: [
    "APAC market expansion ($4.2M potential)",
    "AI regulation driving enterprise demand",
    "Competitor pricing vulnerability",
    "Vertical SaaS expansion",
    "Partnership with hyperscalers",
  ],
  threats: [
    "Nexus AI aggressive APAC push",
    "Economic slowdown reducing SaaS spend",
    "EU AI Act compliance requirements",
    "Big tech entering the space",
    "Talent war in AI engineering",
  ],
};

const healthRadarData = [
  { subject: "Revenue", value: 92 },
  { subject: "Market Share", value: 68 },
  { subject: "Innovation", value: 88 },
  { subject: "Operations", value: 79 },
  { subject: "Talent", value: 74 },
  { subject: "Customer", value: 85 },
];

export default function DashboardPage() {
  const {
    modules,
    agents,
    tasks,
    competitors,
    activeTab,
    setActiveTab,
    toggleTaskStatus,
    addNewTask,
    updateTask,
    triggerAgentAction,
    generatedStrategy,
    generateNewStrategy,
    isGeneratingStrategy,
  } = useDashboard();

  const { user, token } = useAuth();

  // ── Dynamic Real-Time API Data State ──────────────────────────────────────────
  const [liveData, setLiveData] = useState<{
    healthScore: number;
    companyName: string;
    radarData: Array<{ subject: string; value: number }>;
    swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
    kpis: {
      revenue?: { formatted: string; change: number };
      net_profit?: { formatted: string; change: number };
      burn_rate?: { formatted: string; change: number };
      runway_months?: { change: number };
    };
    revenueTrend: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
    financialForecast: Array<{ month: string; projected: number; baseline: number }>;
    executiveSummary: string;
  }>({
    healthScore: 92,
    companyName: user?.company || "Enterprise Company",
    radarData: [
      { subject: "Profit Margin", value: 85 },
      { subject: "Customer Retention", value: 90 },
      { subject: "Revenue Growth", value: 88 },
      { subject: "Risk Defense", value: 82 },
      { subject: "Executive Health", value: 92 },
    ],
    swot: swotMatrixData,
    kpis: {},
    revenueTrend: revenueData,
    financialForecast: forecastData,
    executiveSummary: "",
  });

  const [dynamicCompetitors, setDynamicCompetitors] = useState<any[]>(competitorData);
  const [dynamicFeed, setDynamicFeed] = useState<any[]>(competitorActivitiesList);
  const [dynamicTasksList, setDynamicTasksList] = useState<any[]>(taskPlannerDataset);
  const [ceoRecommendations, setCeoRecommendations] = useState<string[]>([]);
  const [industryTrendsState, setIndustryTrendsState] = useState<{ metrics: any[]; topics: string[] } | null>(null);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: "user" | "ai"; text: string; time: string }>
  >([
    {
      id: "m-1",
      sender: "ai",
      text: `- Faster VC funding traction (vs $120M Series C recovery)\n- Growing APAC presence\n\n🎯 **Recommendation:** Accelerate APAC entry before Nexus AI consolidates that market. Their new pricing suggests they're burning cash - your profitability is a strategic advantage.`,
      time: "10:27 AM",
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("evoai-token") : null);
      if (!authToken) return;
      try {
        const { reportsApi, financialApi, competitorApi, tasksApi, chatApi } = await import("@/lib/api");
        const [healthRes, swotRes, finRes, compRes, actRes, tasksRes, chatHistRes] = await Promise.all([
          reportsApi.health(authToken).catch(() => null),
          reportsApi.swot(authToken).catch(() => null),
          financialApi.overview(authToken).catch(() => null),
          competitorApi.overview(authToken).catch(() => null),
          competitorApi.activity(authToken).catch(() => null),
          tasksApi.list(authToken).catch(() => null),
          chatApi.history(authToken).catch(() => null),
        ]);

        const analysis = (finRes as any)?.analysis || (healthRes as any)?.analysis;
        const companyName = (swotRes as any)?.companyName || user?.company || "Enterprise Company";

        if ((healthRes as any)?.ceoRecommendations) {
          setCeoRecommendations((healthRes as any).ceoRecommendations);
        }
        if ((healthRes as any)?.industryTrends) {
          setIndustryTrendsState((healthRes as any).industryTrends);
        }

        setLiveData({
          healthScore: healthRes?.score || analysis?.healthScore || 92,
          companyName,
          radarData: healthRes?.radarData
            ? (healthRes.radarData as any[]).map((r) => ({ subject: r.metric || r.subject, value: r.score || r.value }))
            : [
                { subject: "Profit Margin", value: 85 },
                { subject: "Customer Retention", value: 90 },
                { subject: "Revenue Growth", value: 88 },
                { subject: "Risk Defense", value: 82 },
                { subject: "Executive Health", value: healthRes?.score || 92 },
              ],
          swot: (swotRes?.swot as any) || analysis?.swotAnalysis || swotMatrixData,
          kpis: (finRes?.kpis as any) || {},
          revenueTrend: analysis?.salesTrend || revenueData,
          financialForecast: analysis?.financialForecast
            ? (analysis.financialForecast as any[]).map((ff: any) => ({
                month: ff.period || ff.month,
                projected: ff.projectedRevenue || ff.projected,
                baseline: ff.projectedExpenses || ff.baseline,
              }))
            : forecastData,
          executiveSummary: analysis?.executiveSummary || "",
        });

        if (compRes?.success && Array.isArray(compRes.competitors)) {
          setDynamicCompetitors(
            compRes.competitors.map((c: any) => ({
              name: c.name,
              share: c.share || "20%",
              revenue: `$${((c.score * 80) / 10).toFixed(1)}M`,
              growth: c.growth || "+18%",
              pricing: `$${c.pricing || 199}/mo`,
              threat: c.tag ? `${c.tag} Threat` : "Medium Threat",
              level: c.highlight ? "you" : "high",
              color: c.highlight ? "#d946ef" : "#06b6d4",
              isUser: !!c.highlight,
            }))
          );
        }

        if (actRes?.success && Array.isArray(actRes.feed)) {
          setDynamicFeed(
            actRes.feed.map((f: any) => ({
              company: f.event.split(" ")[0] || "Competitor",
              text: f.event,
              time: f.time,
              badgeColor: f.severity === "high" ? "bg-rose-500" : "bg-indigo-500",
            }))
          );
        }

        if (tasksRes?.success && Array.isArray(tasksRes.tasks) && tasksRes.tasks.length > 0) {
          setDynamicTasksList(
            tasksRes.tasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              desc: t.description || "Task generated from AI telemetry",
              priority: (t.priority || "high").charAt(0).toUpperCase() + (t.priority || "high").slice(1),
              status: t.status === "in_progress" ? "In Progress" : t.status === "done" ? "Done" : "To Do",
              assigneeName: t.assignee || "Executive AI",
              assigneeInitials: (t.assignee || "AI").slice(0, 2).toUpperCase(),
              aiScore: t.ai_score || 90,
              dueDate: t.due_date || "Today",
              fullDueDate: t.due_date || "Today",
            }))
          );
        }

        if (chatHistRes?.success && Array.isArray(chatHistRes.messages) && chatHistRes.messages.length > 0) {
          setChatMessages(
            chatHistRes.messages.map((m: any) => ({
              id: m.id || `m-${Math.random()}`,
              sender: m.role === "assistant" ? "ai" : "user",
              text: m.content,
              time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently",
            }))
          );
        }
      } catch (err) {
        console.error("Dashboard live data fetch failed:", err);
      }
    };

    fetchDashboardData();
  }, [token, user]);

  // ── PDF generation state ────────────────────────────────────────────────────
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");
  const [pdfToast, setPdfToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedStrategyOption, setSelectedStrategyOption] = useState<"APAC Entry" | "Pricing Opt" | "Enterprise">("APAC Entry");

  const handleDownloadPDF = async () => {
    if (isPdfGenerating) return;
    setIsPdfGenerating(true);
    setPdfProgress("Initialising…");
    setPdfToast(null);
    try {
      await generateBusinessReport(
        user || { name: "Enterprise User", email: "", company: "Enterprise Company", role: "Executive", businessType: "Enterprise" },
        token,
        (step) => setPdfProgress(step),
      );
      setPdfToast({ type: "success", message: "PDF downloaded successfully." });
    } catch (err) {
      console.error("PDF Generation Error Stack Trace:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setPdfToast({ type: "error", message: `PDF generation failed: ${errMsg}` });
    } finally {
      setIsPdfGenerating(false);
      setPdfProgress("");
      setTimeout(() => setPdfToast(null), 8000);
    }
  };

  const [taskViewMode, setTaskViewMode] = useState<"kanban" | "list" | "calendar">("kanban");

  // ── Add Task Modal State ──────────────────────────────────────────────────
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    category: "Strategy",
    priority: "High" as "Critical" | "High" | "Medium" | "Low",
    status: "Pending" as "Pending" | "In Progress" | "Completed",
    assigneeAgent: "Strategy Agent (Evo-Strategy)",
    dueDate: "Today",
  });
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;
    setIsSubmittingTask(true);

    const taskData = {
      title: newTaskForm.title.trim(),
      category: newTaskForm.category,
      priority: newTaskForm.priority,
      status: newTaskForm.status,
      assigneeAgent: newTaskForm.assigneeAgent,
      dueDate: newTaskForm.dueDate || "Today",
    };

    addNewTask(taskData);

    if (token) {
      try {
        const { tasksApi } = await import("@/lib/api");
        await tasksApi.create(token, taskData);
      } catch (err) {
        console.warn("Failed to sync new task to backend API:", err);
      }
    }

    setPdfToast({ type: "success", message: `Task "${taskData.title}" created successfully!` });
    setIsSubmittingTask(false);
    setIsAddTaskOpen(false);
    setNewTaskForm({
      title: "",
      category: "Strategy",
      priority: "High",
      status: "Pending",
      assigneeAgent: "Strategy Agent (Evo-Strategy)",
      dueDate: "Today",
    });
  };

  // ── View / Update Task Modal State ───────────────────────────────────────
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date()); // Current month & year

  const handleUpdateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setIsUpdatingTask(true);

    updateTask(editingTask.id, {
      title: editingTask.title,
      category: editingTask.category,
      priority: editingTask.priority,
      status: editingTask.status,
      assigneeAgent: editingTask.assigneeAgent,
      dueDate: editingTask.dueDate,
    });

    if (token) {
      try {
        const { tasksApi } = await import("@/lib/api");
        await tasksApi.update(token, editingTask.id, editingTask);
      } catch (err) {
        console.warn("Failed to sync updated task to backend API:", err);
      }
    }

    setPdfToast({ type: "success", message: `Task "${editingTask.title}" updated successfully!` });
    setIsUpdatingTask(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── PDF Toast Notification ─────────────────────────────────────────── */}
      <AnimatePresence>
        {pdfToast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold backdrop-blur-md ${
              pdfToast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/90 border-rose-500/40 text-rose-300"
            }`}
          >
            <span className="text-base">{pdfToast.type === "success" ? "✅" : "❌"}</span>
            <span>{pdfToast.message}</span>
            {pdfToast.type === "error" && (
              <button
                onClick={handleDownloadPDF}
                className="ml-2 px-3 py-1 rounded-lg bg-rose-700/50 hover:bg-rose-600/60 text-xs font-bold transition-colors"
              >
                Retry
              </button>
            )}
            <button onClick={() => setPdfToast(null)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* HEADER TITLE & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            {activeTab === "dashboard" && "Executive Command Hub"}
            {activeTab === "agents" && "AI CEO & C-Suite Ecosystem"}
            {activeTab === "competitors" && "Competitor Intelligence Matrix"}
            {activeTab === "trends" && "Predictive Market Trends"}
            {activeTab === "marketing" && "Autonomous Marketing Studio"}
            {activeTab === "analytics" && "Financial & Business Analytics"}
            {activeTab === "task-manager" && "AI Task Planner & Workload Dispatch"}
            {activeTab === "reports" && "Executive Reports & Audit Center"}
            {activeTab === "strategy" && "AI Strategy & Simulation Center"}
            {activeTab === "forecast" && "12-Month Financial Forecast Engine"}
          </h1>
        </div>
      </div>

      {/* VIEW 1: EXECUTIVE DASHBOARD MAIN OVERVIEW */}
      {(activeTab === "dashboard" || !activeTab) && (
        <div className="space-y-8">
          {/* KPI METRICS & BUSINESS HEALTH SCORE BAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="lg:col-span-1 border-indigo-500/30 bg-white dark:bg-gradient-to-br dark:from-indigo-950/20 dark:via-slate-900/60 dark:to-purple-950/20 shadow-md flex flex-col justify-between">
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Business Health Score
                </span>
                <div className="mt-4 flex items-center justify-center relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="52"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-slate-200 dark:text-slate-800"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="52"
                      stroke="url(#healthGrad)"
                      strokeWidth="10"
                      strokeDasharray="326.7"
                      strokeDashoffset={(326.7 * (100 - (liveData.healthScore || 92))) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{liveData.healthScore}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {liveData.healthScore >= 80 ? "EXCELLENT" : liveData.healthScore >= 60 ? "STABLE" : "ATTENTION"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50/80 dark:bg-indigo-500/10 px-4 py-2 border-t border-indigo-100 dark:border-indigo-500/20 text-[11px] text-indigo-600 dark:text-indigo-400 text-center font-medium">
                Live AI Health Score
              </div>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-500 flex items-center justify-between">
                  Total Revenue
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold">{liveData.kpis.revenue?.formatted || "$2,840,500"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                  <ArrowUpRight className="w-4 h-4" /> +{liveData.kpis.revenue?.change || 24.8}% <span className="font-normal text-slate-400">YoY growth</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-400">Status: <span className="font-semibold text-slate-700 dark:text-slate-200">Verified</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-500 flex items-center justify-between">
                  Net Profit Margin
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold">{liveData.kpis.net_profit?.formatted || "$892,100"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                  <ArrowUpRight className="w-4 h-4" /> {liveData.kpis.net_profit?.change || 31.4}% <span className="font-normal text-slate-400">margin depth</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-400">Target Velocity: <span className="font-semibold text-emerald-500">On Track</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-500 flex items-center justify-between">
                  Operating Expenses
                  <Activity className="w-4 h-4 text-rose-500" />
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold">{liveData.kpis.burn_rate?.formatted || "$1,948,400"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                  <ArrowDownRight className="w-4 h-4" /> {liveData.kpis.burn_rate?.change || 4.2}% <span className="font-normal text-slate-400">expense ratio</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-400">Burn Runway: <span className="font-semibold text-indigo-500">Positive Cashflow</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-500 flex items-center justify-between">
                  Active Accounts
                  <Users className="w-4 h-4 text-purple-500" />
                </CardDescription>
                <CardTitle className="text-2xl font-extrabold">14,820</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                  <ArrowUpRight className="w-4 h-4" /> +1,240 <span className="font-normal text-slate-400">new seats</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-400">Churn Rate: <span className="font-semibold text-emerald-500">0.42% (Ultra-low)</span></div>
              </CardContent>
            </Card>
          </div>

          {/* CHARTS PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Revenue & Operating Margin Trajectory</CardTitle>
                  <CardDescription>Historical financial performance breakdown</CardDescription>
                </div>
                <Badge variant="gradient">6 Month Stream</Badge>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liveData.revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [`$${Number(val || 0).toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expense Distribution</CardTitle>
                <CardDescription>Departmental cost allocation</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex flex-col justify-between">
                <ResponsiveContainer width="100%" height="65%">
                  <PieChart>
                    <Pie data={expenseBreakdown} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  {expenseBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate text-slate-500 dark:text-slate-400">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      )}

      {/* VIEW 2: AI CEO & AGENTS (activeTab === "agents") */}
      {activeTab === "agents" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">AI CEO & Autonomous Cognitive Agents</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time C-Suite strategic recommendations and execution agents</p>
            </div>
            <Badge variant="gradient" className="w-fit text-xs px-3 py-1">Industry-Tailored Telemetry Active</Badge>
          </div>

          {/* CEO STRATEGIC RECOMMENDATIONS PANEL */}
          {ceoRecommendations.length > 0 && (
            <Card className="p-5 border-purple-500/30 bg-purple-50/80 dark:bg-gradient-to-r dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/30 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI CEO Industry Recommendations for {liveData.companyName}</h4>
              </div>
              <div className="space-y-2 text-xs">
                {ceoRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/60 border border-purple-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm">
                    <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0">#{i + 1}</span>
                    <p className="leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">8 C-Suite Cognitive AI Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="p-4 space-y-3 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${agent.avatarGradient} flex items-center justify-center text-white text-sm font-bold shadow`}>
                    {agent.name.charAt(0)}
                  </div>
                  <Badge variant={agent.status === "Active" ? "active" : "processing"}>
                    {agent.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{agent.name}</h4>
                  <p className="text-xs text-indigo-500">{agent.role}</p>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div><strong className="text-slate-700 dark:text-slate-300">Task:</strong> {agent.currentTask}</div>
                  <div><strong className="text-slate-700 dark:text-slate-300">Efficiency:</strong> {agent.efficiencyScore}%</div>
                  <div className="text-[10px] text-slate-400">{agent.lastAction}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerAgentAction(agent.id)}
                  className="w-full text-xs"
                >
                  Execute Agent Cycle
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: COMPETITOR INTELLIGENCE (activeTab === "competitors") */}
      {activeTab === "competitors" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Competitor Intelligence</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rival market share telemetry, pricing benchmarking & live intelligence feed
            </p>
          </div>

          {/* ROW 1: 5 TOP COMPETITOR CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dynamicCompetitors.map((item, i) => (
              <Card
                key={i}
                className={`p-4 space-y-2 flex flex-col justify-between transition-all ${
                  item.isUser
                    ? "border-purple-500/80 bg-purple-50/70 dark:bg-gradient-to-b dark:from-purple-950/40 dark:to-slate-900/90 shadow-xl shadow-purple-500/10 ring-1 ring-purple-500/50"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                    {item.isUser && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {item.share}
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Market Share</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.revenue}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.growth}</span>
                  </div>

                  {!item.isUser && (
                    <Badge
                      variant={
                        item.level === "critical"
                          ? "high"
                          : item.level === "high"
                          ? "idle"
                          : "neutral"
                      }
                      className="w-fit text-[10px]"
                    >
                      {item.threat}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* ROW 2: MARKET SHARE DONUT CHART & COMPETITIVE MATRIX TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* MARKET SHARE DISTRIBUTION DONUT CHART */}
            <Card className="lg:col-span-2 p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Market Share Distribution</h3>
              </div>

              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketShareDistribution}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {marketShareDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                {marketShareDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* COMPETITIVE ANALYSIS MATRIX TABLE */}
            <Card className="lg:col-span-3 p-5 space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Competitive Analysis Matrix</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                      <th className="py-2.5">Company</th>
                      <th className="py-2.5">Revenue</th>
                      <th className="py-2.5">Growth</th>
                      <th className="py-2.5">Pricing</th>
                      <th className="py-2.5">Threat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {dynamicCompetitors.map((row, i) => (
                      <tr
                        key={i}
                        className={row.isUser ? "bg-purple-950/20 font-bold text-purple-300" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"}
                      >
                        <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                          {row.name}
                        </td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">{row.revenue}</td>
                        <td className="py-3 text-emerald-500 font-semibold">{row.growth}</td>
                        <td className="py-3 text-slate-700 dark:text-slate-300">{row.pricing}</td>
                        <td className="py-3">
                          {row.isUser ? (
                            <span className="text-slate-400 font-mono">—</span>
                          ) : (
                            <Badge
                              variant={
                                row.level === "critical"
                                  ? "high"
                                  : row.level === "high"
                                  ? "idle"
                                  : "neutral"
                              }
                              className="text-[10px]"
                            >
                              {row.level === "critical" ? "Critical" : row.level === "high" ? "High" : "Medium"}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ROW 3: PRICING COMPARISON HORIZONTAL CHART & COMPETITOR ACTIVITY FEED */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PRICING COMPARISON CHART */}
            <Card className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Pricing Comparison ($USD/mo)</h3>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={pricingComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis type="number" domain={[0, 360]} tickFormatter={(v) => `$${v}`} stroke="#94a3b8" fontSize={11} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                    <Bar dataKey="starter" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Entry Tier" />
                    <Bar dataKey="pro" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Enterprise Tier" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-6 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[#06b6d4]" />
                  <span className="text-slate-700 dark:text-slate-300">Entry Tier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-[#8b5cf6]" />
                  <span className="text-slate-700 dark:text-slate-300">Enterprise Tier</span>
                </div>
              </div>
            </Card>

            {/* COMPETITOR ACTIVITY FEED */}
            <Card className="p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Competitor Activity Feed</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px]">
                  {dynamicFeed.length} events
                </span>
              </div>

              <div className="space-y-3">
                {dynamicFeed.map((act, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${act.badgeColor} mt-1 shrink-0`} />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{act.company}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{act.text}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{act.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 4: MARKET TRENDS (activeTab === "trends") */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Market Trends</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Industry dynamics, forecasts & emerging opportunities
            </p>
          </div>

          {/* TOP 4 METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(industryTrendsState?.metrics || [
              { label: "Enterprise AI Adoption", value: "82%", growth: "+48pts YoY" },
              { label: "Cloud Spend Growth", value: "+89%", growth: "+31pts YoY" },
              { label: "Automation Index", value: "83%", growth: "+42pts YoY" },
              { label: "Market Confidence", value: "7.4/10", growth: "+1.2 pts" },
            ]).map((m: any, idx: number) => (
              <Card key={idx} className="p-4 space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.label}</span>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{m.value}</div>
                <span className="text-xs font-semibold text-emerald-500">{m.growth}</span>
              </Card>
            ))}
          </div>

          {/* LOWER MAIN SECTION (Chart + Sentiment Panel) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* INDUSTRY TREND ANALYSIS CHART */}
            <Card className="lg:col-span-2 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Industry Trend Analysis</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Quarterly adoption rates by category (%)</p>
                </div>
                <Badge variant="neutral" className="font-mono text-[10px]">Q1 '23 – Q3 '24</Badge>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={industryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [`${val}%`, ""]}
                    />
                    <Line type="monotone" dataKey="aiAdoption" stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="AI Adoption" />
                    <Line type="monotone" dataKey="cloudSpend" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Cloud Spend" />
                    <Line type="monotone" dataKey="automation" stroke="#14b8a6" strokeWidth={2.5} dot={false} name="Automation" />
                    <Line type="monotone" dataKey="cybersecurity" stroke="#84cc16" strokeWidth={2.5} dot={false} name="Cybersecurity" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#8b5cf6]" />
                  <span className="text-slate-700 dark:text-slate-300">AI Adoption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#06b6d4]" />
                  <span className="text-slate-700 dark:text-slate-300">Cloud Spend</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#14b8a6]" />
                  <span className="text-slate-700 dark:text-slate-300">Automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#84cc16]" />
                  <span className="text-slate-700 dark:text-slate-300">Cybersecurity</span>
                </div>
              </div>
            </Card>

            {/* CUSTOMER SENTIMENT PANEL */}
            <Card className="p-5 border-emerald-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="font-bold text-base text-white">Customer Sentiment</h3>
                <p className="text-xs text-slate-400 mt-0.5">NLP analysis of 48,000 customer signals</p>

                {/* Sentiment segmented color bar */}
                <div className="flex items-center gap-1.5 mt-4">
                  <div className="h-2 flex-1 rounded-full bg-emerald-700 opacity-60" />
                  <div className="h-2 flex-1 rounded-full bg-cyan-400" />
                  <div className="h-2 flex-1 rounded-full bg-indigo-500" />
                  <div className="h-2 flex-1 rounded-full bg-amber-400" />
                  <div className="h-2 flex-1 rounded-full bg-rose-500" />
                </div>

                <div className="mt-8 text-center space-y-1">
                  <div className="text-5xl font-extrabold text-white tracking-tight">76</div>
                  <div className="text-xs font-bold text-cyan-400 tracking-wide">Positive</div>
                  <div className="text-[11px] text-slate-400">Customer Sentiment Index</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center border-t border-slate-800/80 pt-4">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">NPS Score</span>
                  <span className="text-lg font-bold text-indigo-400">72</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">CSAT</span>
                  <span className="text-lg font-bold text-cyan-400">4.6/5</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Mentions</span>
                  <span className="text-lg font-bold text-indigo-400">48K</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Positive %</span>
                  <span className="text-lg font-bold text-emerald-400">84%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 5: MARKETING STUDIO (activeTab === "marketing") */}
      {activeTab === "marketing" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Marketing Studio</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Multi-channel campaigns, social scheduling & performance telemetry
            </p>
          </div>

          {/* ROW 1: 3 CAMPAIGN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketingCampaigns.map((camp, idx) => (
              <Card key={idx} className="p-5 space-y-4 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{camp.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{camp.type}</p>
                  </div>
                  <Badge variant={camp.status === "Active" ? "active" : "processing"}>
                    {camp.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Budget</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{camp.budget}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Spent</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{camp.spent}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">ROI</span>
                    <span className="font-extrabold text-cyan-400 text-sm">{camp.roi}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Reach</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{camp.reach}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Budget Used</span>
                    <span>{camp.usedPercent > 0 ? `${camp.usedPercent}%` : "0%"}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      style={{ width: `${camp.usedPercent}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* ROW 2: SOCIAL MEDIA CALENDAR & AD CHANNEL PERFORMANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* SOCIAL MEDIA CALENDAR */}
            <Card className="lg:col-span-2 p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Social Media Calendar</h3>
              </div>

              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={socialMediaCalendarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 8]} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                    <Bar dataKey="linkedin" stackId="a" fill="#0284c7" name="LinkedIn" />
                    <Bar dataKey="twitter" stackId="a" fill="#06b6d4" name="Twitter / X" />
                    <Bar dataKey="instagram" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} name="Instagram" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0284c7]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">LI</span>
                    <span className="text-slate-500 dark:text-slate-400">LinkedIn</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">12 posts/wk</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">TW</span>
                    <span className="text-slate-500 dark:text-slate-400">Twitter / X</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">18 posts/wk</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">IG</span>
                    <span className="text-slate-500 dark:text-slate-400">Instagram</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">12 posts/wk</span>
                </div>
              </div>
            </Card>

            {/* AD CHANNEL PERFORMANCE */}
            <Card className="lg:col-span-3 p-5 space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Ad Channel Performance</h3>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={adChannelPerformanceData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis type="number" domain={[0, 1200000]} tickFormatter={(v) => `${v / 1000}K`} stroke="#94a3b8" fontSize={11} />
                    <YAxis type="category" dataKey="channel" stroke="#94a3b8" fontSize={11} width={60} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any, name: any) => [val.toLocaleString(), name]}
                    />
                    <Bar dataKey="impressions" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Impressions" />
                    <Bar dataKey="clicks" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 6: FINANCIAL ANALYTICS (activeTab === "analytics") */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Analytics</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Revenue velocity, cash flow telemetry & departmental ROI
            </p>
          </div>

          {/* ROW 1: 4 TOP KPI METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Q3 Revenue</span>
              <div className="text-3xl font-extrabold text-cyan-400">$4.82M</div>
              <span className="text-xs font-semibold text-emerald-500">+18.3% <span className="font-normal text-slate-400">vs Q3 '23</span></span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Net Profit</span>
              <div className="text-3xl font-extrabold text-cyan-400">$1.94M</div>
              <span className="text-xs font-semibold text-emerald-500">40.2% margin <span className="font-normal text-slate-400">record margin</span></span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Burn Rate</span>
              <div className="text-3xl font-extrabold text-purple-400">$2.88M<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <span className="text-xs font-semibold text-emerald-500">-4.2% <span className="font-normal text-slate-400">decreasing</span></span>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Runway</span>
              <div className="text-3xl font-extrabold text-purple-400">28 months</div>
              <span className="text-xs font-semibold text-emerald-500">+4 mo <span className="font-normal text-slate-400">at current rate</span></span>
            </Card>
          </div>

          {/* ROW 2: REVENUE FORECAST CHART & EXPENSE BREAKDOWN DONUT */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* REVENUE FORECAST CHART */}
            <Card className="lg:col-span-3 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Revenue Forecast</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Actual vs AI forecast vs optimistic</p>
                </div>
                <Badge variant="gradient" className="text-[10px]">AI-Powered</Badge>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialForecastCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 10]} tickFormatter={(v) => `$${v}.0M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                      formatter={(val: any) => [`$${val}M`, ""]}
                    />
                    <Line type="monotone" dataKey="optimistic" stroke="#06b6d4" strokeDasharray="5 5" strokeWidth={2.5} dot={false} name="Optimistic" />
                    <Line type="monotone" dataKey="aiForecast" stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth={2.5} dot={false} name="AI Forecast" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* EXPENSE BREAKDOWN DONUT CHART */}
            <Card className="lg:col-span-2 p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Expense Breakdown</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">$2.88M total expenses</p>
              </div>

              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={financialExpenseBreakdown} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {financialExpenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                {financialExpenseBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ROW 3: CASH FLOW ANALYSIS & ROI BY DEPARTMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CASH FLOW ANALYSIS */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Cash Flow Analysis</h3>
                <Badge variant="active" className="text-[10px]">Positive</Badge>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 6]} tickFormatter={(v) => `$${v}.0M`} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                    <Bar dataKey="inflow" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Inflow" />
                    <Bar dataKey="outflow" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Outflow" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* ROI BY DEPARTMENT */}
            <Card className="p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">ROI by Department</h3>
                <Badge variant="gradient" className="text-[10px]">Avg 214%</Badge>
              </div>

              <div className="space-y-4 pt-2">
                {departmentRoiData.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-900 dark:text-slate-100">{item.dept}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-[11px]">{item.invested}</span>
                        <span className="text-emerald-500 font-bold">{item.roi}</span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 rounded-full"
                        style={{ width: `${item.widthPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 7: AI TASK PLANNER (activeTab === "task-manager") */}
      {activeTab === "task-manager" && (
        <div className="space-y-6">
          {/* HEADER & TOGGLE BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">AI Task Planner</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Smart task management powered by AI prioritization
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Kanban / List / Calendar View Switcher */}
              <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => setTaskViewMode("kanban")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    taskViewMode === "kanban"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setTaskViewMode("list")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    taskViewMode === "list"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setTaskViewMode("calendar")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    taskViewMode === "calendar"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Calendar
                </button>
              </div>

              <Button
                variant="gradient"
                size="sm"
                onClick={() => setIsAddTaskOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
              </Button>
            </div>
          </div>

          {/* ROW 1: 4 METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 text-center space-y-1">
              <CheckSquare className="w-5 h-5 text-indigo-500 mx-auto" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{dynamicTasksList.length}</div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Tasks</span>
            </Card>

            <Card className="p-4 text-center space-y-1">
              <Clock className="w-5 h-5 text-blue-500 mx-auto" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {dynamicTasksList.filter((t) => t.status === "In Progress").length}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">In Progress</span>
            </Card>

            <Card className="p-4 text-center space-y-1">
              <Check className="w-5 h-5 text-emerald-500 mx-auto" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {dynamicTasksList.filter((t) => t.status === "Done" || t.status === "Completed").length}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Completed</span>
            </Card>

            <Card className="p-4 text-center space-y-1">
              <Zap className="w-5 h-5 text-cyan-400 mx-auto" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">92</div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Avg AI Score</span>
            </Card>
          </div>

          {/* ROW 2: MAIN WORKSPACE (KANBAN / LIST / CALENDAR VIEWS) */}

          {/* KANBAN BOARD VIEW */}
          {taskViewMode === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* COLUMN 1: TO DO */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border-2 border-indigo-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">To Do</h3>
                  </div>
                  <span className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    {dynamicTasksList.filter((t) => t.status === "To Do" || t.status === "Pending").length}
                  </span>
                </div>

                <div className="space-y-3">
                  {dynamicTasksList
                    .filter((t) => t.status === "To Do" || t.status === "Pending")
                    .map((task) => (
                      <Card key={task.id} className="p-4 space-y-3 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">{task.title}</h4>
                          <Badge variant="medium" className="shrink-0 text-[10px]">{task.priority}</Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{task.desc}</p>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center">
                              {task.assigneeInitials}
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{task.assigneeName}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                            <span className="text-cyan-400 font-bold">⚡ {task.aiScore}</span>
                            <span>📅 {task.dueDate}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* COLUMN 2: IN PROGRESS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">In Progress</h3>
                  </div>
                  <span className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    {dynamicTasksList.filter((t) => t.status === "In Progress").length}
                  </span>
                </div>

                <div className="space-y-3">
                  {dynamicTasksList
                    .filter((t) => t.status === "In Progress")
                    .map((task) => (
                      <Card key={task.id} className="p-4 space-y-3 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">{task.title}</h4>
                          <Badge variant={task.priority === "Critical" ? "high" : "medium"} className="shrink-0 text-[10px]">
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{task.desc}</p>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">
                              {task.assigneeInitials}
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{task.assigneeName}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                            <span className="text-cyan-400 font-bold">⚡ {task.aiScore}</span>
                            <span>📅 {task.dueDate}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* COLUMN 3: DONE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Done</h3>
                  </div>
                  <span className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    {dynamicTasksList.filter((t) => t.status === "Done" || t.status === "Completed").length}
                  </span>
                </div>

                <div className="space-y-3">
                  {dynamicTasksList
                    .filter((t) => t.status === "Done" || t.status === "Completed")
                    .map((task) => (
                      <Card key={task.id} className="p-4 space-y-3 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all opacity-90">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-through text-slate-400">{task.title}</h4>
                          <Badge variant="medium" className="shrink-0 text-[10px]">{task.priority}</Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{task.desc}</p>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center">
                              {task.assigneeInitials}
                            </div>
                            <span className="text-slate-700 dark:text-slate-300 font-medium">{task.assigneeName}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                            <span className="text-cyan-400 font-bold">⚡ {task.aiScore}</span>
                            <span>📅 {task.dueDate}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {taskViewMode === "list" && (
            <Card className="p-5">
              <div className="space-y-3">
                {dynamicTasksList.map((task) => (
                  <div key={task.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs gap-4">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{task.title}</h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{task.assigneeName} · Due {task.fullDueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <Badge variant={task.priority === "Critical" ? "high" : "medium"} className="text-[10px]">
                        {task.priority}
                      </Badge>
                      <Badge variant={task.status === "Done" || task.status === "Completed" ? "active" : "processing"} className="text-[10px]">
                        {task.status}
                      </Badge>
                      <span className="text-cyan-400 font-bold text-xs">⚡ {task.aiScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CALENDAR VIEW */}
          {taskViewMode === "calendar" && (() => {
            const year = calendarDate.getFullYear();
            const monthIndex = calendarDate.getMonth();
            const monthName = calendarDate.toLocaleString("default", { month: "long" });
            const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();

            const allCalendarTasks = [
              ...tasks,
              ...dynamicTasksList.map(t => ({
                id: t.id,
                title: t.title,
                category: "Strategy",
                priority: (t.priority === "Critical" ? "Critical" : t.priority === "High" ? "High" : "Medium") as any,
                status: (t.status === "Done" || t.status === "Completed" ? "Completed" : t.status === "In Progress" ? "In Progress" : "Pending") as any,
                assigneeAgent: t.assigneeName,
                dueDate: t.dueDate,
              })),
            ];

            const getTasksForDay = (dayNum: number) => {
              const dayStr = String(dayNum).padStart(2, "0");
              return allCalendarTasks.filter((t) => {
                const d = (t.dueDate || "").toLowerCase();
                return (
                  d.includes(`/${dayStr}`) ||
                  d.includes(`-${dayStr}`) ||
                  d.includes(`${dayNum}th`) ||
                  d.includes(`${dayNum}st`) ||
                  d.includes(`${dayNum}nd`) ||
                  d.includes(`${dayNum}rd`) ||
                  (dayNum === 15 && d.includes("15")) ||
                  (dayNum === 12 && d.includes("12")) ||
                  (dayNum === 10 && d.includes("10")) ||
                  (dayNum === 1 && d.includes("today")) ||
                  (dayNum === 20 && d.includes("tomorrow")) ||
                  (dayNum === 25 && d.includes("next"))
                );
              });
            };

            return (
              <Card className="p-4 sm:p-6 text-center space-y-4">
                {/* Calendar Header with Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-400 shrink-0" />
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {monthName} {year} Task Deadlines Calendar
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                    <button
                      onClick={() => setCalendarDate(new Date(year, monthIndex - 1, 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="text-[11px] sm:text-xs">Previous</span>
                    </button>
                    <button
                      onClick={() => setCalendarDate(new Date())}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-600/50 text-indigo-200 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer"
                    >
                      Current Month
                    </button>
                    <button
                      onClick={() => setCalendarDate(new Date(year, monthIndex + 1, 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span className="text-[11px] sm:text-xs">Next</span> <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Day Header & Grid Wrapper for Mobile Responsiveness */}
                <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                  <div className="min-w-[620px] space-y-2">
                    {/* Day Header Grid */}
                    <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-slate-400 py-1">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-2 text-xs min-h-[300px]">
                      {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dayTasks = getTasksForDay(dayNum);
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              if (dayTasks.length > 0) {
                                setEditingTask({ ...dayTasks[0] });
                              } else {
                                setIsAddTaskOpen(true);
                                setNewTaskForm(prev => ({ ...prev, dueDate: `${monthName} ${dayNum}, ${year}` }));
                              }
                            }}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-500/50 transition-all flex flex-col justify-start text-left cursor-pointer group space-y-1.5 min-h-[70px]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-400 font-mono font-bold group-hover:text-indigo-400">{dayNum}</span>
                              {dayTasks.length > 0 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                  {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                                </span>
                              )}
                            </div>

                            {/* Task badges */}
                            <div className="space-y-1 overflow-hidden">
                              {dayTasks.map((t, tidx) => (
                                <div
                                  key={tidx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTask({ ...t });
                                  }}
                                  className="px-1.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-[10px] text-indigo-100 font-medium truncate flex items-center justify-between gap-1 shadow-sm cursor-pointer"
                                >
                                  <span className="truncate">{t.title}</span>
                                  <Edit className="w-2.5 h-2.5 opacity-70 hover:opacity-100 shrink-0 text-cyan-400" />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* ROW 3: TEAM PROGRESS */}
          <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Team Progress</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamProgressMembers.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3 text-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-500 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md">
                    {m.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{m.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{m.role}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-left pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Completed</span>
                      <span className="font-bold text-emerald-500">{m.completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active</span>
                      <span className="font-bold text-indigo-400">{m.active}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${m.percent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 8: REPORTS CENTER (activeTab === "reports") */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          {/* HEADER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports Center</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI-generated business intelligence reports
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating}
              className={`relative overflow-hidden transition-all ${
                isPdfGenerating
                  ? "opacity-80 cursor-not-allowed"
                  : "hover:border-indigo-500 hover:text-indigo-400"
              }`}
            >
              {isPdfGenerating ? (
                <>
                  <svg className="w-3.5 h-3.5 mr-1.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span className="text-xs">{pdfProgress || "Generating…"}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                </>
              )}
            </Button>
          </div>

          {/* ROW 1: 5 REPORT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Report 1 */}
            <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <Badge variant="gradient" className="text-[10px]">92/100</Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Business Health Report</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Comprehensive business performance analysis</p>
              </div>

            </Card>

            {/* Report 2 */}
            <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Badge variant="active" className="text-[10px]">+18.3%</Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Revenue Analysis</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Q3 revenue breakdown and forecast</p>
              </div>

            </Card>

            {/* Report 3 */}
            <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <Badge variant="active" className="text-[10px]">312% ROI</Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Marketing Performance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Campaign ROI and channel analytics</p>
              </div>

            </Card>

            {/* Report 4 */}
            <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <Badge variant="idle" className="text-[10px]">5 risks</Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Risk Assessment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Business risk matrix and mitigation plan</p>
              </div>

            </Card>

            {/* Report 5 */}
            <Card className="p-5 space-y-4 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <Badge variant="processing" className="text-[10px]">4 actions</Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Recommendations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Strategic recommendations for Q4</p>
              </div>

            </Card>
          </div>

          {/* ROW 2: SWOT ANALYSIS DIAGRAM & BUSINESS HEALTH RADAR */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* SWOT ANALYSIS */}
            <Card className="lg:col-span-3 p-6 space-y-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">SWOT Analysis - {liveData.companyName}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* STRENGTHS */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/20 space-y-2">
                  <h4 className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">STRENGTHS</h4>
                  <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300">
                    {(liveData.swot.strengths || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WEAKNESSES */}
                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-50/80 dark:bg-rose-950/20 space-y-2">
                  <h4 className="font-extrabold text-xs text-rose-600 dark:text-rose-400 tracking-wider uppercase">WEAKNESSES</h4>
                  <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300">
                    {(liveData.swot.weaknesses || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* OPPORTUNITIES */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-50/80 dark:bg-purple-950/20 space-y-2">
                  <h4 className="font-extrabold text-xs text-purple-600 dark:text-purple-400 tracking-wider uppercase">OPPORTUNITIES</h4>
                  <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300">
                    {(liveData.swot.opportunities || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* THREATS */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/20 space-y-2">
                  <h4 className="font-extrabold text-xs text-amber-600 dark:text-amber-400 tracking-wider uppercase">THREATS</h4>
                  <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300">
                    {(liveData.swot.threats || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* BUSINESS HEALTH RADAR CHART */}
            <Card className="lg:col-span-2 p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Business Health Radar</h3>
                <Badge variant="gradient" className="text-[10px]">{liveData.healthScore}/100</Badge>
              </div>

              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={liveData.radarData}>
                    <PolarGrid stroke="#334155" opacity={0.4} />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                    <Radar name="A3E Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {liveData.radarData.map((item, idx) => (
                  <div key={idx}>
                    <span className="text-[10px] text-slate-400 block font-medium truncate">{item.subject}</span>
                    <span className="text-sm font-bold text-indigo-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* VIEW 9: AI BUSINESS CHAT (activeTab === "strategy") */}
      {activeTab === "strategy" && (
        <div className="space-y-6">
          {/* HEADER */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">AI Business Chat</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your AI strategic advisor — ask anything about your business
            </p>
          </div>

          {/* QUICK PROMPT SUGGESTION PILLS */}
          <div className="flex flex-wrap items-center gap-2.5">
            {[
              "Analyze our Q4 revenue forecast",
              "What are the top business risks this month?",
              "Compare our pricing vs competitors",
              "Generate a board presentation summary",
              "Identify top 5 growth opportunities",
              "What should our marketing focus be?",
            ].map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const userMsg = { id: `u-${Date.now()}`, sender: "user" as const, text: promptText, time: now };
                  let replyText = "";

                  if (promptText.includes("Q4 revenue forecast")) {
                    replyText = "📊 **Q4 Revenue Forecast Analysis**:\n- Projected ARR: **$24.8M** (+38% YoY)\n- Highest Growth Driver: Enterprise Autonomous Tier (+52% yield expansion)\n- Churn Risk Buffer: Net Retention Rate at **118%**.";
                  } else if (promptText.includes("business risks")) {
                    replyText = "⚠️ **Top 5 Business Risk Telemetry**:\n1. Nexus AI APAC expansion push\n2. EU AI Act regulatory reporting deadlines\n3. Sales hiring bottleneck in EMEA\n4. Cloud infrastructure spend spikes\n5. Hyperscaler API pricing shifts.";
                  } else if (promptText.includes("pricing vs competitors")) {
                    replyText = "💰 **Pricing & Value Benchmarking**:\n- **A3E**: Entry $149/mo | Enterprise $360/mo\n- **TechNova**: Entry $199/mo | Enterprise $290/mo\n- **Nexus AI**: Entry $99/mo | Enterprise $240/mo (Aggressive pricing push)\n🎯 **Insight**: Our high retention rate proves $360/mo enterprise value metric is sustained.";
                  } else if (promptText.includes("board presentation")) {
                    replyText = "📄 **Q3 Board Executive Summary Deck**:\n- Revenue: **$4.82M** (+18.3% vs Q3 '23)\n- Net Profit: **$1.94M** (40.2% record margin)\n- Runway: **28 months** ($2.88M/mo burn rate)\n- Strategic Focus: Accelerate APAC Entry in Q4.";
                  } else {
                    replyText = `⚡ **Strategic Telemetry Response for "${promptText}"**:\n\n- Analyzing multi-channel metrics and agent logs...\n- Operational Score: **92/100**\n🎯 **Action Item:** Align C-suite automated task dispatches to capital allocation objectives.`;
                  }

                  setChatMessages((prev) => [
                    ...prev,
                    userMsg,
                    { id: `ai-${Date.now()}`, sender: "ai" as const, text: replyText, time: now },
                  ]);
                }}
                className="py-1.5 px-3.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all text-left shadow-sm"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* CHAT CONTAINER CARD */}
          <Card className="p-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-2xl flex flex-col h-[520px]">
            {/* TOP BAR */}
            <div className="p-4 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg">
                  <div className="h-full w-full rounded-[10px] bg-white dark:bg-slate-950 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">A3E AI Advisor</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Online • Powered by GPT-4 + Business Intelligence</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="gradient" className="text-[10px]">Context loaded</Badge>
                <button
                  onClick={() =>
                    setChatMessages([
                      {
                        id: `m-${Date.now()}`,
                        sender: "ai",
                        text: `- Faster VC funding traction (vs $120M Series C recovery)\n- Growing APAC presence\n\n🎯 **Recommendation:** Accelerate APAC entry before Nexus AI consolidates that market. Their new pricing suggests they're burning cash — your profitability is a strategic advantage.`,
                        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      },
                    ])
                  }
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  title="Reset Conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES DISPLAY WINDOW */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-2xl p-4 rounded-2xl space-y-2 ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                        : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                      <span>{msg.time}</span>
                      {msg.sender === "ai" && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigator.clipboard.writeText(msg.text)} className="hover:text-slate-900 dark:hover:text-white" title="Copy Text">
                            📋
                          </button>
                          <button className="hover:text-slate-900 dark:hover:text-white" title="Good Response">
                            👍
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CHAT INPUT BAR CONTAINER */}
            <div className="p-4 bg-slate-50/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!chatInput.trim()) return;
                  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  const userText = chatInput;
                  setChatInput("");

                  const userMsg = { id: `u-${Date.now()}`, sender: "user" as const, text: userText, time: now };
                  setChatMessages((prev) => [...prev, userMsg]);

                  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("evoai-token") : null);
                  if (authToken) {
                    try {
                      const { chatApi } = await import("@/lib/api");
                      const res = await chatApi.send(authToken, { message: userText });
                      if (res?.success && res.response) {
                        setChatMessages((prev) => [
                          ...prev,
                          { id: `ai-${Date.now()}`, sender: "ai" as const, text: res.response, time: now },
                        ]);
                        return;
                      }
                    } catch (err) {
                      console.warn("AI Chat API error, falling back to dynamic context:", err);
                    }
                  }

                  const fallbackAiMsg = {
                    id: `ai-${Date.now()}`,
                    sender: "ai" as const,
                    text: `⚡ **Strategic Analysis for ${liveData.companyName}:** "${userText}"\n\n- Business Health Index: **${liveData.healthScore}/100**\n- Revenue Growth Trend: **${liveData.kpis.revenue?.formatted || "$2.84M"}**\n🎯 **Recommendation:** Executive AI Agents have synthesized your request into the **AI Task Planner**.`,
                    time: now,
                  };
                  setChatMessages((prev) => [...prev, fallbackAiMsg]);
                }}
                className="flex items-center gap-3"
              >
                <div className="relative flex-1">
                  <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask your AI CEO anything about your business..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white flex items-center justify-center shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                AI responses are based on your business data • Always verify critical decisions
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 10: FINANCIAL FORECAST (activeTab === "forecast") */}
      {activeTab === "forecast" && (
        <div className="space-y-6">

          <Card className="p-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveData.financialForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                  <Bar dataKey="projected" fill="#6366f1" radius={[4, 4, 0, 0]} name="Projected Revenue" />
                  <Bar dataKey="baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Baseline Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ── ADD NEW AI TASK MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddTaskOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Create New AI Task</h3>
                    <p className="text-xs text-slate-400">Dispatch an autonomous task to AI Executive Agents</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddTaskOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Automate Cloud Cost Allocation Rules"
                    value={newTaskForm.title}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-xs"
                  />
                </div>

                {/* Grid 2x2: Category & Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Category</label>
                    <select
                      value={newTaskForm.category}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                    >
                      <option value="Strategy">Strategy</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Legal">Legal</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Priority Level</label>
                    <select
                      value={newTaskForm.priority}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Grid 2x2: Status & Due Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Status</label>
                    <select
                      value={newTaskForm.status}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Due Date</label>
                    <input
                      type="text"
                      placeholder="e.g. Today / Next Week"
                      value={newTaskForm.dueDate}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Assignee Agent */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Assignee AI Agent</label>
                  <select
                    value={newTaskForm.assigneeAgent}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assigneeAgent: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                  >
                    <option value="Strategy Agent (Evo-Strategy)">Strategy Agent (Evo-Strategy)</option>
                    <option value="Financial Agent (FinanceAI)">Financial Agent (FinanceAI)</option>
                    <option value="Marketing Agent (GrowthAI)">Marketing Agent (GrowthAI)</option>
                    <option value="Operations Agent (Nexus-Ops)">Operations Agent (Nexus-Ops)</option>
                    <option value="Legal & Audit Agent (AuditAI)">Legal & Audit Agent (AuditAI)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    disabled={isSubmittingTask || !newTaskForm.title.trim()}
                    className="px-5 py-2 flex items-center gap-2"
                  >
                    {isSubmittingTask ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Task...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Dispatch AI Task</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── VIEW & UPDATE TASK MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {editingTask && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Edit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">View & Update AI Task</h3>
                    <p className="text-xs text-slate-400">Modify task details, priority, status and deadline date</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingTask(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateTaskSubmit} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-xs"
                  />
                </div>

                {/* Grid 2x2: Category & Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Category</label>
                    <select
                      value={editingTask.category || "Strategy"}
                      onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                    >
                      <option value="Strategy">Strategy</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Legal">Legal</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Competitor Intel">Competitor Intel</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Priority Level</label>
                    <select
                      value={editingTask.priority || "High"}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Grid 2x2: Status & Due Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Status</label>
                    <select
                      value={editingTask.status || "Pending"}
                      onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-indigo-400 flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" /> Task Due Date *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026-07-20 / Aug 15 / Today"
                      value={editingTask.dueDate || ""}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full bg-slate-950 border border-indigo-500/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Assignee Agent */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Assignee AI Agent</label>
                  <select
                    value={editingTask.assigneeAgent || "Strategy Agent (Evo-Strategy)"}
                    onChange={(e) => setEditingTask({ ...editingTask, assigneeAgent: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all text-xs"
                  >
                    <option value="Strategy Agent (Evo-Strategy)">Strategy Agent (Evo-Strategy)</option>
                    <option value="Financial Agent (FinanceAI)">Financial Agent (FinanceAI)</option>
                    <option value="Marketing Agent (GrowthAI)">Marketing Agent (GrowthAI)</option>
                    <option value="Operations Agent (Nexus-Ops)">Operations Agent (Nexus-Ops)</option>
                    <option value="Legal & Audit Agent (AuditAI)">Legal & Audit Agent (AuditAI)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    disabled={isUpdatingTask || !editingTask.title.trim()}
                    className="px-5 py-2 flex items-center gap-2"
                  >
                    {isUpdatingTask ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Task...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes & Update Date</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


