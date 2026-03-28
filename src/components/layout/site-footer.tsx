import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const shell =
  "mx-auto w-[calc(100%-1.5rem)] max-w-[1720px] md:w-[calc(100%-3rem)]";

type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = {
  label: string;
  href: string;
};

const exploreLinks: FooterLink[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Catalog", href: ROUTES.catalog },
  { label: "Room Visualizer", href: ROUTES.visualizer },
  { label: "3D Visualizer", href: ROUTES.visualizer3d },
  { label: "Book Service", href: ROUTES.booking },
];

const sectionLinks: FooterLink[] = [
  { label: "About Us", href: `${ROUTES.home}#about` },
  { label: "Collections", href: `${ROUTES.home}#collections` },
  { label: "Categories", href: `${ROUTES.home}#categories` },
  { label: "Contact", href: `${ROUTES.home}#contact` },
];

const socialLinks: SocialLink[] = [
  { label: "IG", href: "#" },
  { label: "FB", href: "#" },
  { label: "X", href: "#" },
  { label: "YT", href: "#" },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="pb-5 pt-5 md:pb-6 md:pt-6">
      <div className={`${shell} overflow-hidden rounded-[2rem] bg-[#070707] text-white`}>
        <div className="px-6 pb-6 pt-6 md:px-10 md:pb-8 md:pt-8">
          <div className="grid gap-8 md:grid-cols-[1.15fr_0.8fr_0.8fr_1.1fr] md:gap-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/45">
                TileVista
              </p>

              <h3 className="mt-3 max-w-[21rem] text-[1.55rem] font-semibold leading-[1.04] tracking-[-0.05em] text-white md:text-[2rem]">
                Premium tile selections, visual previews, and expert assistance.
              </h3>

              <p className="mt-4 max-w-[27rem] text-sm leading-7 text-white/60">
                Explore floor tiles, wall tiles, bathroom tiles, kitchen tiles,
                and outdoor tile options with a smoother consultation and
                visualization experience.
              </p>

              <div className="mt-6 flex gap-3">
                {socialLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs text-white/80 transition hover:border-white/30 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/90">Contact Us</h4>
              <div className="mt-4 space-y-2 text-sm leading-7 text-white/60">
                <p>hello@tilevista.com</p>
                <p>+91 90000 00000</p>
                <p>Mon - Sat · 10:00 AM to 7:00 PM</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/90">Location</h4>
              <div className="mt-4 space-y-2 text-sm leading-7 text-white/60">
                <p>TileVista Experience Center</p>
                <p>Raipur, Chhattisgarh</p>
                <p>India</p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-white/90">Explore</h4>
                <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
                  {exploreLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white/90">Sections</h4>
                <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
                  {sectionLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 h-px w-full bg-white/10" />

          <div className="mt-4 flex flex-col gap-3 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
            <p>© 2026 TileVista. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="#" className="transition hover:text-white/75">
                Privacy Policy
              </Link>
              <Link href="#" className="transition hover:text-white/75">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none select-none overflow-hidden px-4 pb-1 md:px-8">
          <div className="translate-y-[34%] text-[4rem] font-semibold tracking-[-0.07em] text-white/8 md:text-[8.5rem]">
            TILEVISTA
          </div>
        </div>
      </div>
    </footer>
  );
}