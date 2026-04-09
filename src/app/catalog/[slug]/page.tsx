import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Grid2x2,
  Ruler,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { formatCurrency, getProductImage, getProductPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const response = await api.products.get(slug);
    const product = response.data.product;

    const materialLabel = product.material
      ? product.material.split("_").join(" ")
      : "—";

    return (
      <PageShell
        title={product.name}
        description={product.description || "Explore product details, finishes, sizes, and pricing."}
      >
        <div className="grid gap-5 md:gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={ROUTES.catalog}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-medium text-[var(--text-secondary)] shadow-sm transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to catalog
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-alt)] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              Product details
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] xl:gap-7">
            <div className="overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-[0_20px_60px_rgba(30,20,10,0.08)]">
              <div className="relative overflow-hidden bg-[var(--surface-alt)]">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/15 via-black/5 to-transparent" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {product.isFeatured ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[var(--accent-primary)] shadow-sm backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured
                    </span>
                  ) : null}

                  {product.material ? (
                    <span className="inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                      {materialLabel}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-[0_20px_60px_rgba(30,20,10,0.08)]">
              <div className="border-b border-black/6 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,237,225,0.9))] p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                      Premium surface
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
                      {product.name}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                      {product.description || "A refined surface option crafted for modern interior applications."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/6 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      Starting price
                    </p>
                    <p className="mt-1 text-3xl font-semibold leading-none tracking-tight text-[var(--text-primary)]">
                      {formatCurrency(getProductPrice(product))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 md:p-6">
                {(product.finishes?.length || product.usages?.length) ? (
                  <div className="space-y-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      Finishes & usage
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {product.finishes?.map((item: string) => (
                        <span
                          key={`finish-${item}`}
                          className="inline-flex items-center rounded-full border border-[#eadbc8] bg-[#f5ead9] px-3 py-1 text-[12px] font-medium text-[#99682c]"
                        >
                          {item}
                        </span>
                      ))}

                      {product.usages?.map((item: string) => (
                        <span
                          key={`usage-${item}`}
                          className="inline-flex items-center rounded-full border border-black/8 bg-white px-3 py-1 text-[12px] font-medium text-[var(--text-secondary)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Box className="h-4 w-4 text-[var(--accent-primary)]" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      SKU
                    </p>
                    <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                      {product.sku || "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Grid2x2 className="h-4 w-4 text-[var(--accent-primary)]" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      Material
                    </p>
                    <p className="mt-1 text-base font-semibold capitalize text-[var(--text-primary)]">
                      {materialLabel}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Ruler className="h-4 w-4 text-[var(--accent-primary)]" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      Sizes
                    </p>
                    <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                      {product.sizes?.length ? product.sizes.join(", ") : "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/6 bg-[var(--surface-alt)] p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                      Coverage
                    </p>
                    <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                      {product.boxCoverage ? `${product.boxCoverage} sq.ft` : "—"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-black/6 bg-[linear-gradient(135deg,rgba(245,237,225,0.75),rgba(255,255,255,0.96))] p-4 md:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`${ROUTES.visualizer}?product=${product._id}`}
                      className="flex-1"
                    >
                      <Button className="h-12 w-full rounded-full px-5 text-[15px] font-medium">
                        Apply in visualizer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href={ROUTES.booking} className="flex-1">
                      <Button
                        variant="secondary"
                        className="h-12 w-full rounded-full border border-black/8 bg-white px-5 text-[15px] font-medium shadow-sm"
                      >
                        Book service
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  } catch {
    notFound();
  }
}