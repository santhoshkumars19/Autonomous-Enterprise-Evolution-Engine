"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, ArrowRight, Lock, Mail, Globe, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { login, socialLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Social OAuth Modal State
  const [socialProvider, setSocialProvider] = useState<"google" | "microsoft" | null>(null);
  const [socialEmail, setSocialEmail] = useState("");
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const [socialError, setSocialError] = useState("");

  const handleSocialSubmit = async (emailToSubmit: string) => {
    if (!emailToSubmit || !socialProvider) return;
    setIsSocialSubmitting(true);
    setSocialError("");

    try {
      const authRes = await socialLogin({
        provider: socialProvider,
        email: emailToSubmit.trim(),
      });
      setIsSocialSubmitting(false);

      const token = localStorage.getItem("evoai-token");
      if (token) {
        try {
          const { businessApi } = await import("@/lib/api");
          const res = await businessApi.getSetup(token);
          if ((res as any).role === "admin" || (authRes as any)?.user?.role === "admin") {
            router.push("/admin/dashboard");
            return;
          }
          if (res.success && res.setupCompleted === false) {
            router.push("/business-setup");
            return;
          }
        } catch {}
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setIsSocialSubmitting(false);
      setSocialError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const authRes = await login(email, password);
    setIsLoading(false);

    const token = localStorage.getItem("evoai-token");
    if (token) {
      try {
        const { businessApi } = await import("@/lib/api");
        const res = await businessApi.getSetup(token);
        if ((res as any).role === "admin" || (authRes as any)?.user?.role === "admin") {
          router.push("/admin/dashboard");
          return;
        }
        if (res.success && res.setupCompleted === false) {
          router.push("/business-setup");
          return;
        }
      } catch {}
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          <Card className="shadow-2xl border-slate-200/80 dark:border-slate-800 backdrop-blur-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-2">
                <Cpu className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight justify-center">
                Sign In to Enterprise Console
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your autonomous engine telemetry.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Business Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    Remember Me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full mt-2 py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Authenticating..."
                  ) : (
                    <>
                      Sign In to Console <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                    Or Continue With
                  </span>
                </div>
              </div>

              {/* OAuth Options UI */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setSocialProvider("google");
                    setSocialEmail("");
                    setSocialError("");
                  }}
                  className="text-xs flex items-center justify-center gap-2 py-2.5 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="font-semibold">Google</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setSocialProvider("microsoft");
                    setSocialEmail("");
                    setSocialError("");
                  }}
                  className="text-xs flex items-center justify-center gap-2 py-2.5 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                    <div className="bg-[#f25022] rounded-[1px]" />
                    <div className="bg-[#7fba00] rounded-[1px]" />
                    <div className="bg-[#00a4ef] rounded-[1px]" />
                    <div className="bg-[#ffb900] rounded-[1px]" />
                  </div>
                  <span className="font-semibold">Microsoft</span>
                </Button>
              </div>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              Don't have an enterprise account?{" "}
              <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold ml-1 hover:underline">
                Create Account
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* ── OAuth Account Login Modal ── */}
      {socialProvider !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSocialProvider(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors text-sm"
            >
              ✕
            </button>

            {/* Header Icon */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {socialProvider === "google" ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                ) : (
                  <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                    <div className="bg-[#f25022] rounded-[1px]" />
                    <div className="bg-[#7fba00] rounded-[1px]" />
                    <div className="bg-[#00a4ef] rounded-[1px]" />
                    <div className="bg-[#ffb900] rounded-[1px]" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Sign in with {socialProvider === "google" ? "Google" : "Microsoft"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose an account or enter your email to continue to EvoAI Console
              </p>
            </div>

            {/* Quick Demo Accounts */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Account</p>
              <div className="space-y-1.5">
                {(socialProvider === "google"
                  ? [
                      { email: "alex.vance@gmail.com", name: "Alex Vance" },
                      { email: "john.executive@vanguard.ai", name: "John Executive" },
                    ]
                  : [
                      { email: "sarah.chen@outlook.com", name: "Sarah Chen" },
                      { email: "msft.executive@vanguard.ai", name: "Marcus Rodriguez" },
                    ]
                ).map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleSocialSubmit(acc.email)}
                    disabled={isSocialSubmitting}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-xs flex items-center justify-center">
                        {acc.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-400 transition-colors">{acc.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{acc.email}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Account Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSocialSubmit(socialEmail);
              }}
              className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <Input
                label={`Or use another ${socialProvider === "google" ? "Google" : "Microsoft"} email`}
                type="email"
                placeholder={`user@${socialProvider === "google" ? "gmail.com" : "outlook.com"}`}
                value={socialEmail}
                onChange={(e) => setSocialEmail(e.target.value)}
                required
              />

              {socialError && (
                <p className="text-xs text-rose-500 text-center font-medium">{socialError}</p>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full py-2 text-xs"
                disabled={isSocialSubmitting || !socialEmail.trim()}
              >
                {isSocialSubmitting ? "Signing in..." : `Continue with ${socialProvider === "google" ? "Google" : "Microsoft"}`}
              </Button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
