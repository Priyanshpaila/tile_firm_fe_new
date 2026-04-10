"use client";

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

function TableShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-white shadow-[0_10px_30px_rgba(20,16,10,0.04)]">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

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
      description="Compact team table with linked account and service visibility."
      actions={
        <div className="flex flex-wrap gap-3">
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
        <TableShell>
          <table className="min-w-[1180px] w-full text-sm">
            <thead className="bg-[#faf7f2] text-left text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 font-medium">Staff</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Availability</th>
                <th className="px-4 py-3 font-medium">Login Account</th>
                <th className="px-4 py-3 font-medium">Service Areas</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {staffList.map((staff) => {
                const item = staff as LooseStaff;
                const hasLogin = !!item.userAccount;

                return (
                  <tr
                    key={staff._id}
                    className="border-t border-[var(--border-soft)] align-top transition hover:bg-[#fcfbf8]"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {item.name}
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {item.phone || "—"}
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {item.email || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.isAvailable === false
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.isAvailable === false ? "Unavailable" : "Available"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {hasLogin ? "Linked" : "Not linked"}
                        </p>
                        <p className="mt-1 text-xs">
                          {item.userAccount?.email || "—"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {item.serviceAreas?.length
                        ? item.serviceAreas.join(", ")
                        : "No service areas"}
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      <p className="max-w-[260px] leading-6">
                        {item.notes || "No internal notes."}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEditStaff(staff)}
                        className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-primary)]"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!staffList.length ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
                  >
                    No staff found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </TableShell>
      )}
    </SectionCard>
  );
}