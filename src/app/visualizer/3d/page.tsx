"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, Move3D, SlidersHorizontal } from "lucide-react";

import ThreeDRoom from "@/components/visualizer/scenes/three-d-room";
import { VisualizerMaterialControls } from "@/components/visualizer/ui/visualizer-material-controls";
import { VisualizerProductCatalog } from "@/components/visualizer/ui/visualizer-product-catalog";
import { useVisualizerCatalog } from "@/components/visualizer/hooks/use-visualizer-catalog";
import { getProductPreview } from "@/components/visualizer/utils";
import type {
  AppliedTiles,
  SurfaceMaterialSetting,
  SurfaceMaterialSettings,
  SurfaceType,
} from "@/components/visualizer/types";
import {
  createDefaultSurfaceMaterialSetting,
  createDefaultSurfaceMaterialSettings,
} from "@/components/visualizer/types";

const SURFACES: SurfaceType[] = ["floor", "wall", "ceiling"];

export default function Visualizer3DPage() {
  const {
    categories,
    products,
    selectedProductId,
    setSelectedProductId,
    selectedSurface,
    setSelectedSurface,
  } = useVisualizerCatalog();

  const [appliedTiles, setAppliedTiles] = useState<AppliedTiles>({});
  const [materialSettings, setMaterialSettings] =
    useState<SurfaceMaterialSettings>(createDefaultSurfaceMaterialSettings());

  const handleSelect = (id: string) => {
    const product = products.find((item) => item._id === id);
    const texture = getProductPreview(product);

    if (!texture) return;

    setSelectedProductId(id);
    setAppliedTiles((prev) => ({
      ...prev,
      [selectedSurface]: texture,
    }));
  };

  const handleMaterialChange = (patch: Partial<SurfaceMaterialSetting>) => {
    setMaterialSettings((prev) => ({
      ...prev,
      [selectedSurface]: {
        ...prev[selectedSurface],
        ...patch,
      },
    }));
  };

  const handleResetMaterial = () => {
    setMaterialSettings((prev) => ({
      ...prev,
      [selectedSurface]: createDefaultSurfaceMaterialSetting(),
    }));
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f6f3ee] text-neutral-900">
      <header className="flex h-[72px] items-center justify-between px-4 md:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            3D Visualizer
          </h1>
          <p className="mt-1 text-sm text-neutral-500 md:text-base">
            Orbit around the room and preview tiles live.
          </p>
        </div>

        <Link
          href="/visualizer"
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </header>

      <main className="h-[calc(100dvh-72px)] px-4 pb-4 md:px-6 md:pb-6">
        <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT: VIEWER */}
          <section className="min-w-0 min-h-0">
            <div className="h-full rounded-[30px] bg-white p-2 shadow-sm ring-1 ring-black/5">
              <div className="relative h-full min-h-0 overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top,#f7f3ec_0%,#eee7dc_45%,#e7ded0_100%)]">
                <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur">
                  <Move3D size={14} />
                  Drag to rotate
                </div>

                <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur">
                  <Layers size={14} />
                  Editing{" "}
                  <span className="font-semibold capitalize">
                    {selectedSurface}
                  </span>
                </div>

                <ThreeDRoom
                  modelKey="cozy_living"
                  materialSettings={materialSettings}
                  appliedTiles={appliedTiles}
                />
              </div>
            </div>
          </section>

          {/* RIGHT: SIDEBAR */}
          <aside className="min-w-0 min-h-0">
            <div className="grid h-full min-h-0 gap-4 grid-rows-[minmax(280px,42%)_minmax(0,1fr)]">
              {/* TOP: CONTROLS */}
              <div className="min-h-0 overflow-y-auto pr-1">
                <div className="space-y-4">
                  <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <div className="mb-3 flex items-center gap-2">
                      <Layers size={16} />
                      <p className="text-sm font-semibold text-neutral-900">
                        Surface
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {SURFACES.map((surface) => (
                        <button
                          key={surface}
                          onClick={() => setSelectedSurface(surface)}
                          className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                            selectedSurface === surface
                              ? "bg-black text-white"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          {surface}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <div className="mb-3 flex items-center gap-2">
                      <SlidersHorizontal size={16} />
                      <p className="text-sm font-semibold text-neutral-900">
                        Material controls
                      </p>
                    </div>

                    <VisualizerMaterialControls
                      selectedSurface={selectedSurface}
                      settings={materialSettings[selectedSurface]}
                      onChange={handleMaterialChange}
                      onReset={handleResetMaterial}
                      compact
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM: PRODUCT CATALOG */}
              <div className="min-h-0 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Tile library</h2>
                    <p className="text-sm text-neutral-500">
                      Choose a tile for the selected surface.
                    </p>
                  </div>

                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-700">
                    {selectedSurface}
                  </span>
                </div>

                <div className="h-[calc(100%-56px)] overflow-y-auto pr-1">
                  <VisualizerProductCatalog
                    categories={categories}
                    products={products}
                    selectedProductId={selectedProductId}
                    onSelect={handleSelect}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}