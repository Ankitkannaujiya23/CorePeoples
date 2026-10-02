"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <AuthGuard role="admin">
      <div className="flex min-h-screen bg-surface-50">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </AuthGuard>
  );
}
