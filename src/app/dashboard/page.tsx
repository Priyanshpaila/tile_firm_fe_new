"use client";

import {
  CalendarDays,
  Heart,
  LayoutGrid,
  Layers3,
} from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import {
  DashboardShell,
  type DashboardTabDefinition,
} from "@/components/dashboard/dashboard-shell";
import { UserOverviewTab } from "./_components/user-overview-tab";
import { UserAppointmentsTab } from "./_components/user-appointments-tab";
import { UserWishlistTab } from "./_components/user-wishlist-tab";
import { UserVisualizationsTab } from "./_components/user-visualizations-tab";
import {
  useUserDashboard,
  type UserDashboardTab,
} from "./_hooks/use-user-dashboard";

const tabs: DashboardTabDefinition<UserDashboardTab>[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "appointments", label: "Appointments", icon: CalendarDays },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "visualizations", label: "Saved Views", icon: Layers3 },
];

export default function UserDashboardPage() {
  const dashboard = useUserDashboard();

  return (
    <AuthGuard roles={["user"]}>
      <DashboardShell
        role="user"
        title="My Dashboard"
        description="Manage your appointments, wishlist, upcoming appointments, and saved room previews from one place."
        tabs={tabs}
        activeTab={dashboard.activeTab}
        onChange={dashboard.setActiveTab}
      >
        <div className="grid gap-6">
          <section hidden={dashboard.activeTab !== "overview"}>
            <UserOverviewTab
              user={dashboard.user}
              loading={dashboard.loadingOverview}
              error={dashboard.error}
              stats={dashboard.stats}
              upcomingAppointment={dashboard.upcomingAppointment}
              recentVisualization={dashboard.recentVisualization}
            />
          </section>

          <section hidden={dashboard.activeTab !== "appointments"}>
            <UserAppointmentsTab />
          </section>

          <section hidden={dashboard.activeTab !== "wishlist"}>
            <UserWishlistTab
              loading={dashboard.loadingWishlist}
              error={dashboard.error}
              wishlist={dashboard.wishlist}
              onRefresh={() => void dashboard.loadWishlist()}
            />
          </section>

          <section hidden={dashboard.activeTab !== "visualizations"}>
            <UserVisualizationsTab
              loading={dashboard.loadingVisualizations}
              error={dashboard.error}
              visualizations={dashboard.visualizations}
              onRefresh={() => void dashboard.loadVisualizations()}
            />
          </section>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}