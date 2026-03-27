"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { PageShell } from "@/components/layout/page-shell";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import { toDateLabel } from "@/lib/utils";
import type { Appointment, Visualization } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [saves, setSaves] = useState<Visualization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [appointmentsRes, savesRes] = await Promise.all([api.appointments.myAppointments(), api.visualizer.mySaves()]);
        setAppointments(appointmentsRes.data.appointments);
        setSaves(savesRes.data.visualizations);
      } catch {
        setAppointments([]);
        setSaves([]);
      } finally { setLoading(false); }
    };
    void run();
  }, []);

  return (
    <AuthGuard roles={["user", "staff", "admin"]}>
      <PageShell title="Dashboard" description="Role-aware authenticated workspace for bookings, saved visualizations, and next actions.">
        {loading ? <Loader label="Loading dashboard..." /> : (
          <div className="grid gap-6">
            <StatsGrid items={[{ label: "Signed in as", value: user?.role || "guest" }, { label: "Appointments", value: appointments.length }, { label: "Saved rooms", value: saves.length }, { label: "Wishlist", value: "Use /users/wishlist API" }]} />
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="card-surface p-5">
                <h2 className="text-xl font-semibold">Upcoming and past appointments</h2>
                <div className="mt-4 grid gap-3">
                  {appointments.length ? appointments.map((appointment) => (
                    <div key={appointment._id} className="rounded-2xl border border-[var(--border-soft)] bg-white/60 p-4">
                      <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{appointment.ticketNumber}</p><p className="text-sm text-[var(--text-secondary)]">{toDateLabel(appointment.date)} · {appointment.timeSlot}</p></div><span className="rounded-full bg-[var(--surface-alt)] px-3 py-1 text-xs">{appointment.status}</span></div>
                    </div>
                  )) : <EmptyState title="No appointments yet" description="Book a visit to populate this block." />}
                </div>
              </div>
              <div className="card-surface p-5">
                <h2 className="text-xl font-semibold">Saved visualizations</h2>
                <div className="mt-4 grid gap-3">
                  {saves.length ? saves.map((save) => (
                    <div key={save._id} className="rounded-2xl border border-[var(--border-soft)] bg-white/60 p-4"><p className="font-semibold">{save.name}</p><p className="mt-1 text-sm text-[var(--text-secondary)]">Template: {save.roomTemplate?.name || "Custom upload"} · Tile: {save.selectedTile?.name}</p></div>
                  )) : <EmptyState title="No saved rooms" description="Use the visualizer and save a design to see it here." />}
                </div>
              </div>
            </div>
          </div>
        )}
      </PageShell>
    </AuthGuard>
  );
}
