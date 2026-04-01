"use client";

import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";
import { useMemo, useState } from "react";
import type { Category } from "@/types";
import { api, resolveUploadUrl } from "@/lib/api";
import {
  Boxes,
  ImagePlus,
  IndianRupee,
  Layers3,
  Loader2,
  Package2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import {
  PRODUCT_FINISH_OPTIONS,
  PRODUCT_MATERIAL_OPTIONS,
  PRODUCT_USAGE_OPTIONS,
  TILE_SIZE_OPTIONS,
  type ProductFormState,
} from "../_lib/product-form";
import { ArrayToggleGroup } from "./array-toggle-group";

const inputClass =
  "h-12 w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:ring-4 focus:ring-[#b88a5b]/10";

const textareaClass =
  "w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:ring-4 focus:ring-[#b88a5b]/10";

function parseImageList(text: string) {
  return text
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toImagesText(images: string[]) {
  return images.join("\n");
}

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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const imageList = useMemo(() => parseImageList(form.imagesText), [form.imagesText]);

  if (!open) return null;

  const updateImages = (next: string[]) => {
    setForm((prev) => ({
      ...prev,
      imagesText: toImagesText(Array.from(new Set(next))),
    }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadMessage("");

    try {
      setUploadingImages(true);

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("uploadType", "product_image");

      const res = await api.uploads.multiple(formData);

      const uploadedUrls = (
        res.data.fileUrls ||
        res.data.uploads?.map((item) => item.url) ||
        []
      )
        .map((url) => resolveUploadUrl(url))
        .filter(Boolean);

      if (!uploadedUrls.length) {
        throw new Error("Images uploaded but no file URLs were returned.");
      }

      updateImages([...imageList, ...uploadedUrls]);
      setUploadMessage(
        uploadedUrls.length === 1
          ? "1 image uploaded successfully."
          : `${uploadedUrls.length} images uploaded successfully.`,
      );
    } catch (err) {
      setUploadMessage(
        err instanceof Error ? err.message : "Image upload failed.",
      );
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    updateImages(imageList.filter((_, i) => i !== index));
  };

  const makePrimary = (index: number) => {
    const selected = imageList[index];
    if (!selected) return;

    const reordered = [selected, ...imageList.filter((_, i) => i !== index)];
    updateImages(reordered);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-[rgba(10,10,10,0.62)] p-3 backdrop-blur-md sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
        <div className="flex h-full max-h-[95vh] w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1e8_100%)] shadow-[0_35px_100px_rgba(0,0,0,0.28)]">
          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-[var(--border-soft)] bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dcc9] bg-[#fff7ed] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a6037]">
                    <Package2 className="h-3.5 w-3.5" />
                    Tile Product
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {mode === "create" ? "Create Product" : "Edit Product"}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Cleaner layout, stronger hierarchy, image upload with preview, and faster catalog entry.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[#faf7f2]"
                >
                  <X className="h-4 w-4" />
                  Close
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
                <div className="grid gap-6">
                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  <section className="rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Layers3 className="h-4.5 w-4.5 text-[#8a6037]" />
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Core Details
                      </h4>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Name *
                        </span>
                        <input
                          className={inputClass}
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Beige Marble Porcelain"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          SKU *
                        </span>
                        <input
                          className={inputClass}
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
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Description *
                        </span>
                        <textarea
                          rows={4}
                          className={textareaClass}
                          value={form.description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Short product story, finish feel, room fit, and what makes it premium."
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Category *
                        </span>
                        <select
                          className={inputClass}
                          value={form.category}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
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
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Material *
                        </span>
                        <select
                          className={inputClass}
                          value={form.material}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              material: e.target.value,
                            }))
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
                    </div>
                  </section>

                  <section className="rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <IndianRupee className="h-4.5 w-4.5 text-[#8a6037]" />
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Pricing & Specs
                      </h4>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Price *
                        </span>
                        <input
                          className={inputClass}
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, price: e.target.value }))
                          }
                          placeholder="0.00"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Discount Price
                        </span>
                        <input
                          className={inputClass}
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
                          placeholder="0.00"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Thickness
                        </span>
                        <input
                          className={inputClass}
                          value={form.thickness}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              thickness: e.target.value,
                            }))
                          }
                          placeholder="8 mm"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Box Coverage
                        </span>
                        <input
                          className={inputClass}
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
                          placeholder="16"
                        />
                      </label>

                      <label className="grid gap-2 md:col-span-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Pieces Per Box
                        </span>
                        <input
                          className={inputClass}
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
                          placeholder="4"
                        />
                      </label>
                    </div>
                  </section>

                  <section className="rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-[#8a6037]" />
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Product Attributes
                      </h4>
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
                  </section>
                </div>

                <div className="grid gap-6">
                  <section className="rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <ImagePlus className="h-4.5 w-4.5 text-[#8a6037]" />
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Product Images
                      </h4>
                    </div>

                    <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.4rem] border border-dashed border-[#d9c7b2] bg-[#fcf7f0] px-4 py-8 text-center transition hover:border-[#b88a5b] hover:bg-[#fffaf4]">
                      {uploadingImages ? (
                        <Loader2 className="h-8 w-8 animate-spin text-[#8a6037]" />
                      ) : (
                        <UploadCloud className="h-8 w-8 text-[#8a6037]" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {uploadingImages ? "Uploading images..." : "Upload product images"}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          PNG, JPG, or WebP. You can select multiple files at once.
                        </p>
                      </div>
                      <span className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
                        Choose files
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>

                    {uploadMessage ? (
                      <div
                        className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                          uploadMessage.toLowerCase().includes("success")
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {uploadMessage}
                      </div>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{imageList.length} image(s) attached</span>
                      <span>First image becomes the primary cover</span>
                    </div>

                    {imageList.length ? (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {imageList.map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="group overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-[#faf7f2]"
                          >
                            <div className="relative aspect-square">
                              <img
                                src={resolveUploadUrl(image)}
                                alt={`Product ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                              {index === 0 ? (
                                <span className="absolute left-2 top-2 rounded-full bg-[rgba(23,20,17,0.88)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                                  Cover
                                </span>
                              ) : null}
                            </div>

                            <div className="grid gap-2 p-2">
                              {index !== 0 ? (
                                <button
                                  type="button"
                                  onClick={() => makePrimary(index)}
                                  className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[#f7efe5]"
                                >
                                  Make cover
                                </button>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-[1.2rem] border border-[var(--border-soft)] bg-[#faf7f2] px-4 py-5 text-sm text-[var(--text-secondary)]">
                        No product images uploaded yet.
                      </div>
                    )}
                  </section>

                  <section className="rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Boxes className="h-4.5 w-4.5 text-[#8a6037]" />
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Availability
                      </h4>
                    </div>

                    <div className="grid gap-3">
                      <label className="flex items-center gap-3 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 py-3">
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
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          In stock
                        </span>
                      </label>

                      <label className="flex items-center gap-3 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 py-3">
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
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Featured product
                        </span>
                      </label>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border-soft)] bg-white/85 px-4 py-4 backdrop-blur sm:px-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-[var(--border-soft)] bg-white px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[#faf7f2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
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