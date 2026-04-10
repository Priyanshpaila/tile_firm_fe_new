"use client";

import { Loader } from "@/components/ui/loader";
import type { User } from "@/types";
import { SectionCard } from "./section-card";

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

export function AdminUsersTab({
  users,
  loading,
  error,
  onToggleUser,
}: {
  users: User[];
  loading: boolean;
  error: string;
  onToggleUser: (userId: string) => void;
}) {
  return (
    <SectionCard
      title="User Management"
      description="Compact user table with quick status control."
    >
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader label="Loading users..." />
      ) : (
        <TableShell>
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-[#faf7f2] text-left text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-[var(--border-soft)] transition hover:bg-[#fcfbf8]"
                >
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                    {user.name}
                  </td>

                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#f3eee6] px-2.5 py-1 text-xs font-medium text-[#5a5047]">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        typeof user.isActive === "boolean"
                          ? user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          : "bg-[#f3eee6] text-[#5a5047]"
                      }`}
                    >
                      {typeof user.isActive === "boolean"
                        ? user.isActive
                          ? "Active"
                          : "Inactive"
                        : "Unknown"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => onToggleUser(user._id)}
                      className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-3 py-2 text-xs font-semibold text-white"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}

              {!users.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
                  >
                    No users found.
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