export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  catalog: "/catalog",
  visualizer: "/visualizer",
  visualizer3d: "/visualizer/3d",
  booking: "/booking",
  uploadRoom: "/upload-room",
  dashboard: "/dashboard",
  profile: "/profile",
  admin: "/admin"
} as const;

export function roleHome(role?: string | null) {
  if (role === "admin") return ROUTES.admin;
  if (role === "staff") return ROUTES.dashboard;
  return ROUTES.dashboard;
}
