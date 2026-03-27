"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageShell } from "@/components/layout/page-shell";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useVisualizerStore } from "@/store/visualizer-store";
import type { Product } from "@/types";

const ThreeDRoom = dynamic(() => import("@/components/visualizer/three-d-room"), { ssr: false, loading: () => <Loader label="Loading 3D scene..." /> });

export default function Visualizer3DPage() {
  const selectedTile = useVisualizerStore((s) => s.selectedTile);
  const setSelectedTile = useVisualizerStore((s) => s.setSelectedTile);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const response = await api.products.list({ limit: 8, inStock: true, isFeatured: true });
        const fallback = response.data.products.length ? response.data.products : (await api.products.list({ limit: 8 })).data.products;
        setProducts(fallback);
        if (!selectedTile && fallback[0]) setSelectedTile(fallback[0]);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [selectedTile, setSelectedTile]);

  if (loading) return <Loader label="Loading tiles..." />;

  return (
    <PageShell title="3D Visualizer" description="A lazily loaded React Three Fiber room scaffold with future-ready material selection architecture.">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="card-surface p-4">
          <h2 className="text-xl font-semibold">Material selection</h2>
          <div className="mt-4 grid gap-3">
            {products.map((product) => (
              <button key={product._id} type="button" onClick={() => setSelectedTile(product)} className={`rounded-2xl border p-4 text-left transition ${selectedTile?._id === product._id ? "border-[var(--accent-primary)] bg-white" : "border-[var(--border-soft)] bg-white/50"}`}>
                <p className="font-semibold">{product.name}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{product.finishes.join(", ")}</p>
              </button>
            ))}
          </div>
          <div className="mt-4"><Button variant="secondary" onClick={() => window.location.assign("/visualizer")}>Back to 2D visualizer</Button></div>
        </div>
        <ThreeDRoom tile={selectedTile} />
      </div>
    </PageShell>
  );
}
