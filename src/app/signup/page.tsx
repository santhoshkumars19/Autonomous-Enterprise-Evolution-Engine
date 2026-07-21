"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, ArrowRight, Sparkles } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const { signup, googleLogin } = useAuth();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("saas");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const triggerGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const authRes = await googleLogin({ access_token: tokenResponse.access_token });
        setIsLoading(false);

        const role = authRes?.role || authRes?.user?.role;
        const isSetupCompleted = Boolean(authRes?.setupCompleted || authRes?.user?.business_setup_completed || authRes?.user?.setup_completed);

        if (role === "admin") {
          router.push("/admin/dashboard");
          return;
        }

        if (authRes.isNewUser || !isSetupCompleted) {
          router.push("/business-setup");
          return;
        }

        router.push("/dashboard");
      } catch (err: unknown) {
        setIsLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "Google registration failed");
      }
    },
    onError: () => {
      setErrorMessage("Google Sign-In was cancelled or failed");
    },
  });

  const businessOptions = [
    { label: "SaaS & Cloud Software", value: "saas" },
    { label: "Supermarket & Groceries", value: "supermarket" },
    { label: "Retail Shop & Consumer Goods", value: "retail" },
    { label: "Restaurant & Food Service", value: "restaurant" },
    { label: "E-Commerce & Digital Retail", value: "ecommerce" },
    { label: "Fintech & Financial Services", value: "fintech" },
    { label: "Healthcare & Hospitals", value: "healthcare" },
    { label: "IT & Technology Services", value: "it_services" },
    { label: "AI & Robotics Infrastructure", value: "ai_infrastructure" },
    { label: "Enterprise Manufacturing", value: "manufacturing" },
    { label: "Logistics & Supply Chain", value: "logistics" },
    { label: "Education & EdTech", value: "education" },
    { label: "Real Estate & Construction", value: "real_estate" },
    { label: "Professional & Consulting Services", value: "consulting" },
    { label: "Automotive & Transportation", value: "automotive" },
    { label: "Media & Entertainment", value: "media" },
    { label: "Energy & Utilities", value: "energy" },
    { label: "Agriculture & Food Processing", value: "agriculture" },
    { label: "General Enterprise", value: "general" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await signup({
        name: fullName || "New Enterprise Leader",
        company: companyName || "Apex Innovations",
        email: email,
        password: password,
        businessType: businessType,
      });
      setIsLoading(false);

      const role = res?.role || res?.user?.role;
      const isSetupCompleted = Boolean(res?.setupCompleted || res?.user?.business_setup_completed || res?.user?.setup_completed);

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (!isSetupCompleted) {
        router.push("/business-setup");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-lg space-y-6 relative z-10">
          <Card className="shadow-2xl border-slate-200/80 dark:border-slate-800 backdrop-blur-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-2">
                <Cpu className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight justify-center">
                Deploy Your Enterprise Evolution Engine
              </CardTitle>
              <CardDescription>
                Create your enterprise workspace to start orchestrating AI C-Suite agents.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Company Name"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <Select
                  label="Business Category / Industry"
                  options={businessOptions}
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />

                <Input
                  label="Work Email Address"
                  type="email"
                  placeholder="Enter your work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-500 font-medium text-center">{errorMessage}</p>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full mt-2 py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Initializing Workspace..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1.5" /> Create Enterprise Account
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
                    Or Sign Up With
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => triggerGoogleSignup()}
                className="w-full text-xs flex items-center justify-center gap-2 py-2.5 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-semibold">Continue with Google</span>
              </Button>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              Already registered?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold ml-1 hover:underline">
                Sign In to Console
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
