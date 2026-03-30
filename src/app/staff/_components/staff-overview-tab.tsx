import { CalendarDays, CheckCircle2, Clock3, User2 } from "lucide-react";
import type { Appointment, User } from "@/types";

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

export function StaffOverviewTab({
  user,
  loading,
  error,
  stats,
  nextAppointment,
}: {
  user: User | null;
  loading: boolean;
  error: string;
  stats: {
    total: number;
    today: number;
    completed: number;
  };
  nextAppointment?: Appointment;
}) {
  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-6 text-sm text-[var(--text-secondary)]">
        Loading staff dashboard...
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
            Staff Access
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            {user?.name || "Staff Member"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
            View your assigned appointments, today’s service queue, and upcoming visits.
          </p>

          <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-white/8 p-4 text-sm text-white/75">
            Logged in as {user?.email || "No email available"}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <StatCard label="Assigned Total" value={stats.total} icon={CalendarDays} />
          <StatCard label="Today" value={stats.today} icon={Clock3} />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
        </div>
      </div>

      <div className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-5">
        <div className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-[#8a6037]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Next Assigned Appointment
          </h3>
        </div>

        {nextAppointment ? (
          <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-4 text-sm text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)]">
              {nextAppointment.ticketNumber}
            </p>
            <p className="mt-2">
              {new Date(nextAppointment.date).toLocaleDateString()} ·{" "}
              {nextAppointment.timeSlot}
            </p>
            <p className="mt-2">
              {nextAppointment.address.city}, {nextAppointment.address.state}
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-4 text-sm text-[var(--text-secondary)]">
            No upcoming assigned appointment.
          </div>
        )}
      </div>
    </div>
  );
}