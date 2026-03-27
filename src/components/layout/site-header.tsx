"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { ROUTES, roleHome } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const publicLinks = [
  { href: ROUTES.catalog, label: "Catalog" },
  { href: ROUTES.visualizer, label: "Room Visualizer" },
  { href: ROUTES.visualizer3d, label: "3D Visualizer" },
  { href: ROUTES.booking, label: "Book Service" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const nav = [
    ...publicLinks,
    ...(user ? [{ href: roleHome(user.role), label: user.role === "admin" ? "Admin" : "Dashboard" }, { href: ROUTES.profile, label: "Profile" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[color:rgba(247,242,234,0.78)] backdrop-blur-xl">
      <div className="container-shell flex min-h-[72px] items-center justify-between gap-6">
        <Link href={ROUTES.home} className="text-lg font-bold tracking-tight">{APP_NAME}</Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={cn("text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]", pathname === item.href && "text-[var(--text-primary)]")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--text-secondary)] md:inline">{user.name} · {user.role}</span>
              <Button variant="secondary" onClick={async () => { await logout(); router.replace(ROUTES.home); }}>Logout</Button>
            </>
          ) : (
            <>
              <Link href={ROUTES.login}><Button variant="ghost">Login</Button></Link>
              <Link href={ROUTES.register}><Button>Get Started</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
