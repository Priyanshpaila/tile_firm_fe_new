import { Loader } from "@/components/ui/loader";
import type { User } from "@/types";
import { SectionCard } from "./section-card";

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
      description="User records in responsive cards with compact status actions."
    >
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader label="Loading users..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {users.map((user) => (
            <article
              key={user._id}
              className="rounded-[1.4rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {user.name}
                  </h3>
                  <p className="mt-1 break-all text-sm text-[var(--text-secondary)]">
                    {user.email}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#f3eee6] px-3 py-1 text-xs font-medium text-[#5a5047]">
                  {user.role}
                </span>
              </div>

              <div className="mt-4 rounded-[1rem] bg-[#faf7f2] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  Account status
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                  {typeof user.isActive === "boolean"
                    ? user.isActive
                      ? "Active"
                      : "Inactive"
                    : "Unknown"}
                </p>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => onToggleUser(user._id)}
                  className="w-full rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Toggle Status
                </button>
              </div>
            </article>
          ))}

          {!users.length ? (
            <div className="rounded-[1.3rem] border border-[var(--border-soft)] bg-white px-4 py-10 text-center text-sm text-[var(--text-secondary)] sm:col-span-2 2xl:col-span-3">
              No users found.
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}