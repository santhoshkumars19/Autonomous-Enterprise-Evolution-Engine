"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" /> Privacy Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: July 15, 2026</p>
        </div>

        <Card className="p-8 space-y-6 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">1. Data Privacy Principles</h2>
            <p>
              EvoAI prioritizes privacy and enterprise data sovereignty. We collect minimal operational metrics required for cognitive processing and agent execution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">2. Information We Process</h2>
            <p>
              We process corporate telemetry, account information, and executive task logs. We NEVER sell customer telemetry or share data with unauthorized third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">3. Zero Data Training Guarantee</h2>
            <p>
              Your enterprise business data and customer metrics are strictly isolated. EvoAI model endpoints DO NOT use tenant data for public model retraining.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">4. Compliance & Certifications</h2>
            <p>
              Our platform adheres to GDPR, CCPA, SOC2 Type II, and ISO27001 compliance standards. Administrators can request automated data export or permanent deletion at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">5. Contact Data Protection Officer</h2>
            <p>
              For privacy audits or compliance verification, contact our Data Protection Officer at privacy@a3e.ai.
            </p>
          </section>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

