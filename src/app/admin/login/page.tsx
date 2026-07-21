"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight, Loader2, Sparkles, Server, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState("admin@evoai.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await adminLogin({ email, password });
      if (result.success) {
        setSuccessMessage("Admin Authentication Verified! Redirecting to System Console...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed — invalid credentials";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillCredentials = () => {
    setEmail("admin@evoai.com");
    setPassword("Admin@123");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* Background Gradients & Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-cyan-500/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold backdrop-blur-md shadow-lg shadow-purple-500/10">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Enterprise Admin Gateway</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
            EvoAI <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 dark:from-purple-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">Admin Console</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Secure RBAC JWT Authentication endpoint for system administrators.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>System Authentication</span>
            </div>
            <Badge variant="active" className="text-[10px] bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/30">
              SOC2 Compliant
            </Badge>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Authentication Failed</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" /> Admin Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@evoai.com"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" /> Admin Access Password *
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none focus:text-indigo-400 transition-colors p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Autofill Helper Pill */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Seed Credential: <code className="text-purple-300 font-mono">admin@evoai.com</code></span>
              <button
                type="button"
                onClick={autofillCredentials}
                className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill Seed
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer border border-purple-400/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate Admin Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Security Note */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Server className="w-3 h-3 text-emerald-400" /> API: /api/auth/admin/login
            </span>
            <span>JWT Bearer RBAC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
