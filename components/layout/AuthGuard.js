"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Skeleton from "@/components/ui/Skeleton";

export default function AuthGuard({ role, children }) {
  const router = useRouter();
  const { isAuthenticated, role: userRole, bootstrapped } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!bootstrapped) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (userRole !== role) {
      router.replace(userRole === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    }
  }, [bootstrapped, isAuthenticated, userRole, role, router]);

  if (!bootstrapped || !isAuthenticated || userRole !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 p-6">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return children;
}
