"use client";

import React, { createContext, useContext, useState } from "react";

export interface ModuleData {
  id: string;
  name: string;
  category: string;
  status: "Active" | "Processing" | "Idle";
  currentTask: string;
  performanceMetric: number; // percentage
  recentActivity: string;
  iconName: string;
  description: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Processing" | "Idle";
  currentTask: string;
  efficiencyScore: number;
  lastAction: string;
  avatarGradient: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Completed" | "In Progress" | "Pending";
  assigneeAgent: string;
  dueDate: string;
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: number; // percentage
  pricePoint: string;
  strengths: string[];
  weaknesses: string[];
  threatLevel: "High" | "Medium" | "Low";
}

interface DashboardContextType {
  modules: ModuleData[];
  agents: AIAgent[];
  tasks: TaskItem[];
  competitors: Competitor[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  addNewTask: (task: Omit<TaskItem, "id">) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  triggerAgentAction: (agentId: string) => void;
  generatedStrategy: string | null;
  generateNewStrategy: (focusArea: string) => void;
  isGeneratingStrategy: boolean;
}

const initialModules: ModuleData[] = [
  {
    id: "dashboard",
    name: "Executive Dashboard",
    category: "Operations",
    status: "Active",
    currentTask: "Real-time stream telemetry sync",
    performanceMetric: 98,
    recentActivity: "Optimized Q3 revenue projection stream 2 mins ago",
    iconName: "LayoutDashboard",
    description: "Central command center tracking financial metrics, sales velocity, and business health score.",
  },
  {
    id: "agents",
    name: "AI CEO & Agents",
    category: "Executive AI",
    status: "Active",
    currentTask: "Synchronizing 8 C-Suite cognitive agent clusters",
    performanceMetric: 99,
    recentActivity: "CEO Agent dispatched quarterly capital reallocation orders",
    iconName: "BrainCircuit",
    description: "Full suite of specialized AI executive agents working in parallel 24/7.",
  },
  {
    id: "competitors",
    name: "Competitor Intel",
    category: "Market Research",
    status: "Processing",
    currentTask: "Scraping QuantumSaaS pricing shift matrix",
    performanceMetric: 89,
    recentActivity: "Flagged competitor price drop on API Gateway bundles",
    iconName: "ShieldAlert",
    description: "Automated market benchmarking, rival strength/weakness synthesis, and share of voice.",
  },
  {
    id: "trends",
    name: "Market Trends",
    category: "Market Research",
    status: "Idle",
    currentTask: "Monitoring vertical AI adoption index",
    performanceMetric: 91,
    recentActivity: "Updated APAC enterprise software demand vector",
    iconName: "TrendingUp",
    description: "Macroeconomic trend parsing, future demand prediction models, and regional growth shifts.",
  },
  {
    id: "marketing",
    name: "Marketing Studio",
    category: "Growth",
    status: "Processing",
    currentTask: "A/B testing LinkedIn enterprise copy variations",
    performanceMetric: 92,
    recentActivity: "Scheduled automated multi-channel surge campaign for Q4",
    iconName: "Target",
    description: "Autonomous content generation, omni-channel preview, and multi-campaign budget balancing.",
  },
  {
    id: "analytics",
    name: "Financial Analytics",
    category: "Intelligence",
    status: "Active",
    currentTask: "Synthesizing multi-channel customer cohorts",
    performanceMetric: 94,
    recentActivity: "Identified +18% margin expansion opportunity in Enterprise Tier",
    iconName: "DollarSign",
    description: "Deep analytics across revenue streams, product margin distributions, and customer lifecycles.",
  },
  {
    id: "task-manager",
    name: "AI Task Planner",
    category: "Operations",
    status: "Active",
    currentTask: "Orchestrating cross-functional agent execution sprint",
    performanceMetric: 95,
    recentActivity: "Completed 14 high-priority automated optimization workflows",
    iconName: "CheckSquare",
    description: "Dynamic workload distributor dispatching tasks to autonomous digital staff.",
  },
  {
    id: "reports",
    name: "Reports Center",
    category: "Governance",
    status: "Idle",
    currentTask: "Preparing PDF bundle for Board of Directors",
    performanceMetric: 100,
    recentActivity: "Exported Q2 Comprehensive Business Health & Risk Audit",
    iconName: "FileText",
    description: "One-click generation of audit-ready compliance, health, and financial executive summaries.",
  },
  {
    id: "strategy",
    name: "AI Strategy Center",
    category: "Executive AI",
    status: "Active",
    currentTask: "Modeling 2027 international expansion vectors",
    performanceMetric: 99,
    recentActivity: "Generated automated SWOT & risk mitigation playbook",
    iconName: "Zap",
    description: "Autonomous strategic planning engine recommending high-yield growth levers.",
  },
  {
    id: "forecast",
    name: "Financial Forecast",
    category: "Finance",
    status: "Active",
    currentTask: "Running Monte Carlo cash flow simulations",
    performanceMetric: 96,
    recentActivity: "Recalibrated 12-month EBITDA trajectory to +34.2%",
    iconName: "Activity",
    description: "Predictive financial modeling, capital allocation guidance, and automated budget forecasts.",
  },
];

const initialAgents: AIAgent[] = [
  {
    id: "ceo",
    name: "CEO Agent (Aura-1)",
    role: "Chief Executive & Strategic Alignment",
    status: "Active",
    currentTask: "Evaluating M&A synergies for Q4 target pipeline",
    efficiencyScore: 99.4,
    lastAction: "Approved global operational budget delta (+4.2%)",
    avatarGradient: "from-blue-600 to-indigo-600",
  },
  {
    id: "finance",
    name: "Finance Agent (Vault-X)",
    role: "Chief Financial Officer AI",
    status: "Active",
    currentTask: "Optimizing cross-border treasury liquidity yield",
    efficiencyScore: 98.7,
    lastAction: "Reallocated $450k into high-yield enterprise liquidity pool",
    avatarGradient: "from-emerald-500 to-teal-700",
  },
  {
    id: "marketing",
    name: "Marketing Agent (Pulse-AI)",
    role: "Chief Growth & Marketing Officer",
    status: "Processing",
    currentTask: "Scaling viral demand gen across Enterprise Tech hubs",
    efficiencyScore: 94.2,
    lastAction: "Launched automated campaign targeting Fortune 500 CTOs",
    avatarGradient: "from-purple-600 to-pink-600",
  },
  {
    id: "sales",
    name: "Sales Agent (Vanguard-Sales)",
    role: "VP of Global Enterprise Accounts",
    status: "Active",
    currentTask: "Negotiating contract terms with 3 Tier-1 accounts",
    efficiencyScore: 97.1,
    lastAction: "Closed $1.2M ACV contract expansion",
    avatarGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "customer",
    name: "Customer Support Agent (CareCore)",
    role: "Head of Customer Success",
    status: "Active",
    currentTask: "Proactively mitigating churn signals for high-risk accounts",
    efficiencyScore: 99.8,
    lastAction: "Resolved 412 ticket anomalies automatically in 3ms",
    avatarGradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "hr",
    name: "HR & Talent Agent (TalentX)",
    role: "Chief People Officer AI",
    status: "Idle",
    currentTask: "Matching engineering talent profiles with AI agents",
    efficiencyScore: 92.5,
    lastAction: "Updated remote workforce productivity index",
    avatarGradient: "from-rose-500 to-red-600",
  },
  {
    id: "ops",
    name: "Operations Agent (Nexus-Ops)",
    role: "Chief Operating Officer AI",
    status: "Active",
    currentTask: "Minimizing cloud infrastructure latency by 14ms",
    efficiencyScore: 98.1,
    lastAction: "Autoscaled multi-region Kubernetes deployments",
    avatarGradient: "from-violet-600 to-indigo-800",
  },
  {
    id: "strategy",
    name: "Strategy Agent (Orion-9)",
    role: "Chief Strategy & Innovation Officer",
    status: "Processing",
    currentTask: "Simulating market shifts for 2028 generative AI paradigm",
    efficiencyScore: 99.0,
    lastAction: "Delivered 5-year competitive positioning map",
    avatarGradient: "from-fuchsia-600 to-purple-800",
  },
];

const initialTasks: TaskItem[] = [
  {
    id: "t-1",
    title: "Review Q3 Enterprise Pricing Delta",
    category: "Finance",
    priority: "High",
    status: "In Progress",
    assigneeAgent: "Finance Agent (Vault-X)",
    dueDate: "Today, 5:00 PM",
  },
  {
    id: "t-2",
    title: "Deploy Automated LinkedIn Executive Outreach",
    category: "Marketing",
    priority: "High",
    status: "Completed",
    assigneeAgent: "Marketing Agent (Pulse-AI)",
    dueDate: "Today, 11:30 AM",
  },
  {
    id: "t-3",
    title: "Mitigate Security Vulnerability Alert on Subnode-4",
    category: "Operations",
    priority: "High",
    status: "In Progress",
    assigneeAgent: "Operations Agent (Nexus-Ops)",
    dueDate: "Today, 3:00 PM",
  },
  {
    id: "t-4",
    title: "Benchmark Rival QuantumSaaS v4.2 Release",
    category: "Competitor Intel",
    priority: "Medium",
    status: "Pending",
    assigneeAgent: "Strategy Agent (Orion-9)",
    dueDate: "Tomorrow, 10:00 AM",
  },
  {
    id: "t-5",
    title: "Recalibrate Churn Risk Threshold for Tier-2 SaaS Customers",
    category: "Customer Success",
    priority: "Medium",
    status: "Completed",
    assigneeAgent: "Customer Support Agent (CareCore)",
    dueDate: "Yesterday",
  },
  {
    id: "t-6",
    title: "Synthesize Monthly Board Governance Deck",
    category: "Executive",
    priority: "High",
    status: "In Progress",
    assigneeAgent: "CEO Agent (Aura-1)",
    dueDate: "Jul 18, 2026",
  },
];

const initialCompetitors: Competitor[] = [
  {
    id: "c-1",
    name: "QuantumSaaS Inc.",
    marketShare: 24.5,
    pricePoint: "$1,499 / mo per node",
    strengths: ["Strong North American legacy contracts", "Extensive REST API ecosystem"],
    weaknesses: ["High latency on multi-region sync", "Outdated UX dashboard framework"],
    threatLevel: "High",
  },
  {
    id: "c-2",
    name: "CyberScale Systems",
    marketShare: 18.2,
    pricePoint: "$999 / mo unlimited",
    strengths: ["Aggressive price positioning", "Strong compliance certifications"],
    weaknesses: ["No autonomous C-suite agents", "Limited predictive ROI analytics"],
    threatLevel: "Medium",
  },
  {
    id: "c-3",
    name: "NovaEngine Enterprise",
    marketShare: 12.8,
    pricePoint: "$2,200 / mo tier-1",
    strengths: ["High throughput workflow automation"],
    weaknesses: ["Complex deployment cycle (3+ months)"],
    threatLevel: "Medium",
  },
  {
    id: "c-4",
    name: "LegacyCorp Global",
    marketShare: 6.5,
    pricePoint: "$3,500 / mo enterprise",
    strengths: ["Deep government channel distribution"],
    weaknesses: ["Slow feature releases", "High ongoing consulting overhead"],
    threatLevel: "Low",
  },
];

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [modules] = useState<ModuleData[]>(initialModules);
  const [agents, setAgents] = useState<AIAgent[]>(initialAgents);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [competitors] = useState<Competitor[]>(initialCompetitors);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [generatedStrategy, setGeneratedStrategy] = useState<string | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState<boolean>(false);

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === "Completed"
              ? "In Progress"
              : t.status === "In Progress"
              ? "Pending"
              : "Completed";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const addNewTask = (newTask: Omit<TaskItem, "id">) => {
    const item: TaskItem = {
      ...newTask,
      id: `t-${Date.now()}`,
    };
    setTasks((prev) => [item, ...prev]);
  };

