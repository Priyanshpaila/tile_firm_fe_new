"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  User2,
} from "lucide-react";
import { GuestOnly } from "@/components/layout/guest-only";
import { Button } from "@/components/ui/button";
import { ROUTES, roleHome } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.password.trim().length >= 6
    );
  }, [form.name, form.email, form.password]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      router.replace(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GuestOnly>
      <main className="flex min-h-auto items-center justify-center bg-[linear-gradient(180deg,#f7f2ea_0%,#efe5d7_100%)] px-4 py-8 sm:px-6">
        <section className="w-full max-w-[460px] rounded-[2rem] border border-[var(--border-soft)] bg-white/90 p-5 shadow-[0_24px_60px_rgba(20,16,10,0.08)] backdrop-blur-sm sm:p-7 md:p-8">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              SquareFoot
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
              Register
            </h1>
          </div>

          <form onSubmit={onSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-[var(--text-primary)]"
              >
                Full name
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-[var(--text-secondary)]">
                  <User2 className="h-[18px] w-[18px]" />
                </div>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="h-14 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] !pl-12 !pr-4 text-[15px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--text-primary)]"
              >
                Email
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-[var(--text-secondary)]">
                  <Mail className="h-[18px] w-[18px]" />
                </div>

                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="h-14 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] !pl-12 !pr-4 text-[15px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-[var(--text-primary)]"
              >
                Phone number
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-[var(--text-secondary)]">
                  <Phone className="h-[18px] w-[18px]" />
                </div>

                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-14 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] !pl-12 !pr-4 text-[15px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[var(--text-primary)]"
              >
                Password
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-[var(--text-secondary)]">
                  <LockKeyhole className="h-[18px] w-[18px]" />
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  className="h-14 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] !pl-12 !pr-12 text-[15px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 z-10 flex w-12 items-center justify-center rounded-r-[1rem] text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                <p>{error}</p>
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="h-12 w-full rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-sm font-semibold text-white shadow-[0_16px_36px_rgba(20,16,10,0.16)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create Account"}
              {!submitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
            </Button>

            <div className="text-center text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link
                href={ROUTES.login}
                className="font-semibold text-[var(--text-primary)] underline decoration-[#c9a37c] underline-offset-4 transition hover:text-[#a77442]"
              >
                Login
              </Link>
            </div>
          </form>
        </section>
      </main>
    </GuestOnly>
  );
}