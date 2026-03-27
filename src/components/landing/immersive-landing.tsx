"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { kicker: "Curated Collections", title: "Premium tile catalog built for quick exploration.", copy: "Search finishes, materials, sizes, and featured inventory with a contract-matched product data layer." },
  { kicker: "Visualizer Workflow", title: "Apply tiles across room presets before making a decision.", copy: "The starter includes a 2D visualizer, upload flow, and save architecture aligned to your backend." },
  { kicker: "At-Home Visits", title: "Book on-site consultations with structured appointment and payment hooks.", copy: "Appointments, Razorpay order creation, and admin assignment scaffolding are already wired." },
];

export function ImmersiveLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      panels.forEach((panel) => {
        const content = panel.querySelector("[data-panel-content]");
        if (!content) return;
        gsap.fromTo(content, { opacity: 0, y: 40 }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 80%" },
        });
      });
      const story = document.querySelector("[data-story]");
      if (story) {
        ScrollTrigger.create({ trigger: story, start: "top top", end: "+=1600", scrub: true, pin: true });
      }
      gsap.fromTo("[data-hero-copy]", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.1, ease: "power4.out" });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="overflow-x-hidden">
      <section className="container-shell relative min-h-[86vh] py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div data-hero-copy className="space-y-6">
            <Badge>GSAP-driven landing experience</Badge>
            <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-7xl">Visualize, shortlist, and book premium tile experiences from one flow.</h1>
            <p className="max-w-2xl text-lg text-[var(--text-secondary)]">A continuous landing journey with catalog exploration, room previews, upload-driven inspiration, and booking conversion paths already connected to the real backend contract.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={ROUTES.catalog}><Button>Explore Catalog</Button></Link>
              <Link href={ROUTES.visualizer}><Button variant="secondary">Open Visualizer</Button></Link>
            </div>
          </div>
          <div className="card-surface relative min-h-[440px] overflow-hidden p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(199,159,107,0.30),transparent_40%)]" />
            <div className="relative grid h-full gap-4">
              <div className="rounded-[24px] border border-[var(--border-soft)] bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">Catalog signal</p>
                <p className="mt-4 text-3xl font-semibold">Finishes, usage, sizes, and price filters</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-alt)]/80 p-4">
                  <p className="text-sm text-[var(--text-secondary)]">Room templates</p>
                  <p className="mt-2 text-2xl font-semibold">2D preset + 3D model support</p>
                </div>
                <div className="rounded-[24px] border border-[var(--border-soft)] bg-white/70 p-4">
                  <p className="text-sm text-[var(--text-secondary)]">Booking</p>
                  <p className="mt-2 text-2xl font-semibold">Online or cash appointment flow</p>
                </div>
              </div>
              <div className="rounded-[30px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,rgba(139,94,52,0.92),rgba(199,159,107,0.78))] p-6 text-white">
                <p className="text-xs uppercase tracking-[0.3em]">TileVista starter</p>
                <p className="mt-4 text-3xl font-semibold">Role-aware dashboards and upload workflows included.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section data-story className="container-shell">
        <div className="card-surface grid min-h-[70vh] items-center gap-8 p-8 md:grid-cols-2">
          <div>
            <Badge>Pinned storytelling block</Badge>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">Keep the experience continuous instead of sectioned.</h2>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-[var(--text-secondary)]">The background system, surface treatment, and transitions are intentionally unified so the user feels one immersive scroll rather than stacked disconnected blocks.</p>
            <p className="text-lg text-[var(--text-secondary)]">This is the right place to later deepen the brand, add media, Spline assets, or richer story moments.</p>
          </div>
        </div>
      </section>
      {sections.map((section) => (
        <section key={section.title} data-panel className="container-shell py-16 md:py-24">
          <div data-panel-content className="grid gap-6 md:grid-cols-[0.7fr_1.3fr]">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-secondary)]">{section.kicker}</p>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{section.title}</h2>
              <p className="max-w-3xl text-lg text-[var(--text-secondary)]">{section.copy}</p>
            </div>
          </div>
        </section>
      ))}
      <section className="container-shell py-16 md:py-20">
        <div className="card-surface grid gap-8 p-8 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--text-secondary)]">Starter sections</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em]">Hero, categories, visualizer, uploads, booking, proof, and CTA.</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p>All major landing structures requested in the brief are already present and organized so you can replace content later without disturbing the wiring.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={ROUTES.booking}><Button>Book Consultation</Button></Link>
              <Link href={ROUTES.uploadRoom}><Button variant="secondary">Upload Room</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
