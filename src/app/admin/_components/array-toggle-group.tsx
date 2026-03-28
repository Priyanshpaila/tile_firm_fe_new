export function ArrayToggleGroup({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (active) {
                  onChange(selected.filter((item) => item !== option));
                } else {
                  onChange([...selected, option]);
                }
              }}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                active
                  ? "bg-[var(--text-primary)] text-white"
                  : "border border-[var(--border-soft)] bg-white text-[var(--text-secondary)] hover:border-[var(--text-primary)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}