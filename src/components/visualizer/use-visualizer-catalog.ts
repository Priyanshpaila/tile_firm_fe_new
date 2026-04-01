"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Category, Product } from "@/types";
import { detectCategoryKind } from "./utils";

export function useVisualizerCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  const selectedCategory = useMemo(
    () => categories.find((item) => item._id === selectedCategoryId) || null,
    [categories, selectedCategoryId],
  );

  const selectedKind = useMemo(
    () => detectCategoryKind(selectedCategory),
    [selectedCategory],
  );

  const selectedProduct = useMemo(
    () => products.find((item) => item._id === selectedProductId) || null,
    [products, selectedProductId],
  );

  useEffect(() => {
    const run = async () => {
      setLoadingCategories(true);
      setError("");
      try {
        const res = await api.categories.list({ isActive: true });
        const items = res.data.categories || [];
        setCategories(items);
        if (items[0]?._id) {
          setSelectedCategoryId(items[0]._id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    void run();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setProducts([]);
      setSelectedProductId("");
      return;
    }

    const run = async () => {
      setLoadingProducts(true);
      setError("");
      try {
        const res = await api.products.list({
          category: selectedCategoryId,
          page: 1,
          limit: 24,
        });
        const items = res.data.products || [];
        setProducts(items);
        setSelectedProductId(items[0]?._id || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    void run();
  }, [selectedCategoryId]);

  return {
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
  };
}