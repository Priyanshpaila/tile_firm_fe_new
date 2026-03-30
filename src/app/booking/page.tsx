"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Info,
  Loader2,
  MapPinHouse,
  NotebookPen,
  Wallet,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { TIME_SLOTS } from "@/lib/constants";
import { api } from "@/lib/api";
import { AuthGuard } from "@/components/layout/auth-guard";

type BookingFormState = {
  street: string;
  city: string;
  state: string;
  pincode: string;
  date: string;
  timeSlot: string;
  notes: string;
  paymentMethod: "cash" | "online";
};

type PinStatus = "idle" | "loading" | "success" | "error";

function getTodayInputDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function bookingDateToIso(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const localNoon = new Date(year, month - 1, day, 12, 0, 0);
  return localNoon.toISOString();
}

function formatSlot(slot: string) {
  return slot.replaceAll("_", " ");
}

function PinAutoFill({
  pin,
  setForm,
}: {
  pin: string;
  setForm: React.Dispatch<React.SetStateAction<BookingFormState>>;
}) {
  const [pinStatus, setPinStatus] = useState<PinStatus>("idle");
  const [pinStatusMsg, setPinStatusMsg] = useState("");
  const lastPinRef = useRef<string | null>(null);

  function cleanPostOfficeName(name: string) {
    return String(name || "")
      .replace(/\b(HO|GPO|S\.?O|H\.?O|B\.?O)\b/gi, "")
      .replace(/\bA\s*O\b/gi, "")
      .replace(/\bSub Post Office\b/gi, "")
      .replace(/\bHead Post Office\b/gi, "")
      .replace(/\bPost Office\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeCityFromOffice(office: any) {
    const rawName = cleanPostOfficeName(office?.Name || "");

    if (!rawName) {
      return String(
        office?.Block || office?.District || office?.Division || "",
      ).trim();
    }

    // If name is like "Bhilai 1", convert to "Bhilai"
    const noTrailingNumber = rawName.replace(/\s+\d+\s*$/, "").trim();

    // If name is like "Sector 2 Bhilai", keep it as-is because it is still useful
    return noTrailingNumber || rawName;
  }

  function normalizeStateName(state: string) {
    const value = String(state || "").trim();
    if (!value) return value;

    // optional correction for common typo returned by some postal records
    if (value.toLowerCase() === "chattisgarh") return "Chhattisgarh";

    return value;
  }

  useEffect(() => {
    const cleanPin = String(pin ?? "")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!/^\d{6}$/.test(cleanPin)) {
      lastPinRef.current = null;
      setPinStatus("idle");
      setPinStatusMsg("");
      return;
    }

    if (lastPinRef.current === cleanPin) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      setPinStatus("loading");
      setPinStatusMsg("Looking up city and state...");

      try {
        try {
          const response = await fetch(
            `https://api.postalpincode.in/pincode/${cleanPin}`,
            {
              signal: controller.signal,
              mode: "cors",
            },
          );

          const json = await response.json();
          const payload = Array.isArray(json) ? json[0] : null;
          const offices = Array.isArray(payload?.PostOffice)
            ? payload.PostOffice
            : [];

          if (payload?.Status === "Success" && offices.length > 0) {
            const preferredOffice =
              offices.find(
                (office: any) =>
                  String(office?.DeliveryStatus || "").toLowerCase() ===
                  "delivery",
              ) || offices[0];

            const city = normalizeCityFromOffice(preferredOffice);
            const state = normalizeStateName(preferredOffice?.State || "");
            const district = String(preferredOffice?.District || "").trim();

            if (city || state) {
              setForm((prev) => ({
                ...prev,
                city: city || prev.city,
                state: state || prev.state,
              }));

              setPinStatus("success");
              setPinStatusMsg(
                `${city}${city && state ? ", " : ""}${state}${
                  district && district !== city
                    ? ` • District: ${district}`
                    : ""
                }`,
              );
              lastPinRef.current = cleanPin;
              return;
            }
          }

          throw new Error("Postal API returned no usable result");
        } catch {
          const fallback = await fetch(
            `https://api.zippopotam.us/IN/${cleanPin}`,
            {
              signal: controller.signal,
              mode: "cors",
            },
          );

          if (!fallback.ok) {
            throw new Error("Fallback API failed");
          }

          const json = await fallback.json();
          const place = json?.places?.[0];
          const city = String(place?.["place name"] || "").trim();
          const state = normalizeStateName(place?.state || "");

          setForm((prev) => ({
            ...prev,
            city: city || prev.city,
            state: state || prev.state,
          }));

          setPinStatus("success");
          setPinStatusMsg(`${city}${city && state ? ", " : ""}${state}`.trim());
          lastPinRef.current = cleanPin;
        }
      } catch (error: any) {
        if (error?.name === "AbortError") return;
        setPinStatus("error");
        setPinStatusMsg("Could not fetch city/state. Please fill manually.");
        lastPinRef.current = null;
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [pin, setForm]);

  if (pinStatus === "idle") return null;

  const wrapperClass =
    pinStatus === "loading"
      ? "mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
      : pinStatus === "success"
        ? "mt-2 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
        : "mt-2 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700";

  return (
    <div className={wrapperClass}>
      {pinStatus === "loading" ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : pinStatus === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <Info className="h-4 w-4 shrink-0" />
      )}
      <span>{pinStatusMsg}</span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-medium text-[var(--text-primary)]">
      {children}
    </span>
  );
}

function MessageBox({
  message,
  success,
}: {
  message: string | null;
  success: boolean;
}) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-[1rem] px-4 py-3 text-sm ${
        success
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <p>{message}</p>
    </div>
  );
}

export default function BookingPage() {
  const [form, setForm] = useState<BookingFormState>({
    street: "",
    city: "",
    state: "",
    pincode: "",
    date: getTodayInputDate(),
    timeSlot: TIME_SLOTS[0] || "",
    notes: "",
    paymentMethod: "cash",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  } | null>(null);
  const [appointmentInfo, setAppointmentInfo] = useState<{
    ticketNumber: string;
    status: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const visitFee = 500;

  const isAddressReady = useMemo(() => {
    return (
      form.street.trim() &&
      form.city.trim() &&
      form.state.trim() &&
      /^\d{6}$/.test(form.pincode)
    );
  }, [form.city, form.pincode, form.state, form.street]);

  const formattedDate = useMemo(() => {
    if (!form.date) return "Select a date";
    const date = new Date(`${form.date}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [form.date]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitting(true);
    setMessage(null);
    setMessageSuccess(false);
    setOrderInfo(null);
    setAppointmentInfo(null);

    try {
      const appointmentRes = await api.appointments.create({
        address: {
          street: form.street.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          country: "India",
        },
        date: bookingDateToIso(form.date),
        timeSlot: form.timeSlot,
        notes: form.notes.trim() || undefined,
        paymentMethod: form.paymentMethod,
      });

      const appointment = appointmentRes.data.appointment;

      setAppointmentInfo({
        ticketNumber: appointment.ticketNumber,
        status: String(appointment.status),
      });

      if (form.paymentMethod === "online") {
        const orderRes = await api.payments.createOrder(appointment._id);
        setOrderInfo(orderRes.data);
        setMessage(
          `Appointment ${appointment.ticketNumber} created successfully. Payment order is ready.`,
        );
        setMessageSuccess(true);
      } else {
        setMessage(
          `Appointment booked successfully with ticket ${appointment.ticketNumber}.`,
        );
        setMessageSuccess(true);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create appointment.",
      );
      setMessageSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard roles={["user", "staff", "admin"]}>
      <PageShell
        title="Book Consultation"
        description="Schedule an expert visit with address autofill, preferred slot selection, and cash or online payment flow."
      >
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="grid gap-6">
            <div className="overflow-hidden rounded-[1.8rem] border border-[var(--border-soft)] bg-[linear-gradient(145deg,#171411_0%,#2b231c_55%,#463122_100%)] p-5 text-white shadow-[0_24px_60px_rgba(20,16,10,0.16)] sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">
                Premium Consultation
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                Book a home visit for tile guidance and space review.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                Enter your address, pick a date and slot, and confirm whether
                you want to pay online or on visit. Pincode lookup helps fill
                your city and state automatically.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55">
                    Visit Fee
                  </p>
                  <p className="mt-2 text-xl font-semibold">₹ {visitFee}</p>
                </div>

                <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55">
                    Autofill
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    Pincode → city & state
                  </p>
                </div>

                <div className="rounded-[1.2rem] border border-white/10 bg-white/8 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/55">
                    Payment
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    Cash or online order
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]"
            >
              <div className="flex items-center gap-2">
                <MapPinHouse className="h-4 w-4 text-[#8a6037]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Address & Visit Details
                </h3>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 md:col-span-2">
                  <FieldLabel>Street address</FieldLabel>
                  <input
                    placeholder="House / building / street"
                    value={form.street}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, street: e.target.value }))
                    }
                    required
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>Pincode</FieldLabel>
                  <input
                    placeholder="6-digit pincode"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                    inputMode="numeric"
                    required
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                  <PinAutoFill pin={form.pincode} setForm={setForm} />
                </label>

                <div className="hidden md:block" />

                <label className="grid gap-2">
                  <FieldLabel>City</FieldLabel>
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, city: e.target.value }))
                    }
                    required
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>State</FieldLabel>
                  <input
                    placeholder="State"
                    value={form.state}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, state: e.target.value }))
                    }
                    required
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <FieldLabel>Visit date</FieldLabel>
                  <input
                    type="date"
                    min={getTodayInputDate()}
                    value={form.date}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                    className="h-12 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 text-sm outline-none transition focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                  />
                </label>

                <div className="grid gap-2 md:col-span-2">
                  <FieldLabel>Preferred time slot</FieldLabel>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {TIME_SLOTS.map((slot) => {
                      const active = form.timeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, timeSlot: slot }))
                          }
                          className={`rounded-[1rem] border px-4 py-3 text-left text-sm font-medium transition ${
                            active
                              ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white shadow-[0_10px_24px_rgba(20,16,10,0.12)]"
                              : "border-[var(--border-soft)] bg-[#fcfbf8] text-[var(--text-primary)] hover:border-[#c29a72]/40 hover:bg-white"
                          }`}
                        >
                          {formatSlot(slot)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <FieldLabel>Payment method</FieldLabel>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, paymentMethod: "cash" }))
                      }
                      className={`rounded-[1rem] border p-4 text-left transition ${
                        form.paymentMethod === "cash"
                          ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white shadow-[0_10px_24px_rgba(20,16,10,0.12)]"
                          : "border-[var(--border-soft)] bg-[#fcfbf8] text-[var(--text-primary)] hover:border-[#c29a72]/40 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5" />
                        <div>
                          <p className="font-semibold">Cash on visit</p>
                          <p
                            className={`mt-1 text-sm ${
                              form.paymentMethod === "cash"
                                ? "text-white/72"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            Confirm booking first and pay at consultation time.
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          paymentMethod: "online",
                        }))
                      }
                      className={`rounded-[1rem] border p-4 text-left transition ${
                        form.paymentMethod === "online"
                          ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white shadow-[0_10px_24px_rgba(20,16,10,0.12)]"
                          : "border-[var(--border-soft)] bg-[#fcfbf8] text-[var(--text-primary)] hover:border-[#c29a72]/40 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-semibold">Online payment</p>
                          <p
                            className={`mt-1 text-sm ${
                              form.paymentMethod === "online"
                                ? "text-white/72"
                                : "text-[var(--text-secondary)]"
                            }`}
                          >
                            Create appointment first, then continue with payment
                            order.
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <label className="grid gap-2 md:col-span-2">
                  <FieldLabel>Additional notes</FieldLabel>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center text-[var(--text-secondary)]">
                      <NotebookPen className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-[var(--text-secondary)]" />
                    </div>
                    <textarea
                      placeholder="Any directions, site details, or special requests"
                      rows={5}
                      maxLength={500}
                      value={form.notes}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      className="h-14 w-full rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] !pl-12 !pr-4 text-[15px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:bg-white focus:ring-4 focus:ring-[#b88a5b]/10"
                    />
                  </div>
                  <div className="text-right text-xs text-[var(--text-secondary)]">
                    {form.notes.length}/500
                  </div>
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 rounded-full px-6"
                >
                  {submitting ? "Booking appointment..." : "Book Appointment"}
                </Button>

                <MessageBox message={message} success={messageSuccess} />
              </div>
            </form>

            {orderInfo ? (
              <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#8a6037]" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Online Payment Order Ready
                  </h3>
                </div>

                <div className="mt-4 grid gap-3 rounded-[1rem] bg-[#faf7f2] p-4 text-sm text-[var(--text-secondary)]">
                  <p>
                    <span className="font-medium text-[var(--text-primary)]">
                      Order ID:
                    </span>{" "}
                    {orderInfo.orderId}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-primary)]">
                      Amount:
                    </span>{" "}
                    ₹ {orderInfo.amount / 100}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-primary)]">
                      Currency:
                    </span>{" "}
                    {orderInfo.currency}
                  </p>
                  <p>
                    <span className="font-medium text-[var(--text-primary)]">
                      Razorpay Key:
                    </span>{" "}
                    {orderInfo.keyId}
                  </p>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="grid gap-6">
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)] xl:sticky xl:top-24">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#8a6037]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Booking Summary
                </h3>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="rounded-[1rem] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    Consultation Fee
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[var(--text-primary)]">
                    <IndianRupee className="h-4 w-4" />
                    <span className="text-2xl font-semibold tracking-[-0.04em]">
                      {visitFee}
                    </span>
                  </div>
                </div>

                <div className="rounded-[1rem] bg-[#faf7f2] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    Address Status
                  </p>
                  <p className="mt-2 font-medium text-[var(--text-primary)]">
                    {isAddressReady ? "Complete" : "Incomplete"}
                  </p>
                  <p className="mt-2 text-[var(--text-secondary)]">
                    {[
                      form.street.trim(),
                      form.city.trim(),
                      form.state.trim(),
                      form.pincode.trim(),
                    ]
                      .filter(Boolean)
                      .join(", ") || "Fill your address to continue smoothly."}
                  </p>
                </div>

                <div className="rounded-[1rem] bg-[#faf7f2] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    Selected Slot
                  </p>
                  <p className="mt-2 font-medium text-[var(--text-primary)]">
                    {formattedDate}
                  </p>
                  <p className="mt-1 text-[var(--text-secondary)]">
                    {form.timeSlot ? formatSlot(form.timeSlot) : "Pick a slot"}
                  </p>
                </div>

                <div className="rounded-[1rem] bg-[#faf7f2] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    Payment Choice
                  </p>
                  <p className="mt-2 font-medium text-[var(--text-primary)] capitalize">
                    {form.paymentMethod}
                  </p>
                  <p className="mt-1 text-[var(--text-secondary)]">
                    {form.paymentMethod === "online"
                      ? "Creates an online order after appointment creation."
                      : "Pay directly at the visit."}
                  </p>
                </div>

                {appointmentInfo ? (
                  <div className="rounded-[1rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <p className="font-semibold">Appointment Created</p>
                    <p className="mt-2">
                      Ticket: {appointmentInfo.ticketNumber}
                    </p>
                    <p className="mt-1">Status: {appointmentInfo.status}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#8a6037]" />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Helpful Notes
                </h3>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  "Enter a valid 6-digit pincode to auto-fill city and state.",
                  "Choose online payment only when you want to continue into payment flow immediately.",
                  "Keep street details specific so your consultation visit can be scheduled without confusion.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1rem] bg-[#faf7f2] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </PageShell>
    </AuthGuard>
  );
}
