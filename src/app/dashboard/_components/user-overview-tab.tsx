import { CalendarDays, Heart, Layers3, User2 } from "lucide-react";
import type { Appointment, User, Visualization } from "@/types";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[1.35rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5efe6] text-[#7f5a35]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

export function UserOverviewTab({
  user,
  loading,
  error,
  stats,
  upcomingAppointment,
  recentVisualization,
}: {
  user: User | null;
  loading: boolean;
  error: string;
  stats: {
    appointments: number;
    wishlist: number;
    visualizations: number;
  };
  upcomingAppointment?: Appointment;
  recentVisualization?: Visualization;
}) {
  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-6 text-sm text-[var(--text-secondary)]">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[linear-gradient(135deg,#171411_0%,#2b231c_55%,#463122_100%)] p-5 text-white shadow-[0_20px_50px_rgba(20,16,10,0.12)] sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/55">
            Welcome
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            {user?.name || "User"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
            Review your wishlist, upcoming appointments, and saved room previews
            from one place.
          </p>

          <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-white/8 p-4 text-sm text-white/75">
            Logged in as {user?.email || "No email available"}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <StatCard label="Appointments" value={stats.appointments} icon={CalendarDays} />
          <StatCard label="Wishlist" value={stats.wishlist} icon={Heart} />
          <StatCard label="Saved Views" value={stats.visualizations} icon={Layers3} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#8a6037]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Upcoming Appointment
            </h3>
          </div>

          {upcomingAppointment ? (
            <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-4 text-sm text-[var(--text-secondary)]">
              <p className="font-semibold text-[var(--text-primary)]">
                {upcomingAppointment.ticketNumber}
              </p>
              <p className="mt-2">
                {new Date(upcomingAppointment.date).toLocaleDateString()} ·{" "}
                {upcomingAppointment.timeSlot}
              </p>
              <p className="mt-2">
                {upcomingAppointment.address.city}, {upcomingAppointment.address.state}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-4 text-sm text-[var(--text-secondary)]">
              No upcoming appointment found.
            </div>
          )}
        </div>

        <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-5">
          <div className="flex items-center gap-2">
            <User2 className="h-4 w-4 text-[#8a6037]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Latest Saved Preview
            </h3>
          </div>

          {recentVisualization ? (
            <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-4 text-sm text-[var(--text-secondary)]">
              <p className="font-semibold text-[var(--text-primary)]">
                {recentVisualization.name || "Untitled Save"}
              </p>
              <p className="mt-2">
                Saved on{" "}
                {recentVisualization.createdAt
                  ? new Date(recentVisualization.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-4 text-sm text-[var(--text-secondary)]">
              No saved visualizations yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}