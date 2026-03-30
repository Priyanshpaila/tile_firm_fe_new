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
  ShieldCheck,
  UserCircle2,
  Users,
} from "lucide-react";
import { GuestOnly } from "@/components/layout/guest-only";
import { Button } from "@/components/ui/button";
import { ROUTES, roleHome } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

const roleCards = [
  {
    title: "Users",
    description:
      "Track bookings, room uploads, and personalized tile previews.",
    icon: UserCircle2,
  },
  {
    title: "Staff",
    description: "View assigned appointments and manage visit workflows.",
    icon: Users,
  },
  {
    title: "Admin",
    description: "Monitor products, staff, categories, and appointments.",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return form.email.trim().length > 0 && form.password.trim().length > 0;
  }, [form.email, form.password]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const user = await login({
        email: form.email.trim(),
        password: form.password,
      });
      router.replace(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GuestOnly>
      <main className="min-h-[100dvh] bg-[linear-gradient(180deg,#f7f2ea_0%,#efe5d7_100%)] px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(145deg,#171411_0%,#2b231c_48%,#3a2b1e_100%)] p-6 text-white shadow-[0_30px_80px_rgba(20,16,10,0.18)] lg:block lg:p-8 xl:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,107,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

            <div className="relative z-[1]">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
                SquareFoot Access
              </p>

              <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-0.05em] xl:text-5xl">
                Sign in to continue your tile, staff, and appointment workflows.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 xl:text-base">
                A single login flow works across user, staff, and admin
                accounts. After sign-in, you are redirected automatically to the
                correct dashboard.
              </p>

              <div className="mt-8 grid gap-4 xl:grid-cols-3">
                {roleCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8">
                        <Icon className="h-5 w-5 text-[#ddb07f]" />
                      </span>

                      <h2 className="mt-4 text-sm font-semibold text-white">
                        {item.title}
                      </h2>

                      <p className="mt-2 text-xs leading-6 text-white/68">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[1.3rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/72">
                Use the same email and password issued for your account. Staff
                members created by admin can also log in here with their linked
                credentials.
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white/88 p-4 shadow-[0_24px_60px_rgba(20,16,10,0.08)] backdrop-blur-sm sm:p-6 md:p-8">
            <div className="mx-auto max-w-xl">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                  Welcome Back
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                  Login
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  Enter your credentials to continue to your role-based
                  dashboard.
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-8 grid gap-5">
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-[var(--text-secondary)]">
                      <Mail className="h-4.5 w-4.5" />
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

                  <p className="text-xs leading-6 text-[var(--text-secondary)]">
                    Use the email linked to your SquareFoot account.
                  </p>
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
                      <LockKeyhole className="h-4.5 w-4.5" />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                      className="h-14 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] !pl-12 !pr-12 text-[15px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 z-10 flex w-12 items-center justify-center rounded-r-[1rem] text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs leading-6 text-[var(--text-secondary)]">
                    Keep your password private. Contact admin if your staff
                    credentials were recently created.
                  </p>
                </div>

                {error ? (
                  <div className="flex items-start gap-3 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                    <p>{error}</p>
                  </div>
                ) : null}

                <div className="pt-1">
                  <Button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="h-12 w-full rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-sm font-semibold text-white shadow-[0_16px_36px_rgba(20,16,10,0.16)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Signing in..." : "Continue to Dashboard"}
                    {!submitting ? (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    ) : null}
                  </Button>
                </div>

                <div className="rounded-[1rem] border border-[var(--border-soft)] bg-[#faf7f2] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  New here?{" "}
                  <Link
                    href={ROUTES.register}
                    className="font-semibold text-[var(--text-primary)] underline decoration-[#c9a37c] underline-offset-4 transition hover:text-[#a77442]"
                  >
                    Create an account
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </GuestOnly>
  );
}
