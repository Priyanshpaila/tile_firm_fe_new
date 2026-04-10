"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

gsap.registerPlugin(ScrollTrigger);

const shell =
  "mx-auto w-[calc(100%-1.5rem)] max-w-[1720px] md:w-[calc(100%-3rem)]";

type HeroMetric = {
  value: string;
  label: string;
};

type TileCollectionItem = {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  tag: string;
  image: string;
  href: string;
};

type TileCategory = {
  id: string;
  label: string;
};

type TileCategoryProduct = {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  image: string;
  categoryId: string;
  href: string;
};

type TestimonialItem = {
  text: string;
  image: string;
  name: string;
  role: string;
};

const heroImage =
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=2200&q=80";

const promoImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2200&q=80";

const ctaImage =
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2200&q=80";

const heroMetrics: HeroMetric[] = [
  { value: "200+", label: "Tile designs" },
  { value: "50+", label: "Room previews" },
  { value: "Pan India", label: "Delivery support" },
];

/**
 * Easy future API integration:
 * - replace these arrays with API data
 * - keep the same object shape or map backend response into this shape
 */
const featuredCollections: TileCollectionItem[] = [
  {
    id: "porcelain-marble",
    title: "Porcelain Marble Finish",
    subtitle: "Glossy · 600×1200 mm",
    priceLabel: "From ₹68 / sq.ft",
    tag: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1616594039964-3c8c2d2e6d4b?auto=format&fit=crop&w=1000&q=80",
    href: ROUTES.catalog,
  },
  {
    id: "wood-finish-planks",
    title: "Wood Finish Planks",
    subtitle: "Matt · Living & Bedroom",
    priceLabel: "From ₹74 / sq.ft",
    tag: "Premium Look",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
    href: ROUTES.catalog,
  },
  {
    id: "subway-wall",
    title: "Subway Wall Tiles",
    subtitle: "Kitchen & Feature Walls",
    priceLabel: "From ₹42 / sq.ft",
    tag: "Top Rated",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    href: ROUTES.catalog,
  },
  {
    id: "stone-texture",
    title: "Stone Texture Tiles",
    subtitle: "Outdoor & Accent Surfaces",
    priceLabel: "From ₹81 / sq.ft",
    tag: "Outdoor",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=80",
    href: ROUTES.catalog,
  },
  {
    id: "bathroom-anti-skid",
    title: "Bathroom Anti-Skid",
    subtitle: "Safe Grip · Wet Areas",
    priceLabel: "From ₹49 / sq.ft",
    tag: "Functional",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80",
    href: ROUTES.catalog,
  },
  {
    id: "parking-heavy-duty",
    title: "Parking Heavy Duty",
    subtitle: "Exterior · Durable Finish",
    priceLabel: "From ₹58 / sq.ft",
    tag: "Heavy Duty",
    image:
      "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=1000&q=80",
    href: ROUTES.catalog,
  },
];

const tileCategories: TileCategory[] = [
  { id: "living-room", label: "Living Room Tiles" },
  { id: "bathroom", label: "Bathroom Tiles" },
  { id: "kitchen", label: "Kitchen Tiles" },
  { id: "outdoor", label: "Outdoor Tiles" },
];

