"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";
import ThreeDRoom from "@/components/visualizer/three-d-room";
import { ProductStrip } from "@/components/visualizer/product-strip";
import { useVisualizerCatalog } from "@/components/visualizer/use-visualizer-catalog";
import { getProductPreview } from "@/components/visualizer/utils";
import { api } from "@/lib/api";

const SCENES = [
  { id: "living", name: "Living Room" },
  { id: "bathroom", name: "Bathroom" },
  { id: "kitchen", name: "Kitchen" },
] as const;

export default function Visualizer3DPage() {
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

  const [sceneId, setSceneId] = useState<(typeof SCENES)[number]["id"]>("living");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const activeScene = useMemo(
    () => SCENES.find((item) => item.id === sceneId) || SCENES[0],
    [sceneId],
  );

  const handleSave = async () => {
    if (!user || !selectedProduct) return;

    try {
      setSaving(true);
      setSaveMessage(null);

      await api.visualizer.save({
        name: `${activeScene.name} - ${selectedProduct.name}`,
        selectedTile: selectedProduct._id,
        viewState: {
          mode: "3d",
          sceneId: activeScene.id,
          sceneName: activeScene.name,
          categoryId: selectedCategory?._id,
          categoryName: selectedCategory?.name,
          surfaceType: selectedKind,
          tileImage: getProductPreview(selectedProduct),
        },
      });

      setSaveMessage("3D visualization saved successfully.");
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : "Failed to save 3D visualization.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title="3D Visualizer"
      description="Apply live products on a lightweight 3D room. Use DB-driven categories and products, with hardcoded optimized scenes."
      fullWidth
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.45fr_1fr]">
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
                href={ROUTES.visualizer}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 text-sm font-medium text-[var(--text-primary)]"
              >
                Go 2D
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
                      onClick={() => setSelectedCategoryId(category._id)}
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
              Choose Scene
            </h2>

            <div className="mt-4 grid gap-3">
              {SCENES.map((scene) => {
                const active = scene.id === sceneId;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => setSceneId(scene.id)}
                    className={`rounded-[1.2rem] border p-3 text-left transition ${
                      active
                        ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white"
                        : "border-[var(--border-soft)] bg-[#fcfbf8]"
                    }`}
                  >
                    <p className="font-semibold">{scene.name}</p>
                    <p className={`mt-1 text-sm ${active ? "text-white/72" : "text-[var(--text-secondary)]"}`}>
                      Lightweight scene optimized for live texture preview.
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          <ThreeDRoom
            sceneId={sceneId}
            tileUrl={getProductPreview(selectedProduct)}
            surfaceType={selectedKind}
          />

          <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Active Setup
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                  {activeScene.name} · {selectedKind}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {selectedProduct?.name || "Select a product"} on the selected 3D scene
                </p>
              </div>

              {user ? (
                <Button onClick={() => void handleSave()} disabled={saving || !selectedProduct}>
                  {saving ? "Saving..." : "Save 3D Visualization"}
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

        <section className="grid gap-4">
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