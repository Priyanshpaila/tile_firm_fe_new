"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { TIME_SLOTS } from "@/lib/constants";
import { api } from "@/lib/api";
import { AuthGuard } from "@/components/layout/auth-guard";

export default function BookingPage() {
  const [form, setForm] = useState({ street: "", city: "", state: "", pincode: "", date: "", timeSlot: TIME_SLOTS[0], notes: "", paymentMethod: "cash" as "cash" | "online" });
  const [message, setMessage] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ orderId: string; amount: number; currency: string; keyId: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setOrderInfo(null);
    try {
      const appointmentRes = await api.appointments.create({
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode, country: "India" },
        date: new Date(form.date).toISOString(),
        timeSlot: form.timeSlot,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
      });
      const appointment = appointmentRes.data.appointment;
      if (form.paymentMethod === "online") {
        const orderRes = await api.payments.createOrder(appointment._id);
        setOrderInfo(orderRes.data);
        setMessage("Appointment created. Razorpay order scaffold created successfully.");
      } else {
        setMessage(`Appointment booked with ticket ${appointment.ticketNumber}. Status: ${appointment.status}.`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard roles={["user", "staff", "admin"]}>
      <PageShell title="Book Consultation" description="Creates an appointment through the real backend and scaffolds the Razorpay order flow for online payments.">
        <form onSubmit={onSubmit} className="card-surface grid gap-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input placeholder="Street address" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} required />
            <input placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} required />
            <input placeholder="State" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} required />
            <input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))} required />
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
            <select value={form.timeSlot} onChange={(e) => setForm((p) => ({ ...p, timeSlot: e.target.value as typeof form.timeSlot }))}>{TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select>
            <select value={form.paymentMethod} onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value as "cash" | "online" }))}><option value="cash">Cash</option><option value="online">Online</option></select>
          </div>
          <textarea placeholder="Notes" rows={4} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          <div className="flex items-center gap-4"><Button disabled={submitting}>{submitting ? "Submitting..." : "Book appointment"}</Button><p className="text-sm text-[var(--text-secondary)]">Backend default visit fee: ₹500</p></div>
          {message ? <p className="text-sm text-[var(--text-primary)]">{message}</p> : null}
          {orderInfo ? <div className="rounded-2xl border border-[var(--border-soft)] bg-white/60 p-4 text-sm"><p className="font-medium">Razorpay order scaffold</p><p>Order ID: {orderInfo.orderId}</p><p>Amount: ₹{orderInfo.amount / 100}</p><p>Currency: {orderInfo.currency}</p><p className="mt-2 text-[var(--text-secondary)]">Final checkout UI and script injection can now be layered on top of this real backend order response.</p></div> : null}
        </form>
      </PageShell>
    </AuthGuard>
  );
}
