import type { Product } from "@/types";

export const PRODUCT_FINISH_OPTIONS = [
  "glossy",
  "matte",
  "satin",
  "textured",
  "polished",
  "rustic",
  "lappato",
] as const;

export const PRODUCT_USAGE_OPTIONS = [
  "floor",
  "wall",
  "both",
  "outdoor",
  "bathroom",
  "kitchen",
  "living_room",
] as const;

export const PRODUCT_MATERIAL_OPTIONS = [
  "ceramic",
  "porcelain",
  "vitrified",
  "natural_stone",
  "marble",
  "granite",
  "mosaic",
] as const;

export const TILE_SIZE_OPTIONS = [
  "300x300",
  "300x600",
  "600x600",
  "600x1200",
  "800x800",
  "800x1600",
  "1000x1000",
  "1200x1200",
  "1200x2400",
] as const;

export type ProductFormState = {
  name: string;
  description: string;
  sku: string;
  price: string;
  discountPrice: string;
  imagesText: string;
  category: string;
  finishes: string[];
  usages: string[];
  material: string;
  sizes: string[];
  thickness: string;
  boxCoverage: string;
  piecesPerBox: string;
  inStock: boolean;
  isFeatured: boolean;
};

export const initialProductForm: ProductFormState = {
  name: "",
  description: "",
  sku: "",
  price: "",
  discountPrice: "",
  imagesText: "",
  category: "",
  finishes: [],
  usages: [],
  material: "",
  sizes: [],
  thickness: "",
  boxCoverage: "",
  piecesPerBox: "",
  inStock: true,
  isFeatured: false,
};

export function splitLines(value: string) {
  return value
    .split(/\n|,/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinLines(values?: string[]) {
  return (values || []).join("\n");
}

export function numberOrUndefined(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return Number(trimmed);
}

export function productToForm(product: Product): ProductFormState {
  const categoryId =
    typeof product.category === "string"
      ? product.category
      : product.category?._id || "";

  return {
    name: product.name || "",
    description: product.description || "",
    sku: product.sku || "",
    price: product.price?.toString() || "",
    discountPrice: product.discountPrice?.toString() || "",
    imagesText: joinLines(product.images),
    category: categoryId,
    finishes: product.finishes || [],
    usages: product.usages || [],
    material: product.material || "",
    sizes: product.sizes || [],
    thickness: product.thickness || "",
    boxCoverage: product.boxCoverage?.toString() || "",
    piecesPerBox: product.piecesPerBox?.toString() || "",
    inStock: Boolean(product.inStock),
    isFeatured: Boolean(product.isFeatured),
  };
}

export function validateProductForm(form: ProductFormState) {
  if (!form.name.trim()) return "Product name is required.";
  if (!form.description.trim()) return "Description is required.";
  if (!form.sku.trim()) return "SKU is required.";
  if (!form.price.trim()) return "Price is required.";
  if (!form.category) return "Category is required.";
  if (!form.material) return "Material is required.";
  if (form.finishes.length === 0) return "Select at least one finish.";
  if (form.usages.length === 0) return "Select at least one usage.";
  if (form.sizes.length === 0) return "Select at least one size.";
  if (splitLines(form.imagesText).length === 0) {
    return "At least one image URL is required.";
  }
  return "";
}

export function buildProductPayload(form: ProductFormState) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    sku: form.sku.trim().toUpperCase(),
    price: Number(form.price),
    discountPrice: numberOrUndefined(form.discountPrice),
    images: splitLines(form.imagesText),
    category: form.category,
    finishes: form.finishes,
    usages: form.usages,
    material: form.material,
    sizes: form.sizes,
    thickness: form.thickness.trim() || undefined,
    boxCoverage: numberOrUndefined(form.boxCoverage),
    piecesPerBox: numberOrUndefined(form.piecesPerBox),
    inStock: form.inStock,
    isFeatured: form.isFeatured,
  };
}