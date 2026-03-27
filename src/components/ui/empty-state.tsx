import { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode; }) {
  return (
    <div className="card-surface flex min-h-[220px] flex-col items-center justify-center gap-3 p-8 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="max-w-lg text-sm text-[var(--text-secondary)]">{description}</p>
      {action}
    </div>
  );
}
