"use client";

import type { ReactNode } from "react";
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
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function TableShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] bg-white shadow-[0_10px_30px_rgba(20,16,10,0.04)]">
      <div className="overflow-x-auto">{children}</div>
    </div>
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
      description="Compact catalog table for faster admin operations."
      actions={
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRefresh}
            className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
          >
            Refresh
          </button>
          <button
            onClick={onCreateProduct}
            className="rounded-full bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(20,16,10,0.14)]"
          >
            Add Product
          </button>
        </div>
      }
    >
      <div className="rounded-[1.2rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4">
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

        <div className="mt-4 flex flex-wrap gap-3">
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
          <TableShell>
            <table className="min-w-[1180px] w-full text-sm">
              <thead className="bg-[#faf7f2] text-left text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Material</th>
                  <th className="px-4 py-3 font-medium">Sizes</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t border-[var(--border-soft)] align-top transition hover:bg-[#fcfbf8]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex min-w-[260px] items-start gap-3">
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-cover bg-[#f6f2eb]"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-primary)]">
                            {product.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">
                            {product.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {product.sku || "—"}
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {typeof product.category === "string"
                        ? product.category
                        : product.category?.name || "—"}
                    </td>

                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      ₹ {product.price}
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {product.material || "—"}
                    </td>

                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {(product.sizes || []).join(", ") || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inStock ? "In stock" : "Out of stock"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.isFeatured
                            ? "bg-amber-100 text-amber-700"
                            : "bg-[#f3eee6] text-[#5b5148]"
                        }`}
                      >
                        {product.isFeatured ? "Featured" : "No"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex min-w-[170px] gap-2">
                        <button
                          onClick={() => onEditProduct(product)}
                          className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-primary)]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product)}
                          className="rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!products.length ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm text-[var(--text-secondary)]"
                    >
                      No products found for the current filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </TableShell>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-[1.15rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          Showing page {productsPagination.page} of {productsPagination.pages} ·{" "}
          {productsPagination.total} total products
        </p>

        <div className="flex flex-wrap gap-3">
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