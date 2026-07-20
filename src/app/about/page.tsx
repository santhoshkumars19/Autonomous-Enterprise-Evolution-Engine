"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Cpu, BrainCircuit, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Autonomous AI Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About EvoAI</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            EvoAI is built to pioneer cognitive corporate management by unifying AI C-Suite agents, multi-dimensional telemetry, and predictive modeling into a seamless operating platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            <h3 className="font-bold text-base">Cognitive C-Suite</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Autonomous AI agents working 24/7 as CEO, CFO, CMO, and Sales leads to eliminate business bottlenecks.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h3 className="font-bold text-base">Real-Time Telemetry</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sub-millisecond data feeds unifying financial run-rates, customer sentiment, and competitive threat matrices.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            <h3 className="font-bold text-base">Bank-Grade Governance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              SOC2 Type II and ISO27001 certified security architecture protecting enterprise data integrity.
            </p>
          </Card>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Experience Next-Gen Corporate Operations</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Ready to explore our 10 cognitive modules and experience autonomous enterprise intelligence in action?
          </p>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-lg hover:opacity-90 transition-all">
              Go to Executive Console →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

