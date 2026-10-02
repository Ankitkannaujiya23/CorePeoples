"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import EmployeeSidebar from "@/components/layout/EmployeeSidebar";

export default function EmployeeLayout({ children }) {
  return (
    <AuthGuard role="employee">
      <div className="flex min-h-screen bg-surface-50">
        <EmployeeSidebar />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </AuthGuard>
  );
}
