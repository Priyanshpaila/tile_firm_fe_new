import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getProductImage, getProductPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const response = await api.products.get(slug);
    const product = response.data.product;
    return (
      <PageShell title={product.name} description={product.description}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card-surface overflow-hidden"><img src={getProductImage(product)} alt={product.name} className="aspect-[4/3] h-full w-full object-cover" /></div>
          <div className="card-surface space-y-6 p-6">
            <div className="flex flex-wrap gap-2">{product.finishes.map((item) => <Badge key={item}>{item}</Badge>)}{product.usages.map((item) => <Badge key={item}>{item}</Badge>)}</div>
            <div><p className="text-sm text-[var(--text-secondary)]">SKU</p><p className="text-lg font-medium">{product.sku}</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="text-sm text-[var(--text-secondary)]">Price</p><p className="text-3xl font-semibold">{formatCurrency(getProductPrice(product))}</p></div>
              <div><p className="text-sm text-[var(--text-secondary)]">Material</p><p className="text-lg font-medium capitalize">{product.material.replace("_", " ")}</p></div>
              <div><p className="text-sm text-[var(--text-secondary)]">Sizes</p><p className="text-lg font-medium">{product.sizes.join(", ")}</p></div>
              <div><p className="text-sm text-[var(--text-secondary)]">Coverage</p><p className="text-lg font-medium">{product.boxCoverage || "—"} sq.ft</p></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`${ROUTES.visualizer}?product=${product._id}`}><Button>Apply in visualizer</Button></Link>
              <Link href={ROUTES.booking}><Button variant="secondary">Book service</Button></Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  } catch {
    notFound();
  }
}
