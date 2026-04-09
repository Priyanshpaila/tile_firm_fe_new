import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { ROUTES } from "@/lib/routes";
import { formatCurrency, getProductImage, getProductPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const chips = [
    ...(product.finishes?.slice(0, 1).map((value) => ({
      value,
      tone: "soft" as const,
    })) || []),
    ...(product.usages?.slice(0, 1).map((value) => ({
      value,
      tone: "plain" as const,
    })) || []),
  ];

  return (
    <Link
      href={`${ROUTES.catalog}/${product.slug || product._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-black/6 bg-white shadow-[0_14px_36px_rgba(30,20,10,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(30,20,10,0.12)]"
    >
      <div className="relative aspect-[15/11] overflow-hidden bg-[var(--surface-alt)]">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 via-black/5 to-transparent" />

        {product.isFeatured ? (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-[var(--accent-primary)] shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Featured
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-[var(--text-secondary)]">
            {product.material} · {product.sizes?.[0] || "Size TBD"}
          </p>
        </div>

        <div className="flex min-h-[30px] flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip.value}
              className={[
                "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
                chip.tone === "soft"
                  ? "border-[#e9d9c1] bg-[#f4e8d6] text-[#9a6a2f]"
                  : "border-black/8 bg-white text-[var(--text-secondary)]",
              ].join(" ")}
            >
              {chip.value}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-black/6 pt-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Starting price
            </p>
            <p className="mt-1 text-[22px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">
              {formatCurrency(getProductPrice(product))}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-alt)] px-2.5 py-2 text-sm font-medium text-[var(--accent-primary)] transition group-hover:bg-[var(--accent-primary)] group-hover:text-white">
            View details
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}