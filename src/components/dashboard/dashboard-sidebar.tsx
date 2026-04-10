"use client";

import {
  Boxes,
  CalendarDays,
  Heart,
  LayoutGrid,
  Layers3,
  ListChecks,
  ShieldCheck,
  Sparkles,
  User2,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type AdminDashboardTab =
  | "overview"
  | "appointments"
  | "products"
  | "categories"
  | "staff"
  | "users";

type UserDashboardTab =
  | "overview"
  | "appointments"
  | "wishlist"
  | "visualizations";

type StaffDashboardTab = "overview" | "appointments" | "today";

type DashboardRole = "admin" | "user" | "staff";

type RoleTabMap = {
  admin: AdminDashboardTab;
  user: UserDashboardTab;
  staff: StaffDashboardTab;
};

type TabItem<T extends string> = {
  key: T;
  label: string;
  icon: LucideIcon;
};

const roleTabs: {
  [K in DashboardRole]: TabItem<RoleTabMap[K]>[];
} = {
  admin: [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "appointments", label: "Appointments", icon: CalendarDays },
    { key: "products", label: "Products", icon: Boxes },
    { key: "categories", label: "Categories", icon: Layers3 },
    { key: "staff", label: "Staff", icon: ShieldCheck },
    { key: "users", label: "Users", icon: Users2 },
  ],
  user: [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "appointments", label: "Appointments", icon: CalendarDays },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "visualizations", label: "Saved Views", icon: Layers3 },
  ],
  staff: [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "appointments", label: "Calendar", icon: CalendarDays },
    { key: "today", label: "Today Queue", icon: ListChecks },
  ],
};

const roleMeta: Record<
  DashboardRole,
  { eyebrow: string; title: string; description: string }
> = {
  admin: {
    eyebrow: "Admin Workspace",
    title: "Operations Control",
    description: "Manage catalog, appointments, staff, and user activity.",
  },
  user: {
    eyebrow: "User Workspace",
    title: "My Dashboard",
    description: "Appointments, wishlist, saved views, and account activity.",
  },
  staff: {
    eyebrow: "Staff Workspace",
    title: "Daily Operations",
    description: "Track appointments, calendar flow, and today’s work queue.",
  },
};

export function DashboardSidebar<R extends DashboardRole>({
  role,
  activeTab,
  onChange,
  userName,
  userEmail,
}: {
  role: R;
  activeTab: RoleTabMap[R];
  onChange: (tab: RoleTabMap[R]) => void;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const items = roleTabs[role];
  const meta = roleMeta[role];
  const initials = (userName || meta.title)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className={cn(
        "border-none",
        "[&_[data-sidebar=sidebar]]:border-r [&_[data-sidebar=sidebar]]:border-[#2c241d]",
        "[&_[data-sidebar=sidebar]]:bg-[linear-gradient(180deg,#151210_0%,#1c1713_100%)]",
        "[&_[data-sidebar=sidebar]]:text-white",
      )}
    >
      <SidebarHeader className="gap-4 border-b border-white/8 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f2e5d4_0%,#dfc4a1_100%)] text-[#171411] shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/52">
              {meta.eyebrow}
            </p>
            <h2 className="truncate text-[1.02rem] font-semibold tracking-[-0.03em] text-white">
              {meta.title}
            </h2>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-white/8 bg-white/5 p-3.5">
          <p className="text-sm leading-6 text-white/68">{meta.description}</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="gap-1.5">
              {items.map((item) => {
                const Icon = item.icon;
                const active = item.key === activeTab;

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      type="button"
                      tooltip={item.label}
                      isActive={active}
                      onClick={() => onChange(item.key)}
                      className={cn(
                        "h-12 rounded-[1rem] px-3 transition-all duration-200",
                        active
                          ? "bg-[linear-gradient(135deg,#f4e8db_0%,#e7d3ba_100%)] text-[#171411] shadow-[0_12px_24px_rgba(0,0,0,0.16)] hover:bg-[linear-gradient(135deg,#f4e8db_0%,#e7d3ba_100%)]"
                          : "bg-transparent text-white/78 hover:bg-white/6 hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                          active
                            ? "border-[#e6c8a1] bg-white text-[#a9743c]"
                            : "border-white/10 bg-white/6 text-white/72",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <span className="truncate text-sm font-semibold tracking-[-0.02em]">
                        {item.label}
                      </span>

                      <span
                        className={cn(
                          "ml-auto h-2 w-2 shrink-0 rounded-full",
                          active ? "bg-[#b77d45]" : "bg-white/14",
                        )}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 p-3">
        <div className="rounded-[1.1rem] border border-white/8 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f2e5d4_0%,#dfc4a1_100%)] text-[#171411]">
              {initials ? (
                <span className="text-xs font-bold tracking-[0.08em]">
                  {initials}
                </span>
              ) : (
                <User2 className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {userName || "Dashboard User"}
              </p>
              <p className="truncate text-xs text-white/52">
                {userEmail || meta.eyebrow}
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}