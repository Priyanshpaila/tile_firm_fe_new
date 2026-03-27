import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border-soft)] py-10">
      <div className="container-shell grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold">TileVista</h3>
          <p className="mt-2 max-w-xl text-sm text-[var(--text-secondary)]">Starter frontend scaffold for a tiles and interiors platform with catalog, visualizer, booking, uploads, authentication, and role-aware dashboards.</p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          <Link href={ROUTES.catalog}>Catalog</Link>
          <Link href={ROUTES.visualizer}>Visualizer</Link>
          <Link href={ROUTES.booking}>Book Service</Link>
          <Link href={ROUTES.login}>Login</Link>
        </div>
      </div>
    </footer>
  );
}
