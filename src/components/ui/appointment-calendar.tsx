"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  IndianRupee,
  Loader2,
  MapPin,
  Phone,
  Receipt,
  User2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Appointment, Staff } from "@/types";

type CalendarRange = {
  from: string;
  to: string;
};

type AppointmentWithPaymentMeta = Appointment & {
  paymentMode?: string;
  paymentMethod?: string;
  mode?: string;
};

type AppointmentCalendarProps = {
  title: string;
  description?: string;
  appointments: Appointment[];
  loading?: boolean;
  error?: string;
  emptyLabel?: string;
  staffOptions?: Staff[];
  allowManage?: boolean;
  onRefresh?: (range: CalendarRange) => void | Promise<void>;
  onAssignStaff?: (
    appointmentId: string,
    staffId: string,
  ) => void | Promise<void>;
  onUpdateStatus?: (
    appointmentId: string,
    status: string,
  ) => void | Promise<void>;
};

const STATUS_OPTIONS = [
  "CREATED",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "CLOSED",
];

function toDateKey(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "yyyy-MM-dd");
}

function getDisplayStatus(status?: string) {
  if (!status) return "UNKNOWN";
  return status.replaceAll("_", " ");
}

function getTimeSlotLabel(slot?: string) {
  if (!slot) return "Time not set";
  return slot.replaceAll("_", " ");
}

function getUserLabel(appointment: Appointment) {
  if (!appointment.user) return "Unknown user";
  if (typeof appointment.user === "string") return appointment.user;
  return appointment.user.name || appointment.user.email || "Unknown user";
}

function getStaffId(appointment: Appointment) {
  if (!appointment.staff) return "";
  if (typeof appointment.staff === "string") return appointment.staff;
  return appointment.staff._id || "";
}

function getStaffLabel(appointment: Appointment) {
  if (!appointment.staff) return "Not assigned";
  if (typeof appointment.staff === "string") return appointment.staff;
  return appointment.staff.name || appointment.staff.email || "Assigned";
}

function getPaymentModeLabel(appointment: Appointment) {
  const enriched = appointment as AppointmentWithPaymentMeta;
  const value =
    enriched.paymentMode || enriched.paymentMethod || enriched.mode || "";
  if (!value) return "Not specified";
  return value.replaceAll("_", " ");
}

function getAddressLabel(appointment: Appointment) {
  return `${appointment.address.street}, ${appointment.address.city}, ${appointment.address.state} - ${appointment.address.pincode}`;
}

const selectClassName =
  "h-11 w-full rounded-[0.9rem] border border-[var(--border-soft)] bg-white px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[#b88a5b] focus:ring-4 focus:ring-[#b88a5b]/10";

