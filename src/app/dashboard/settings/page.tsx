"use client";

import React, { useState } from "react";
import { User, Bell, Shield, Moon, Sun, Key, Sliders, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || "Alexandra Vance");
  const [email, setEmail] = useState(user?.email || "alexandra.vance@vanguard.ai");
  const [company, setCompany] = useState(user?.company || "Apex Global Dynamics");
  const [role, setRole] = useState(user?.role || "Chief Executive Officer & Enterprise Admin");
  const [autoSync, setAutoSync] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, company, role });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-indigo-500" /> System Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure profile management, telemetry sync intervals, theme modes, and notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Theme & Display Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" /> Theme & Preference Controls
            </CardTitle>
            <CardDescription>Choose how the EvoAI Console renders across desktop and mobile devices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">Interface Color Scheme</span>
                <span className="text-[11px] text-slate-500">Toggle dark mode vs light mode theme persistence.</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={theme === "light" ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="w-3.5 h-3.5 mr-1" /> Light Mode
                </Button>
                <Button
                  type="button"
                  variant={theme === "dark" ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="w-3.5 h-3.5 mr-1" /> Dark Mode
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">Real-time Agent Telemetry Auto-Sync</span>
                <span className="text-[11px] text-slate-500">Refresh dashboard charts every 5 seconds.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Account Security & API Secrets
            </CardTitle>
            <CardDescription>Manage 2FA verification, single sign-on (SSO), and cluster credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Two-Factor Authentication (2FA)</span>
                <span className="text-[10px] text-slate-500">Hardware token key connected via FIDO2</span>
              </div>
              <Badge variant="active">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Executive Cluster Secret Key</span>
                <span className="text-[10px] font-mono text-slate-500">evoai_live_sk_8f93...9a21</span>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => alert("Secret key copied to clipboard.")}>
                Copy Key
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences updated successfully!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Changes take effect immediately.</span>
            )}
            <Button type="submit" variant="gradient" size="sm">
              Save All Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

