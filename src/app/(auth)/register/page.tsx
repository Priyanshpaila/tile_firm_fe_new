"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GuestOnly } from "@/components/layout/guest-only";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { ROUTES, roleHome } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await register(form);
      router.replace(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GuestOnly>
      <PageShell title="Create account" description="Registers through the real backend and immediately hydrates the session from /auth/me.">
        <form onSubmit={onSubmit} className="card-surface mx-auto grid max-w-xl gap-4 p-6">
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <input placeholder="Phone (10 digits)" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <Button disabled={submitting}>{submitting ? "Creating..." : "Register"}</Button>
          <p className="text-sm text-[var(--text-secondary)]">Already have an account? <Link href={ROUTES.login} className="text-[var(--accent-primary)]">Login</Link></p>
        </form>
      </PageShell>
    </GuestOnly>
  );
}