export function AppointmentCalendar({
  title,
  description,
  appointments,
  loading = false,
  error = "",
  emptyLabel = "No appointments found.",
  staffOptions = [],
  allowManage = false,
  onRefresh,
  onAssignStaff,
  onUpdateStatus,
}: AppointmentCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [busyKey, setBusyKey] = useState("");
  const [assignDrafts, setAssignDrafts] = useState<Record<string, string>>({});
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({});

  const range = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return {
      start,
      end,
      from: format(start, "yyyy-MM-dd"),
      to: format(end, "yyyy-MM-dd"),
    };
  }, [currentMonth]);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: range.start,
        end: range.end,
      }),
    [range.start, range.end],
  );

  const groupedAppointments = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const key = toDateKey(appointment.date);
      const existing = map.get(key) || [];
      existing.push(appointment);
      map.set(key, existing);
    }
    return map;
  }, [appointments]);

  const selectedAppointments = selectedDay
    ? groupedAppointments.get(toDateKey(selectedDay)) || []
    : [];

  const handleAssign = async (appointmentId: string) => {
    const staffId = assignDrafts[appointmentId];
    if (!staffId || !onAssignStaff) return;

    setBusyKey(`assign-${appointmentId}`);
    try {
      await onAssignStaff(appointmentId, staffId);
    } finally {
      setBusyKey("");
    }
  };

  const handleStatusUpdate = async (appointmentId: string) => {
    const status = statusDrafts[appointmentId];
    if (!status || !onUpdateStatus) return;

    setBusyKey(`status-${appointmentId}`);
    try {
      await onUpdateStatus(appointmentId, status);
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#fff_0%,#faf7f2_100%)] shadow-[0_20px_50px_rgba(20,16,10,0.06)]">
      <div className="border-b border-[var(--border-soft)] px-4 py-4 sm:px-5 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Appointment Calendar
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-2xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-white p-1 shadow-sm">
              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentMonth((prev) => addMonths(prev, -1));
                  setSelectedDay(null);
                }}
                className="rounded-full p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-[140px] px-4 text-center text-sm font-semibold text-[var(--text-primary)]">
                {format(currentMonth, "MMMM yyyy")}
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setCurrentMonth((prev) => addMonths(prev, 1));
                  setSelectedDay(null);
                }}
                className="rounded-full p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setCurrentMonth(startOfMonth(today));
                setSelectedDay(null);
              }}
            >
              Today
            </Button>

            {onRefresh ? (
              <Button
                onClick={() =>
                  void onRefresh({ from: range.from, to: range.to })
                }
              >
                Refresh
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)] sm:text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const key = toDateKey(day);
            const dayAppointments = groupedAppointments.get(key) || [];
            const isSelected = !!selectedDay && isSameDay(day, selectedDay);

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "min-h-[88px] rounded-[1rem] border p-2 text-left transition sm:min-h-[112px] sm:p-3",
                  isSelected
                    ? "border-[#b88a5b] bg-[#f7efe4] shadow-[0_10px_25px_rgba(20,16,10,0.08)]"
                    : "border-[var(--border-soft)] bg-white hover:bg-[#faf7f2]",
                  !isSameMonth(day, currentMonth) && "opacity-45",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                      isToday(day)
                        ? "bg-[var(--text-primary)] text-white"
                        : "bg-[#f3eee6] text-[var(--text-primary)]",
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {dayAppointments.length > 0 ? (
                    <span className="rounded-full bg-[#171411] px-2 py-1 text-[10px] font-semibold text-white sm:text-xs">
                      {dayAppointments.length}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 hidden gap-2 sm:grid">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <div
                      key={appointment._id}
                      className="rounded-lg bg-[#faf7f2] px-2 py-1.5 text-[11px] leading-4 text-[var(--text-primary)]"
                    >
                      <div className="truncate font-medium">
                        {appointment.ticketNumber}
                      </div>
                      <div className="truncate text-[var(--text-secondary)]">
                        {getTimeSlotLabel(appointment.timeSlot)}
                      </div>
                    </div>
                  ))}

                  {dayAppointments.length > 2 ? (
                    <div className="text-[11px] font-medium text-[var(--text-secondary)]">
                      + {dayAppointments.length - 2} more
                    </div>
                  ) : null}
                </div>

                <div className="mt-3 sm:hidden">
                  {dayAppointments.length > 0 ? (
                    <div className="text-[10px] font-medium text-[var(--text-secondary)]">
                      {dayAppointments.length} appointment
                      {dayAppointments.length > 1 ? "s" : ""}
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {!loading && appointments.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
            {emptyLabel}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 flex items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--text-secondary)]" />
          </div>
        ) : null}
      </div>

      {selectedDay ? (
        <div className="fixed inset-0 z-[90] bg-black/55 p-3 backdrop-blur-sm sm:p-5">
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
            <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
              <div className="border-b border-[var(--border-soft)] px-4 py-4 sm:px-5 md:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      {format(selectedDay, "EEEE")}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-2xl">
                      {format(selectedDay, "dd MMMM yyyy")}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {selectedAppointments.length} appointment
                      {selectedAppointments.length === 1 ? "" : "s"} on this day
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDay(null)}
                    className="rounded-full border border-[var(--border-soft)] bg-white p-2 text-[var(--text-primary)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 md:px-6">
                {selectedAppointments.length === 0 ? (
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-[#faf7f2] px-4 py-10 text-center text-sm text-[var(--text-secondary)]">
                    No appointments on this day.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {selectedAppointments.map((appointment) => {
                      const currentStaffId = getStaffId(appointment);
                      const currentStatus = String(appointment.status || "");

                      return (
                        <div
                          key={appointment._id}
                          className="rounded-[1.25rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4 sm:p-5"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#171411] px-3 py-1 text-xs font-semibold text-white">
                                  {appointment.ticketNumber}
                                </span>
                                <span className="rounded-full bg-[#efe6db] px-3 py-1 text-xs font-medium text-[#8b633c]">
                                  {getDisplayStatus(String(appointment.status))}
                                </span>
                                <span className="rounded-full bg-[#f3eee6] px-3 py-1 text-xs font-medium text-[#5b5148]">
                                  {getTimeSlotLabel(appointment.timeSlot)}
                                </span>
                              </div>

                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[1rem] border border-[var(--border-soft)] bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                                  <div className="mb-1 flex items-center gap-2 text-[var(--text-primary)]">
                                    <User2 className="h-4 w-4" />
                                    <span className="font-medium">Customer</span>
                                  </div>
                                  <p>{getUserLabel(appointment)}</p>
                                </div>

                                <div className="rounded-[1rem] border border-[var(--border-soft)] bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                                  <div className="mb-1 flex items-center gap-2 text-[var(--text-primary)]">
                                    <CalendarDays className="h-4 w-4" />
                                    <span className="font-medium">Visit date</span>
                                  </div>
                                  <p>
                                    {format(
                                      new Date(appointment.date),
                                      "dd MMM yyyy",
                                    )}
                                  </p>
                                </div>

                                <div className="rounded-[1rem] border border-[var(--border-soft)] bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                                  <div className="mb-1 flex items-center gap-2 text-[var(--text-primary)]">
                                    <Phone className="h-4 w-4" />
                                    <span className="font-medium">Assigned staff</span>
                                  </div>
                                  <p>{getStaffLabel(appointment)}</p>
                                </div>

                                <div className="rounded-[1rem] border border-[var(--border-soft)] bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                                  <div className="mb-1 flex items-center gap-2 text-[var(--text-primary)]">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="font-medium">Payment mode</span>
                                  </div>
                                  <p>{getPaymentModeLabel(appointment)}</p>
                                </div>

                                <div className="rounded-[1rem] border border-[var(--border-soft)] bg-white px-3 py-3 text-sm text-[var(--text-secondary)] sm:col-span-2">
                                  <div className="mb-1 flex items-center gap-2 text-[var(--text-primary)]">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-medium">Address</span>
                                  </div>
                                  <p>{getAddressLabel(appointment)}</p>
                                </div>
                              </div>

                              {appointment.notes ? (
                                <div className="mt-4 rounded-[1rem] border border-[var(--border-soft)] bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                                  <p className="mb-1 font-medium text-[var(--text-primary)]">
                                    Notes
                                  </p>
                                  <p>{appointment.notes}</p>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex flex-wrap gap-2 lg:w-[220px] lg:justify-end">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm">
                                <Receipt className="h-3.5 w-3.5" />
                                {getPaymentModeLabel(appointment)}
                              </span>

                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm">
                                <IndianRupee className="h-3.5 w-3.5" />
                                {appointment.visitFee}
                              </span>
                            </div>
                          </div>

                          {allowManage ? (
                            <div className="mt-5 grid gap-3 border-t border-[var(--border-soft)] pt-5 xl:grid-cols-2">
                              <div className="rounded-[1rem] border border-[var(--border-soft)] bg-white p-3">
                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                                  Assign staff
                                </label>

                                <div className="flex flex-col gap-2">
                                  <select
                                    value={
                                      assignDrafts[appointment._id] ??
                                      currentStaffId
                                    }
                                    onChange={(e) =>
                                      setAssignDrafts((prev) => ({
                                        ...prev,
                                        [appointment._id]: e.target.value,
                                      }))
                                    }
                                    className={selectClassName}
                                  >
                                    <option value="">Select staff</option>
                                    {staffOptions.map((staff) => (
                                      <option key={staff._id} value={staff._id}>
                                        {staff.name}
                                      </option>
                                    ))}
                                  </select>

                                  <Button
                                    onClick={() =>
                                      void handleAssign(appointment._id)
                                    }
                                    disabled={
                                      !onAssignStaff ||
                                      busyKey === `assign-${appointment._id}`
                                    }
                                  >
                                    {busyKey === `assign-${appointment._id}`
                                      ? "Saving..."
                                      : "Assign"}
                                  </Button>
                                </div>
                              </div>

                              <div className="rounded-[1rem] border border-[var(--border-soft)] bg-white p-3">
                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                                  Appointment status
                                </label>

                                <div className="flex flex-col gap-2">
                                  <select
                                    value={
                                      statusDrafts[appointment._id] ??
                                      currentStatus
                                    }
                                    onChange={(e) =>
                                      setStatusDrafts((prev) => ({
                                        ...prev,
                                        [appointment._id]: e.target.value,
                                      }))
                                    }
                                    className={selectClassName}
                                  >
                                    {STATUS_OPTIONS.map((status) => (
                                      <option key={status} value={status}>
                                        {status.replaceAll("_", " ")}
                                      </option>
                                    ))}
                                  </select>

                                  <Button
                                    variant="secondary"
                                    onClick={() =>
                                      void handleStatusUpdate(appointment._id)
                                    }
                                    disabled={
                                      !onUpdateStatus ||
                                      busyKey === `status-${appointment._id}`
                                    }
                                  >
                                    {busyKey === `status-${appointment._id}`
                                      ? "Saving..."
                                      : "Update"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}