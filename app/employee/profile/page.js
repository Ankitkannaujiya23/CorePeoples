"use client";

import { useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { getEmployeeById } from "@/data/employees";

export default function EmployeeProfilePage() {
  const user = useSelector((s) => s.auth.user);
  const organization = useSelector((s) => s.organization.organization);
  const employee = getEmployeeById(user?.employeeId);

  return (
    <>
      <Topbar title="Profile" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Profile</h1>
            <p className="mt-1 text-sm text-ink-500">Your account details.</p>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Avatar name={user?.name} color={user?.avatarColor} size="xl" />
              <div>
                <p className="text-lg font-semibold text-ink-900">{user?.name}</p>
                <p className="text-sm text-ink-500">{employee?.role}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-ink-500">Email</p>
                <p className="text-sm text-ink-800">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-ink-500">Department</p>
                <p className="text-sm text-ink-800">{employee?.department}</p>
              </div>
              <div>
                <p className="text-xs text-ink-500">Organization</p>
                <p className="text-sm text-ink-800">{organization?.name}</p>
              </div>
              <div>
                <p className="text-xs text-ink-500">Role</p>
                <p className="text-sm capitalize text-ink-800">{user?.role}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
