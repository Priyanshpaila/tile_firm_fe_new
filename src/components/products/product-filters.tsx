"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_MATERIALS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key); else next.set(key, value);
    next.delete("page");
    router.push(`/catalog?${next.toString()}`);
  };

  return (
    <div className="card-surface grid gap-4 p-4 md:grid-cols-4">
      <input placeholder="Search tiles..." defaultValue={params.get("search") || ""} onKeyDown={(event) => { if (event.key === "Enter") update("search", (event.currentTarget as HTMLInputElement).value); }} />
      <select defaultValue={params.get("material") || ""} onChange={(e) => update("material", e.target.value)}>
        <option value="">All materials</option>
        {PRODUCT_MATERIALS.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select defaultValue={params.get("sort") || ""} onChange={(e) => update("sort", e.target.value)}>
        <option value="">Newest first</option>
        <option value="price">Price: low to high</option>
        <option value="-price">Price: high to low</option>
        <option value="name">Name A-Z</option>
      </select>
      <div className="flex gap-3"><Button variant="secondary" className="w-full" onClick={() => router.push("/catalog")}>Reset</Button></div>
    </div>
  );
}
