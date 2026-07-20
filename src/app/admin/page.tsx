"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function AdminRootRedirect() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role?.toLowerCase() === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
      Redirecting to EvoAI Admin Portal...
    </div>
  );
}
