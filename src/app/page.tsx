"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Users,
  BrainCircuit,
  TrendingUp,
  Target,
  CheckCircle2,
  Lock,
  Globe,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const featureCards = [
    {
      icon: BrainCircuit,
      title: "8 Autonomous C-Suite Agents",
      description: "Dedicated CEO, CFO, CMO, and Sales AI agents working synchronously 24/7 to analyze data, resolve anomalies, and execute strategic priorities.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: TrendingUp,
      title: "Real-time Business Health Dial",
      description: "Live calculation of revenue velocity, margin spread, cash flow runway, and customer acquisition efficiency packed into a unified 0-100 score.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Shield,
      title: "Competitor Intel & Price Watch",
      description: "Autonomous Web Scraping & sentiment monitoring detecting rival pricing changes, feature debuts, and market share drift before anyone else.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Target,
      title: "AI Strategy Generator",
      description: "Monte Carlo strategy simulations delivering audit-backed expansion vectors, SWOT analysis, and prioritized capital deployment plans.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: BarChart3,
      title: "Predictive Financial Forecasting",
      description: "12-month forward-looking financial modeling with cash flow run-rate prediction, budget balancing, and ROI scenario evaluation.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Smart Task & Workload Dispatch",
      description: "Automatic task assignment to cognitive agents with priority queuing, automated reminders, and progress tracking.",
      color: "from-violet-500 to-purple-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide mb-6 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
              <span>Next-Gen Enterprise AI Engine v4.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1]"
            >
              Accelerate Enterprise Growth with{" "}
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Autonomous AI Evolution
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
            >
              The unified SaaS intelligence engine orchestrating 8 specialized AI C-Suite agents, multi-market telemetry, predictive financial modeling, and dynamic strategy execution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/signup">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto shadow-xl shadow-indigo-500/25">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In to Console
                </Button>
              </Link>
            </motion.div>

            {/* Quick Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-Time Telemetry
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 8 C-Suite AI Agents
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Code Setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bank-Grade Security
              </span>
            </motion.div>
          </div>

        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Unified Enterprise Intelligence
              </h2>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Everything required to run an autonomous, multi-million dollar business.
              </p>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Replace fragmented legacy SaaS tools with 10 integrated cognitive modules designed to automate strategic, financial, and operational execution.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featureCards.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <motion.div key={idx} variants={itemVariants}>
                    <Card className="h-full border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-lg">{feat.title}</CardTitle>
                        <CardDescription className="mt-2 text-xs leading-relaxed">
                          {feat.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
