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
  Sparkles,
  User2,
  WandSparkles,
  ShieldCheck,
} from "lucide-react";
import { GuestOnly } from "@/components/layout/guest-only";
import { Button } from "@/components/ui/button";
import { ROUTES, roleHome } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

const featureCards = [
  {
    title: "Catalog Access",
    description: "Browse products, collections, and tile categories with a cleaner experience.",
    icon: Sparkles,
  },
  {
    title: "Room Workflows",
    description: "Save uploads, room previews, and appointment activity in one place.",
    icon: WandSparkles,
  },
  {
    title: "Secure Account",
    description: "Your profile, bookings, and role-based access stay linked to one account.",
    icon: ShieldCheck,
  },
];

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
      <main className="min-h-[100dvh] bg-[linear-gradient(180deg,#f7f2ea_0%,#efe5d7_100%)] px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <section className="relative hidden overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[linear-gradient(145deg,#171411_0%,#2b231c_48%,#3a2b1e_100%)] p-6 text-white shadow-[0_30px_80px_rgba(20,16,10,0.18)] lg:block lg:p-8 xl:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,163,107,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

            <div className="relative z-[1]">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
                SquareFoot Access
              </p>

              <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-0.05em] xl:text-5xl">
                Create your account and start managing your tile journey.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 xl:text-base">
                Register once to access products, room uploads, saved visual flows,
                and your appointment history inside a single account.
              </p>

              <div className="mt-8 grid gap-4 xl:grid-cols-3">
                {featureCards.map((item) => {
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
                Your account is created through the real backend auth flow and can
                continue directly into the correct dashboard after registration.
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-white/88 p-4 shadow-[0_24px_60px_rgba(20,16,10,0.08)] backdrop-blur-sm sm:p-6 md:p-8">
            <div className="mx-auto max-w-xl">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                  Get Started
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                  Create account
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  Register your account to continue into your personalized SquareFoot experience.
                </p>
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

                  <p className="text-xs leading-6 text-[var(--text-secondary)]">
                    Use your real name for bookings and profile records.
                  </p>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Email address
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

                  <p className="text-xs leading-6 text-[var(--text-secondary)]">
                    This email will be used for login and account communication.
                  </p>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Phone number <span className="text-[var(--text-secondary)]">(optional)</span>
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

                  <p className="text-xs leading-6 text-[var(--text-secondary)]">
                    Useful for appointment coordination and profile completeness.
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
                      <LockKeyhole className="h-[18px] w-[18px]" />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a secure password"
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

                  <p className="text-xs leading-6 text-[var(--text-secondary)]">
                    Use at least 6 characters to create your account.
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
                    {submitting ? "Creating account..." : "Create Account"}
                    {!submitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                  </Button>
                </div>

                <div className="rounded-[1rem] border border-[var(--border-soft)] bg-[#faf7f2] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  Already have an account?{" "}
                  <Link
                    href={ROUTES.login}
                    className="font-semibold text-[var(--text-primary)] underline decoration-[#c9a37c] underline-offset-4 transition hover:text-[#a77442]"
                  >
                    Login
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