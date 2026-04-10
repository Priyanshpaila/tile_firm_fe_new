"use client";

import {
  Boxes,
  CalendarDays,
  LayoutGrid,
  Layers3,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import {
  DashboardShell,
  type DashboardTabDefinition,
} from "@/components/dashboard/dashboard-shell";
import {
  useAdminDashboard,
  type AdminTabKey,
} from "./_hooks/use-admin-dashboard";
import { AdminOverviewTab } from "./_components/admin-overview-tab";
import { AdminProductsTab } from "./_components/admin-products-tab";
import { AdminCategoriesTab } from "./_components/admin-categories-tab";
import { AdminStaffTab } from "./_components/admin-staff-tab";
import { AdminUsersTab } from "./_components/admin-users-tab";
import { ProductModal } from "./_components/product-modal";
import { CategoryModal } from "./_components/category-modal";
import { StaffModal } from "./_components/staff-modal";
import { AdminAppointmentsTab } from "./_components/admin-appointments-tab";

const tabs: DashboardTabDefinition<AdminTabKey>[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "products", label: "Products", icon: Boxes },
  { key: "categories", label: "Categories", icon: Layers3 },
  { key: "staff", label: "Staff", icon: ShieldCheck },
  { key: "users", label: "Users", icon: Users2 },
];

export default function AdminPage() {
  const admin = useAdminDashboard();

  return (
    <AuthGuard roles={["admin"]}>
      <DashboardShell
        role="admin"
        title="Admin Dashboard"
        description="Admin control panel with overview, products, categories, staff, appointments, and users."
        tabs={tabs}
        activeTab={admin.activeTab}
        onChange={admin.setActiveTab}
      >
        <div className="grid gap-6">
          <section hidden={admin.activeTab !== "overview"}>
            <AdminOverviewTab
              stats={admin.stats}
              statsItems={admin.statsItems}
              loading={admin.loadingDashboard}
              error={admin.dashboardError}
            />
          </section>

          <section hidden={admin.activeTab !== "appointments"}>
            <AdminAppointmentsTab />
          </section>

          <section hidden={admin.activeTab !== "products"}>
            <AdminProductsTab
              products={admin.products}
              categories={admin.categories}
              loading={admin.loadingProducts}
              error={admin.productsError}
              productSearch={admin.productSearch}
              setProductSearch={admin.setProductSearch}
              productCategoryFilter={admin.productCategoryFilter}
              setProductCategoryFilter={admin.setProductCategoryFilter}
              productStockFilter={admin.productStockFilter}
              setProductStockFilter={admin.setProductStockFilter}
              productFeaturedFilter={admin.productFeaturedFilter}
              setProductFeaturedFilter={admin.setProductFeaturedFilter}
              productPage={admin.productPage}
              productsPagination={admin.productsPagination}
              onRefresh={() => void admin.loadProducts(1)}
              onApplyFilters={() => void admin.loadProducts(1)}
              onResetFilters={admin.resetProductFilters}
              onCreateProduct={admin.openCreateModal}
              onEditProduct={admin.openEditModal}
              onDeleteProduct={(product) =>
                void admin.handleDeleteProduct(product)
              }
              onPrevPage={() => void admin.loadProducts(admin.productPage - 1)}
              onNextPage={() => void admin.loadProducts(admin.productPage + 1)}
            />
          </section>

          <section hidden={admin.activeTab !== "categories"}>
            <AdminCategoriesTab
              categories={admin.categories}
              loading={admin.loadingCategories}
              error={admin.categoriesError}
              onRefresh={() => void admin.loadCategories()}
              onCreateCategory={admin.openCreateCategoryModal}
              onEditCategory={admin.openEditCategoryModal}
              onDeleteCategory={(category) =>
                void admin.handleDeleteCategory(category)
              }
            />
          </section>

          <section hidden={admin.activeTab !== "staff"}>
            <AdminStaffTab
              staffList={admin.staffList}
              loading={admin.loadingStaff}
              error={admin.staffError}
              onRefresh={() => void admin.loadStaff()}
              onCreateStaff={admin.openCreateStaffModal}
              onEditStaff={admin.openEditStaffModal}
              staffCredentialNotice={admin.staffCredentialNotice}
              onClearCredentialNotice={admin.clearStaffCredentialNotice}
            />
          </section>

          <section hidden={admin.activeTab !== "users"}>
            <AdminUsersTab
              users={admin.users}
              loading={admin.loadingUsers}
              error={admin.usersError}
              onToggleUser={(userId) => void admin.handleToggleUser(userId)}
            />
          </section>
        </div>

        <ProductModal
          open={admin.modalOpen}
          mode={admin.editingProduct ? "edit" : "create"}
          form={admin.productForm}
          setForm={admin.setProductForm}
          categories={admin.categories}
          saving={admin.savingProduct}
          error={admin.productFormError}
          onClose={admin.closeProductModal}
          onSubmit={admin.handleSubmitProduct}
        />

        <CategoryModal
          open={admin.categoryModalOpen}
          mode={admin.editingCategory ? "edit" : "create"}
          form={admin.categoryForm}
          setForm={admin.setCategoryForm}
          saving={admin.savingCategory}
          error={admin.categoryFormError}
          onClose={admin.closeCategoryModal}
          onSubmit={admin.handleSubmitCategory}
        />

        <StaffModal
          open={admin.staffModalOpen}
          mode={admin.editingStaff ? "edit" : "create"}
          form={admin.staffForm}
          setForm={admin.setStaffForm}
          saving={admin.savingStaff}
          error={admin.staffFormError}
          onClose={admin.closeStaffModal}
          onSubmit={admin.handleSubmitStaff}
        />
      </DashboardShell>
    </AuthGuard>
  );
}