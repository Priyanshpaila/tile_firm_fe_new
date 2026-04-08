"use client";

import type { Product } from "@/types";
import { getProductPreview } from "../utils";

type Props = {
  products: Product[];
  selectedProductId: string;
  onSelect: (id: string) => void;
};

export function ProductStrip({
  products,
  selectedProductId,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((p) => (
        <button
          key={p._id}
          onClick={() => onSelect(p._id)}
          className={`border rounded-xl ${
            selectedProductId === p._id ? "ring-2 ring-black" : ""
          }`}
        >
          <img src={getProductPreview(p)} className="h-32 w-full object-cover" />
          <p className="p-2 text-sm">{p.name}</p>
        </button>
      ))}
    </div>
  );
}