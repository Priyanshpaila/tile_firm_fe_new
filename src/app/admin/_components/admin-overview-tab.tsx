"use client";

import { Loader } from "@/components/ui/loader";
import { toDateLabel } from "@/lib/utils";
import type { AdminStats } from "@/types";
import { SectionCard } from "./section-card";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#fff_0%,#faf7f2_100%)] p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)]">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function TableShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-white shadow-[0_10px_30px_rgba(20,16,10,0.04)]">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminOverviewTab({
  stats,
  statsItems,
  loading,
  error,
}: {
  stats: AdminStats | null;
  statsItems: { label: string; value: string | number }[];
  loading: boolean;
  error: string;
}) {
  return (
    <SectionCard
      title="Overview"
      description="High-level metrics and recent operational activity from your admin routes."
    >
      {loading ? (
        <Loader label="Loading dashboard stats..." />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : stats ? (
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statsItems.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="grid gap-3">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                  Recent appointments
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Latest service and consultation requests in a compact table.
                </p>
              </div>

              <TableShell>
                <table className="min-w-[860px] w-full text-sm">
                  <thead className="bg-[#faf7f2] text-left text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Ticket</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAppointments.length ? (
                      stats.recentAppointments.map((appointment) => (
                        <tr
                          key={appointment._id}
                          className="border-t border-[var(--border-soft)] transition hover:bg-[#fcfbf8]"
                        >
                          <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                            {appointment.ticketNumber}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {typeof appointment.user === "object"
                              ? appointment.user?.name
                              : "Unknown user"}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {toDateLabel(appointment.date)}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {appointment.timeSlot}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-[#f3eee6] px-2.5 py-1 text-xs text-[#5b5148]">
                              {appointment.status}
                            </span>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
                        >
                          No recent appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </TableShell>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.25rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#171411_0%,#2b241d_100%)] p-5 text-white">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/55">
                  Admin Notes
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                  Operations snapshot
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Products, categories, staff, users, and appointments are now
                  arranged in denser admin-friendly tables for faster review.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  "Products now use a compact tabular catalog view with filters and row actions.",
                  "Categories, users, and staff are streamlined into denser table layouts.",
                  "Appointments now have both a calendar view and a quick date-based table below it.",
                ].map((text) => (
                  <div
                    key={text}
                    className="rounded-[1.1rem] border border-[var(--border-soft)] bg-white p-4 text-sm leading-6 text-[var(--text-secondary)]"
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}