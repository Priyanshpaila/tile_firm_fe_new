import {
  Boxes,
  CalendarDays,
  LayoutGrid,
  Layers3,
  ShieldCheck,
  Users2,
} from "lucide-react";
import type { AdminTabKey } from "../_hooks/use-admin-dashboard";

const tabs: {
  key: AdminTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    key: "appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
  {
    key: "products",
    label: "Products",
    icon: Boxes,
  },
  {
    key: "categories",
    label: "Categories",
    icon: Layers3,
  },
  {
    key: "staff",
    label: "Staff",
    icon: ShieldCheck,
  },
  {
    key: "users",
    label: "Users",
    icon: Users2,
  },
];

export function AdminTabs({
  activeTab,
  onChange,
}: {
  activeTab: AdminTabKey;
  onChange: (tab: AdminTabKey) => void;
}) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#f8f4ec_0%,#f4ede2_100%)] p-2 sm:p-2.5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`group flex min-h-[56px] items-center gap-3 rounded-[1rem] border px-3 py-2.5 text-left transition-all duration-200 sm:min-h-[58px] sm:px-3.5 ${
                active
                  ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white shadow-[0_10px_24px_rgba(20,16,10,0.14)]"
                  : "border-[var(--border-soft)] bg-white/88 text-[var(--text-primary)] hover:border-[#c29a72]/40 hover:bg-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition sm:h-9 sm:w-9 ${
                  active
                    ? "border-white/10 bg-white/10 text-white"
                    : "border-[var(--border-soft)] bg-[#f8f3eb] text-[#4b4037]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-semibold tracking-[-0.02em] ${
                    active ? "text-white" : "text-[var(--text-primary)]"
                  }`}
                >
                  {tab.label}
                </p>
              </div>

              <span
                className={`h-2 w-2 shrink-0 rounded-full transition ${
                  active ? "bg-[#d7a36b]" : "bg-[var(--border-soft)]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}