"use client";

import { useCallback, useEffect, useState } from "react";
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { api } from "@/lib/api";
import type { Appointment } from "@/types";
import { AppointmentCalendar } from "@/components/ui/appointment-calendar";

type Range = {
  from: string;
  to: string;
};

function getInitialRange(): Range {
  const now = new Date();
  const start = startOfWeek(startOfMonth(now));
  const end = endOfWeek(endOfMonth(now));

  return {
    from: format(start, "yyyy-MM-dd"),
    to: format(end, "yyyy-MM-dd"),
  };
}

export function UserAppointmentsCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentRange, setCurrentRange] = useState<Range>(getInitialRange());

  const loadAppointments = useCallback(async (range: Range) => {
    setLoading(true);
    setError("");
    setCurrentRange(range);

    try {
      const res = await api.appointments.myAppointments(range);
      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments(getInitialRange());
  }, [loadAppointments]);

  return (
    <AppointmentCalendar
      title="My Appointments"
      description="Your appointments for the selected month. Use refresh after changing month."
      appointments={appointments}
      loading={loading}
      error={error}
      emptyLabel="You do not have any appointments in this month."
      onRefresh={(range) => void loadAppointments(range)}
    />
  );
}