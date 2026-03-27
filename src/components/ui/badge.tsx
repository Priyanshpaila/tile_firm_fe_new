import { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-white/65 px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">{children}</span>;
}
