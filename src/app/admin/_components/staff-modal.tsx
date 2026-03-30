import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { StaffFormState } from "../_lib/staff-form";

export function StaffModal({
  open,
  mode,
  form,
  setForm,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  form: StaffFormState;
  setForm: Dispatch<SetStateAction<StaffFormState>>;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-[rgba(10,10,10,0.55)] p-3 backdrop-blur-sm sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-center">
        <div className="flex h-full max-h-[95vh] w-full flex-col overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,#ffffff_0%,#faf7f2_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-[var(--border-soft)] px-4 py-4 sm:px-5 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    Staff
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-2xl">
                    {mode === "create" ? "Create staff member" : "Edit staff member"}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Create a staff profile and linked login account in one flow.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 md:px-6">
              <div className="grid gap-6">
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Full Name *</span>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. Aman Verma"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Phone *</span>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="e.g. 9876543210"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-medium">Email *</span>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="e.g. aman@SquareFoot.com"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-medium">
                      Password {mode === "create" ? "(optional)" : "(leave blank to keep current)"}
                    </span>
                    <input
                      type="text"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      placeholder={
                        mode === "create"
                          ? "Leave blank to auto-generate temporary password"
                          : "Enter only if you want to replace login password"
                      }
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-medium">
                      Service Areas
                    </span>
                    <textarea
                      rows={4}
                      value={form.serviceAreasText}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          serviceAreasText: e.target.value,
                        }))
                      }
                      placeholder={`492001\n492004\nShankar Nagar`}
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-medium">Notes</span>
                    <textarea
                      rows={5}
                      value={form.notes}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      placeholder="Optional notes about role, area coverage, or availability"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-[1rem] border border-[var(--border-soft)] bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isAvailable: e.target.checked,
                        }))
                      }
                    />
                    <span className="text-sm font-medium">
                      Available for assignment
                    </span>
                  </label>

                  <div className="rounded-[1rem] border border-[var(--border-soft)] bg-[#faf7f2] px-4 py-3 text-sm text-[var(--text-secondary)]">
                    If password is left blank during creation, the backend can generate a temporary password for staff login.
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border-soft)] bg-white/80 px-4 py-4 sm:px-5 md:px-6">
              <div className="grid gap-3 sm:grid-cols-2 sm:justify-end lg:flex">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-[var(--border-soft)] bg-white px-5 py-3 text-sm font-medium text-[var(--text-primary)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving
                    ? mode === "create"
                      ? "Creating..."
                      : "Saving..."
                    : mode === "create"
                    ? "Create Staff"
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}