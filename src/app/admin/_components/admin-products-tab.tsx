import type { Category, Product } from "@/types";
import { Loader } from "@/components/ui/loader";
import { SectionCard } from "./section-card";

type ProductsPagination = {
  page: number;
  pages: number;
  total: number;
  limit: number;
};

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function AdminProductsTab({
  products,
  categories,
  loading,
  error,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  productStockFilter,
  setProductStockFilter,
  productFeaturedFilter,
  setProductFeaturedFilter,
  productPage,
  productsPagination,
  onRefresh,
  onApplyFilters,
  onResetFilters,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onPrevPage,
  onNextPage,
}: {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string;
  productSearch: string;
  setProductSearch: (value: string) => void;
  productCategoryFilter: string;
  setProductCategoryFilter: (value: string) => void;
  productStockFilter: string;
  setProductStockFilter: (value: string) => void;
  productFeaturedFilter: string;
  setProductFeaturedFilter: (value: string) => void;
  productPage: number;
  productsPagination: ProductsPagination;
  onRefresh: () => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}) {
  return (
    <SectionCard
      title="Product Management"
      description="A responsive catalog control panel for tile products. No tables, no horizontal scroll."
      actions={
        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
          <button
            onClick={onRefresh}
            className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
          >
            Refresh
          </button>
          <button
            onClick={onCreateProduct}
            className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(20,16,10,0.16)]"
          >
            Add Product
          </button>
        </div>
      }
    >
      <div className="rounded-[1.35rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterField label="Search">
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Name, description, SKU"
            />
          </FilterField>

          <FilterField label="Category">
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug || category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Stock">
            <select
              value={productStockFilter}
              onChange={(e) => setProductStockFilter(e.target.value)}
            >
              <option value="">All stock states</option>
              <option value="true">In stock</option>
              <option value="false">Out of stock</option>
            </select>
          </FilterField>

          <FilterField label="Featured">
            <select
              value={productFeaturedFilter}
              onChange={(e) => setProductFeaturedFilter(e.target.value)}
            >
              <option value="">All featured states</option>
              <option value="true">Featured</option>
              <option value="false">Not featured</option>
            </select>
          </FilterField>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:flex">
          <button
            onClick={onApplyFilters}
            className="rounded-full bg-[var(--text-primary)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Apply Filters
          </button>

          <button
            onClick={onResetFilters}
            className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
          >
            Reset
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-5">
        {loading ? (
          <Loader label="Loading products..." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-[1.4rem] border border-[var(--border-soft)] bg-white shadow-[0_10px_30px_rgba(20,16,10,0.04)]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#f6f2eb]">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.inStock ? "In stock" : "Out of stock"}
                    </span>

                    {product.isFeatured ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {product.sku}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 rounded-[1rem] bg-[#faf7f2] p-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[var(--text-secondary)]">Category</p>
                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        {typeof product.category === "string"
                          ? product.category
                          : product.category?.name || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--text-secondary)]">Price</p>
                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        ₹ {product.price}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--text-secondary)]">Material</p>
                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        {product.material || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--text-secondary)]">Sizes</p>
                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        {(product.sizes || []).join(", ") || "—"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
                    {product.description}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
                    >
                      Edit Product
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product)}
                      className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {!products.length ? (
              <div className="rounded-[1.3rem] border border-[var(--border-soft)] bg-white px-4 py-10 text-center text-sm text-[var(--text-secondary)] sm:col-span-2 2xl:col-span-3">
                No products found for the current filters.
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          Showing page {productsPagination.page} of {productsPagination.pages} ·{" "}
          {productsPagination.total} total products
        </p>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <button
            disabled={productPage <= 1 || loading}
            onClick={onPrevPage}
            className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={productPage >= productsPagination.pages || loading}
            onClick={onNextPage}
            className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </SectionCard>
  );
}