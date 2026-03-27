"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GuestOnly } from "@/components/layout/guest-only";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { ROUTES, roleHome } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login(form);
      router.replace(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GuestOnly>
      <PageShell title="Login" description="Use the backend auth contract and continue to the role-appropriate dashboard.">
        <form onSubmit={onSubmit} className="card-surface mx-auto grid max-w-xl gap-4 p-6">
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button disabled={submitting}>{submitting ? "Signing in..." : "Login"}</Button>
          <p className="text-sm text-[var(--text-secondary)]">New here? <Link href={ROUTES.register} className="text-[var(--accent-primary)]">Create an account</Link></p>
        </form>
      </PageShell>
    </GuestOnly>
  );
}
