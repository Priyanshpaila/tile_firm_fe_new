import type { Visualization } from "@/types";

export function UserVisualizationsTab({
  loading,
  error,
  visualizations,
  onRefresh,
}: {
  loading: boolean;
  error: string;
  visualizations: Visualization[];
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-white p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Saved Room Previews
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Your previously saved visualizer states and room experiments.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="rounded-full border border-[var(--border-soft)] bg-white px-4 py-2 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[1rem] bg-[#faf7f2] px-4 py-8 text-sm text-[var(--text-secondary)]">
          Loading saved previews...
        </div>
      ) : visualizations.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visualizations.map((item) => (
            <article
              key={item._id}
              className="rounded-[1.25rem] border border-[var(--border-soft)] bg-[#fcfbf8] p-4"
            >
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {item.name || "Untitled Save"}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Saved{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "recently"}
              </p>
              <div className="mt-4 rounded-[1rem] bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                This saved state can later be reopened inside your visualizer flow.
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1rem] bg-[#faf7f2] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
          No saved room previews yet.
        </div>
      )}
    </div>
  );
}