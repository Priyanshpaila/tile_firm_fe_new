"use client";

import { useCallback, useEffect, useState } from "react";
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { api } from "@/lib/api";
import type { Appointment, Staff } from "@/types";
import { AppointmentCalendar } from "@/components/ui/appointment-calendar";
import { SectionCard } from "./section-card";

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

export function AdminAppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentRange, setCurrentRange] = useState<Range>(getInitialRange());

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    try {
      const res = await api.staff.list();
      setStaffList(res.data.staff || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load staff.");
    } finally {
      setStaffLoading(false);
    }
  }, []);

  const loadAppointments = useCallback(async (range: Range) => {
    setLoading(true);
    setError("");
    setCurrentRange(range);

    try {
      const res = await api.appointments.calendar(range);
      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStaff();
    void loadAppointments(getInitialRange());
  }, [loadAppointments, loadStaff]);

  const handleAssignStaff = async (appointmentId: string, staffId: string) => {
    await api.appointments.assignStaff(appointmentId, staffId);
    await loadAppointments(currentRange);
  };

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    await api.appointments.updateStatus(appointmentId, status);
    await loadAppointments(currentRange);
  };

  return (
    <SectionCard
      title="Appointments"
      description="Monthly appointment calendar for admin. Reload manually when needed."
    >
      <AppointmentCalendar
        title="Admin Appointments Calendar"
        description="Each cell shows appointment count. Click a day to view details."
        appointments={appointments}
        staffOptions={staffList}
        loading={loading || staffLoading}
        error={error}
        emptyLabel="No appointments for this month."
        allowManage
        onRefresh={(range) => void loadAppointments(range)}
        onAssignStaff={(appointmentId, staffId) =>
          void handleAssignStaff(appointmentId, staffId)
        }
        onUpdateStatus={(appointmentId, status) =>
          void handleUpdateStatus(appointmentId, status)
        }
      />
    </SectionCard>
  );
}