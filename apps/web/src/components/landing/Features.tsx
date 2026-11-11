"use client";

import { useEffect, useRef } from "react";
import {
  Search,
  Lightbulb,
  Film,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    icon: Search,
    title: "Research",
    description:
      "Surface trending topics and keywords from YouTube Data API and Google Trends. Every idea is backed by real signal, not guesswork.",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    icon: Lightbulb,
    title: "Create",
    description:
      "Generate ranked video ideas, write full scripts, craft CTR-optimised titles, and produce SEO-optimised descriptions with GPT-4o.",
    accent: "from-violet-500 to-purple-400",
  },
  {
    icon: Film,
    title: "Produce",
    description:
      "Generate AI thumbnails, voiceovers, and video clips. Compose and render the final video with Remotion and FFmpeg.",
    accent: "from-brand-primary to-brand-secondary",
  },
  {
    icon: TrendingUp,
    title: "Analyse",
    description:
      "Track views, watch time, CTR, and revenue via YouTube Analytics API. Correlate performance back to the original research signal.",
    accent: "from-emerald-500 to-teal-400",
  },
];

export function Features() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // Dynamic import keeps GSAP + ScrollTrigger code-split to this page
    void import("gsap").then(({ gsap }) => {
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

        ScrollTrigger.batch(cards, {
          onEnter: (batch) => {
            gsap.from(batch, {
              y: 40,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.1,
            });
          },
          once: true,
          start: "top 85%",
        });
      });
    });

    return () => {
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      {/* Section header */}
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-brand-text md:text-4xl">
          Everything in one workflow
        </h2>
        <p className="mx-auto max-w-xl text-brand-muted">
          From idea discovery to published video — no switching between tools.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group rounded-xl border border-brand-border bg-brand-surface p-6 transition-colors duration-200 hover:border-brand-primary/40 hover:bg-brand-surface/80"
            >
              {/* Icon */}
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.accent} bg-opacity-10`}
              >
                <Icon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              </div>

              {/* Text */}
              <h3 className="mb-2 text-base font-semibold text-brand-text">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-muted">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
