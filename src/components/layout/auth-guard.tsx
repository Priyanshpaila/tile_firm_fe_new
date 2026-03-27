"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { ROUTES, roleHome } from "@/lib/routes";
import type { Role } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children, roles }: { children: ReactNode; roles?: Role[]; }) {
  const router = useRouter();
  const { user, status, hydrated, initialize } = useAuthStore();
  useEffect(() => { void initialize(); }, [initialize]);
  useEffect(() => {
    if (!hydrated) return;
    if (!user) { router.replace(ROUTES.login); return; }
    if (roles && !roles.includes(user.role)) router.replace(roleHome(user.role));
  }, [hydrated, roles, router, user]);

  if (!hydrated || status === "loading") return <Loader label="Checking your session..." />;
  if (!user) return <Loader label="Redirecting to login..." />;
  if (roles && !roles.includes(user.role)) return <Loader label="Redirecting..." />;
  return <>{children}</>;
}
