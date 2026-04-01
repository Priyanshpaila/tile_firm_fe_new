import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  title,
  description,
  actions,
  children,
  fullWidth = false,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <section className={cn("py-10", fullWidth ? "px-4 md:px-6 xl:px-8" : "container-shell")}>
      <div className={cn("mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", fullWidth && "mx-auto max-w-[1720px]")}>
        <div>
          <h1 className="section-title">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>

      <div className={cn(fullWidth && "mx-auto max-w-[1720px]")}>
        {children}
      </div>
    </section>
  );
}