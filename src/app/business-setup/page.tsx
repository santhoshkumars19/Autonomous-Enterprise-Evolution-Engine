"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Globe2,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Users,
  Layers,
  ShoppingBag,
  Utensils,
  Laptop,
  Activity,
  Factory,
  ShoppingCart,
  ShieldCheck,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { businessApi } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BUSINESS_TYPES = [
  { id: "Retail Shop", name: "Retail Shop", icon: ShoppingBag, desc: "Physical or digital store selling consumer goods" },
  { id: "Restaurant", name: "Restaurant & Food", icon: Utensils, desc: "Dining, cafes, food service, and hospitality" },
  { id: "IT Company", name: "IT Company & SaaS", icon: Laptop, desc: "Software, tech services, digital agency, IT" },
  { id: "Hospital", name: "Hospital & Healthcare", icon: Activity, desc: "Medical clinics, health services, hospitals" },
  { id: "Manufacturing", name: "Manufacturing", icon: Factory, desc: "Industrial production, assembly, raw materials" },
  { id: "E-Commerce", name: "E-Commerce", icon: ShoppingCart, desc: "Online marketplace, D2C store, fulfillment" },
  { id: "General Enterprise", name: "General Enterprise", icon: Building2, desc: "Commercial enterprise, B2B services, consulting" },
];

const INDUSTRY_OPTIONS = [
  { value: "Supermarket & Groceries", label: "Supermarket & Groceries" },
  { value: "Technology & Software", label: "Technology & Software (SaaS / AI)" },
  { value: "Retail & Consumer Goods", label: "Retail & Consumer Goods" },
  { value: "Healthcare & Hospitals", label: "Healthcare & Hospitals" },
  { value: "Restaurants & Hospitality", label: "Restaurants & Hospitality" },
  { value: "Manufacturing & Industrial", label: "Manufacturing & Industrial" },
  { value: "E-Commerce & Digital Store", label: "E-Commerce & Digital Store" },
  { value: "Financial Services & Banking", label: "Financial Services & Banking" },
  { value: "Logistics & Supply Chain", label: "Logistics & Supply Chain" },
  { value: "Education & EdTech", label: "Education & EdTech" },
  { value: "Real Estate & Construction", label: "Real Estate & Construction" },
  { value: "Professional & Consulting", label: "Professional & Consulting Services" },
  { value: "Automotive & Transportation", label: "Automotive & Transportation" },
  { value: "Media & Entertainment", label: "Media & Entertainment" },
  { value: "Energy & Utilities", label: "Energy & Utilities" },
  { value: "Agriculture & Food Processing", label: "Agriculture & Food Processing" },
];

const COUNTRY_OPTIONS = [
  { value: "United States", label: "United States" },
  { value: "India", label: "India" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "Singapore", label: "Singapore" },
  { value: "United Arab Emirates", label: "United Arab Emirates" },
  { value: "Japan", label: "Japan" },
  { value: "Brazil", label: "Brazil" },
  { value: "France", label: "France" },
  { value: "Other Country", label: "Other Country" },
];

const STATES_MAP: Record<string, { value: string; label: string }[]> = {
  "United States": [
    { value: "California", label: "California" },
    { value: "New York", label: "New York" },
    { value: "Texas", label: "Texas" },
    { value: "Florida", label: "Florida" },
    { value: "Illinois", label: "Illinois" },
    { value: "Washington", label: "Washington" },
    { value: "Massachusetts", label: "Massachusetts" },
    { value: "Georgia", label: "Georgia" },
    { value: "North Carolina", label: "North Carolina" },
    { value: "Virginia", label: "Virginia" },
    { value: "Ohio", label: "Ohio" },
    { value: "Pennsylvania", label: "Pennsylvania" },
    { value: "Other State", label: "Other State" },
  ],
  "India": [
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Delhi NCR", label: "Delhi NCR" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Haryana", label: "Haryana" },
    { value: "Punjab", label: "Punjab" },
    { value: "Kerala", label: "Kerala" },
    { value: "Other State", label: "Other State" },
  ],
  "United Kingdom": [
    { value: "England", label: "England" },
    { value: "Scotland", label: "Scotland" },
    { value: "Wales", label: "Wales" },
    { value: "Northern Ireland", label: "Northern Ireland" },
    { value: "Greater London", label: "Greater London" },
    { value: "Other Region", label: "Other Region" },
  ],
  "Canada": [
    { value: "Ontario", label: "Ontario" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "Quebec", label: "Quebec" },
    { value: "Alberta", label: "Alberta" },
    { value: "Manitoba", label: "Manitoba" },
    { value: "Other Province", label: "Other Province" },
  ],
  "Australia": [
    { value: "New South Wales", label: "New South Wales" },
    { value: "Victoria", label: "Victoria" },
    { value: "Queensland", label: "Queensland" },
    { value: "Western Australia", label: "Western Australia" },
    { value: "South Australia", label: "South Australia" },
    { value: "Other State", label: "Other State" },
  ],
};

