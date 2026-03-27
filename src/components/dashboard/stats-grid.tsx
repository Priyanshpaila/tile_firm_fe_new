export function StatsGrid({ items }: { items: Array<{ label: string; value: string | number; help?: string }>; }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card-surface p-5">
          <p className="text-sm text-[var(--text-secondary)]">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold">{item.value}</p>
          {item.help ? <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.help}</p> : null}
        </div>
      ))}
    </div>
  );
}
