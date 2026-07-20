"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" /> Legal Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last updated: July 15, 2026</p>
        </div>

        <Card className="p-8 space-y-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the EvoAI platform, services, and APIs, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, you must not access or use the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">2. Cognitive Services & Autonomous AI Agents</h2>
            <p>
              EvoAI provides autonomous AI C-Suite recommendations and telemetry calculations. While our cognitive agents achieve high precision based on model algorithms, executive decisions remain under human governance. Always review critical corporate strategies prior to capital deployment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">3. Data Security & Confidentiality</h2>
            <p>
              All organizational data transmitted through EvoAI is encrypted in transit (TLS 1.3) and at rest (AES-256). We enforce strict isolation between enterprise tenant datasets and adhere to SOC2 Type II and ISO27001 standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">4. Acceptable Use Policy</h2>
            <p>
              You agree not to modify, reverse engineer, or exploit the platform algorithms. Usage must comply with applicable global privacy laws and corporate governance standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, EvoAI shall not be liable for indirect, incidental, or consequential damages arising out of automated task execution or external market volatility.
            </p>
          </section>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

