"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

import TwoDRoom from "@/components/visualizer/scenes/two-d-room";
import { VisualizerMaterialControls } from "@/components/visualizer/ui/visualizer-material-controls";
import { VisualizerProductCatalog } from "@/components/visualizer/ui/visualizer-product-catalog";
import { useVisualizerCatalog } from "@/components/visualizer/hooks/use-visualizer-catalog";
import { getProductPreview } from "@/components/visualizer/utils";
import type {
  AppliedTiles,
  SurfaceType,
} from "@/components/visualizer/types";

const SURFACES: SurfaceType[] = ["floor", "wall", "ceiling"];

export default function VisualizerPage() {
  const {
    categories,
    products,
    selectedProductId,
    setSelectedProductId,
    selectedSurface,
    setSelectedSurface,
  } = useVisualizerCatalog();

  const [tileScale, setTileScale] = useState(1);
  const [appliedTiles, setAppliedTiles] = useState<AppliedTiles>({});

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

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-neutral-900">
      <header className="flex items-center justify-between px-4 pb-4 pt-4 md:px-6 md:pb-5 md:pt-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tile Visualizer
          </h1>
          <p className="mt-1 text-sm text-neutral-500 md:text-base">
            Fixed view for fast surface previewing.
          </p>
        </div>

        <Link
          href="/visualizer/3d"
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Go 3D <ArrowRight size={16} />
        </Link>
      </header>

      <main className="grid gap-4 px-4 pb-4 md:px-6 md:pb-6 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="space-y-4">
          <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="mb-4 flex items-center gap-2">
              <Layers size={16} />
              <p className="text-sm font-semibold text-neutral-900">Surface</p>
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

            <div className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
              Applying to:{" "}
              <span className="font-semibold capitalize text-neutral-900">
                {selectedSurface}
              </span>
            </div>
          </div>

          <VisualizerMaterialControls
            tileScale={tileScale}
            onTileScaleChange={setTileScale}
          />
        </aside>

        <section className="rounded-[32px] bg-white p-2 shadow-sm ring-1 ring-black/5">
          <div className="h-[58vh] min-h-[420px] overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_top,#f7f3ec_0%,#eee7dc_45%,#e7ded0_100%)] sm:h-[62vh] lg:h-[76vh]">
            <TwoDRoom
              modelKey="cozy_living"
              tileScale={tileScale}
              appliedTiles={appliedTiles}
            />
          </div>
        </section>

        <aside className="rounded-[32px] bg-white p-4 shadow-sm ring-1 ring-black/5">
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

          <div className="max-h-[76vh] overflow-y-auto pr-1">
            <VisualizerProductCatalog
              categories={categories}
              products={products}
              selectedProductId={selectedProductId}
              onSelect={handleSelect}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}