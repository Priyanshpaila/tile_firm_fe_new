import type { Appointment } from "@/types";

export function StaffTodayTab({
  loading,
  error,
  todayAppointments,
  onRefresh,
}: {
  loading: boolean;
  error: string;
  todayAppointments: Appointment[];
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Today Queue
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            All appointments assigned to you for today.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[1rem] bg-[#faf7f2] px-4 py-8 text-sm text-[var(--text-secondary)]">
          Loading today queue...
        </div>
      ) : todayAppointments.length ? (
        <div className="grid gap-4">
          {todayAppointments.map((appointment) => (
            <article
              key={appointment._id}
              className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {appointment.ticketNumber}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {appointment.timeSlot}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    {appointment.address.street}, {appointment.address.city}
                  </p>
                </div>

                <span className="rounded-full bg-[#f3eee6] px-3 py-2 text-xs font-medium text-[#5b5148]">
                  {String(appointment.status)}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1rem] bg-[#faf7f2] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
          No appointments assigned for today.
        </div>
      )}
    </div>
  );
}