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
    <div className="rounded-[1.35rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#fff_0%,#faf7f2_100%)] p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)]">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
        {value}
      </p>
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

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                    Recent appointments
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Latest service and consultation requests.
                  </p>
                </div>
                <span className="rounded-full bg-[#111111] px-3 py-1 text-xs font-medium text-white">
                  {stats.recentAppointments.length}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {stats.recentAppointments.length ? (
                  stats.recentAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="rounded-[1.2rem] border border-[var(--border-soft)] bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--text-primary)]">
                            {appointment.ticketNumber}
                          </p>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            {appointment.user?.name || "Unknown user"}
                          </p>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            {toDateLabel(appointment.date)} · {appointment.timeSlot}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#f3eee6] px-3 py-1 text-xs text-[#5b5148]">
                            {appointment.status}
                          </span>
                          <span className="rounded-full bg-[#efe6db] px-3 py-1 text-xs text-[#8d6337]">
                            {appointment.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-white px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
                    No recent appointments found.
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#171411_0%,#2b241d_100%)] p-5 text-white">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/55">
                  Admin Notes
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                  Operations snapshot
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Products, categories, staff, and user state can all be managed
                  from this dashboard using your current backend surface.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  "Products are fully manageable through create, update, delete, and filter flows.",
                  "Categories support full CRUD and are ready for catalog organization.",
                  "Staff can be created and updated for appointment assignment workflows.",
                ].map((text) => (
                  <div
                    key={text}
                    className="rounded-[1.2rem] border border-[var(--border-soft)] bg-white p-4 text-sm leading-6 text-[var(--text-secondary)]"
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