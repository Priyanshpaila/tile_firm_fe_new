"use client";

import type { Product } from "@/types";
import { formatPrice, getProductPreview } from "./utils";

export function ProductStrip({
  products,
  selectedProductId,
  onSelect,
}: {
  products: Product[];
  selectedProductId: string;
  onSelect: (productId: string) => void;
}) {
  if (!products.length) {
    return (
      <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-white px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
        No products found for this category.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
      {products.map((product) => {
        const active = product._id === selectedProductId;
        const image = getProductPreview(product);

        return (
          <button
            key={product._id}
            type="button"
            onClick={() => onSelect(product._id)}
            className={`overflow-hidden rounded-[1.2rem] border text-left transition ${
              active
                ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white shadow-[0_12px_28px_rgba(20,16,10,0.14)]"
                : "border-[var(--border-soft)] bg-white hover:border-[#c29a72]/40"
            }`}
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#f2eadf]">
              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-secondary)]">
                  No image
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="truncate text-sm font-semibold">{product.name}</p>
              <p className={`mt-1 text-xs ${active ? "text-white/72" : "text-[var(--text-secondary)]"}`}>
                {product.sku}
              </p>
              <p className={`mt-2 text-sm font-medium ${active ? "text-white" : "text-[var(--text-primary)]"}`}>
                {formatPrice(product.discountPrice || product.price)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}