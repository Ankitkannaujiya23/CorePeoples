"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import AddEmployeeModal from "@/components/admin/AddEmployeeModal";
import EmployeeCredentialsModal from "@/components/admin/EmployeeCredentialsModal";
import { setEmployeeStatus } from "@/store/slices/organizationSlice";
import { showToast } from "@/store/slices/uiSlice";
import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import { employeeService } from "@/services/employeeService";
import { updateEmployeeStatusInStore } from "@/store/slices/organizationSlice";



export default function AdminEmployeesPage() {
  const dispatch = useDispatch();
  const employees = useSelector((s) => s.organization.employees);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [credentialsTarget, setCredentialsTarget] = useState(null);

  const filtered = employees.filter(
    (e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.department?.toLowerCase().includes(query.toLowerCase())
  );

  async function handleToggleStatus(emp) {
    try {
      await employeeService.setEmployeeStatus(emp.id, !emp.isActive);
      dispatch(updateEmployeeStatusInStore({ id: emp.id, isActive: !emp.isActive }));
      dispatch(
        showToast({
          message: emp.isActive ? `${emp.name} deactivated.` : `${emp.name} activated.`,
          type: "info",
        })
      );
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || err.message || "Couldn't update status.",
          type: "error",
        })
      );
    }
  }

  return (
    <>
      <Topbar title="Employees" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Employees</h1>
              <p className="mt-1 text-sm text-ink-500">{employees.length} people in your organization.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search employees" className="w-48 pl-9 sm:w-64" />
              </div>
              <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>
                <HiOutlinePlus className="h-4 w-4" /> Add Employee
              </Button>
            </div>
          </div>

          <Card className="">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line-100 text-xs uppercase tracking-wide text-ink-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Department</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Email</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-line-100 last:border-0 hover:bg-surface-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.name} color={emp.avatarColor} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink-900">{emp.name}</p>
                          <p className="truncate text-xs text-ink-500">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-ink-600 sm:table-cell">{emp.department}</td>
                    <td className="hidden px-5 py-3.5 text-ink-600 md:table-cell">{emp.email}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={emp.isActive === false ? "paused" : "active"} dot>
                        {emp.isActive === false ? "Deactivated" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Dropdown
                        trigger={<span className="rounded-lg p-1 text-ink-500 hover:bg-surface-100 hover:text-ink-900"><HiOutlineEllipsisHorizontal className="h-5 w-5" /></span>}
                        items={[
                          { label: "Change credentials", onClick: () => setCredentialsTarget(emp) },
                          { divider: true },
                          { label: emp.isActive === false ? "Activate" : "Deactivate", onClick: () => handleToggleStatus(emp), danger: emp.isActive !== false },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="px-5 py-10 text-center text-sm text-ink-500">No employees match your search.</p>}
          </Card>
        </div>
      </main>

      <AddEmployeeModal open={showAdd} onClose={() => setShowAdd(false)} />
      <EmployeeCredentialsModal open={!!credentialsTarget} employee={credentialsTarget} onClose={() => setCredentialsTarget(null)} />
    </>
  );
}