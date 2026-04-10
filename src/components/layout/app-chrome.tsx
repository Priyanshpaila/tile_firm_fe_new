"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const APP_ROUTES_WITHOUT_SITE_CHROME = [
  "/dashboard",
  "/user-dashboard",
  "/admin-dashboard",
  "/staff-dashboard",
  "/admin",
  "/staff",
  "/user",
];

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideSiteChrome = APP_ROUTES_WITHOUT_SITE_CHROME.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (hideSiteChrome) {
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