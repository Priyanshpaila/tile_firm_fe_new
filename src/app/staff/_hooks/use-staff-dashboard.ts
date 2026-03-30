"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Appointment, User } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export type StaffDashboardTab = "overview" | "appointments" | "today";

export function useStaffDashboard() {
  const user = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<StaffDashboardTab>("overview");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.appointments.staffMyAppointments();
      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load assigned appointments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAppointments();
  }, []);

  const stats = useMemo(() => {
    const todayKey = new Date().toDateString();

    return {
      total: appointments.length,
      today: appointments.filter(
        (item) => new Date(item.date).toDateString() === todayKey,
      ).length,
      completed: appointments.filter(
        (item) => String(item.status).toUpperCase() === "COMPLETED",
      ).length,
    };
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    const now = Date.now();

    return [...appointments]
      .filter((item) => new Date(item.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    const todayKey = new Date().toDateString();

    return appointments
      .filter((item) => new Date(item.date).toDateString() === todayKey)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments]);

  return {
    activeTab,
    setActiveTab,
    user: user as User | null,
    appointments,
    loading,
    error,
    stats,
    nextAppointment,
    todayAppointments,
    loadAppointments,
  };
}