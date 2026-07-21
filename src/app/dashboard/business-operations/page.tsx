"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  ShoppingBag,
  Utensils,
  Laptop,
  Activity,
  Factory,
  ShoppingCart,
  Building2,
  CheckCircle2,
  Loader2,
  Sparkles,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  History,
} from "lucide-react";
import { businessApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INDUSTRY_PROMPTS: Record<string, { title: string; focus: string; fields: Array<{ key: string; label: string; type: string; defaultVal: any }> }> = {
  "Retail Shop": {
    title: "Retail Shop Operations",
    focus: "Inventory Optimization & Sales Velocity",
    fields: [
      { key: "dailySales", label: "Daily Sales Amount ($/₹)", type: "number", defaultVal: 45000 },
      { key: "inventory", label: "Current Inventory Value ($/₹)", type: "number", defaultVal: 180000 },
      { key: "purchases", label: "New Stock Purchases ($/₹)", type: "number", defaultVal: 12000 },
      { key: "expenses", label: "Operating Expenses ($/₹)", type: "number", defaultVal: 8500 },
      { key: "customers", label: "Daily Customer Count", type: "number", defaultVal: 320 },
      { key: "suppliers", label: "Active Suppliers Count", type: "number", defaultVal: 14 },
    ],
  },
  "Restaurant": {
    title: "Restaurant & Food Service",
    focus: "Menu & Food Cost Optimization",
    fields: [
      { key: "orders", label: "Total Daily Orders", type: "number", defaultVal: 240 },
      { key: "revenue", label: "Daily Revenue ($/₹)", type: "number", defaultVal: 38000 },
      { key: "foodCost", label: "Food & Ingredient Cost ($/₹)", type: "number", defaultVal: 11000 },
      { key: "customers", label: "Cover Count (Guests Served)", type: "number", defaultVal: 310 },
      { key: "staff", label: "Working Staff Shift Count", type: "number", defaultVal: 18 },
      { key: "inventory", label: "Pantry Inventory Value ($/₹)", type: "number", defaultVal: 25000 },
    ],
  },
  "IT Company": {
    title: "IT Company & SaaS Operations",
    focus: "Project Delivery & Employee Productivity",
    fields: [
      { key: "activeProjects", label: "Active Client Projects", type: "number", defaultVal: 12 },
      { key: "completedProjects", label: "Completed Projects (MTD)", type: "number", defaultVal: 4 },
      { key: "newClients", label: "New Clients Onboarded", type: "number", defaultVal: 3 },
      { key: "productivity", label: "Employee Productivity Score (%)", type: "number", defaultVal: 88 },
      { key: "billableHours", label: "Total Billable Hours Logged", type: "number", defaultVal: 1420 },
      { key: "projectRevenue", label: "Monthly Project Revenue ($/₹)", type: "number", defaultVal: 480000 },
      { key: "operationalExpenses", label: "Operational & Cloud Expenses ($/₹)", type: "number", defaultVal: 290000 },
      { key: "customerSatisfaction", label: "CSAT Score (out of 100)", type: "number", defaultVal: 94 },
      { key: "resourceUtilization", label: "Resource Utilization (%)", type: "number", defaultVal: 82 },
    ],
  },
  "Hospital": {
    title: "Hospital & Medical Operations",
    focus: "Patient Flow Optimization",
    fields: [
      { key: "patients", label: "Total Outpatients / Inpatients", type: "number", defaultVal: 450 },
      { key: "appointments", label: "Daily Appointments Scheduled", type: "number", defaultVal: 180 },
      { key: "revenue", label: "Daily Medical Revenue ($/₹)", type: "number", defaultVal: 620000 },
      { key: "doctors", label: "Attending Doctors Count", type: "number", defaultVal: 42 },
      { key: "staff", label: "Nursing & Admin Staff Count", type: "number", defaultVal: 110 },
      { key: "expenses", label: "Daily Operating Expenses ($/₹)", type: "number", defaultVal: 380000 },
    ],
  },
  "Manufacturing": {
    title: "Manufacturing & Industrial Operations",
    focus: "Production Efficiency & OEE",
    fields: [
      { key: "productionUnits", label: "Total Manufactured Units", type: "number", defaultVal: 8500 },
      { key: "rawMaterials", label: "Raw Materials Cost ($/₹)", type: "number", defaultVal: 140000 },
      { key: "inventory", label: "Finished Goods Inventory ($/₹)", type: "number", defaultVal: 320000 },
      { key: "revenue", label: "Daily Shipped Revenue ($/₹)", type: "number", defaultVal: 520000 },
      { key: "expenses", label: "Plant Expenses & Energy ($/₹)", type: "number", defaultVal: 280000 },
      { key: "machineUtilization", label: "Machine Utilization / OEE (%)", type: "number", defaultVal: 84 },
    ],
  },
  "E-Commerce": {
    title: "E-Commerce & Digital Store",
    focus: "ROAS & Conversion Rate Optimization",
    fields: [
      { key: "orders", label: "Daily Total Orders", type: "number", defaultVal: 620 },
      { key: "revenue", label: "Daily E-Com Gross Revenue ($/₹)", type: "number", defaultVal: 125000 },
      { key: "returns", label: "Order Returns Count", type: "number", defaultVal: 18 },
      { key: "conversionRate", label: "Store Conversion Rate (%)", type: "number", defaultVal: 3.8 },
      { key: "websiteVisitors", label: "Daily Store Visitors", type: "number", defaultVal: 16500 },
      { key: "marketingSpend", label: "Daily Ad / Marketing Spend ($/₹)", type: "number", defaultVal: 14000 },
    ],
  },
  "General Enterprise": {
    title: "General Enterprise Operations",
    focus: "Executive Performance & Cost Efficiency",
    fields: [
      { key: "revenue", label: "Total Revenue ($/₹)", type: "number", defaultVal: 500000 },
      { key: "expenses", label: "Total Expenses ($/₹)", type: "number", defaultVal: 320000 },
      { key: "inventory", label: "Asset / Inventory Value ($/₹)", type: "number", defaultVal: 150000 },
      { key: "customers", label: "Active Enterprise Accounts", type: "number", defaultVal: 85 },
      { key: "growthRate", label: "Quarterly Growth Target (%)", type: "number", defaultVal: 22 },
    ],
  },
};

export default function BusinessOperationsPage() {
  const [businessType, setBusinessType] = useState<string>("IT Company");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pastLogs, setPastLogs] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    const token = localStorage.getItem("evoai-token");
    if (!token) return;

    setLoading(true);
    Promise.allSettled([businessApi.getSetup(token), businessApi.getOperations(token)])
      .then(([setupRes, opsRes]) => {
        if (setupRes.status === "fulfilled" && setupRes.value.success) {
          const bType = setupRes.value.company?.business_type || "IT Company";
          setBusinessType(bType);
          initDefaultFormData(bType);
        } else {
          initDefaultFormData("IT Company");
        }

        if (opsRes.status === "fulfilled" && opsRes.value.success) {
          setPastLogs(opsRes.value.operations || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const initDefaultFormData = (bType: string) => {
    const spec = INDUSTRY_PROMPTS[bType] || INDUSTRY_PROMPTS["General Enterprise"];
    const initial: Record<string, any> = {};
    spec.fields.forEach((f) => {
      initial[f.key] = f.defaultVal;
    });
    setFormData(initial);
  };

  const handleTypeChange = (newType: string) => {
    setBusinessType(newType);
    initDefaultFormData(newType);
  };

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("evoai-token");
    if (!token) {
      setErrorMsg("Please sign in to submit business operations data.");
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await businessApi.submitOperations(token, {
        businessType,
        metricsData: formData,
      });

      if (res.success) {
        setSuccessMsg("Operations telemetry saved & AI business insights refreshed!");
        if (res.operation) {
          setPastLogs((prev) => [res.operation!, ...prev]);
        }
      } else {
        setErrorMsg(res.message || "Failed to save operations entry");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to record operations data");
    } finally {
      setSubmitting(false);
    }
  };

  const spec = INDUSTRY_PROMPTS[businessType] || INDUSTRY_PROMPTS["General Enterprise"];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading Business Operations Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-purple-900/60 dark:via-indigo-900/50 dark:to-slate-900 border border-slate-200 dark:border-purple-500/20 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
              <Layers className="w-3 h-3 mr-1" /> Dynamic Industry Telemetry
            </Badge>
            <Badge className="bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30">
              {spec.title}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Daily Business Data Entry</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Record daily or periodic operational inputs. The AI engine automatically computes industry-specific KPI vectors: <strong className="text-cyan-600 dark:text-cyan-400">{spec.focus}</strong>.
          </p>
        </div>
      </div>

      {/* Industry Type Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.keys(INDUSTRY_PROMPTS).map((tKey) => {
          const active = businessType === tKey;
          return (
            <button
              key={tKey}
              onClick={() => handleTypeChange(tKey)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/20 scale-105"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tKey}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Form Card */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {spec.title} Entry Form
              </span>
              <Badge variant="neutral" className="text-[10px] text-cyan-700 dark:text-cyan-400 border-cyan-500/30">
                AI Focused: {spec.focus}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Form updates dynamically based on selected industry parameters.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {spec.fields.map((f) => (
                  <Input
                    key={f.key}
                    label={f.label}
                    type={f.type}
                    value={formData[f.key] ?? ""}
                    onChange={(e) =>
                      handleFieldChange(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                    }
                    required
                  />
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Save Operations & Refresh AI</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Telemetry Log History Sidebar */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl flex flex-col">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Recent Operations Logs
            </CardTitle>
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              Live database activity records
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 flex-1 overflow-y-auto max-h-[500px] space-y-3">
            {pastLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No past operations logs recorded yet. Submit your first telemetry entry above.
              </div>
            ) : (
              pastLogs.map((log, idx) => {
                const dataObj = typeof log.metrics_data === "string" ? JSON.parse(log.metrics_data) : log.metrics_data || {};
                const keys = Object.keys(dataObj).slice(0, 3);
                return (
                  <div
                    key={log.id || idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 space-y-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{log.business_type}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      {keys.map((k) => (
                        <div key={k} className="truncate">
                          <span className="text-slate-600 dark:text-slate-400 capitalize">{k}: </span>
                          <span className="font-semibold text-slate-900 dark:text-slate-200">{dataObj[k]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
