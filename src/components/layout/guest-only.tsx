"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { roleHome } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, hydrated, initialize } = useAuthStore();
  useEffect(() => { void initialize(); }, [initialize]);
  useEffect(() => { if (hydrated && user) router.replace(roleHome(user.role)); }, [hydrated, router, user]);
  if (!hydrated) return <Loader label="Loading..." />;
  if (user) return <Loader label="Redirecting..." />;
  return <>{children}</>;
}
