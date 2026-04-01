"use client";

import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";
import { useState } from "react";
import { api, resolveUploadUrl } from "@/lib/api";
import {
  ImagePlus,
  Layers3,
  Loader2,
  Sparkles,
  Tag,
  UploadCloud,
  X,
} from "lucide-react";
import type { CategoryFormState } from "../_lib/category-form";

const inputClass =
  "h-12 w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:ring-4 focus:ring-[#b88a5b]/10";

const textareaClass =
  "w-full rounded-2xl border border-[var(--border-soft)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/70 focus:border-[#b88a5b] focus:ring-4 focus:ring-[#b88a5b]/10";

export function CategoryModal({
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
  form: CategoryFormState;
  setForm: Dispatch<SetStateAction<CategoryFormState>>;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  if (!open) return null;

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadMessage("");

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);

      // using product_image so this works with your current backend enum
      formData.append("uploadType", "product_image");

      const res = await api.uploads.single(formData);
      const rawUrl = res.data.upload?.url || res.data.fileUrl || "";

      if (!rawUrl) {
        throw new Error("Image uploaded but no file URL was returned.");
      }

      const fullUrl = resolveUploadUrl(rawUrl);

      setForm((prev) => ({
        ...prev,
        image: fullUrl,
      }));

      setUploadMessage("Category image uploaded successfully.");
    } catch (err) {
      setUploadMessage(
        err instanceof Error ? err.message : "Category image upload failed.",
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-[rgba(10,10,10,0.62)] p-3 backdrop-blur-md sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-4xl items-center justify-center">
        <div className="flex h-full max-h-[95vh] w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1e8_100%)] shadow-[0_35px_100px_rgba(0,0,0,0.28)]">
          <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-[var(--border-soft)] bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#e8dcc9] bg-[#fff7ed] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a6037]">
                    <Tag className="h-3.5 w-3.5" />
                    Category
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {mode === "create" ? "Create Category" : "Edit Category"}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Cleaner structure, image upload with preview, and better spacing for admin workflows.
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
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
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
                        Category Details
                      </h4>
                    </div>

                    <div className="grid gap-4">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Category Name *
                        </span>
                        <input
                          className={inputClass}
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="e.g. Bathroom Tiles"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Slug
                        </span>
                        <input
                          className={inputClass}
                          value={form.slug}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, slug: e.target.value }))
                          }
                          placeholder="e.g. bathroom-tiles"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Description
                        </span>
                        <textarea
                          rows={6}
                          className={textareaClass}
                          value={form.description}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Short description for this category"
                        />
                      </label>
                    </div>
                  </section>

                  <section className="rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-[#8a6037]" />
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Visibility
                      </h4>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex items-center gap-3 rounded-[1rem] border border-[var(--border-soft)] bg-[#fcfbf8] px-4 py-3">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Active category
                        </span>
                      </label>

                      <div className="rounded-[1rem] border border-[var(--border-soft)] bg-[#faf7f2] px-4 py-3 text-sm text-[var(--text-secondary)]">
                        This category can later connect directly with product filters, homepage sections, and collection cards.
                      </div>
                    </div>
                  </section>
                </div>

                <div className="grid gap-6">
                  <section className="rounded-[1.6rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_10px_30px_rgba(20,16,10,0.04)] sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <ImagePlus className="h-4.5 w-4.5 text-[#8a6037]" />
                      <h4 className="text-base font-semibold text-[var(--text-primary)]">
                        Category Image
                      </h4>
                    </div>

                    <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.4rem] border border-dashed border-[#d9c7b2] bg-[#fcf7f0] px-4 py-8 text-center transition hover:border-[#b88a5b] hover:bg-[#fffaf4]">
                      {uploadingImage ? (
                        <Loader2 className="h-8 w-8 animate-spin text-[#8a6037]" />
                      ) : (
                        <UploadCloud className="h-8 w-8 text-[#8a6037]" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {uploadingImage ? "Uploading image..." : "Upload category image"}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          PNG, JPG, or WebP. The uploaded URL will be stored automatically.
                        </p>
                      </div>
                      <span className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)]">
                        Choose file
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
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

                    {form.image ? (
                      <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-[#faf7f2]">
                        <div className="aspect-[4/3]">
                          <img
                            src={resolveUploadUrl(form.image)}
                            alt={form.name || "Category preview"}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                image: "",
                              }))
                            }
                            className="w-full rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Remove image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-[1.2rem] border border-[var(--border-soft)] bg-[#faf7f2] px-4 py-5 text-sm text-[var(--text-secondary)]">
                        No category image uploaded yet.
                      </div>
                    )}
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
                  disabled={saving || uploadingImage}
                  className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? mode === "create"
                      ? "Creating..."
                      : "Saving..."
                    : mode === "create"
                      ? "Create Category"
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