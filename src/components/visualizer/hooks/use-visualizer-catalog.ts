"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Category, Product } from "@/types";

export type SurfaceType = "floor" | "wall" | "ceiling";

export function useVisualizerCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [selectedSurface, setSelectedSurface] =
    useState<SurfaceType>("floor");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  // SELECTED PRODUCT
  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId) || null,
    [products, selectedProductId]
  );

  // LOAD CATEGORIES
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.categories.list({ isActive: true });
        setCategories(res.data.categories || []);
      } catch {
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    void run();
  }, []);

  // 🔥 LOAD ALL PRODUCTS (NO CATEGORY FILTER)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.products.list({
          page: 1,
          limit: 100,
        });

        const items = res.data.products || [];
        setProducts(items);

        setSelectedProductId(items[0]?._id || "");
      } catch {
        setError("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    void run();
  }, []);

  return {
    categories,
    products,
    selectedProduct,
    selectedProductId,
    setSelectedProductId,
    selectedSurface,
    setSelectedSurface,
    loadingCategories,
    loadingProducts,
    error,
  };
}