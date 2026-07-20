"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("saas");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    await signup({
      name: fullName || "New Enterprise Leader",
      company: companyName || "Apex Innovations",
      email: email || "leader@apex.io",
      password: password,
      businessType: businessType,
    });
    setIsLoading(false);
    router.push("/business-setup");
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
