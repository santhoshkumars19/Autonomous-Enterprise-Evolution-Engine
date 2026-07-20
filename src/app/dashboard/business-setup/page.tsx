"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardBusinessSetupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/business-setup");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      <p className="text-xs font-semibold text-slate-400">Redirecting to Business Setup page...</p>
    </div>
  );
}
