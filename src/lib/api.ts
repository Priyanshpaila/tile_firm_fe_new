import { apiRequest } from "./api-client";
import type {
  AdminStats,
  ApiResponse,
  Appointment,
  Category,
  PaginatedApiResponse,
  Product,
  RoomTemplate,
  Staff,
  UploadRecord,
  User,
  Visualization,
} from "@/types";
import { buildQuery } from "./utils";

export const api = {
  auth: {
    register: (payload: { name: string; email: string; password: string; phone?: string }) =>
      apiRequest<ApiResponse<{ user: User }>>("/auth/register", { method: "POST", body: payload }),
    login: (payload: { email: string; password: string }) =>
      apiRequest<ApiResponse<{ user: User }>>("/auth/login", { method: "POST", body: payload }),
    refresh: () => apiRequest<ApiResponse<null>>("/auth/refresh", { method: "POST" }),
    logout: () => apiRequest<ApiResponse<null>>("/auth/logout", { method: "POST" }),
    me: () => apiRequest<ApiResponse<{ user: User }>>("/auth/me"),
  },
  users: {
    updateProfile: (payload: Partial<User>) =>
      apiRequest<ApiResponse<{ user: User }>>("/users/profile", { method: "PUT", body: payload }),
    changePassword: (payload: { currentPassword: string; newPassword: string }) =>
      apiRequest<ApiResponse<null>>("/users/change-password", { method: "PUT", body: payload }),
    getWishlist: () => apiRequest<ApiResponse<{ wishlist: Product[] }>>("/users/wishlist"),
    toggleWishlist: (productId: string) =>
      apiRequest<ApiResponse<{ wishlist: string[]; added: boolean }>>(`/users/wishlist/${productId}`, { method: "POST" }),
    listUsers: (params: Record<string, unknown>) =>
      apiRequest<PaginatedApiResponse<{ users: User[] }>>(`/users?${buildQuery(params)}`),
    toggleUserStatus: (id: string) =>
      apiRequest<ApiResponse<{ user: User }>>(`/users/${id}/status`, { method: "PATCH" }),
  },
  categories: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<ApiResponse<{ categories: Category[] }>>(`/categories?${buildQuery(params)}`),
    get: (idOrSlug: string) => apiRequest<ApiResponse<{ category: Category }>>(`/categories/${idOrSlug}`),
  },
  products: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<PaginatedApiResponse<{ products: Product[] }>>(`/products?${buildQuery(params)}`),
    get: (idOrSlugOrSku: string) => apiRequest<ApiResponse<{ product: Product }>>(`/products/${idOrSlugOrSku}`),
  },
  roomTemplates: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<ApiResponse<{ templates: RoomTemplate[] }>>(`/room-templates?${buildQuery(params)}`),
    get: (id: string) => apiRequest<ApiResponse<{ template: RoomTemplate }>>(`/room-templates/${id}`),
  },
  visualizer: {
    save: (payload: {
      name?: string;
      roomTemplate?: string;
      uploadedImage?: string;
      selectedTile: string;
      viewState: Record<string, unknown>;
      thumbnailUrl?: string;
    }) => apiRequest<ApiResponse<{ visualization: Visualization }>>("/visualizer", { method: "POST", body: payload }),
    mySaves: () => apiRequest<ApiResponse<{ visualizations: Visualization[] }>>("/visualizer/my-saves"),
    remove: (id: string) => apiRequest<ApiResponse<null>>(`/visualizer/${id}`, { method: "DELETE" }),
  },
  uploads: {
    single: (formData: FormData) =>
      apiRequest<ApiResponse<{ upload: UploadRecord }>>("/uploads/single", { method: "POST", body: formData, isFormData: true }),
  },
  appointments: {
    create: (payload: {
      address: { street: string; city: string; state: string; pincode: string; country?: string };
      date: string;
      timeSlot: string;
      notes?: string;
      paymentMethod: "online" | "cash";
    }) => apiRequest<ApiResponse<{ appointment: Appointment }>>("/appointments", { method: "POST", body: payload }),
    myAppointments: () => apiRequest<ApiResponse<{ appointments: Appointment[] }>>("/appointments/my-appointments"),
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<ApiResponse<{ appointments: Appointment[] }>>(`/appointments?${buildQuery(params)}`),
  },
  payments: {
    createOrder: (appointmentId: string) =>
      apiRequest<ApiResponse<{ orderId: string; amount: number; currency: string; keyId: string }>>("/payments/create-order", { method: "POST", body: { appointmentId } }),
  },
  staff: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<ApiResponse<{ staff: Staff[] }>>(`/staff?${buildQuery(params)}`),
  },
  admin: {
    stats: () => apiRequest<ApiResponse<{ stats: AdminStats }>>("/admin/stats"),
  },
};
