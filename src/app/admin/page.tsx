"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { PageShell } from "@/components/layout/page-shell";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Loader } from "@/components/ui/loader";
import { api } from "@/lib/api";
import { toDateLabel } from "@/lib/utils";
import type { AdminStats, User } from "@/types";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([api.admin.stats(), api.users.listUsers({ page: 1, limit: 8 })]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
      } finally { setLoading(false); }
    };
    void run();
  }, []);

  return (
    <AuthGuard roles={["admin"]}>
      <PageShell title="Admin Dashboard" description="Uses admin-only backend routes for aggregate metrics and user management scaffolding.">
        {loading || !stats ? <Loader label="Loading admin data..." /> : (
          <div className="grid gap-6">
            <StatsGrid items={[{ label: "Total users", value: stats.totalUsers }, { label: "Total products", value: stats.totalProducts }, { label: "Total appointments", value: stats.totalAppointments }, { label: "Total uploads", value: stats.totalUploads }]} />
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="card-surface p-5">
                <h2 className="text-xl font-semibold">Recent appointments</h2>
                <div className="mt-4 grid gap-3">{stats.recentAppointments.map((appointment) => <div key={appointment._id} className="rounded-2xl border border-[var(--border-soft)] bg-white/60 p-4"><p className="font-semibold">{appointment.ticketNumber}</p><p className="text-sm text-[var(--text-secondary)]">{appointment.user?.name || "Unknown user"} · {toDateLabel(appointment.date)} · {appointment.status}</p></div>)}</div>
              </div>
              <div className="card-surface p-5">
                <h2 className="text-xl font-semibold">Recent users</h2>
                <div className="mt-4 grid gap-3">{users.map((user) => <div key={user._id} className="rounded-2xl border border-[var(--border-soft)] bg-white/60 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{user.name}</p><p className="text-sm text-[var(--text-secondary)]">{user.email}</p></div><span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs">{user.role}</span></div></div>)}</div>
              </div>
            </div>
          </div>
        )}
      </PageShell>
    </AuthGuard>
  );
}
