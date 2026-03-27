import { api } from "@/lib/api";
import { PageShell } from "@/components/layout/page-shell";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductCard } from "@/components/products/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>>; }) {
  const params = await searchParams;
  const query = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const response = await api.products.list({ page: query.page || 1, limit: 12, ...query });
  const products = response.data.products;

  return (
    <PageShell title="Catalog" description="Public product listing wired to backend search, sort, material, and pagination params.">
      <div className="grid gap-6">
        <ProductFilters />
        {products.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
        ) : (
          <EmptyState title="No products found" description="Adjust the filters or seed products in the backend catalog." action={<Link href="/catalog"><Button variant="secondary">Reset filters</Button></Link>} />
        )}
      </div>
    </PageShell>
  );
}
