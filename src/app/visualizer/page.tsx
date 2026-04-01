"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";
import { useVisualizerCatalog } from "@/components/visualizer/use-visualizer-catalog";
import { ProductStrip } from "@/components/visualizer/product-strip";
import { getProductPreview } from "@/components/visualizer/utils";
import {
  getTemplatesForSurfaceKind,
  type RoomSurfaceId,
} from "@/components/visualizer/room-image-templates";
import { RoomImagePreview } from "@/components/visualizer/room-image-preview";
import { api } from "@/lib/api";

export default function VisualizerPage() {
  const user = useAuthStore((state) => state.user);

  const {
    categories,
    selectedCategory,
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    selectedProduct,
    selectedProductId,
    setSelectedProductId,
    selectedKind,
    loadingCategories,
    loadingProducts,
    error,
  } = useVisualizerCatalog();

  const templates = useMemo(
    () => getTemplatesForSurfaceKind(selectedKind),
    [selectedKind],
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [activeSurface, setActiveSurface] = useState<RoomSurfaceId>("floor");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!templates.length) {
      setSelectedTemplateId("");
      return;
    }

    if (!templates.some((item) => item.id === selectedTemplateId)) {
      setSelectedTemplateId(templates[0].id);
      setActiveSurface(templates[0].surfaces[0]?.id || "floor");
    }
  }, [templates, selectedTemplateId]);

  const selectedTemplate =
    templates.find((item) => item.id === selectedTemplateId) || templates[0];

  const handleSave = async () => {
    if (!user || !selectedProduct || !selectedTemplate) return;

    try {
      setSaving(true);
      setSaveMessage(null);

      await api.visualizer.save({
        name: `${selectedTemplate.name} - ${selectedProduct.name}`,
        selectedTile: selectedProduct._id,
        viewState: {
          mode: "2d-room-image",
          categoryId: selectedCategory?._id,
          categoryName: selectedCategory?.name,
          surfaceKind: selectedKind,
          templateId: selectedTemplate.id,
          templateName: selectedTemplate.name,
          activeSurface,
          tileImage: getProductPreview(selectedProduct),
        },
      });

      setSaveMessage("2D visualizer state saved successfully.");
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : "Failed to save visualization.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title="2D Visualizer"
      description="Choose a category, pick a real room template, click the exact surface, and apply the tile there."
      fullWidth
    >
      <div className="mx-auto grid max-w-[1720px] gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px] 2xl:grid-cols-[340px_minmax(0,1fr)_380px]">
        <section className="grid gap-4">
          <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Step 1
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                  Choose Category
                </h2>
              </div>

              <Link
                href={ROUTES.visualizer3d}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 text-sm font-medium text-[var(--text-primary)]"
              >
                Go 3D
                <ArrowRight size={15} />
              </Link>
            </div>

            {loadingCategories ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading categories...
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = category._id === selectedCategoryId;
                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(category._id);
                        setSelectedTemplateId("");
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white"
                          : "border border-[var(--border-soft)] bg-[#faf7f2] text-[var(--text-primary)]"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            )}

            {error ? (
              <div className="mt-4 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Step 2
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              Pick Room Template
            </h2>

            <div className="mt-4 grid gap-3">
              {templates.map((template) => {
                const active = selectedTemplate?.id === template.id;

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setActiveSurface(template.surfaces[0]?.id || "floor");
                    }}
                    className={`rounded-[1.2rem] border p-3 text-left transition ${
                      active
                        ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white"
                        : "border-[var(--border-soft)] bg-[#fcfbf8]"
                    }`}
                  >
                    <p className="font-semibold">{template.name}</p>
                    <p
                      className={`mt-1 text-sm ${
                        active ? "text-white/72" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {template.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:sticky xl:top-24 xl:self-start">
          {selectedTemplate ? (
            <RoomImagePreview
              template={selectedTemplate}
              activeSurface={activeSurface}
              tileUrl={getProductPreview(selectedProduct)}
              onSurfaceSelect={setActiveSurface}
            />
          ) : (
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white px-4 py-16 text-center text-sm text-[var(--text-secondary)]">
              No matching room template found.
            </div>
          )}

          <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Active Surface
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                  {selectedTemplate?.name || "Template"} · {activeSurface}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {selectedProduct?.name || "Select a tile product"} will be applied only on the selected hotspot.
                </p>
              </div>

              {user ? (
                <Button
                  onClick={() => void handleSave()}
                  disabled={saving || !selectedProduct || !selectedTemplate}
                >
                  {saving ? "Saving..." : "Save Visualization"}
                </Button>
              ) : (
                <Link
                  href={ROUTES.login}
                  className="inline-flex h-11 items-center rounded-full border border-[var(--border-soft)] px-5 text-sm font-semibold text-[var(--text-primary)]"
                >
                  Login to Save
                </Link>
              )}
            </div>

            {saveMessage ? (
              <div className="mt-4 flex items-start gap-3 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{saveMessage}</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Step 3
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              Choose Product
            </h2>

            {loadingProducts ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading products...
              </div>
            ) : (
              <div className="mt-4">
                <ProductStrip
                  products={products}
                  selectedProductId={selectedProductId}
                  onSelect={setSelectedProductId}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}