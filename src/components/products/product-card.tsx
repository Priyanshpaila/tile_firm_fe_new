import Link from "next/link";
import { Product } from "@/types";
import { ROUTES } from "@/lib/routes";
import { formatCurrency, getProductImage, getProductPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`${ROUTES.catalog}/${product.slug || product._id}`} className="card-surface overflow-hidden transition hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-[var(--surface-alt)]"><img src={getProductImage(product)} alt={product.name} className="h-full w-full object-cover" /></div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{product.material} · {product.sizes?.[0] || "Size TBD"}</p>
          </div>
          {product.isFeatured ? <Badge>Featured</Badge> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.finishes?.slice(0, 2).map((finish) => <Badge key={finish}>{finish}</Badge>)}
          {product.usages?.slice(0, 2).map((usage) => <Badge key={usage}>{usage}</Badge>)}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Starting price</p>
            <p className="text-xl font-semibold">{formatCurrency(getProductPrice(product))}</p>
          </div>
          <span className="text-sm text-[var(--accent-primary)]">View details →</span>
        </div>
      </div>
    </Link>
  );
}
