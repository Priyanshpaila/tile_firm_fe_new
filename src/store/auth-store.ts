"use client";

import { create } from "zustand";
import type { User } from "@/types";
import { api } from "@/lib/api";

type AuthStatus = "idle" | "loading" | "authenticated" | "guest";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  hydrated: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<User | null>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  hydrated: false,
  error: null,
  setUser: (user) => set({ user, status: user ? "authenticated" : "guest", hydrated: true, error: null }),
  initialize: async () => {
    if (get().hydrated) return;
    set({ status: "loading" });
    try {
      const response = await api.auth.me();
      set({ user: response.data.user, status: "authenticated", hydrated: true, error: null });
    } catch {
      set({ user: null, status: "guest", hydrated: true, error: null });
    }
  },
  refreshMe: async () => {
    try {
      const response = await api.auth.me();
      set({ user: response.data.user, status: "authenticated", hydrated: true, error: null });
      return response.data.user;
    } catch {
      set({ user: null, status: "guest", hydrated: true, error: null });
      return null;
    }
  },
  login: async (payload) => {
    set({ status: "loading", error: null });
    await api.auth.login(payload);
    const response = await api.auth.me();
    set({ user: response.data.user, status: "authenticated", hydrated: true, error: null });
    return response.data.user;
  },
  register: async (payload) => {
    set({ status: "loading", error: null });
    await api.auth.register(payload);
    const response = await api.auth.me();
    set({ user: response.data.user, status: "authenticated", hydrated: true, error: null });
    return response.data.user;
  },
  logout: async () => {
    try {
      await api.auth.logout();
    } finally {
      set({ user: null, status: "guest", hydrated: true, error: null });
    }
  },
}));
