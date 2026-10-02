"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  authRequestFailed,
  authRequestStarted,
  authRequestSucceeded,
} from "@/store/slices/authSlice";
import { setOrganization } from "@/store/slices/organizationSlice";
import Input, { Field } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { authService } from "@/services/authService";
import { HiCheckCircle } from "react-icons/hi2";

const industries = ["Software", "Retail", "Healthcare", "Finance", "Manufacturing", "Other"];

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    organizationName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
    employeeCount: "",
    industry: "Software",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.organizationName.trim()) next.organizationName = "Organization name is required.";
    if (!form.adminName.trim()) next.adminName = "Your name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords don't match.";
    if (!form.employeeCount) next.employeeCount = "Employee count is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    dispatch(authRequestStarted());
    try {
      const { user, organization } = await authService.createOrganization(form);
      dispatch(authRequestSucceeded(user));
      dispatch(setOrganization(organization));
      setSuccess(true);
      setTimeout(() => router.push("/admin/dashboard"), 1400);
    } catch (err) {
      dispatch(authRequestFailed(err.message));
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-50 px-5">
        <Card className="max-w-sm p-10 text-center animate-scale-in">
          <HiCheckCircle className="mx-auto h-12 w-12 text-success-500" />
          <h1 className="mt-4 text-xl font-semibold text-ink-950">Your organization is ready.</h1>
          <p className="mt-2 text-sm text-ink-500">Taking you to your dashboard…</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-50 px-5 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold text-bronze-300">
            V
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-ink-900">VoteDesk</span>
        </Link>

        <Card className="p-7">
          <h1 className="text-xl font-semibold tracking-tight text-ink-950">Create your organization</h1>
          <p className="mt-1 text-sm text-ink-500">Set up VoteDesk for your team in under a minute.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Organization name" htmlFor="organizationName" required error={errors.organizationName}>
              <Input
                id="organizationName"
                value={form.organizationName}
                onChange={(e) => update("organizationName", e.target.value)}
                placeholder="Acme Technologies"
                error={errors.organizationName}
              />
            </Field>
            <Field label="Admin name" htmlFor="adminName" required error={errors.adminName}>
              <Input
                id="adminName"
                value={form.adminName}
                onChange={(e) => update("adminName", e.target.value)}
                placeholder="Your full name"
                error={errors.adminName}
              />
            </Field>
            <Field label="Email" htmlFor="email" required error={errors.email}>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@company.com"
                error={errors.email}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Password" htmlFor="password" required error={errors.password}>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  error={errors.password}
                />
              </Field>
              <Field label="Confirm password" htmlFor="confirmPassword" required error={errors.confirmPassword}>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee count" htmlFor="employeeCount" required error={errors.employeeCount}>
                <Input
                  id="employeeCount"
                  type="number"
                  min="1"
                  value={form.employeeCount}
                  onChange={(e) => update("employeeCount", e.target.value)}
                  placeholder="25"
                  error={errors.employeeCount}
                />
              </Field>
              <Field label="Industry" htmlFor="industry">
                <select
                  id="industry"
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className="w-full rounded-xl border border-line-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus-ring focus:border-ink-700"
                >
                  {industries.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {error && (
              <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-500">{error}</p>
            )}

            <Button type="submit" variant="accent" className="w-full" loading={status === "loading"}>
              Create Organization
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-ink-900 hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
