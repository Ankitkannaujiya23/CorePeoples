"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import Input, { Field } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { setOrganization } from "@/store/slices/organizationSlice";
import { showToast } from "@/store/slices/uiSlice";

export default function AdminSettingsPage() {
  const dispatch = useDispatch();
  const organization = useSelector((s) => s.organization.organization);
  const user = useSelector((s) => s.auth.user);
  const [name, setName] = useState(organization.name);

  function handleSave(e) {
    e.preventDefault();
    dispatch(setOrganization({ ...organization, name }));
    dispatch(showToast({ message: "Organization settings saved." }));
  }

  return (
    <>
      <Topbar title="Settings" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Settings</h1>
            <p className="mt-1 text-sm text-ink-500">Manage your organization and account.</p>
          </div>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-ink-900">Organization</h2>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <Field label="Organization name" htmlFor="orgName">
                <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Plan">
                <div className="rounded-xl border border-line-200 bg-surface-50 px-3.5 py-2.5 text-sm text-ink-700">
                  {organization.plan}
                </div>
              </Field>
              <Button type="submit" variant="accent" size="sm">
                Save Changes
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-ink-900">Admin account</h2>
            <div className="mt-4 space-y-4">
              <Field label="Name">
                <div className="rounded-xl border border-line-200 bg-surface-50 px-3.5 py-2.5 text-sm text-ink-700">
                  {user?.name}
                </div>
              </Field>
              <Field label="Email">
                <div className="rounded-xl border border-line-200 bg-surface-50 px-3.5 py-2.5 text-sm text-ink-700">
                  {user?.email}
                </div>
              </Field>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
