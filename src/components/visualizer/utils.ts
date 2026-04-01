import type { Category, Product } from "@/types";

export type VisualizerCategoryKind = "floor" | "wall" | "ceiling";

export function detectCategoryKind(
  category?: Pick<Category, "name" | "slug"> | null,
): VisualizerCategoryKind {
  const value = `${category?.slug || ""} ${category?.name || ""}`.toLowerCase();

  if (
    value.includes("ceiling") ||
    value.includes("roof") ||
    value.includes("false ceiling")
  ) {
    return "ceiling";
  }

  if (
    value.includes("wall") ||
    value.includes("elevation") ||
    value.includes("cladding") ||
    value.includes("backsplash") ||
    value.includes("bathroom")
  ) {
    return "wall";
  }

  return "floor";
}

export function resolveAssetUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const apiOrigin = apiBase.replace(/\/api\/?$/, "");

  if (url.startsWith("/")) {
    return `${apiOrigin}${url}`;
  }

  return url;
}

export function getProductPreview(product?: Product | null) {
  return resolveAssetUrl(product?.images?.[0] || "");
}

export function formatCategoryLabel(category?: Category | null) {
  return category?.name || "Category";
}

export function formatPrice(value?: number) {
  if (typeof value !== "number") return "—";
  return `₹ ${value.toLocaleString("en-IN")}`;
}