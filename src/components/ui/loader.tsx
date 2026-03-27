export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent-primary)] border-r-transparent" />
        <span>{label}</span>
      </div>
    </div>
  );
}
