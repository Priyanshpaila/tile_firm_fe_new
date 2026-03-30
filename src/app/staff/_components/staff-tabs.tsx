import {
  CalendarDays,
  LayoutGrid,
  ListChecks,
} from "lucide-react";
import type { StaffDashboardTab } from "../_hooks/use-staff-dashboard";

const tabs: {
  key: StaffDashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "appointments", label: "Calendar", icon: CalendarDays },
  { key: "today", label: "Today Queue", icon: ListChecks },
];

export function StaffTabs({
  activeTab,
  onChange,
}: {
  activeTab: StaffDashboardTab;
  onChange: (tab: StaffDashboardTab) => void;
}) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#f8f4ec_0%,#f4ede2_100%)] p-2 sm:p-2.5">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex min-h-[54px] items-center gap-3 rounded-[1rem] border px-3 py-2.5 text-left transition-all ${
                active
                  ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white shadow-[0_10px_24px_rgba(20,16,10,0.14)]"
                  : "border-[var(--border-soft)] bg-white/88 text-[var(--text-primary)] hover:border-[#c29a72]/40 hover:bg-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                  active
                    ? "border-white/10 bg-white/10 text-white"
                    : "border-[var(--border-soft)] bg-[#f8f3eb] text-[#4b4037]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate text-sm font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}