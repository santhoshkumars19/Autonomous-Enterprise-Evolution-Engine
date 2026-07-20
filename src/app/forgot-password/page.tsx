"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2, ShieldCheck, Lock } from "lucide-react";
import { authApi } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsVerifying(true);

    try {
      const res = await authApi.verifyEmail(email);
      if (res.success) {
        setSuccessMessage("Account verified! Enter your new password below.");
        setStep(2);
      } else {
        setErrorMessage(res.message || "Email verification failed");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "No registered account found with this email address");
    } finally {
      setIsVerifying(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please ensure both passwords are identical.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters in length.");
      return;
    }

    setIsResetting(true);

    try {
      const res = await authApi.resetPassword({ email, newPassword });
      if (res.success) {
        setSuccessMessage(res.message || "Password reset successfully! Redirecting to Sign In...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setErrorMessage(res.message || "Failed to reset password");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          <Card className="shadow-2xl border-slate-200/80 dark:border-slate-800 backdrop-blur-2xl">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-2">
                {step === 1 ? <Mail className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight justify-center">
                {step === 1 ? "Reset Account Password" : "Set New Password"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Enter your registered business email address to verify your account."
                  : `Account verified: ${email}. Enter your new secure password.`}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Verification Error</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Step 1: Verify Email Form */}
              {step === 1 && (
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <Input
                    label="Business Email Address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full mt-2 py-2.5 flex items-center justify-center gap-2"
                    disabled={isVerifying || !email.trim()}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Account Email...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Email Address</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: New Password & Confirm Password Form */}
              {step === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Verified Email:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{email}</span>
                  </div>

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-400"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <Button
                      type="submit"
                      variant="gradient"
                      className="flex-1 py-2.5 flex items-center justify-center gap-2"
                      disabled={isResetting || !newPassword.trim() || !confirmPassword.trim()}
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Reset Password & Sign In</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              Remembered your password?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold ml-1 hover:underline">
                Back to Sign In
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
