"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { AdminStats, Category, Product, Staff, User } from "@/types";
import {
  ProductFormState,
  buildProductPayload,
  initialProductForm,
  productToForm,
  validateProductForm,
} from "../_lib/product-form";
import {
  CategoryFormState,
  buildCategoryPayload,
  categoryToForm,
  initialCategoryForm,
  validateCategoryForm,
} from "../_lib/category-form";
import {
  StaffFormState,
  buildStaffPayload,
  initialStaffForm,
  staffToForm,
  validateStaffForm,
} from "../_lib/staff-form";

export type AdminTabKey =
  | "overview"
  | "products"
  | "categories"
  | "staff"
  | "users";

type ProductsPagination = {
  page: number;
  pages: number;
  total: number;
  limit: number;
};

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabKey>("overview");

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] =
    useState<ProductFormState>(initialProductForm);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState("");

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] =
    useState<CategoryFormState>(initialCategoryForm);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState("");

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState<StaffFormState>(initialStaffForm);
  const [savingStaff, setSavingStaff] = useState(false);
  const [staffFormError, setStaffFormError] = useState("");

  const [usersError, setUsersError] = useState("");
  const [productsError, setProductsError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
  const [staffError, setStaffError] = useState("");

  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("");
  const [productStockFilter, setProductStockFilter] = useState("");
  const [productFeaturedFilter, setProductFeaturedFilter] = useState("");
  const [productPage, setProductPage] = useState(1);

  const [productsPagination, setProductsPagination] = useState<ProductsPagination>(
    {
      page: 1,
      pages: 1,
      total: 0,
      limit: 8,
    }
  );

  const statsItems = useMemo(
    () =>
      stats
        ? [
            { label: "Total users", value: stats.totalUsers },
            { label: "Total products", value: stats.totalProducts },
            { label: "Total appointments", value: stats.totalAppointments },
            { label: "Total uploads", value: stats.totalUploads },
          ]
        : [],
    [stats]
  );

  const loadDashboard = async () => {
    setLoadingDashboard(true);
    setDashboardError("");
    try {
      const res = await api.admin.stats();
      setStats(res.data.stats);
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : "Failed to load dashboard stats."
      );
    } finally {
      setLoadingDashboard(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError("");
    try {
      const res = await api.users.listUsers({ page: 1, limit: 8 });
      setUsers(res.data.users);
    } catch (error) {
      setUsersError(
        error instanceof Error ? error.message : "Failed to load users."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    setCategoriesError("");
    try {
      const res = await api.categories.list();
      setCategories(res.data.categories);
    } catch (error) {
      setCategoriesError(
        error instanceof Error ? error.message : "Failed to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadStaff = async () => {
    setLoadingStaff(true);
    setStaffError("");
    try {
      const res = await api.staff.list();
      setStaffList(res.data.staff);
    } catch (error) {
      setStaffError(
        error instanceof Error ? error.message : "Failed to load staff."
      );
    } finally {
      setLoadingStaff(false);
    }
  };

  const loadProducts = async (page = productPage) => {
    setLoadingProducts(true);
    setProductsError("");

    try {
      const query: Record<string, unknown> = {
        page,
        limit: productsPagination.limit,
      };

      if (productSearch.trim()) query.search = productSearch.trim();
      if (productCategoryFilter) query.category = productCategoryFilter;
      if (productStockFilter) query.inStock = productStockFilter;
      if (productFeaturedFilter) query.isFeatured = productFeaturedFilter;

      const res = await api.products.list(query);
      setProducts(res.data.products);
      setProductsPagination(res.pagination);
      setProductPage(res.pagination.page);
    } catch (error) {
      setProductsError(
        error instanceof Error ? error.message : "Failed to load products."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    void Promise.all([
      loadDashboard(),
      loadUsers(),
      loadCategories(),
      loadStaff(),
      loadProducts(1),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm(initialProductForm);
    setProductFormError("");
  };

  const openCreateModal = () => {
    resetProductForm();
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm(productToForm(product));
    setProductFormError("");
    setModalOpen(true);
  };

  const closeProductModal = () => {
    setModalOpen(false);
    resetProductForm();
  };

  const handleSubmitProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateProductForm(productForm);
    if (validationError) {
      setProductFormError(validationError);
      return;
    }

    setSavingProduct(true);
    setProductFormError("");

    try {
      const payload = buildProductPayload(productForm);

      if (editingProduct) {
        await api.products.update(editingProduct._id, payload);
      } else {
        await api.products.create(payload);
      }

      closeProductModal();
      await Promise.all([loadProducts(productPage), loadDashboard()]);
    } catch (error) {
      setProductFormError(
        error instanceof Error ? error.message : "Failed to save product."
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const ok = window.confirm(`Delete "${product.name}"?`);
    if (!ok) return;

    try {
      await api.products.remove(product._id);
      await Promise.all([loadProducts(productPage), loadDashboard()]);
    } catch (error) {
      setProductsError(
        error instanceof Error ? error.message : "Failed to delete product."
      );
    }
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    setCategoryForm(initialCategoryForm);
    setCategoryFormError("");
  };

  const openCreateCategoryModal = () => {
    resetCategoryForm();
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm(categoryToForm(category));
    setCategoryFormError("");
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    resetCategoryForm();
  };

  const handleSubmitCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateCategoryForm(categoryForm);
    if (validationError) {
      setCategoryFormError(validationError);
      return;
    }

    setSavingCategory(true);
    setCategoryFormError("");

    try {
      const payload = buildCategoryPayload(categoryForm);

      if (editingCategory) {
        await api.categories.update(editingCategory._id, payload);
      } else {
        await api.categories.create(payload);
      }

      closeCategoryModal();
      await Promise.all([loadCategories(), loadProducts(1)]);
    } catch (error) {
      setCategoryFormError(
        error instanceof Error ? error.message : "Failed to save category."
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const ok = window.confirm(`Delete "${category.name}"?`);
    if (!ok) return;

    try {
      await api.categories.remove(category._id);
      await Promise.all([loadCategories(), loadProducts(1)]);
    } catch (error) {
      setCategoriesError(
        error instanceof Error ? error.message : "Failed to delete category."
      );
    }
  };

  const resetStaffForm = () => {
    setEditingStaff(null);
    setStaffForm(initialStaffForm);
    setStaffFormError("");
  };

  const openCreateStaffModal = () => {
    resetStaffForm();
    setStaffModalOpen(true);
  };

  const openEditStaffModal = (staff: Staff) => {
    setEditingStaff(staff);
    setStaffForm(staffToForm(staff));
    setStaffFormError("");
    setStaffModalOpen(true);
  };

  const closeStaffModal = () => {
    setStaffModalOpen(false);
    resetStaffForm();
  };

  const handleSubmitStaff = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateStaffForm(staffForm);
    if (validationError) {
      setStaffFormError(validationError);
      return;
    }

    setSavingStaff(true);
    setStaffFormError("");

    try {
      const payload = buildStaffPayload(staffForm);

      if (editingStaff) {
        await api.staff.update(editingStaff._id, payload);
      } else {
        await api.staff.create(payload);
      }

      closeStaffModal();
      await loadStaff();
    } catch (error) {
      setStaffFormError(
        error instanceof Error ? error.message : "Failed to save staff."
      );
    } finally {
      setSavingStaff(false);
    }
  };

  const handleToggleUser = async (userId: string) => {
    try {
      await api.users.toggleUserStatus(userId);
      await loadUsers();
    } catch (error) {
      setUsersError(
        error instanceof Error ? error.message : "Failed to update user status."
      );
    }
  };

  const resetProductFilters = () => {
    setProductSearch("");
    setProductCategoryFilter("");
    setProductStockFilter("");
    setProductFeaturedFilter("");
    void loadProducts(1);
  };

  return {
    activeTab,
    setActiveTab,

    stats,
    users,
    products,
    categories,
    staffList,

    loadingDashboard,
    loadingProducts,
    loadingUsers,
    loadingCategories,
    loadingStaff,

    modalOpen,
    editingProduct,
    productForm,
    setProductForm,
    savingProduct,
    productFormError,

    categoryModalOpen,
    editingCategory,
    categoryForm,
    setCategoryForm,
    savingCategory,
    categoryFormError,

    staffModalOpen,
    editingStaff,
    staffForm,
    setStaffForm,
    savingStaff,
    staffFormError,

    usersError,
    productsError,
    dashboardError,
    categoriesError,
    staffError,

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

    statsItems,

    loadDashboard,
    loadUsers,
    loadProducts,
    loadCategories,
    loadStaff,

    openCreateModal,
    openEditModal,
    closeProductModal,
    handleSubmitProduct,
    handleDeleteProduct,

    openCreateCategoryModal,
    openEditCategoryModal,
    closeCategoryModal,
    handleSubmitCategory,
    handleDeleteCategory,

    openCreateStaffModal,
    openEditStaffModal,
    closeStaffModal,
    handleSubmitStaff,

    handleToggleUser,
    resetProductFilters,
  };
}