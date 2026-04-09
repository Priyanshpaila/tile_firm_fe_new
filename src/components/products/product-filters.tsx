"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { PRODUCT_MATERIALS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const searchParam = params.get("search") || "";
  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  const update = useCallback(
    (key: string, value: string, mode: "push" | "replace" = "push") => {
      const next = new URLSearchParams(params.toString());

      if (!value) next.delete(key);
      else next.set(key, value);

      next.delete("page");

      const url = next.toString() ? `/catalog?${next.toString()}` : "/catalog";

      if (mode === "replace") router.replace(url);
      else router.push(url);
    },
    [params, router]
  );

  useEffect(() => {
    if (search === searchParam) return;

    const timer = window.setTimeout(() => {
      update("search", search.trim(), "replace");
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search, searchParam, update]);

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-black/6 bg-white/80 p-3.5 shadow-[0_18px_50px_rgba(30,20,10,0.06)] backdrop-blur md:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(180,122,53,0.06),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(120,93,58,0.05),transparent_28%)]" />

      <div className="relative mb-3 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-alt)] text-[var(--accent-primary)]">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        Refine your selection
      </div>

      <div className="relative grid gap-3 md:grid-cols-2 xl:grid-cols-[1.35fr_0.9fr_0.9fr_132px]">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Search
          </label>
          <div className="flex h-12 items-center gap-3 rounded-[18px] border border-black/8 bg-white px-3.5 shadow-sm transition focus-within:border-[var(--accent-primary)] focus-within:shadow-[0_0_0_4px_rgba(180,122,53,0.08)]">
            <Search className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tiles..."
              className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--text-secondary)]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Material
          </label>
          <div className="relative">
            <select
              defaultValue={params.get("material") || ""}
              onChange={(e) => update("material", e.target.value)}
              className="h-12 w-full appearance-none rounded-[18px] border border-black/8 bg-white px-3.5 pr-10 text-[15px] shadow-sm outline-none transition focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_4px_rgba(180,122,53,0.08)]"
            >
              <option value="">All materials</option>
              {PRODUCT_MATERIALS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Sort by
          </label>
          <div className="relative">
            <select
              defaultValue={params.get("sort") || ""}
              onChange={(e) => update("sort", e.target.value)}
              className="h-12 w-full appearance-none rounded-[18px] border border-black/8 bg-white px-3.5 pr-10 text-[15px] shadow-sm outline-none transition focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_4px_rgba(180,122,53,0.08)]"
            >
              <option value="">Newest first</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="name">Name A-Z</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          </div>
        </div>

        <div className="flex items-end">
          <Button
            variant="secondary"
            className="h-12 w-full rounded-[18px] border border-black/8 bg-white px-4 text-[15px] font-medium shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--surface-alt)]"
            onClick={() => router.push("/catalog")}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}