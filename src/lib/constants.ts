export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SquareFoot";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const PRODUCT_MATERIALS = ["ceramic", "porcelain", "vitrified", "natural_stone", "marble", "granite", "mosaic"] as const;
export const TIME_SLOTS = [
  "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
  "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
] as const;
