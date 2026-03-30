"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { PageShell } from "@/components/layout/page-shell";
import { UserTabs } from "./_components/user-tabs";
import { UserOverviewTab } from "./_components/user-overview-tab";
import { UserAppointmentsTab } from "./_components/user-appointments-tab";
import { UserWishlistTab } from "./_components/user-wishlist-tab";
import { UserVisualizationsTab } from "./_components/user-visualizations-tab";
import { useUserDashboard } from "./_hooks/use-user-dashboard";

export default function UserDashboardPage() {
  const dashboard = useUserDashboard();

  return (
    <AuthGuard roles={["user"]}>
      <PageShell
        title="My Dashboard"
        description="Manage your appointments, wishlist, saved room previews, and account activity."
      >
        <div className="grid gap-6">
          <UserTabs
            activeTab={dashboard.activeTab}
            onChange={dashboard.setActiveTab}
          />

          {dashboard.activeTab === "overview" ? (
            <UserOverviewTab
              user={dashboard.user}
              loading={dashboard.loadingOverview}
              error={dashboard.error}
              stats={dashboard.stats}
              upcomingAppointment={dashboard.upcomingAppointment}
              recentVisualization={dashboard.recentVisualization}
            />
          ) : null}

          {dashboard.activeTab === "appointments" ? (
            <UserAppointmentsTab />
          ) : null}

          {dashboard.activeTab === "wishlist" ? (
            <UserWishlistTab
              loading={dashboard.loadingWishlist}
              error={dashboard.error}
              wishlist={dashboard.wishlist}
              onRefresh={() => void dashboard.loadWishlist()}
            />
          ) : null}

          {dashboard.activeTab === "visualizations" ? (
            <UserVisualizationsTab
              loading={dashboard.loadingVisualizations}
              error={dashboard.error}
              visualizations={dashboard.visualizations}
              onRefresh={() => void dashboard.loadVisualizations()}
            />
          ) : null}
        </div>
      </PageShell>
    </AuthGuard>
  );
}