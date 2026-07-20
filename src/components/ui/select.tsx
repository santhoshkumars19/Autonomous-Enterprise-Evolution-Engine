import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={`${opt.value}-${idx}`} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
