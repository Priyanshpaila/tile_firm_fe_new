import { Loader } from "@/components/ui/loader";
import type { Staff } from "@/types";
import { SectionCard } from "./section-card";

type LooseStaff = Staff & {
  email?: string;
  phone?: string;
  isAvailable?: boolean;
  notes?: string;
  serviceAreas?: string[];
  userAccount?: {
    _id?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  } | null;
};

type StaffCredentialNotice = {
  email: string;
  temporaryPassword?: string;
} | null;

export function AdminStaffTab({
  staffList,
  loading,
  error,
  onRefresh,
  onCreateStaff,
  onEditStaff,
  staffCredentialNotice,
  onClearCredentialNotice,
}: {
  staffList: Staff[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onCreateStaff: () => void;
  onEditStaff: (staff: Staff) => void;
  staffCredentialNotice: StaffCredentialNotice;
  onClearCredentialNotice: () => void;
}) {
  return (
    <SectionCard
      title="Staff Management"
      description="Team records with assignment status and linked login-account visibility."
      actions={
        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
          <button
            onClick={onRefresh}
            className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
          >
            Refresh
          </button>
          <button
            onClick={onCreateStaff}
            className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add Staff
          </button>
        </div>
      }
    >
      {staffCredentialNotice ? (
        <div className="mb-4 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-[0_10px_24px_rgba(16,185,129,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold">Staff login account ready</p>
              <p className="mt-1">
                Email:{" "}
                <span className="font-medium">{staffCredentialNotice.email}</span>
              </p>

              {staffCredentialNotice.temporaryPassword ? (
                <p className="mt-1">
                  Temporary password:{" "}
                  <span className="font-semibold">
                    {staffCredentialNotice.temporaryPassword}
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-emerald-800/80">
                  Login account updated. Existing password remains in use.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClearCredentialNotice}
              className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-medium text-emerald-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader label="Loading staff..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {staffList.map((staff) => {
            const item = staff as LooseStaff;
            const hasLogin = !!item.userAccount;

            return (
              <article
                key={staff._id}
                className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {item.phone || "No phone"}
                    </p>
                    {item.email ? (
                      <p className="mt-1 break-all text-sm text-[var(--text-secondary)]">
                        {item.email}
                      </p>
                    ) : null}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      item.isAvailable === false
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.isAvailable === false ? "Unavailable" : "Available"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 rounded-[1rem] bg-[#faf7f2] p-3 text-sm">
                  <div>
                    <p className="text-[var(--text-secondary)]">Login Account</p>
                    <p className="mt-1 font-medium text-[var(--text-primary)]">
                      {hasLogin ? "Linked" : "Not linked"}
                    </p>
                    {item.userAccount?.email ? (
                      <p className="mt-1 break-all text-xs text-[var(--text-secondary)]">
                        {item.userAccount.email}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-[var(--text-secondary)]">Service Areas</p>
                    <p className="mt-1 font-medium text-[var(--text-primary)]">
                      {item.serviceAreas?.length
                        ? item.serviceAreas.join(", ")
                        : "No service areas added"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-3 text-sm text-[var(--text-secondary)]">
                  {item.notes || "No internal notes added for this staff member."}
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => onEditStaff(staff)}
                    className="w-full rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
                  >
                    Edit Staff
                  </button>
                </div>
              </article>
            );
          })}

          {!staffList.length ? (
            <div className="rounded-[1.3rem] border border-[var(--border-soft)] bg-white px-4 py-10 text-center text-sm text-[var(--text-secondary)] sm:col-span-2 2xl:col-span-3">
              No staff found.
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}