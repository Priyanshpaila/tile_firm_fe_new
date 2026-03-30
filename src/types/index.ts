export type Role = "user" | "admin" | "staff";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pagination: ApiPagination;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  isActive?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  parentCategory?: string | Category | null;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category?: string | Category;
  finishes: string[];
  usages: string[];
  material: string;
  sizes: string[];
  thickness?: string;
  boxCoverage?: number;
  piecesPerBox?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomTemplate {
  _id: string;
  name: string;
  type: "2d_preset" | "3d_model";
  roomCategory:
    | "bathroom"
    | "kitchen"
    | "living_room"
    | "bedroom"
    | "outdoor"
    | "commercial";
  backgroundImageUrl?: string;
  surfaceMasks?: {
    name: string;
    surfaceType: "floor" | "wall";
    polygon: { x: number; y: number }[];
    zIndex?: number;
  }[];
  modelUrl?: string;
  meshTargets?: {
    name: string;
    surfaceType: "floor" | "wall";
    defaultRepeat?: { x: number; y: number };
  }[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UploadType =
  | "product_image"
  | "room_photo"
  | "room_template"
  | "avatar"
  | "category_image"
  | "staff_image"
  | "visualizer_asset"
  | string;

export interface UploadRecord {
  _id: string;
  originalName: string;
  filename: string;
  path?: string;
  mimetype: string;
  size: number;
  uploadType: UploadType;
  uploadedBy?: string | User;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Visualization {
  _id: string;
  name: string;
  roomTemplate?: string | RoomTemplate;
  uploadedImage?: string | UploadRecord;
  selectedTile: string | Product;
  viewState: Record<string, unknown>;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentStatus =
  | "CREATED"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "CLOSED"
  | "created"
  | "confirmed"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "closed";

export type PaymentMethod = "online" | "cash";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "pending"
  | "completed"
  | "failed"
  | "refunded";

export interface Appointment {
  _id: string;
  ticketNumber: string;
  user?: Pick<User, "_id" | "name" | "email" | "phone"> | string;
  staff?:
    | {
        _id: string;
        name: string;
        phone?: string;
        email?: string;
        isAvailable?: boolean;
      }
    | string
    | null;
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
  status: AppointmentStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  visitFee: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffUserAccount {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: Role;
  isActive?: boolean;
}

export interface Staff {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  isAvailable?: boolean;
  serviceAreas?: string[];
  notes?: string;
  userAccount?: string | StaffUserAccount | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalAppointments: number;
  totalUploads: number;
  recentAppointments: Appointment[];
}