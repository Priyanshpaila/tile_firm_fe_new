"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChevronRight,
  Home,
  Layers3,
  LayoutGrid,
  LogOut,
  Menu,
  Phone,
  ShoppingBag,
  UserCircle2,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { ROUTES, roleHome } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export type DashboardRole = "user" | "admin" | "staff";

export type DashboardTabDefinition<T extends string> = {
  key: T;
  label: string;
  icon: LucideIcon;
};

const roleMeta: Record<
  DashboardRole,
  { eyebrow: string; badge: string; description: string }
> = {
  user: {
    eyebrow: "User Workspace",
    badge: "Dashboard",
    description: "Appointments, wishlist, saved views, and account activity.",
  },
  admin: {
    eyebrow: "Admin Workspace",
    badge: "Admin Panel",
    description: "Products, categories, appointments, staff, and user control.",
  },
  staff: {
    eyebrow: "Staff Workspace",
    badge: "Operations",
    description: "Daily queue, calendar flow, and appointment operations.",
  },
};

type SiteNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function DashboardShell<T extends string>({
  role,
  title,
  description,
  tabs,
  activeTab,
  onChange,
  children,
}: {
  role: DashboardRole;
  title: string;
  description: string;
  tabs: DashboardTabDefinition<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const meta = roleMeta[role];

  const siteNav = useMemo<SiteNavItem[]>(
    () => [
      { href: ROUTES.home, label: "Home", icon: Home },
      { href: ROUTES.catalog, label: "Shop", icon: ShoppingBag },
      { href: `${ROUTES.home}#collections`, label: "Collections", icon: Layers3 },
      { href: `${ROUTES.home}#about`, label: "About Us", icon: BookOpen },
      { href: `${ROUTES.home}#contact`, label: "Contact Us", icon: Phone },
      {
        href: roleHome((user?.role as DashboardRole) || role),
        label: (user?.role || role) === "admin" ? "Admin" : "Dashboard",
        icon: LayoutGrid,
      },
    ],
    [role, user?.role]
  );

  const isRouteActive = (href: string) => {
    const cleanHref = href.split("#")[0];
    if (href.includes("#")) return pathname === ROUTES.home;
    return pathname === cleanHref;
  };

  const handleLogout = async () => {
    await Promise.resolve(logout());
    router.replace(ROUTES.home);
  };

  const userName =
    user?.name ||
    (role === "admin"
      ? "Admin User"
      : role === "staff"
        ? "Staff User"
        : "Dashboard User");

  const userEmail = user?.email || "";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const SidebarInner = () => (
    <div className="flex h-full min-h-0 flex-col bg-[linear-gradient(180deg,#151210_0%,#1c1713_52%,#16120f_100%)] text-white">
      <div className="border-b border-white/8 px-4 py-4">
        <Link href={ROUTES.home} className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/6">
            <span className="h-4 w-4 rounded-full border border-white/75" />
          </span>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold tracking-[-0.04em] text-white">
              {APP_NAME}
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/48">
              {meta.eyebrow}
            </p>
          </div>
        </Link>

        <div className="mt-4 rounded-[1.15rem] border border-white/8 bg-white/5 p-3.5">
          <p className="text-sm leading-6 text-white/68">{meta.description}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={ROUTES.home}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Landing Page
          </Link>
          <Link
            href={ROUTES.booking}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#a9743c] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(169,116,60,0.22)] transition hover:bg-[#95632f]"
          >
            Book Service
          </Link>
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-5">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
            Website Navigation
          </p>

          <div className="grid gap-1.5">
            {siteNav.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex min-h-[44px] items-center gap-3 rounded-[1rem] px-3 py-2.5 transition-all duration-200",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/72 hover:bg-white/6 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                      active
                        ? "border-white/12 bg-white/10 text-white"
                        : "border-white/10 bg-white/5 text-white/70"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="truncate text-sm font-medium">{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 shrink-0 opacity-45" />
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
            Workspace
          </p>

          <div className="grid gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.key === activeTab;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onChange(tab.key)}
                  className={cn(
                    "group flex min-h-[50px] items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left transition-all duration-200",
                    active
                      ? "bg-[linear-gradient(135deg,#f4e7d7_0%,#e5d0b6_100%)] text-[#171411] shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                      : "text-white/82 hover:bg-white/6"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                      active
                        ? "border-[#e1bf95] bg-white text-[#b2793f]"
                        : "border-white/10 bg-white/5 text-white/72"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="truncate text-sm font-semibold tracking-[-0.01em]">
                    {tab.label}
                  </span>

                  <span
                    className={cn(
                      "ml-auto h-2 w-2 shrink-0 rounded-full",
                      active ? "bg-[#bf8246]" : "bg-white/14"
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 p-3">
        <div className="rounded-[1.15rem] border border-white/8 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f4e7d7_0%,#dfc4a1_100%)] text-[#171411]">
              <span className="text-xs font-bold tracking-[0.08em]">
                {initials || "DU"}
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
              <p className="truncate text-xs text-white/52">
                {userEmail || meta.badge}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={ROUTES.profile}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <UserCircle2 className="h-4 w-4" />
              Profile
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#111111] px-3 text-sm font-semibold text-white transition hover:bg-[#000000]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] overflow-hidden bg-[linear-gradient(180deg,#f6f1e8_0%,#f3ede4_100%)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[292px] border-r border-black/8 md:flex">
        <SidebarInner />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[292px] max-w-[86vw] transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarInner />
        </div>
      </div>

      <div className="h-[100dvh] md:pl-[292px]">
        <div className="flex h-full min-h-0 flex-col">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-soft)] bg-[#f6f1e8]/88 px-4 backdrop-blur-md md:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#171411] md:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6e4a]">
                  {meta.badge}
                </p>
                <h1 className="truncate text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  {title}
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href={ROUTES.home}
                className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[#171411] transition hover:bg-white"
              >
                Go to site
              </Link>
              <Link
                href={ROUTES.profile}
                className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-[#171411] transition hover:bg-white"
              >
                Profile
              </Link>
            </div>
          </header>

          <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}