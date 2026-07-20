import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "active" | "processing" | "idle" | "high" | "medium" | "low" | "neutral" | "gradient";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variantStyles = {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    processing: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 animate-pulse",
    idle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    high: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold",
    medium: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
    low: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    gradient: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-medium shadow-sm border border-cyan-400/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-all",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {variant === "active" && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
      )}
      {variant === "processing" && (
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-spin" />
      )}
      {variant === "idle" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
      {children}
    </span>
  );
}
