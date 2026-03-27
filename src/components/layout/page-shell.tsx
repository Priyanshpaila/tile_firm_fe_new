import { ReactNode } from "react";

export function PageShell({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode; }) {
  return (
    <section className="container-shell py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="section-title">{title}</h1>
          {description ? <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
