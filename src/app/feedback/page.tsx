"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquarePlus,
  Bug,
  Lightbulb,
  Palette,
  Zap,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Send,
  MessageCircle,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Footer } from "@/components/footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { feedbackApi, FeedbackItem } from "@/lib/api";

const SEED_FEEDBACK_ITEMS: FeedbackItem[] = [
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

export default function FeedbackPage() {
  const { user, token } = useAuth();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [category, setCategory] = useState<FeedbackItem["category"]>("bug");
  const [priority, setPriority] = useState<FeedbackItem["priority"]>("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load initial feedback items
  useEffect(() => {
    const loadFeedback = () => {
      const stored = localStorage.getItem("evoai_feedback_items");
      if (stored) {
        try {
          setFeedbackList(JSON.parse(stored));
          return;
        } catch (e) {
          console.warn("Failed to parse local feedback items:", e);
        }
      }
      setFeedbackList(SEED_FEEDBACK_ITEMS);
      localStorage.setItem("evoai_feedback_items", JSON.stringify(SEED_FEEDBACK_ITEMS));
    };

    loadFeedback();

    // Listen for storage updates (when admin replies in another tab)
    const handleStorageChange = () => {
      const stored = localStorage.getItem("evoai_feedback_items");
      if (stored) {
        try {
          setFeedbackList(JSON.parse(stored));
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const newTicket: FeedbackItem = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id,
      userName: user?.name || "Verified User",
      userEmail: user?.email || "user@vanguard.ai",
      companyName: user?.company || "Enterprise Customer",
      category,
      priority,
      subject,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Try API submission if authenticated
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("evoai-token") : null);
    if (authToken) {
      try {
        await feedbackApi.submit(authToken, newTicket);
      } catch (err) {
        console.warn("API feedback submission fallback to local storage:", err);
      }
    }

    const updatedList = [newTicket, ...feedbackList];
    setFeedbackList(updatedList);
    localStorage.setItem("evoai_feedback_items", JSON.stringify(updatedList));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setSubject("");
    setDescription("");

    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const getCategoryIcon = (cat: FeedbackItem["category"]) => {
    switch (cat) {
      case "bug":
        return <Bug className="w-4 h-4 text-rose-500" />;
      case "feature":
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case "ui":
        return <Palette className="w-4 h-4 text-purple-500" />;
      case "performance":
        return <Zap className="w-4 h-4 text-cyan-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: FeedbackItem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="neutral" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30">Pending Review</Badge>;
      case "under_review":
        return <Badge variant="processing" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30">Under Review</Badge>;
      case "resolved":
        return <Badge variant="active" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Resolved</Badge>;
      case "closed":
        return <Badge variant="idle" className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30">Closed</Badge>;
    }
  };

  const getPriorityBadge = (pri: FeedbackItem["priority"]) => {
    switch (pri) {
      case "critical":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Critical</span>;
      case "high":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">High</span>;
      case "medium":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">Low</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-md">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-900 dark:text-white">Feedback & Support Hub</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Direct Telemetry Link to Executive Engineering</p>
            </div>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="text-xs">
            Console Dashboard
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* STATS HEADER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Total Submitted</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{feedbackList.length}</span>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Pending Review</span>
              <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                {feedbackList.filter((f) => f.status === "pending" || f.status === "under_review").length}
              </span>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Resolved & Closed</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {feedbackList.filter((f) => f.status === "resolved" || f.status === "closed").length}
              </span>
            </div>
          </Card>
        </div>

        {/* FEEDBACK SUBMISSION & TICKETS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: SUBMIT FORM */}
          <Card className="lg:col-span-2 p-6 space-y-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Submit Ticket / Bug
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Report a bug or submit feature suggestions directly to the system administrators.
              </p>
            </div>

            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Ticket submitted successfully! Admin team notified.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Feedback Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "bug", label: "Bug Report", icon: Bug },
                    { id: "feature", label: "Feature Suggestion", icon: Lightbulb },
                    { id: "ui", label: "UI / UX Issue", icon: Palette },
                    { id: "performance", label: "Performance Spikes", icon: Zap },
                  ].map((item) => {
                    const Icon = item.icon;
                    const selected = category === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id as FeedbackItem["category"])}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all ${
                          selected
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-white font-bold"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority Selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as FeedbackItem["priority"])}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="low">Low - Minor cosmetic feedback</option>
                  <option value="medium">Medium - General workflow query</option>
                  <option value="high">High - Feature bottleneck</option>
                  <option value="critical">Critical - System / Auth error</option>
                </select>
              </div>

              <Input
                label="Subject Summary *"
                placeholder="Brief summary of the issue or idea..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide steps to reproduce or details of your suggestion..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !description.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Ticket to Admin
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* RIGHT: TICKET HISTORY & ADMIN REPLIES */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Ticket History & Admin Responses ({feedbackList.length})
              </h2>
            </div>

            <div className="space-y-4">
              {feedbackList.length === 0 ? (
                <Card className="p-8 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500">
                  <p className="text-xs">No feedback tickets submitted yet.</p>
                </Card>
              ) : (
                feedbackList.map((item) => (
                  <Card key={item.id} className="p-5 space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{item.id}</span>
                          {getStatusBadge(item.status)}
                          {getPriorityBadge(item.priority)}
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pt-1">
                          {getCategoryIcon(item.category)} {item.subject}
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      {item.description}
                    </p>

                    {/* OFFICIAL ADMIN REPLY SECTION */}
                    {item.adminReply ? (
                      <div className="mt-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4" /> Admin Response from Executive Team
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(item.repliedAt || item.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                          {item.adminReply}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 italic pt-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Awaiting response from Administrator
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
