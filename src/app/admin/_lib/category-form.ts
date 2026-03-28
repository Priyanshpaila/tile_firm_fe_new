import type { Category } from "@/types";

type LooseCategory = Category & {
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
};

export type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
};

export const initialCategoryForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
  isActive: true,
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function categoryToForm(category: Category): CategoryFormState {
  const item = category as LooseCategory;

  return {
    name: item.name || "",
    slug: item.slug || "",
    description: item.description || "",
    image: item.image || "",
    isActive: typeof item.isActive === "boolean" ? item.isActive : true,
  };
}

export function validateCategoryForm(form: CategoryFormState) {
  if (!form.name.trim()) return "Category name is required.";
  return "";
}

export function buildCategoryPayload(form: CategoryFormState) {
  return {
    name: form.name.trim(),
    slug: (form.slug.trim() || slugify(form.name)).trim(),
    description: form.description.trim() || undefined,
    image: form.image.trim() || undefined,
    isActive: form.isActive,
  };
}