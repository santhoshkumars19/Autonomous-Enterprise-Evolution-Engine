"use client";

import React, { useState } from "react";
import { User, Mail, Building, Briefcase, ShieldCheck, Award, Calendar, CheckCircle2, Save } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "Alexandra Vance");
  const [email, setEmail] = useState(user?.email || "alexandra.vance@vanguard.ai");
  const [company, setCompany] = useState(user?.company || "Apex Global Dynamics");
  const [role, setRole] = useState(user?.role || "Chief Executive Officer & Enterprise Admin");
  const [businessType, setBusinessType] = useState(user?.businessType || "Enterprise AI Infrastructure");
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, company, role, businessType });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-500" /> Executive Profile & Account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, C-Suite permissions, and organization profile settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Avatar & Identity Summary */}
        <Card className="md:col-span-1 text-center p-6 flex flex-col items-center justify-between space-y-4">
          <div className="space-y-3">
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
                {name.charAt(0)}
              </div>
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{name}</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{role}</p>
              <p className="text-[11px] text-slate-500">{company}</p>
            </div>

            <Badge variant="active" className="mx-auto">
              <ShieldCheck className="w-3 h-3 mr-1" /> Enterprise Tier 1 Access
            </Badge>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-500 text-left">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Member since Q1 2024
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-500" /> 8 AI Agents Assigned
            </div>
          </div>
        </Card>

        {/* Right Editable Details Form */}
        <Card className="md:col-span-2">
          <form onSubmit={handleUpdate}>
            <CardHeader>
              <CardTitle className="text-base">Edit Account Information</CardTitle>
              <CardDescription>Update your personal executive contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
                <Input
                  label="Industry Category"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>

              <Input
                label="Role Title"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated!
                </span>
              ) : (
                <span className="text-xs text-slate-400">All edits sync automatically.</span>
              )}
              <Button type="submit" variant="gradient" size="sm">
                <Save className="w-3.5 h-3.5 mr-1" /> Update Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