const categoryProducts: TileCategoryProduct[] = [
  {
    id: "living-marble-beige",
    title: "Beige Marble Porcelain",
    subtitle: "Glossy · 600×1200 mm",
    priceLabel: "From ₹72 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1616594039964-3c8c2d2e6d4b?auto=format&fit=crop&w=1000&q=80",
    categoryId: "living-room",
    href: ROUTES.catalog,
  },
  {
    id: "living-wood-oak",
    title: "Natural Oak Wood Finish",
    subtitle: "Matt · 200×1200 mm",
    priceLabel: "From ₹79 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80",
    categoryId: "living-room",
    href: ROUTES.catalog,
  },
  {
    id: "bathroom-anti-skid-grey",
    title: "Grey Anti-Skid Tile",
    subtitle: "Safe Grip · 300×300 mm",
    priceLabel: "From ₹46 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80",
    categoryId: "bathroom",
    href: ROUTES.catalog,
  },
  {
    id: "bathroom-wall-white",
    title: "White Bathroom Wall Tile",
    subtitle: "Clean Finish · 300×600 mm",
    priceLabel: "From ₹39 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=80",
    categoryId: "bathroom",
    href: ROUTES.catalog,
  },
  {
    id: "kitchen-subway",
    title: "Kitchen Subway Gloss",
    subtitle: "Backsplash · 75×300 mm",
    priceLabel: "From ₹44 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    categoryId: "kitchen",
    href: ROUTES.catalog,
  },
  {
    id: "kitchen-stone-matt",
    title: "Stone Matt Kitchen Tile",
    subtitle: "Low Maintenance · 600×600 mm",
    priceLabel: "From ₹62 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80",
    categoryId: "kitchen",
    href: ROUTES.catalog,
  },
  {
    id: "outdoor-parking",
    title: "Parking Vitrified Tile",
    subtitle: "Durable · Exterior Grade",
    priceLabel: "From ₹57 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=1000&q=80",
    categoryId: "outdoor",
    href: ROUTES.catalog,
  },
  {
    id: "outdoor-stone",
    title: "Outdoor Stone Texture",
    subtitle: "Anti-Slip · Open Areas",
    priceLabel: "From ₹66 / sq.ft",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=80",
    categoryId: "outdoor",
    href: ROUTES.catalog,
  },
];

const testimonials: TestimonialItem[] = [
  {
    text: "The visualizer helped us shortlist the exact beige marble finish for our living room before ordering. It made the whole tile selection process much easier.",
    image:
      "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Neha Sharma",
    role: "Homeowner",
  },
  {
    text: "We compared multiple bathroom anti-skid options and finalised faster than expected. The consultation team explained finish, size, and maintenance very clearly.",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Arjun Mehta",
    role: "Residential Client",
  },
  {
    text: "The catalog feels premium and the tile ranges are easy to understand. We used it to choose wall tiles for a kitchen renovation and it saved us a lot of time.",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Nair",
    role: "Interior Stylist",
  },
  {
    text: "From product browsing to room preview, the experience felt very smooth. It gave our clients more confidence before finalizing tile combinations.",
    image:
      "https://randomuser.me/api/portraits/men/41.jpg",
    name: "Rohit Jain",
    role: "Architect",
  },
  {
    text: "We were able to review outdoor and parking tile options in one place. The product presentation and finishes were much more helpful than a normal catalog sheet.",
    image:
      "https://randomuser.me/api/portraits/men/56.jpg",
    name: "Siddharth Verma",
    role: "Builder",
  },
  {
    text: "The premium look of the collections and the consultation support made the final decision easy for our bathroom and kitchen renovation project.",
    image:
      "https://randomuser.me/api/portraits/women/36.jpg",
    name: "Kavya Iyer",
    role: "Home Renovation Client",
  },
  {
    text: "Being able to compare tile categories quickly was the best part. We shortlisted living room and feature wall tiles without visiting multiple stores.",
    image:
      "https://randomuser.me/api/portraits/women/24.jpg",
    name: "Aditi Kapoor",
    role: "Apartment Owner",
  },
  {
    text: "The consultation flow is well thought out. It helped us select a durable exterior tile with the right tone and finish for our project site.",
    image:
      "https://randomuser.me/api/portraits/men/18.jpg",
    name: "Vivek Rao",
    role: "Contractor",
  },
  {
    text: "The room-preview approach makes a real difference. It feels modern, practical, and much more trustworthy than choosing from flat swatches alone.",
    image:
      "https://randomuser.me/api/portraits/women/52.jpg",
    name: "Ritika Malhotra",
    role: "Design Consultant",
  },
];

