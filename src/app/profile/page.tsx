"use client";

import { FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || "", phone: user.phone || "", street: user.address?.street || "", city: user.address?.city || "", state: user.address?.state || "", pincode: user.address?.pincode || "" });
  }, [user]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    try {
      await api.users.updateProfile({ name: form.name, phone: form.phone, address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode, country: "India" } });
      await refreshMe();
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile update failed");
    }
  };

  return (
    <AuthGuard roles={["user", "staff", "admin"]}>
      <PageShell title="Profile" description="Editable profile scaffold mapped to /api/users/profile.">
        <form onSubmit={onSubmit} className="card-surface grid gap-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" />
            <input value={user?.email || ""} disabled placeholder="Email" />
            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" />
            <input value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} placeholder="Street" />
            <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="City" />
            <input value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} placeholder="State" />
            <input value={form.pincode} onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))} placeholder="Pincode" />
          </div>
          <Button>Save profile</Button>
          {message ? <p className="text-sm text-[var(--text-secondary)]">{message}</p> : null}
        </form>
      </PageShell>
    </AuthGuard>
  );
}
