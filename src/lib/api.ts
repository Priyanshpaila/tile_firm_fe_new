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

type StaffLoginAccount = {
  email: string;
  role: string;
  temporaryPassword?: string;
};

type StaffMutationResponse = {
  staff: Staff;
  loginAccount?: StaffLoginAccount;
};

type AppointmentQueryParams = {
  from?: string;
  to?: string;
  date?: string;
  status?: string;
  staffId?: string;
  userId?: string;
  page?: number;
  limit?: number;
};

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function getBackendOrigin() {
  const normalized = RAW_API_BASE.replace(/\/$/, "");
  if (!normalized) return "";

  return normalized.replace(/\/api$/i, "");
}

function extractUploadFilename(url?: string | null) {
  if (!url) return "";

  const clean = url.split("?")[0].split("#")[0];

  const match = clean.match(/\/uploads\/([^/]+)$/i);
  if (match?.[1]) {
    return match[1];
  }

  return "";
}

export const resolveUploadUrl = (url?: string | null) => {
  if (!url) return "";

  const backendOrigin = getBackendOrigin();
  const filename = extractUploadFilename(url);

  if (filename && backendOrigin) {
    return `${backendOrigin}/uploads/${filename}`;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (backendOrigin) {
    const relative = url.startsWith("/") ? url : `/${url}`;
    return `${backendOrigin}${relative}`;
  }

  return url;
};

export const api = {
  auth: {
    register: (payload: { name: string; email: string; password: string; phone?: string }) =>
      apiRequest<ApiResponse<{ user: User }>>("/auth/register", {
        method: "POST",
        body: payload,
      }),

    login: (payload: { email: string; password: string }) =>
      apiRequest<ApiResponse<{ user: User }>>("/auth/login", {
        method: "POST",
        body: payload,
      }),

    refresh: () =>
      apiRequest<ApiResponse<null>>("/auth/refresh", {
        method: "POST",
      }),

    logout: () =>
      apiRequest<ApiResponse<null>>("/auth/logout", {
        method: "POST",
      }),

    me: () => apiRequest<ApiResponse<{ user: User }>>("/auth/me"),
  },

  users: {
    updateProfile: (payload: Partial<User>) =>
      apiRequest<ApiResponse<{ user: User }>>("/users/profile", {
        method: "PUT",
        body: payload,
      }),

    changePassword: (payload: { currentPassword: string; newPassword: string }) =>
      apiRequest<ApiResponse<null>>("/users/change-password", {
        method: "PUT",
        body: payload,
      }),

    getWishlist: () =>
      apiRequest<ApiResponse<{ wishlist: Product[] }>>("/users/wishlist"),

    toggleWishlist: (productId: string) =>
      apiRequest<ApiResponse<{ wishlist: string[]; added: boolean }>>(
        `/users/wishlist/${productId}`,
        {
          method: "POST",
        }
      ),

    listUsers: (params: Record<string, unknown>) =>
      apiRequest<PaginatedApiResponse<{ users: User[] }>>(
        `/users?${buildQuery(params)}`
      ),

    toggleUserStatus: (id: string) =>
      apiRequest<ApiResponse<{ user: User }>>(`/users/${id}/status`, {
        method: "PATCH",
      }),
  },

  categories: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<ApiResponse<{ categories: Category[] }>>(
        `/categories?${buildQuery(params)}`
      ),

    get: (idOrSlug: string) =>
      apiRequest<ApiResponse<{ category: Category }>>(`/categories/${idOrSlug}`),

    create: (payload: Record<string, unknown>) =>
      apiRequest<ApiResponse<{ category: Category }>>("/categories", {
        method: "POST",
        body: payload,
      }),

    update: (id: string, payload: Record<string, unknown>) =>
      apiRequest<ApiResponse<{ category: Category }>>(`/categories/${id}`, {
        method: "PATCH",
        body: payload,
      }),

    remove: (id: string) =>
      apiRequest<ApiResponse<null>>(`/categories/${id}`, {
        method: "DELETE",
      }),
  },

  products: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<PaginatedApiResponse<{ products: Product[] }>>(
        `/products?${buildQuery(params)}`
      ),

    get: (idOrSlugOrSku: string) =>
      apiRequest<ApiResponse<{ product: Product }>>(
        `/products/${idOrSlugOrSku}`
      ),

    create: (payload: Record<string, unknown>) =>
      apiRequest<ApiResponse<{ product: Product }>>("/products", {
        method: "POST",
        body: payload,
      }),

    update: (id: string, payload: Record<string, unknown>) =>
      apiRequest<ApiResponse<{ product: Product }>>(`/products/${id}`, {
        method: "PATCH",
        body: payload,
      }),

    remove: (id: string) =>
      apiRequest<ApiResponse<null>>(`/products/${id}`, {
        method: "DELETE",
      }),
  },

  roomTemplates: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<ApiResponse<{ templates: RoomTemplate[] }>>(
        `/room-templates?${buildQuery(params)}`
      ),

    get: (id: string) =>
      apiRequest<ApiResponse<{ template: RoomTemplate }>>(`/room-templates/${id}`),
  },

  visualizer: {
    save: (payload: {
      name?: string;
      roomTemplate?: string;
      uploadedImage?: string;
      selectedTile: string;
      viewState: Record<string, unknown>;
      thumbnailUrl?: string;
    }) =>
      apiRequest<ApiResponse<{ visualization: Visualization }>>("/visualizer", {
        method: "POST",
        body: payload,
      }),

    mySaves: () =>
      apiRequest<ApiResponse<{ visualizations: Visualization[] }>>(
        "/visualizer/my-saves"
      ),

    remove: (id: string) =>
      apiRequest<ApiResponse<null>>(`/visualizer/${id}`, {
        method: "DELETE",
      }),
  },

  uploads: {
    single: (formData: FormData) =>
      apiRequest<ApiResponse<{ upload: UploadRecord; fileUrl: string }>>(
        "/uploads/single",
        {
          method: "POST",
          body: formData,
          isFormData: true,
        }
      ),

    multiple: (formData: FormData) =>
      apiRequest<ApiResponse<{ uploads: UploadRecord[]; fileUrls: string[] }>>(
        "/uploads/multiple",
        {
          method: "POST",
          body: formData,
          isFormData: true,
        }
      ),
  },

  appointments: {
    create: (payload: {
      address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
      };
      date: string;
      timeSlot: string;
      notes?: string;
      paymentMethod: "online" | "cash";
    }) =>
      apiRequest<ApiResponse<{ appointment: Appointment }>>("/appointments", {
        method: "POST",
        body: payload,
      }),

    myAppointments: (params: AppointmentQueryParams = {}) =>
      apiRequest<ApiResponse<{ appointments: Appointment[] }>>(
        `/appointments/my-appointments?${buildQuery(params)}`
      ),

    list: (params: AppointmentQueryParams = {}) =>
      apiRequest<ApiResponse<{ appointments: Appointment[] }>>(
        `/appointments?${buildQuery(params)}`
      ),

    calendar: (params: AppointmentQueryParams = {}) =>
      apiRequest<ApiResponse<{ appointments: Appointment[] }>>(
        `/appointments/calendar?${buildQuery(params)}`
      ),

    staffMyAppointments: (params: AppointmentQueryParams = {}) =>
      apiRequest<ApiResponse<{ appointments: Appointment[] }>>(
        `/appointments/staff/my-appointments?${buildQuery(params)}`
      ),

    assignStaff: (id: string, staffId: string) =>
      apiRequest<ApiResponse<{ appointment: Appointment }>>(
        `/appointments/${id}/assign`,
        {
          method: "PATCH",
          body: { staffId },
        }
      ),

    updateStatus: (id: string, status: string) =>
      apiRequest<ApiResponse<{ appointment: Appointment }>>(
        `/appointments/${id}/status`,
        {
          method: "PATCH",
          body: { status },
        }
      ),
  },

  payments: {
    createOrder: (appointmentId: string) =>
      apiRequest<
        ApiResponse<{
          orderId: string;
          amount: number;
          currency: string;
          keyId: string;
        }>
      >("/payments/create-order", {
        method: "POST",
        body: { appointmentId },
      }),
  },

  staff: {
    list: (params: Record<string, unknown> = {}) =>
      apiRequest<ApiResponse<{ staff: Staff[] }>>(
        `/staff?${buildQuery(params)}`
      ),

    create: (payload: {
      name: string;
      phone: string;
      email: string;
      password?: string;
      isAvailable?: boolean;
      serviceAreas?: string[];
      notes?: string;
    }) =>
      apiRequest<ApiResponse<StaffMutationResponse>>("/staff", {
        method: "POST",
        body: payload,
      }),

    update: (
      id: string,
      payload: {
        name?: string;
        phone?: string;
        email?: string;
        password?: string;
        isAvailable?: boolean;
        serviceAreas?: string[];
        notes?: string;
      }
    ) =>
      apiRequest<ApiResponse<StaffMutationResponse>>(`/staff/${id}`, {
        method: "PATCH",
        body: payload,
      }),
  },

  admin: {
    stats: () =>
      apiRequest<ApiResponse<{ stats: AdminStats }>>("/admin/stats"),
  },
};