function TileCard({
  item,
}: {
  item: TileCollectionItem | TileCategoryProduct;
}) {
  return (
    <Link
      href={item.href}
      data-reveal
      className="group rounded-[1.45rem] border border-black/6 bg-[#efebe6] p-4 transition hover:translate-y-[-3px] hover:shadow-[0_18px_40px_rgba(20,16,10,0.08)]"
    >
      {"tag" in item ? (
        <div className="mb-4">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#38312a] shadow-sm">
            {item.tag}
          </span>
        </div>
      ) : null}

      <div className="flex items-center justify-center rounded-[1.15rem] bg-[#f6f4f0] p-6">
        <img
          src={item.image}
          alt={item.title}
          className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#1e1a17]">{item.title}</p>
          <p className="mt-1 text-sm text-[#6f655a]">{item.subtitle}</p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[#151210]">
            {item.priceLabel}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#1a1613]">
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}

function TestimonialsColumn({
  className,
  items,
  duration = 16,
}: {
  className?: string;
  items: TestimonialItem[];
  duration?: number;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            {items.map((item, i) => (
              <div
                key={`${item.name}-${i}-${index}`}
                className="rounded-[1.45rem] border border-black/6 bg-[#efebe6] p-5 shadow-[0_16px_34px_rgba(20,16,10,0.05)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#a9743c]">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#a9743c] shadow-sm">
                    <Quote size={16} />
                  </div>
                </div>

                <p className="text-[15px] leading-7 text-[#3e342c]">
                  {item.text}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-11 w-11 rounded-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#1e1a17]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#6f655a]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function ImmersiveLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const heroOverlayRef = useRef<HTMLDivElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const heroStatsRef = useRef<HTMLDivElement | null>(null);

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    tileCategories[0].id,
  );

  const filteredCategoryProducts = useMemo(() => {
    return categoryProducts.filter(
      (item) => item.categoryId === activeCategoryId,
    );
  }, [activeCategoryId]);

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  useEffect(() => {
    let cleanupParallax: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
            },
          },
        );
      });

      if (heroContentRef.current) {
        gsap.fromTo(
          heroContentRef.current,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
          },
        );
      }

      if (heroStatsRef.current) {
        gsap.fromTo(
          heroStatsRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 0.15,
            ease: "power4.out",
          },
        );
      }

      if (heroRef.current && heroBgRef.current) {
        gsap.to(heroBgRef.current, {
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const hero = heroRef.current;
      const heroBg = heroBgRef.current;
      const heroOverlay = heroOverlayRef.current;
      const heroContent = heroContentRef.current;
      const heroStats = heroStatsRef.current;

      if (
        hero &&
        heroBg &&
        heroOverlay &&
        heroContent &&
        heroStats &&
        window.matchMedia("(pointer: fine)").matches
      ) {
        const bgX = gsap.quickTo(heroBg, "x", {
          duration: 0.9,
          ease: "power3.out",
        });
        const bgY = gsap.quickTo(heroBg, "y", {
          duration: 0.9,
          ease: "power3.out",
        });

        const overlayX = gsap.quickTo(heroOverlay, "x", {
          duration: 1,
          ease: "power3.out",
        });
        const overlayY = gsap.quickTo(heroOverlay, "y", {
          duration: 1,
          ease: "power3.out",
        });

        const contentX = gsap.quickTo(heroContent, "x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const contentY = gsap.quickTo(heroContent, "y", {
          duration: 0.8,
          ease: "power3.out",
        });

        const statsX = gsap.quickTo(heroStats, "x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const statsY = gsap.quickTo(heroStats, "y", {
          duration: 0.8,
          ease: "power3.out",
        });

        const handlePointerMove = (event: PointerEvent) => {
          const rect = hero.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;

          bgX(px * 28);
          bgY(py * 20);
          overlayX(px * 14);
          overlayY(py * 12);
          contentX(px * -8);
          contentY(py * -6);
          statsX(px * -12);
          statsY(py * -10);
        };

        const resetParallax = () => {
          bgX(0);
          bgY(0);
          overlayX(0);
          overlayY(0);
          contentX(0);
          contentY(0);
          statsX(0);
          statsY(0);
        };

        hero.addEventListener("pointermove", handlePointerMove);
        hero.addEventListener("pointerleave", resetParallax);

        cleanupParallax = () => {
          hero.removeEventListener("pointermove", handlePointerMove);
          hero.removeEventListener("pointerleave", resetParallax);
        };
      }
    }, rootRef);

    return () => {
      cleanupParallax?.();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="overflow-x-hidden bg-[linear-gradient(180deg,#f5f0e8_0%,#f6f2eb_48%,#f3eee6_100%)]"
    >
      <section id="home" className="relative">
        <div
          ref={heroRef}
          className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#d7c5b2]"
        >
          <div
            ref={heroBgRef}
            className="absolute inset-0 scale-[1.05] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,12,0.62)_0%,rgba(18,15,12,0.38)_32%,rgba(18,15,12,0.16)_60%,rgba(18,15,12,0.22)_100%)]"
            aria-hidden="true"
          />

          <div
            ref={heroOverlayRef}
            className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.08),transparent_22%)]"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.14)_55%,rgba(0,0,0,0.28)_100%)]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1720px] flex-col justify-between px-6 pb-7 pt-[108px] sm:px-8 md:px-10 md:pb-10 md:pt-[124px] lg:px-14">
            <div
              ref={heroContentRef}
              className="max-w-[40rem] space-y-4 md:space-y-5"
            >
              <span className="inline-flex rounded-full border border-white/18 bg-black/18 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/92 backdrop-blur-md md:text-[11px]">
                Premium tiles for modern spaces
              </span>

              <h1 className="max-w-[9ch] text-[clamp(2.9rem,6vw,6.1rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-white [text-shadow:0_10px_30px_rgba(0,0,0,0.28)]">
                Discover premium tiles for beautifully finished spaces.
              </h1>

              <p className="max-w-[36rem] text-sm leading-7 text-white/88 md:text-[1rem] md:leading-8">
                Explore wall and floor tile collections, preview them in room
                visualizers, and book expert assistance for the right finish,
                size, and style.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href={ROUTES.booking}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-[#a9743c] px-6 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(169,116,60,0.32)] transition hover:translate-y-[-1px] hover:bg-[#95632f]"
                >
                  Book Consultation
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href={ROUTES.catalog}
                  className="inline-flex h-12 items-center rounded-full border border-white/18 bg-[rgba(255,255,255,0.14)] px-6 text-sm font-semibold !text-white backdrop-blur-md transition hover:bg-[rgba(255,255,255,0.20)]"
                >
                  View Catalog
                </Link>

                <Link
                  href={ROUTES.visualizer}
                  className="inline-flex h-12 items-center rounded-full border border-white/12 bg-black/20 px-6 text-sm font-semibold !text-white/92 backdrop-blur-md transition hover:bg-black/28"
                >
                  Open Visualizer
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <div
                ref={heroStatsRef}
                className="w-full max-w-[24rem] rounded-[1.35rem] border border-white/10 bg-[#111111]/86 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl md:p-5"
              >
                <div className="grid grid-cols-3 divide-x divide-white/10">
                  {heroMetrics.map((item) => (
                    <div key={item.label} className="px-3 first:pl-0 last:pr-0">
                      <p className="text-[1.2rem] font-semibold tracking-[-0.04em] md:text-[1.6rem]">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-white/58 md:text-xs">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="pb-10 pt-6 md:pb-14 md:pt-8">
        <div
          data-reveal
          className={`${shell} grid gap-8 border-b border-black/8 pb-10 md:grid-cols-[180px_1fr] md:pb-14`}
        >
          <div className="text-[1.4rem] font-medium tracking-[-0.04em] text-[#2d2925] md:text-[1.65rem]">
            About Us
          </div>

          <p className="max-w-[56rem] text-[clamp(1.3rem,2vw,2.7rem)] font-medium leading-[1.08] tracking-[-0.05em] text-[#1e1a17]">
            We help customers choose tiles that look refined, perform well, and
            fit the space correctly. From living rooms to bathrooms and outdoor
            areas, SquareFoot combines curated collections, room previews, and
            expert support in one premium experience.
          </p>
        </div>
      </section>

      <section id="collections" className="pb-12 pt-4 md:pb-16">
        <div className={shell}>
          <div
            data-reveal
            className="mb-8 flex items-end justify-between gap-6 md:mb-10"
          >
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.22em] text-[#7a6d61]">
                Featured Range
              </p>
              <h2 className="text-[clamp(2rem,3vw,3.7rem)] font-semibold tracking-[-0.06em] text-[#151210]">
                Tile Collections
              </h2>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[#1a1613] transition hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[#1a1613] transition hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredCollections.map((item) => (
              <TileCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="consultation" className="pb-12 md:pb-16">
        <div
          data-reveal
          className={`${shell} relative overflow-hidden rounded-[2rem]`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(22,18,14,0.28), rgba(22,18,14,0.12)), url(${promoImage})`,
            }}
          />

          <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-6 md:min-h-[340px] md:p-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <p className="max-w-[28rem] text-[1.45rem] font-medium leading-[1.08] tracking-[-0.04em] text-white md:text-[2rem]">
                Compare finishes, tones, and sizes before finalizing the tile
                for your space.
              </p>

              <Link
                href={ROUTES.visualizer}
                className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#121212] px-5 text-sm font-semibold !text-white"
              >
                Try Visualizer
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="pb-12 md:pb-16">
        <div className={`${shell} grid gap-8 lg:grid-cols-[320px_1fr]`}>
          <div data-reveal className="pt-2">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.22em] text-[#7a6d61]">
              Browse Faster
            </p>

            <h2 className="max-w-[14rem] text-[clamp(2rem,3vw,3.4rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#151210]">
              Shop by Category
            </h2>

            <div className="mt-8 flex flex-col gap-3">
              {tileCategories.map((category) => {
                const active = category.id === activeCategoryId;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`w-fit rounded-full px-4 py-2 text-left text-[1.05rem] transition md:text-[1.2rem] ${
                      active
                        ? "bg-[#151210] text-white"
                        : "text-[#84786c] hover:bg-black/5 hover:text-[#171310]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredCategoryProducts.map((item) => (
              <TileCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div data-reveal className={`${shell} mt-8 flex justify-center`}>
          <Link
            href={ROUTES.catalog}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#121212] px-5 text-sm font-semibold !text-white"
          >
            View Full Catalog
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section id="testimonials" className="pb-12 md:pb-16">
        <div className={shell}>
          <div
            data-reveal
            className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.22em] text-[#7a6d61]">
                Trusted Experience
              </p>
              <h2 className="text-[clamp(2rem,3vw,3.7rem)] font-semibold tracking-[-0.06em] text-[#151210]">
                What customers say
              </h2>
            </div>

            <p className="max-w-[30rem] text-sm leading-7 text-[#6f655a]">
              Homeowners, designers, and project teams use SquareFoot to
              explore collections, compare finishes, and choose tiles with more
              confidence.
            </p>
          </div>

          <div
            data-reveal
            className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-[#f1ece5] p-4 md:p-6"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-[linear-gradient(180deg,#f1ece5_0%,rgba(241,236,229,0)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-[linear-gradient(0deg,#f1ece5_0%,rgba(241,236,229,0)_100%)]" />

            <div className="flex max-h-[760px] justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] md:gap-5">
              <TestimonialsColumn items={firstColumn} duration={15} />
              <TestimonialsColumn
                items={secondColumn}
                duration={18}
                className="hidden md:block"
              />
              <TestimonialsColumn
                items={thirdColumn}
                duration={16}
                className="hidden xl:block"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6 pt-2 md:pb-8">
        <div
          data-reveal
          className={`${shell} relative overflow-hidden rounded-[2rem]`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(24,20,17,0.28), rgba(24,20,17,0.16)), url(${ctaImage})`,
            }}
          />

          <div className="relative z-10 flex min-h-[290px] flex-col justify-between p-6 md:min-h-[360px] md:p-10">
            <div className="max-w-[24rem] text-[clamp(1.9rem,3vw,3.6rem)] font-semibold leading-[1] tracking-[-0.06em] text-white [text-shadow:0_10px_30px_rgba(0,0,0,0.25)]">
              Find the right tile collection for your next space.
            </div>

            <div className="flex flex-col gap-4 md:items-end">
              <p className="max-w-[24rem] text-sm leading-7 text-white/86 md:text-right">
                Book a consultation first if you want guided product selection,
                room advice, and help choosing the right tile finish for your
                space.
              </p>

              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href={ROUTES.booking}
                  className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[#a9743c] px-6 text-sm font-semibold !text-white shadow-[0_16px_36px_rgba(169,116,60,0.30)] transition hover:translate-y-[-1px] hover:bg-[#95632f]"
                >
                  Book Consultation
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href={ROUTES.catalog}
                  className="inline-flex h-12 w-fit items-center rounded-full border border-white/18 bg-[rgba(255,255,255,0.14)] px-6 text-sm font-semibold !text-white backdrop-blur-md transition hover:bg-[rgba(255,255,255,0.20)]"
                >
                  View Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}