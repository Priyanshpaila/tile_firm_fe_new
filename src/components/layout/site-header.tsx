"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { ROUTES, roleHome } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

function ProfileIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M20 21a8 8 0 0 0-16 0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowUpRightIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M7 17L17 7M9 7h8v8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17l5-5-5-5M21 12H9"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 7h16" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 12h16" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 17h16" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M6 6l12 12" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 6L6 18" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === ROUTES.home;
  const overlayMode = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const nav = useMemo(
    () => [
      { href: ROUTES.home, label: "Home" },
      { href: ROUTES.catalog, label: "Shop" },
      { href: `${ROUTES.home}#collections`, label: "Collection" },
      { href: `${ROUTES.home}#about`, label: "About Us" },
      { href: `${ROUTES.home}#contact`, label: "Contact Us" },
      ...(user
        ? [
            {
              href: roleHome(user.role),
              label: user.role === "admin" ? "Admin" : "Dashboard",
            },
          ]
        : []),
    ],
    [user],
  );

  const isActive = (href: string) => {
    const cleanHref = href.split("#")[0];
    if (href.includes("#")) return pathname === ROUTES.home;
    return pathname === cleanHref;
  };

  const headerModeClass = overlayMode
    ? "bg-transparent text-white"
    : "rounded-full border border-black/10 bg-[rgba(245,240,232,0.82)] text-[#181512] shadow-[0_14px_42px_rgba(20,16,10,0.10)] backdrop-blur-xl";

  const linkClass = overlayMode
    ? "text-white/82 hover:text-white"
    : "text-[#6f655b] hover:text-[#181512]";

  const logoRingClass = overlayMode ? "border-white/70" : "border-[#181512]/70";

  const iconButtonClass = cn(
    "inline-flex h-11 w-11 items-center justify-center rounded-full border transition",
    overlayMode
      ? "border-white/20 bg-white/6 text-white hover:bg-white/12"
      : "border-black/10 bg-white/70 text-[#181512] hover:bg-white",
  );

  const desktopPrimaryPillClass = cn(
    "hidden h-11 items-center rounded-full px-5 text-sm font-semibold md:inline-flex transition",
    overlayMode
      ? "border border-white/18 bg-white/10 text-white hover:bg-white/16"
      : "bg-[#a9743c] text-white shadow-[0_10px_30px_rgba(169,116,60,0.20)] hover:bg-[#95632f]",
  );

  const bookingPillClass = cn(
    "hidden h-11 items-center rounded-full px-5 text-sm font-semibold transition lg:inline-flex",
    overlayMode
      ? "bg-[#a9743c] text-white shadow-[0_12px_30px_rgba(169,116,60,0.26)] hover:bg-[#95632f]"
      : "bg-[#a9743c] text-white shadow-[0_10px_30px_rgba(169,116,60,0.20)] hover:bg-[#95632f]",
  );

  return (
    <header className={cn("inset-x-0 top-0 z-50", isHome ? "fixed" : "sticky")}>
      <div
        className={cn(
          "mx-auto mt-3 flex h-[68px] w-[calc(100%-1rem)] max-w-[1820px] items-center justify-between px-4 transition-all duration-300 md:w-[calc(100%-2.5rem)] md:px-6",
          headerModeClass,
        )}
      >
        <Link
          href={ROUTES.home}
          className="flex shrink-0 items-center gap-3"
          aria-label={APP_NAME}
        >
          <span
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full border",
              logoRingClass,
            )}
          >
            <span
              className={cn(
                "h-4 w-4 rounded-full border",
                overlayMode ? "border-white/80" : "border-[#181512]/80",
              )}
            />
          </span>

          <span
            className={cn(
              "text-xl font-semibold tracking-[-0.05em]",
              overlayMode ? "text-white" : "text-[#181512]",
            )}
          >
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors",
                linkClass,
                isActive(item.href) &&
                  (overlayMode ? "text-white" : "text-[#181512]"),
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={ROUTES.booking} className={bookingPillClass}>
            Book Consultation
          </Link>

          {user ? (
            <>
              <Link
                href={roleHome(user.role)}
                className={desktopPrimaryPillClass}
              >
                {user.role === "admin" ? "Admin" : "Dashboard"}
              </Link>

              <Link
                href={ROUTES.profile}
                className={iconButtonClass}
                aria-label="Profile"
              >
                <ProfileIcon className="h-5 w-5" />
              </Link>

              <button
                onClick={async () => {
                  await logout();
                  router.replace(ROUTES.home);
                }}
                className={iconButtonClass}
                aria-label="Logout"
              >
                <LogoutIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className={iconButtonClass}
                aria-label="Login"
              >
                <ProfileIcon className="h-5 w-5" />
              </Link>

              <Link
                href={ROUTES.register}
                className={iconButtonClass}
                aria-label="Get Started"
              >
                <ArrowUpRightIcon className="h-5 w-5" />
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className={cn("xl:hidden", iconButtonClass)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 h-screen bg-[rgba(245,240,232,0.96)] px-5 pb-6 pt-24 backdrop-blur-xl transition-all duration-300 xl:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto flex h-full max-w-xl flex-col justify-between">
          <div className="grid gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-4 text-lg font-medium text-[#1b1714] transition hover:bg-black/5",
                  isActive(item.href) && "bg-black/5",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="grid gap-3 pt-6">
            <Link
              href={ROUTES.booking}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#a9743c] text-sm font-semibold text-white"
            >
              Book Consultation
            </Link>

            {user ? (
              <>
                <Link
                  href={ROUTES.profile}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-semibold text-[#181512]"
                >
                  Profile
                </Link>

                <button
                  onClick={async () => {
                    await logout();
                    router.replace(ROUTES.home);
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.login}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-semibold text-[#181512]"
                >
                  Login
                </Link>

                <Link
                  href={ROUTES.register}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