  const triggerAgentAction = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            status: agent.status === "Processing" ? "Active" : "Processing",
            lastAction: `Executed manual command update at ${new Date().toLocaleTimeString()}`,
            efficiencyScore: Math.min(100, +(agent.efficiencyScore + 0.2).toFixed(1)),
          };
        }
        return agent;
      })
    );
  };

  const generateNewStrategy = async (focusArea: string) => {
    setIsGeneratingStrategy(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("evoai-token") : null;
      const { chatApi } = await import("@/lib/api");
      const prompt = `Generate a high-level enterprise AI strategy recommendation focusing on: ${focusArea}. Provide 4 clear actionable points covering revenue expansion, competitive defense, cost capitalization, and risk buffer.`;
      const res = await chatApi.send(token || "", { message: prompt, provider: "openai" });
      if (res.success && res.response) {
        setGeneratedStrategy(res.response);
        setIsGeneratingStrategy(false);
        return;
      }
    } catch {
      // Offline or database disconnected fallback
    }

      setTimeout(() => {
      setGeneratedStrategy(
        `[STRATEGIC INITIATIVE ALPHA - ${focusArea.toUpperCase()}]\n\n` +
          `1. Dynamic Revenue Expansion: Implement algorithmic pricing tiers targeting high-growth enterprise seats to increase ARPU by 28% within 90 days.\n` +
          `2. Competitive Defense Vector: Counter rival QuantumSaaS by deploying zero-latency AI C-Suite agents as a standard bundled feature.\n` +
          `3. Cost Capitalization: Automate cloud resource allocation via Nexus-Ops Agent to shave $42,000 off monthly infrastructure spending.\n` +
          `4. Risk Buffer: Maintain liquidity ratio above 3.8x while pursuing European expansion opportunities.`
      );
      setIsGeneratingStrategy(false);
    }, 1000);
  };

  const updateTask = (taskId: string, updates: Partial<TaskItem>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  return (
    <DashboardContext.Provider
      value={{
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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
