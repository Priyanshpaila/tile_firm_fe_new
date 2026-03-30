"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Appointment, Product, User, Visualization } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export type UserDashboardTab =
  | "overview"
  | "appointments"
  | "wishlist"
  | "visualizations";

export function useUserDashboard() {
  const user = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState<UserDashboardTab>("overview");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);

  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingVisualizations, setLoadingVisualizations] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      const res = await api.appointments.myAppointments();
      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load appointments.");
    }
  };

  const loadWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const res = await api.users.getWishlist();
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist.");
    } finally {
      setLoadingWishlist(false);
    }
  };

  const loadVisualizations = async () => {
    setLoadingVisualizations(true);
    try {
      const res = await api.visualizer.mySaves();
      setVisualizations(res.data.visualizations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load saved visualizations.",
      );
    } finally {
      setLoadingVisualizations(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoadingOverview(true);
      setError("");
      await Promise.all([loadAppointments(), loadWishlist(), loadVisualizations()]);
      setLoadingOverview(false);
    };

    void run();
  }, []);

  const upcomingAppointment = useMemo(() => {
    const now = Date.now();

    return [...appointments]
      .filter((item) => new Date(item.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [appointments]);

  const recentVisualization = useMemo(() => {
    return [...visualizations]
      .sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime(),
      )[0];
  }, [visualizations]);

  const stats = useMemo(
    () => ({
      appointments: appointments.length,
      wishlist: wishlist.length,
      visualizations: visualizations.length,
    }),
    [appointments.length, visualizations.length, wishlist.length],
  );

  return {
    activeTab,
    setActiveTab,
    user: user as User | null,
    appointments,
    wishlist,
    visualizations,
    loadingOverview,
    loadingWishlist,
    loadingVisualizations,
    error,
    stats,
    upcomingAppointment,
    recentVisualization,
    loadWishlist,
    loadVisualizations,
  };
}