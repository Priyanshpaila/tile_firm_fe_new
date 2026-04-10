"use client";

import {
  CalendarDays,
  LayoutGrid,
  ListChecks,
} from "lucide-react";
import { AuthGuard } from "@/components/layout/auth-guard";
import {
  DashboardShell,
  type DashboardTabDefinition,
} from "@/components/dashboard/dashboard-shell";
import { StaffOverviewTab } from "./_components/staff-overview-tab";
import { StaffAppointmentsTab } from "./_components/staff-appointments-tab";
import { StaffTodayTab } from "./_components/staff-today-tab";
import {
  useStaffDashboard,
  type StaffDashboardTab,
} from "./_hooks/use-staff-dashboard";

const tabs: DashboardTabDefinition<StaffDashboardTab>[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "appointments", label: "Calendar", icon: CalendarDays },
  { key: "today", label: "Today Queue", icon: ListChecks },
];

export default function StaffDashboardPage() {
  const dashboard = useStaffDashboard();

  return (
    <AuthGuard roles={["staff"]}>
      <DashboardShell
        role="staff"
        title="Staff Dashboard"
        description="Track assigned appointments, daily queues, and current workload."
        tabs={tabs}
        activeTab={dashboard.activeTab}
        onChange={dashboard.setActiveTab}
      >
        <div className="grid gap-6">
          <section hidden={dashboard.activeTab !== "overview"}>
            <StaffOverviewTab
              user={dashboard.user}
              loading={dashboard.loading}
              error={dashboard.error}
              stats={dashboard.stats}
              nextAppointment={dashboard.nextAppointment}
            />
          </section>

          <section hidden={dashboard.activeTab !== "appointments"}>
            <StaffAppointmentsTab />
          </section>

          <section hidden={dashboard.activeTab !== "today"}>
            <StaffTodayTab
              loading={dashboard.loading}
              error={dashboard.error}
              todayAppointments={dashboard.todayAppointments}
              onRefresh={() => void dashboard.loadAppointments()}
            />
          </section>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}