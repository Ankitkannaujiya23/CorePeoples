"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  authRequestFailed,
  authRequestStarted,
  authRequestSucceeded,
  clearError,
} from "@/store/slices/authSlice";
import { showToast } from "@/store/slices/uiSlice";
import { authService } from "@/services/authService";
import Input, { Field } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { status, error, isAuthenticated, role } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("admin@acme.com");
  const [password, setPassword] = useState("password123");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(authRequestStarted());
    try {
      const { user } = await authService.login({ email, password });
      dispatch(authRequestSucceeded(user));
      dispatch(showToast({ message: `Welcome back, ${user.name.split(" ")[0]}.` }));
    } catch (err) {
      dispatch(authRequestFailed(err.message));
    }
  }

  function fillDemo(role) {
    if (role === "admin") {
      setEmail("admin@acme.com");
      setPassword("password123");
    } else {
      setEmail("rahul@acme.com");
      setPassword("password123");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-50 px-5 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold text-bronze-300">
            V
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-ink-900">VoteDesk</span>
        </Link>

        <Card className="p-7">
          <h1 className="text-xl font-semibold tracking-tight text-ink-950">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-500">Log in to your VoteDesk organization.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </Field>
            <Field label="Password" htmlFor="password" required>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </Field>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-line-200 text-bronze-500 focus-ring"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-ink-700 hover:text-ink-900">
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-500">{error}</p>
            )}

            <Button type="submit" variant="accent" className="w-full" loading={status === "loading"}>
              Log In
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-500">
            Don&apos;t have an organization?{" "}
            <Link href="/signup" className="font-medium text-ink-900 hover:underline">
              Create one
            </Link>
          </p>
        </Card>

        <div className="mt-5 rounded-xl border border-line-100 bg-white p-4 text-xs text-ink-600">
          <p className="font-medium text-ink-800">Demo credentials</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="flex-1 rounded-lg border border-line-200 px-3 py-2 text-left hover:bg-surface-50"
            >
              <span className="block font-medium text-ink-800">Admin</span>
              admin@acme.com / password123
            </button>
            <button
              type="button"
              onClick={() => fillDemo("employee")}
              className="flex-1 rounded-lg border border-line-200 px-3 py-2 text-left hover:bg-surface-50"
            >
              <span className="block font-medium text-ink-800">Employee</span>
              rahul@acme.com / password123
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
