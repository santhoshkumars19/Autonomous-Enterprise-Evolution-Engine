import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        {/* Centered Navigation Links: About Us, Terms & Conditions, Privacy Policy */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium">
          <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/terms" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col items-center justify-center text-xs text-slate-500 dark:text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} EvoAI. All rights reserved.</p>
          <p className="font-mono text-[11px]">Empowering modern enterprises with autonomous AI intelligence.</p>
        </div>
      </div>
    </footer>
  );
}

