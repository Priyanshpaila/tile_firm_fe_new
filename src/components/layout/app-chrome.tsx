"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const DASHBOARD_PREFIXES = [
  "/dashboard",
  "/user-dashboard",
  "/admin-dashboard",
  "/staff-dashboard",
];

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isDashboardRoute = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}