const CITIES_MAP: Record<string, { value: string; label: string }[]> = {
  "California": [
    { value: "San Francisco", label: "San Francisco" },
    { value: "Los Angeles", label: "Los Angeles" },
    { value: "San Jose", label: "San Jose" },
    { value: "San Diego", label: "San Diego" },
    { value: "Sacramento", label: "Sacramento" },
    { value: "Other City", label: "Other City" },
  ],
  "New York": [
    { value: "New York City", label: "New York City" },
    { value: "Albany", label: "Albany" },
    { value: "Buffalo", label: "Buffalo" },
    { value: "Rochester", label: "Rochester" },
    { value: "Other City", label: "Other City" },
  ],
  "Texas": [
    { value: "Austin", label: "Austin" },
    { value: "Houston", label: "Houston" },
    { value: "Dallas", label: "Dallas" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "Fort Worth", label: "Fort Worth" },
    { value: "Other City", label: "Other City" },
  ],
  "Florida": [
    { value: "Miami", label: "Miami" },
    { value: "Orlando", label: "Orlando" },
    { value: "Tampa", label: "Tampa" },
    { value: "Jacksonville", label: "Jacksonville" },
    { value: "Other City", label: "Other City" },
  ],
  "Maharashtra": [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Pune", label: "Pune" },
    { value: "Nagpur", label: "Nagpur" },
    { value: "Thane", label: "Thane" },
    { value: "Nashik", label: "Nashik" },
    { value: "Other City", label: "Other City" },
  ],
  "Karnataka": [
    { value: "Bengaluru", label: "Bengaluru" },
    { value: "Mysore", label: "Mysore" },
    { value: "Hubli", label: "Hubli" },
    { value: "Mangalore", label: "Mangalore" },
    { value: "Other City", label: "Other City" },
  ],
  "Delhi NCR": [
    { value: "New Delhi", label: "New Delhi" },
    { value: "Gurgaon", label: "Gurgaon" },
    { value: "Noida", label: "Noida" },
    { value: "Ghaziabad", label: "Ghaziabad" },
    { value: "Other City", label: "Other City" },
  ],
  "Tamil Nadu": [
    { value: "Chennai", label: "Chennai" },
    { value: "Coimbatore", label: "Coimbatore" },
    { value: "Madurai", label: "Madurai" },
    { value: "Tiruchirappalli", label: "Tiruchirappalli (Trichy)" },
    { value: "Salem", label: "Salem" },
    { value: "Tiruppur", label: "Tiruppur" },
    { value: "Tirunelveli", label: "Tirunelveli" },
    { value: "Erode", label: "Erode" },
    { value: "Vellore", label: "Vellore" },
    { value: "Thanjavur", label: "Thanjavur" },
    { value: "Thoothukudi", label: "Thoothukudi (Tuticorin)" },
    { value: "Dindigul", label: "Dindigul" },
    { value: "Kanchipuram", label: "Kanchipuram" },
    { value: "Nagercoil", label: "Nagercoil" },
    { value: "Cuddalore", label: "Cuddalore" },
    { value: "Karur", label: "Karur" },
    { value: "Other City", label: "Other City" },
  ],
  "Telangana": [
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Warangal", label: "Warangal" },
    { value: "Secunderabad", label: "Secunderabad" },
    { value: "Other City", label: "Other City" },
  ],
  "England": [
    { value: "London", label: "London" },
    { value: "Manchester", label: "Manchester" },
    { value: "Birmingham", label: "Birmingham" },
    { value: "Leeds", label: "Leeds" },
    { value: "Bristol", label: "Bristol" },
    { value: "Other City", label: "Other City" },
  ],
  "Ontario": [
    { value: "Toronto", label: "Toronto" },
    { value: "Ottawa", label: "Ottawa" },
    { value: "Mississauga", label: "Mississauga" },
    { value: "Hamilton", label: "Hamilton" },
    { value: "Other City", label: "Other City" },
  ],
  "New South Wales": [
    { value: "Sydney", label: "Sydney" },
    { value: "Newcastle", label: "Newcastle" },
    { value: "Wollongong", label: "Wollongong" },
    { value: "Other City", label: "Other City" },
  ],
};

