import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Category } from "@/types";
import {
  PRODUCT_FINISH_OPTIONS,
  PRODUCT_MATERIAL_OPTIONS,
  PRODUCT_USAGE_OPTIONS,
  TILE_SIZE_OPTIONS,
  type ProductFormState,
} from "../_lib/product-form";
import { ArrayToggleGroup } from "./array-toggle-group";

export function ProductModal({
  open,
  mode,
  form,
  setForm,
  categories,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  form: ProductFormState;
  setForm: Dispatch<SetStateAction<ProductFormState>>;
  categories: Category[];
  saving: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-[rgba(10,10,10,0.55)] p-3 backdrop-blur-sm sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-center">
        <div className="flex h-full max-h-[95vh] w-full flex-col overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,#ffffff_0%,#faf7f2_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-[var(--border-soft)] px-4 py-4 sm:px-5 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    Tile Product
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-2xl">
                    {mode === "create" ? "Create product" : "Edit product"}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Product form optimized for smaller screens and larger desktop workflows.
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
                    <span className="text-sm font-medium">Name *</span>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Beige Marble Porcelain"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">SKU *</span>
                    <input
                      value={form.sku}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          sku: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="TV-BMP-001"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-medium">Description *</span>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Category *</span>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, category: e.target.value }))
                      }
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Material *</span>
                    <select
                      value={form.material}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, material: e.target.value }))
                      }
                    >
                      <option value="">Select material</option>
                      {PRODUCT_MATERIAL_OPTIONS.map((material) => (
                        <option key={material} value={material}>
                          {material}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Price *</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, price: e.target.value }))
                      }
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Discount Price</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.discountPrice}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          discountPrice: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Thickness</span>
                    <input
                      value={form.thickness}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          thickness: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Box Coverage</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.boxCoverage}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          boxCoverage: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Pieces Per Box</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.piecesPerBox}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          piecesPerBox: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-medium">Images *</span>
                    <textarea
                      rows={4}
                      value={form.imagesText}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          imagesText: e.target.value,
                        }))
                      }
                      placeholder={`https://...\nhttps://...`}
                    />
                  </label>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  <ArrayToggleGroup
                    title="Finishes *"
                    options={PRODUCT_FINISH_OPTIONS}
                    selected={form.finishes}
                    onChange={(next) =>
                      setForm((prev) => ({ ...prev, finishes: next }))
                    }
                  />
                  <ArrayToggleGroup
                    title="Usages *"
                    options={PRODUCT_USAGE_OPTIONS}
                    selected={form.usages}
                    onChange={(next) =>
                      setForm((prev) => ({ ...prev, usages: next }))
                    }
                  />
                  <ArrayToggleGroup
                    title="Sizes *"
                    options={TILE_SIZE_OPTIONS}
                    selected={form.sizes}
                    onChange={(next) =>
                      setForm((prev) => ({ ...prev, sizes: next }))
                    }
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-[1rem] border border-[var(--border-soft)] bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          inStock: e.target.checked,
                        }))
                      }
                    />
                    <span className="text-sm font-medium">In stock</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-[1rem] border border-[var(--border-soft)] bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }))
                      }
                    />
                    <span className="text-sm font-medium">Featured product</span>
                  </label>
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
                    ? "Create Product"
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