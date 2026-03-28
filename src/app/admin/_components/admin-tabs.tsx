import {
  Boxes,
  LayoutGrid,
  Layers3,
  ShieldCheck,
  Users2,
} from "lucide-react";
import type { AdminTabKey } from "../_hooks/use-admin-dashboard";

const tabs: {
  key: AdminTabKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "overview",
    label: "Overview",
    description: "Stats & activity",
    icon: LayoutGrid,
  },
  {
    key: "products",
    label: "Products",
    description: "Tile catalog",
    icon: Boxes,
  },
  {
    key: "categories",
    label: "Categories",
    description: "Catalog groups",
    icon: Layers3,
  },
  {
    key: "staff",
    label: "Staff",
    description: "Assignments",
    icon: ShieldCheck,
  },
  {
    key: "users",
    label: "Users",
    description: "Accounts",
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
    <div className="rounded-[1.6rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,#f9f5ee_0%,#f5efe5_100%)] p-3 shadow-[0_16px_40px_rgba(20,16,10,0.06)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const active = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`group relative overflow-hidden rounded-[1.25rem] border p-3 text-left transition-all duration-200 ${
                active
                  ? "border-transparent bg-[linear-gradient(135deg,#171411_0%,#2c241d_100%)] text-white shadow-[0_18px_40px_rgba(20,16,10,0.16)]"
                  : "border-[var(--border-soft)] bg-white/82 text-[var(--text-primary)] hover:border-[#c29a72]/45 hover:bg-white hover:shadow-[0_12px_28px_rgba(20,16,10,0.08)]"
              } ${index === tabs.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                    active
                      ? "border-white/12 bg-white/10 text-white"
                      : "border-[var(--border-soft)] bg-[#f8f3eb] text-[#3c322b] group-hover:bg-[#f2e7d8]"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    active
                      ? "bg-[#d7a36b]"
                      : "bg-[var(--border-soft)] group-hover:bg-[#c29a72]"
                  }`}
                />
              </div>

              <div className="mt-3 min-w-0">
                <p
                  className={`truncate text-sm font-semibold tracking-[-0.02em] ${
                    active ? "text-white" : "text-[var(--text-primary)]"
                  }`}
                >
                  {tab.label}
                </p>

                <p
                  className={`mt-1 hidden text-xs leading-5 sm:block ${
                    active ? "text-white/70" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {tab.description}
                </p>
              </div>

              {active ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-[#d7a36b]" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}