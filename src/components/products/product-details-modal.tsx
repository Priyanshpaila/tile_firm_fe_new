"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  Grid2x2,
  Loader2,
  Ruler,
  Sparkles,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatCurrency, getProductImage, getProductPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Product } from "@/types";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
};

export function ProductDetailsModal({ open, product, onClose }: Props) {
  const [resolvedProduct, setResolvedProduct] = useState<Product | null>(product);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !product) return;

    let cancelled = false;

    setResolvedProduct(product);
    setLoadingDetails(true);
    setNotice(null);

    async function loadFreshDetails() {
      try {
        if (!product) return;
        const response = await api.products.get(product.slug || product._id);
        const nextProduct = response?.data?.product;

        if (!cancelled && nextProduct) {
          setResolvedProduct(nextProduct as Product);
        }
      } catch {
        if (!cancelled) {
          setNotice("Showing available product details.");
        }
      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    }

    loadFreshDetails();

    return () => {
      cancelled = true;
    };
  }, [open, product]);

  const currentProduct = resolvedProduct ?? product;

  const materialLabel = useMemo(() => {
    return currentProduct?.material
      ? currentProduct.material.split("_").join(" ")
      : "—";
  }, [currentProduct]);

  if (!open || !currentProduct) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/55 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex h-full w-full items-stretch justify-center p-3 md:p-5">
        <div className="flex h-full w-full max-w-[1560px] flex-col overflow-hidden rounded-[32px] border border-white/30 bg-[#f7f3ec] shadow-[0_28px_100px_rgba(15,10,5,0.28)]">
          <div className="flex items-center justify-between border-b border-black/6 bg-white/80 px-4 py-3 backdrop-blur md:px-6 md:py-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-alt)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Product details
                </span>

                {currentProduct.isFeatured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[var(--accent-primary)] shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured
                  </span>
                ) : null}

                {loadingDetails ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)] shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Refreshing
                  </span>
                ) : null}
              </div>

              <h2 className="mt-2 line-clamp-1 text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
                {currentProduct.name}
              </h2>

              {notice ? (
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{notice}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-[var(--text-primary)] shadow-sm transition hover:scale-[1.03]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid gap-5 p-4 md:p-6 xl:grid-cols-[1.08fr_0.92fr] xl:gap-6">
              <div className="overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-[0_20px_60px_rgba(30,20,10,0.08)]">
                <div className="relative overflow-hidden bg-[var(--surface-alt)]">
                  <img
                    src={getProductImage(currentProduct)}
                    alt={currentProduct.name}
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/15 via-black/5 to-transparent" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {currentProduct.material ? (
                      <span className="inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                        {materialLabel}
                      </span>
                    ) : null}

                    {currentProduct.inStock === false ? (
                      <span className="inline-flex items-center rounded-full bg-[#221814]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                        Out of stock
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-[0_20px_60px_rgba(30,20,10,0.08)]">
                <div className="border-b border-black/6 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(245,237,225,0.9))] p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                        Premium surface
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
                        {currentProduct.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                        {currentProduct.description ||
                          "A refined surface option crafted for modern interior applications."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/6 bg-white px-4 py-3 shadow-sm">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Starting price
                      </p>
                      <p className="mt-1 text-3xl font-semibold leading-none tracking-tight text-[var(--text-primary)]">
                        {formatCurrency(getProductPrice(currentProduct))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-6">
                  {currentProduct.finishes?.length || currentProduct.usages?.length ? (
                    <div className="space-y-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Finishes & usage
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {currentProduct.finishes?.map((item: string) => (
                          <span
                            key={`finish-${item}`}
                            className="inline-flex items-center rounded-full border border-[#eadbc8] bg-[#f5ead9] px-3 py-1 text-[12px] font-medium text-[#99682c]"
                          >
                            {item}
                          </span>
                        ))}

                        {currentProduct.usages?.map((item: string) => (
                          <span
                            key={`usage-${item}`}
                            className="inline-flex items-center rounded-full border border-black/8 bg-white px-3 py-1 text-[12px] font-medium text-[var(--text-secondary)]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Box className="h-4 w-4 text-[var(--accent-primary)]" />
                      </div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        SKU
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                        {currentProduct.sku || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Grid2x2 className="h-4 w-4 text-[var(--accent-primary)]" />
                      </div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Material
                      </p>
                      <p className="mt-1 text-base font-semibold capitalize text-[var(--text-primary)]">
                        {materialLabel}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Ruler className="h-4 w-4 text-[var(--accent-primary)]" />
                      </div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Sizes
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                        {currentProduct.sizes?.length
                          ? currentProduct.sizes.join(", ")
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
                      </div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Coverage
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                        {currentProduct.boxCoverage
                          ? `${currentProduct.boxCoverage} sq.ft`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Pieces per box
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                        {currentProduct.piecesPerBox ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                        Thickness
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                        {currentProduct.thickness || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/6 bg-[linear-gradient(135deg,rgba(245,237,225,0.78),rgba(255,255,255,0.96))] p-4 md:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`${ROUTES.visualizer}?product=${currentProduct._id}`}
                        className="flex-1"
                        onClick={onClose}
                      >
                        <Button className="h-12 w-full rounded-full px-5 text-[15px] font-medium">
                          Apply in visualizer
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>

                      <Link
                        href={ROUTES.booking}
                        className="flex-1"
                        onClick={onClose}
                      >
                        <Button
                          variant="secondary"
                          className="h-12 w-full rounded-full border border-black/8 bg-white px-5 text-[15px] font-medium shadow-sm"
                        >
                          Book service
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}