import { Loader } from "@/components/ui/loader";
import type { Category } from "@/types";
import { SectionCard } from "./section-card";

type LooseCategory = Category & {
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

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
      description="Responsive category cards with better hierarchy and actions."
      actions={
        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
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
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {categories.map((category) => {
            const item = category as LooseCategory;

            return (
              <article
                key={category._id}
                className="overflow-hidden rounded-[1.4rem] border border-[var(--border-soft)] bg-white shadow-[0_10px_30px_rgba(20,16,10,0.04)]"
              >
                {item.image ? (
                  <div className="aspect-[16/8] overflow-hidden bg-[#f6f2eb]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/8] bg-[linear-gradient(135deg,#f6f2eb_0%,#eee4d7_100%)]" />
                )}

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                        {item.name}
                      </h3>
                      <p className="mt-1 break-all text-sm text-[var(--text-secondary)]">
                        {item.slug || "No slug"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        item.isActive === false
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </div>

                  <p className="mt-4 min-h-[72px] text-sm leading-6 text-[var(--text-secondary)]">
                    {item.description || "No description added yet."}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => onEditCategory(category)}
                      className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
                    >
                      Edit Category
                    </button>

                    <button
                      onClick={() => onDeleteCategory(category)}
                      className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {!categories.length ? (
            <div className="rounded-[1.3rem] border border-[var(--border-soft)] bg-white px-4 py-10 text-center text-sm text-[var(--text-secondary)] sm:col-span-2 2xl:col-span-3">
              No categories found.
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}