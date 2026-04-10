"use client";

import type { Category } from "@/types";
import { Loader } from "@/components/ui/loader";
import { SectionCard } from "./section-card";

type LooseCategory = Category & {
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

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

export function AdminCategoriesTab({
  categories,
  loading,
  error,
  onRefresh,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}: {
  categories: Category[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}) {
  return (
    <SectionCard
      title="Category Management"
      description="Compact table layout for easier category administration."
      actions={
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRefresh}
            className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
          >
            Refresh
          </button>
          <button
            onClick={onCreateCategory}
            className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add Category
          </button>
        </div>
      }
    >
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader label="Loading categories..." />
      ) : (
        <TableShell>
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-[#faf7f2] text-left text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => {
                const item = category as LooseCategory;

                return (
                  <tr
                    key={category._id}
                    className="border-t border-[var(--border-soft)] align-top transition hover:bg-[#fcfbf8]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex min-w-[220px] items-start gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f6f2eb]">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {item.slug || "—"}
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      <p className="max-w-[380px] leading-6">
                        {item.description || "No description added yet."}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.isActive === false
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex min-w-[160px] gap-2">
                        <button
                          onClick={() => onEditCategory(category)}
                          className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-primary)]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onDeleteCategory(category)}
                          className="rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!categories.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
                  >
                    No categories found.
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