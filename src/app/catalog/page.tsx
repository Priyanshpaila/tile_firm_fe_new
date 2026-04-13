"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { PageShell } from "@/components/layout/page-shell";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { ProductDetailsModal } from "@/components/products/product-details-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

function CatalogPageContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const query = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries());

    return {
      ...entries,
      page: Number(entries.page || 1),
      limit: 12,
    };
  }, [queryString, searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.products.list(query);
        const nextProducts = response?.data?.products ?? [];

        if (!cancelled) {
          setProducts(Array.isArray(nextProducts) ? (nextProducts as Product[]) : []);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
          setError("Unable to load products right now. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <PageShell
      title="Catalog"
      description="Public product listing wired to backend search, sort, material, and pagination params."
    >
      <div className="grid gap-5 md:gap-6">
        <ProductFilters />

        {loading ? (
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[320px] animate-pulse rounded-[28px] border border-black/6 bg-white/70"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-dashed border-black/10 bg-white/60 p-4 shadow-[0_14px_36px_rgba(30,20,10,0.05)] md:p-6">
            <EmptyState
              title="Products unavailable"
              description={error}
              action={
                <Link href="/catalog">
                  <Button variant="secondary">Reset filters</Button>
                </Link>
              }
            />
          </div>
        ) : products.length ? (
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onOpenDetails={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-black/10 bg-white/60 p-4 shadow-[0_14px_36px_rgba(30,20,10,0.05)] md:p-6">
            <EmptyState
              title="No products found"
              description="Adjust the filters or seed products in the backend catalog."
              action={
                <Link href="/catalog">
                  <Button variant="secondary">Reset filters</Button>
                </Link>
              }
            />
          </div>
        )}
      </div>

      <ProductDetailsModal
        open={Boolean(selectedProduct)}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </PageShell>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <PageShell
          title="Catalog"
          description="Public product listing wired to backend search, sort, material, and pagination params."
        >
          <div className="grid gap-5 md:gap-6">
            <div className="h-14 animate-pulse rounded-[20px] border border-black/6 bg-white/70" />
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="min-h-[320px] animate-pulse rounded-[28px] border border-black/6 bg-white/70"
                />
              ))}
            </div>
          </div>
        </PageShell>
      }
    >
      <CatalogPageContent />
    </Suspense>
  );
}