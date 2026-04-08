"use client";

import type { Product, Category } from "@/types";
import { getProductPreview } from "../utils";

type Props = {
  categories: Category[];
  products: Product[];
  selectedProductId: string;
  onSelect: (id: string) => void;
};

export function VisualizerProductCatalog({
  categories,
  products,
  selectedProductId,
  onSelect,
}: Props) {
  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const items = products.filter((p) => {
          const productCategory =
            typeof p.category === "string"
              ? p.category
              : (p.category as any)?._id;

          return productCategory === cat._id;
        });

        if (!items.length) return null;

        return (
          <div key={cat._id}>
            <h3 className="text-sm font-semibold mb-2 text-gray-600">
              {cat.name}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {items.map((p) => {
                const active = p._id === selectedProductId;

                return (
                  <button
                    key={p._id}
                    onClick={() => onSelect(p._id)}
                    className={`rounded-xl overflow-hidden border transition ${
                      active
                        ? "ring-2 ring-black shadow"
                        : "hover:shadow-md"
                    }`}
                  >
                    <img
                      src={getProductPreview(p)}
                      className="h-28 w-full object-cover"
                    />

                    <div className="p-2 text-left">
                      <p className="text-xs font-medium truncate">
                        {p.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}