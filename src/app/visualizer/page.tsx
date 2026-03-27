"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { PageShell } from "@/components/layout/page-shell";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { TemplatePreview } from "@/components/visualizer/template-preview";
import { useVisualizerStore } from "@/store/visualizer-store";
import type { Product, RoomTemplate } from "@/types";
import { formatCurrency, getProductPrice } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function VisualizerPage() {
  const searchParams = useSearchParams();
  const selectedTile = useVisualizerStore((s) => s.selectedTile);
  const selectedTemplate = useVisualizerStore((s) => s.selectedTemplate);
  const uploadedRoom = useVisualizerStore((s) => s.uploadedRoom);
  const setSelectedTile = useVisualizerStore((s) => s.setSelectedTile);
  const setSelectedTemplate = useVisualizerStore((s) => s.setSelectedTemplate);
  const [templates, setTemplates] = useState<RoomTemplate[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialProductId = searchParams.get("product");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [templateRes, productRes] = await Promise.all([
          api.roomTemplates.list({ activeOnly: true }),
          api.products.list({ limit: 12, inStock: true }),
        ]);
        setTemplates(templateRes.data.templates);
        setProducts(productRes.data.products);
        if (!selectedTemplate && templateRes.data.templates[0]) setSelectedTemplate(templateRes.data.templates[0]);
        if (!selectedTile) {
          const preselected = productRes.data.products.find((item) => item._id === initialProductId);
          setSelectedTile(preselected || productRes.data.products[0] || null);
        }
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [initialProductId, selectedTemplate, selectedTile, setSelectedTemplate, setSelectedTile]);

  const saveDisabled = useMemo(() => !selectedTile || (!selectedTemplate && !uploadedRoom), [selectedTile, selectedTemplate, uploadedRoom]);
  const saveVisualization = async () => {
    if (saveDisabled || !selectedTile) return;
    setSaving(true);
    try {
      await api.visualizer.save({
        name: "Starter preview",
        roomTemplate: selectedTemplate?._id,
        uploadedImage: uploadedRoom?._id,
        selectedTile: selectedTile._id,
        viewState: { mode: "2d", selectedTemplateId: selectedTemplate?._id || null, selectedTileId: selectedTile._id },
      });
      alert("Visualization saved");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to save visualization");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading templates and products..." />;

  return (
    <PageShell title="Room Template Visualizer" description="MVP room visualizer scaffold with template selection, tile selection, uploaded room fallback, and save hooks.">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <div className="grid gap-6">
          <div className="card-surface p-4">
            <h2 className="text-xl font-semibold">Select room template</h2>
            <div className="mt-4 grid gap-3">
              {templates.map((template) => (
                <button key={template._id} type="button" onClick={() => setSelectedTemplate(template)} className={`rounded-2xl border p-4 text-left transition ${selectedTemplate?._id === template._id ? "border-[var(--accent-primary)] bg-white" : "border-[var(--border-soft)] bg-white/50"}`}>
                  <p className="font-semibold">{template.name}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{template.roomCategory} · {template.type}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="card-surface p-4">
            <h2 className="text-xl font-semibold">Select tile</h2>
            <div className="mt-4 grid gap-3">
              {products.map((product) => (
                <button key={product._id} type="button" onClick={() => setSelectedTile(product)} className={`rounded-2xl border p-4 text-left transition ${selectedTile?._id === product._id ? "border-[var(--accent-primary)] bg-white" : "border-[var(--border-soft)] bg-white/50"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{product.material} · {product.sizes[0]}</p>
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(getProductPrice(product))}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <TemplatePreview template={selectedTemplate} tile={selectedTile} upload={uploadedRoom} />
          <div className="card-surface flex flex-wrap gap-3 p-4">
            <Button onClick={saveVisualization} disabled={saveDisabled || saving}>{saving ? "Saving..." : "Save Visualization"}</Button>
            <Button variant="secondary" onClick={() => window.location.assign("/visualizer/3d")}>Open 3D View</Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
