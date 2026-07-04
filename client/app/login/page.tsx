"use client";

import * as React from "react";

import { useRouter } from "next/navigation";
import { ShieldCheck, Sparkles, Users, ScanFace } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/providers/ToastProvider";
import type { LoginCredentials } from "@/types/auth";

const initialForm: LoginCredentials = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const { hydrated, isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = React.useState(initialForm);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(form);
      toast({
        title: "Welcome back",
        description: "You have been signed in successfully.",
        variant: "success",
      });
      router.replace("/dashboard");
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in right now.";

      setError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-xl">
          <Loader className="h-8 w-8" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Loading Mini CRM</p>
            <p className="text-xs text-[var(--foreground)]/55">Preparing your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-indigo-500/14 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-cyan-500/12 blur-3xl" />

      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between rounded-4xl border border-[var(--border)] bg-[var(--card)]/92 p-8 backdrop-blur-xl lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-4 py-2 text-sm text-[var(--foreground)]/75">
              <Sparkles size={16} className="text-cyan-300" />
              Mini Visitor CRM
            </div>

            <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight text-[var(--foreground)] lg:text-6xl">
              Keep every customer and visitor flow in one place.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--foreground)]/72">
              Sign in to manage customer records, visitor check-ins, activity tracking, and the live dashboard that sits on top of the backend.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-hover)] p-4">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              <p className="mt-3 text-sm text-[var(--foreground)]/80">JWT protected routes</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-hover)] p-4">
              <Users className="h-5 w-5 text-emerald-500" />
              <p className="mt-3 text-sm text-[var(--foreground)]/80">Customer CRUD and search</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-hover)] p-4">
              <ScanFace className="h-5 w-5 text-cyan-500" />
              <p className="mt-3 text-sm text-[var(--foreground)]/80">Visitor check-in and history</p>
            </div>
          </div>
        </section>

        <Card className="shadow-2xl shadow-slate-400/10">
          <CardContent className="p-8 lg:p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--foreground)]/55">
                Secure access
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
                Sign in to continue
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]/65">
                Use the admin account seeded in the backend.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@crm.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button className="w-full" size="lg" loading={loading}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}