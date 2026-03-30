import Link from "next/link";
import type { Product } from "@/types";
import { ROUTES } from "@/lib/routes";

export function UserWishlistTab({
  loading,
  error,
  wishlist,
  onRefresh,
}: {
  loading: boolean;
  error: string;
  wishlist: Product[];
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Wishlist
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Tiles and products you saved for later.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[1rem] bg-[#faf7f2] px-4 py-8 text-sm text-[var(--text-secondary)]">
          Loading wishlist...
        </div>
      ) : wishlist.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((product) => (
            <article
              key={product._id}
              className="overflow-hidden rounded-[1.25rem] border border-[var(--border-soft)] bg-[#fcfbf8]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#f4ede2]">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  ₹ {product.price}
                </p>

                <Link
                  href={`${ROUTES.catalog}/${product.slug || product._id}`}
                  className="mt-4 inline-flex rounded-full border border-[var(--border-soft)] px-4 py-2 text-sm font-medium text-[var(--text-primary)]"
                >
                  View Product
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1rem] bg-[#faf7f2] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
          No products in your wishlist yet.
        </div>
      )}
    </div>
  );
}