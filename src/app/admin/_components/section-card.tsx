import type { ReactNode } from "react";

export function SectionCard({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.6rem] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.88)_100%)] shadow-[0_20px_50px_rgba(20,16,10,0.06)]">
      <div className="border-b border-[var(--border-soft)] px-4 py-4 sm:px-5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="w-full lg:w-auto">{actions}</div> : null}
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5 md:px-6">{children}</div>
    </section>
  );
}