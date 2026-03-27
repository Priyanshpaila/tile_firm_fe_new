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
  parentCategory?: string | null;
  children?: Category[];
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
  category?: Category;
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
}

export interface RoomTemplate {
  _id: string;
  name: string;
  type: "2d_preset" | "3d_model";
  roomCategory: "bathroom" | "kitchen" | "living_room" | "bedroom" | "outdoor" | "commercial";
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
}

export interface UploadRecord {
  _id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadType: "product_image" | "room_photo" | "room_template" | "avatar";
  url: string;
  createdAt?: string;
}

export interface Visualization {
  _id: string;
  name: string;
  roomTemplate?: RoomTemplate;
  uploadedImage?: UploadRecord;
  selectedTile: Product;
  viewState: Record<string, unknown>;
  thumbnailUrl?: string;
  createdAt?: string;
}

export interface Appointment {
  _id: string;
  ticketNumber: string;
  user?: Pick<User, "_id" | "name" | "email" | "phone">;
  staff?: { _id: string; name: string; phone?: string } | null;
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
  status: "created" | "confirmed" | "assigned" | "in_progress" | "completed" | "cancelled" | "closed";
  paymentMethod: "online" | "cash";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  visitFee: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
}

export interface Staff {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  isAvailable?: boolean;
  serviceAreas?: string[];
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalAppointments: number;
  totalUploads: number;
  recentAppointments: Appointment[];
}
