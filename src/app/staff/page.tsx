"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { PageShell } from "@/components/layout/page-shell";
import { StaffTabs } from "./_components/staff-tabs";
import { StaffOverviewTab } from "./_components/staff-overview-tab";
import { StaffAppointmentsTab } from "./_components/staff-appointments-tab";
import { StaffTodayTab } from "./_components/staff-today-tab";
import { useStaffDashboard } from "./_hooks/use-staff-dashboard";

export default function StaffDashboardPage() {
  const dashboard = useStaffDashboard();

  return (
    <AuthGuard roles={["staff"]}>
      <PageShell
        title="Staff Dashboard"
        description="Track assigned appointments, daily queues, and current workload."
      >
        <div className="grid gap-6">
          <StaffTabs
            activeTab={dashboard.activeTab}
            onChange={dashboard.setActiveTab}
          />

          {dashboard.activeTab === "overview" ? (
            <StaffOverviewTab
              user={dashboard.user}
              loading={dashboard.loading}
              error={dashboard.error}
              stats={dashboard.stats}
              nextAppointment={dashboard.nextAppointment}
            />
          ) : null}

          {dashboard.activeTab === "appointments" ? (
            <StaffAppointmentsTab />
          ) : null}

          {dashboard.activeTab === "today" ? (
            <StaffTodayTab
              loading={dashboard.loading}
              error={dashboard.error}
              todayAppointments={dashboard.todayAppointments}
              onRefresh={() => void dashboard.loadAppointments()}
            />
          ) : null}
        </div>
      </PageShell>
    </AuthGuard>
  );
}