export default function BusinessSetupStandalonePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [setupCompleted, setSetupCompleted] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("IT Company");
  const [industry, setIndustry] = useState("Technology & Software");
  const [companySize, setCompanySize] = useState("11-50");
  const [numEmployees, setNumEmployees] = useState(25);
  const [country, setCountry] = useState("United States");
  const [state, setState] = useState("California");
  const [city, setCity] = useState("San Francisco");
  const [productsServices, setProductsServices] = useState("AI Enterprise Platforms & Solutions");
  const [annualRevenue, setAnnualRevenue] = useState(5000000);
  const [annualExpenses, setAnnualExpenses] = useState(3200000);
  const [currency, setCurrency] = useState("USD");

  const handleCountryChange = (val: string) => {
    setCountry(val);
    const availableStates = STATES_MAP[val] || [
      { value: "Central State", label: "Central State" },
      { value: "North Region", label: "North Region" },
      { value: "South Region", label: "South Region" },
      { value: "Other State", label: "Other State" },
    ];
    const firstState = availableStates[0]?.value || "Other State";
    setState(firstState);

    const availableCities = CITIES_MAP[firstState] || [
      { value: "Capital City", label: "Capital City" },
      { value: "Metro Hub", label: "Metro Hub" },
      { value: "Other City", label: "Other City" },
    ];
    setCity(availableCities[0]?.value || "Other City");
  };

  const handleStateChange = (val: string) => {
    setState(val);
    const availableCities = CITIES_MAP[val] || [
      { value: "Capital City", label: "Capital City" },
      { value: "Metro Hub", label: "Metro Hub" },
      { value: "Other City", label: "Other City" },
    ];
    setCity(availableCities[0]?.value || "Other City");
  };

  useEffect(() => {
    if (user?.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    const token = localStorage.getItem("evoai-token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    businessApi
      .getSetup(token)
      .then((res) => {
        if ((res as any).role === "admin") {
          router.push("/admin/dashboard");
          return;
        }
        if (res.success) {
          if (res.company) {
            setCompanyName(res.company.name || user?.company || "");
            setIndustry(res.company.industry || "Technology & Software");
            setBusinessType(res.company.businessType || "IT Company");
            setCompanySize(res.company.companySize || "11-50");
            setNumEmployees(res.company.numEmployees || 25);
            setCountry(res.company.country || "United States");
            setState(res.company.state || "California");
            setCity(res.company.city || "San Francisco");
            setProductsServices(res.company.productsServices || "AI Enterprise Solutions");
          } else if (user?.company) {
            setCompanyName(user.company);
          }

          if (res.metrics) {
            setAnnualRevenue(res.metrics.annualRevenue || 5000000);
            setAnnualExpenses(res.metrics.annualExpenses || 3200000);
            setCurrency(res.metrics.currency || "USD");
          }

          if (res.setupCompleted) {
            setSetupCompleted(true);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load setup info:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!companyName.trim()) {
      setErrorMsg("Company Name is required.");
      setStep(1);
      return;
    }

    const token = localStorage.getItem("evoai-token");
    if (!token) {
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await businessApi.saveSetup(
        {
          companyName,
          businessType,
          industry,
          companySize,
          numEmployees,
          country,
          state,
          city,
          productsServices,
          annualRevenue,
          annualExpenses,
          currency,
        },
        token
      );

      if (res.success) {
        updateProfile({ company: companyName });
        setSuccessMsg("Business parameters saved successfully! Initializing AI Dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setErrorMsg(res.message || "Failed to save business setup data.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading Business Setup Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent truncate">
              EvoAI Platform Setup
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {setupCompleted && (
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 shrink-0"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1 text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Encrypted Workspace</span>
              <span className="sm:hidden">Secured</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />

        {/* Hero Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/20 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                <Sparkles className="w-3 h-3 mr-1" /> Onboarding & Configuration
              </Badge>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                Step {step} of 3
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {setupCompleted ? "Edit Business Setup Parameters" : "Mandatory Business Setup"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Configure your operational metrics, company identity, and financial targets to power your personalized AI C-Suite insights.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2 z-10 shrink-0 self-stretch md:self-auto justify-between md:justify-end">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s as 1 | 2 | 3)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                  step === s
                    ? "bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 scale-105"
                    : step > s
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-900/80 text-slate-500 border border-slate-800"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <Card className="border-slate-800/80 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-3">
                <span className="font-bold">Error:</span> {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Company Profile */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-400" /> Company & Industry Profile
                    </h2>
                    <p className="text-xs text-slate-400">
                      Primary organizational identity and industry alignment for AI model personalization.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Company Name"
                      placeholder="e.g. Apex Global Innovations"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />

                    <Select
                      label="Primary Industry Sector"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      options={INDUSTRY_OPTIONS}
                    />
                  </div>

                  {/* Business Type Selector Grid */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-300">
                      Select Business Model (Powers Industry Telemetry & AI Prompts)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {BUSINESS_TYPES.map((bt) => {
                        const Icon = bt.icon;
                        const selected = businessType === bt.id;
                        return (
                          <div
                            key={bt.id}
                            onClick={() => setBusinessType(bt.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                              selected
                                ? "bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10"
                                : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`p-2 rounded-xl ${selected ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              {selected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-white">{bt.name}</h3>
                              <p className="text-[11px] text-slate-400 leading-tight mt-1">{bt.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Select
                      label="Company Size Range"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      options={[
                        { label: "1-10 Employees (Micro Startup)", value: "1-10" },
                        { label: "11-50 Employees (Growing Business)", value: "11-50" },
                        { label: "51-200 Employees (Mid-Market)", value: "51-200" },
                        { label: "201-1000 Employees (Scaleup Enterprise)", value: "201-1000" },
                        { label: "1000+ Employees (Global Enterprise)", value: "1000+" },
                      ]}
                    />

                    <Input
                      label="Exact Employee Count"
                      type="number"
                      value={numEmployees}
                      onChange={(e) => setNumEmployees(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="gradient"
                      onClick={() => setStep(2)}
                      disabled={!companyName.trim() || !industry.trim()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold"
                    >
                      <span>Continue to Location & Products</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Products */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe2 className="w-5 h-5 text-purple-400" /> Operating Location & Offerings
                    </h2>
                    <p className="text-xs text-slate-400">
                      Geographic footprint and offering breakdown for regional competitor benchmarking.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Select
                      label="Country"
                      value={country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      options={COUNTRY_OPTIONS}
                    />

                    <Select
                      label="State / Province"
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      options={(STATES_MAP[country] || [
                        { value: "California", label: "California" },
                        { value: "New York", label: "New York" },
                        { value: "Maharashtra", label: "Maharashtra" },
                        { value: "Other State", label: "Other State" },
                      ]).filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i)}
                    />

                    <Select
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      options={(CITIES_MAP[state] || [
                        { value: "San Francisco", label: "San Francisco" },
                        { value: "New York City", label: "New York City" },
                        { value: "Mumbai", label: "Mumbai" },
                        { value: "Metro Hub", label: "Metro Hub" },
                        { value: "Other City", label: "Other City" },
                      ]).filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Products & Services Overview</label>
                    <textarea
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                      placeholder="Describe primary products, platforms, or core services rendered..."
                      value={productsServices}
                      onChange={(e) => setProductsServices(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 border-slate-800 text-slate-300 text-xs font-semibold py-2.5"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span>Back</span>
                    </Button>

                    <Button
                      type="button"
                      variant="gradient"
                      onClick={() => setStep(3)}
                      disabled={!country.trim() || !state.trim() || !city.trim() || !productsServices.trim()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold"
                    >
                      <span>Continue to Financial Baseline</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Financial Baseline */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" /> Financial Baseline & Operational Targets
                    </h2>
                    <p className="text-xs text-slate-400">
                      Annual run-rate data to baseline financial health scores, ROI forecasts, and profit analytics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Select
                      label="Reporting Currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      options={[
                        { label: "USD ($) - US Dollar", value: "USD" },
                        { label: "INR (₹) - Indian Rupee", value: "INR" },
                        { label: "EUR (€) - Euro", value: "EUR" },
                        { label: "GBP (£) - British Pound", value: "GBP" },
                        { label: "CAD ($) - Canadian Dollar", value: "CAD" },
                        { label: "AUD ($) - Australian Dollar", value: "AUD" },
                        { label: "AED (د.إ) - UAE Dirham", value: "AED" },
                      ]}
                    />

                    <Input
                      label="Annual Projected Revenue"
                      type="number"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                      required
                    />

                    <Input
                      label="Annual Operating Expenses"
                      type="number"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                      required
                    />
                  </div>

                  {/* Summary Metric Preview Box */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Estimated Net Operating Margin:</span>
                      <span className={`font-mono font-bold ${annualRevenue >= annualExpenses ? "text-emerald-400" : "text-rose-400"}`}>
                        {annualRevenue > 0
                          ? (((annualRevenue - annualExpenses) / annualRevenue) * 100).toFixed(1) + "%"
                          : "0.0%"}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, annualRevenue > 0 ? ((annualRevenue - annualExpenses) / annualRevenue) * 100 : 0)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 border-slate-800 text-slate-300 text-xs font-semibold py-2.5"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span>Back</span>
                    </Button>

                    <Button
                      type="submit"
                      variant="gradient"
                      disabled={submitting}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 text-xs font-bold"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Parameters & Initializing AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{setupCompleted ? "Update Business Setup" : "Save & Launch AI Dashboard"}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
