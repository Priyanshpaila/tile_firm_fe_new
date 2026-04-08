"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, RotateCcw, UploadCloud } from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useVisualizerCatalog } from "@/components/visualizer/hooks/use-visualizer-catalog";
import { ProductStrip } from "@/components/visualizer/ui/product-strip";
import { getProductPreview, resolveAssetUrl } from "@/components/visualizer/utils";
import { api } from "@/lib/api";

type Point = { x: number; y: number };

const DEFAULT_POINTS: Point[] = [
  { x: 220, y: 470 },
  { x: 770, y: 470 },
  { x: 910, y: 690 },
  { x: 90, y: 690 },
];

export default function UploadRoomPage() {
  const {
    categories,
    selectedCategory,
    selectedCategoryId,
    setSelectedCategoryId,
    products,
    selectedProduct,
    selectedProductId,
    setSelectedProductId,
    loadingCategories,
    loadingProducts,
    error,
  } = useVisualizerCatalog();

  const [uploaded, setUploaded] = useState<{
    id: string;
    url: string;
    name: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [points, setPoints] = useState<Point[]>(DEFAULT_POINTS);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const tileUrl = getProductPreview(selectedProduct);
  const polygonPoints = useMemo(
    () => points.map((p) => `${p.x},${p.y}`).join(" "),
    [points],
  );

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", "room_photo");

      const res = await api.uploads.single(formData);
      const record = res.data.upload;

      setUploaded({
        id: record._id,
        url: record.url,
        name: record.originalName,
      });
      setMessage("Room photo uploaded. Adjust the floor mask and apply a tile.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (draggingIndex === null || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1000;
    const y = ((event.clientY - rect.top) / rect.height) * 700;

    setPoints((prev) =>
      prev.map((point, index) =>
        index === draggingIndex
          ? {
              x: Math.max(0, Math.min(1000, x)),
              y: Math.max(0, Math.min(700, y)),
            }
          : point,
      ),
    );
  };

  const handleSave = async () => {
    if (!uploaded || !selectedProduct) return;

    try {
      setSaving(true);
      setMessage(null);

      await api.visualizer.save({
        name: `Room Upload - ${selectedProduct.name}`,
        uploadedImage: uploaded.id,
        selectedTile: selectedProduct._id,
        viewState: {
          mode: "upload-room",
          categoryId: selectedCategory?._id,
          categoryName: selectedCategory?.name,
          uploadedImageUrl: uploaded.url,
          polygon: points,
          tileImage: tileUrl,
        },
      });

      setMessage("Uploaded room visualization saved successfully.");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Failed to save room visualization.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard roles={["user", "staff", "admin"]}>
      <PageShell
        title="Upload Your Room"
        description="Upload a room photo, manually define the floor area, and preview your tiles directly on the image."
      >
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.45fr_1fr]">
          <section className="grid gap-4">
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                Step 1
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                Upload Photo
              </h2>

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[1.2rem] border border-dashed border-[var(--border-soft)] bg-[#faf7f2] px-4 py-8 text-center">
                <UploadCloud className="h-8 w-8 text-[#8a6037]" />
                <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                  Upload room image
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  PNG, JPG, or WEBP
                </p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>

              {uploading ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading image...
                </div>
              ) : null}

              {uploaded ? (
                <div className="mt-4 rounded-[1rem] bg-[#faf7f2] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  Uploaded: <span className="font-medium text-[var(--text-primary)]">{uploaded.name}</span>
                </div>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                Step 2
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                Choose Category
              </h2>

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
          </section>

          <section className="grid gap-4">
            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-4 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Manual Floor Mask
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Drag the four corner points to match your floor area.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPoints(DEFAULT_POINTS)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 text-sm font-medium text-[var(--text-primary)]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Mask
                </button>
              </div>

              {uploaded ? (
                <div className="overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-[#f5efe6]">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 1000 700"
                    className="h-auto w-full touch-none"
                    onPointerMove={handlePointerMove}
                    onPointerUp={() => setDraggingIndex(null)}
                    onPointerLeave={() => setDraggingIndex(null)}
                  >
                    <defs>
                      {tileUrl ? (
                        <pattern
                          id="upload-room-tile-pattern"
                          patternUnits="userSpaceOnUse"
                          width="84"
                          height="84"
                        >
                          <image
                            href={resolveAssetUrl(tileUrl)}
                            x="0"
                            y="0"
                            width="84"
                            height="84"
                            preserveAspectRatio="none"
                          />
                        </pattern>
                      ) : null}
                    </defs>

                    <image
                      href={resolveAssetUrl(uploaded.url)}
                      x="0"
                      y="0"
                      width="1000"
                      height="700"
                      preserveAspectRatio="xMidYMid slice"
                    />

                    {tileUrl ? (
                      <polygon
                        points={polygonPoints}
                        fill="url(#upload-room-tile-pattern)"
                        opacity="0.72"
                        stroke="#d7a36b"
                        strokeWidth="4"
                      />
                    ) : null}

                    {!tileUrl ? (
                      <polygon
                        points={polygonPoints}
                        fill="rgba(215,163,107,0.18)"
                        stroke="#d7a36b"
                        strokeWidth="4"
                        strokeDasharray="10 10"
                      />
                    ) : null}

                    {points.map((point, index) => (
                      <g key={`${point.x}-${point.y}-${index}`}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="14"
                          fill="#171411"
                          opacity="0.86"
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="8"
                          fill="#ffffff"
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            setDraggingIndex(index);
                          }}
                          style={{ cursor: "grab" }}
                        />
                      </g>
                    ))}
                  </svg>
                </div>
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-[var(--border-soft)] bg-[#faf7f2] px-4 py-16 text-center text-sm text-[var(--text-secondary)]">
                  Upload an image first to start the room editor.
                </div>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5 shadow-[0_12px_30px_rgba(20,16,10,0.05)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    Save Result
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {selectedCategory?.name || "Select category"} · {selectedProduct?.name || "Select product"}
                  </h3>
                </div>

                <Button onClick={() => void handleSave()} disabled={!uploaded || !selectedProduct || saving}>
                  {saving ? "Saving..." : "Save Room Visualization"}
                </Button>
              </div>

              {message ? (
                <div className="mt-4 flex items-start gap-3 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{message}</p>
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
    </AuthGuard>
  );
}