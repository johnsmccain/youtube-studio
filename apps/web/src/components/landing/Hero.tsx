"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Three.js canvas loaded client-side only — never SSR
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

interface HeroProps {
  /** OAuth error message (already mapped from error code), shown above sign-in button */
  authError?: string | undefined;
  /** URL to initiate Google sign-in */
  signInUrl: string;
}

export function Hero({ authError, signInUrl }: HeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — skip all GSAP animations
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // Dynamically import GSAP so it's code-split to this page only
    void import("gsap").then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const targets = [
        headlineRef.current,
        taglineRef.current,
        ctaRef.current,
        errorRef.current,
      ].filter(Boolean);

      tl.from(headlineRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          taglineRef.current,
          { y: 25, opacity: 0, duration: 0.7 },
          "-=0.55",
        )
        .from(
          ctaRef.current,
          { y: 20, opacity: 0, scale: 0.97, duration: 0.6 },
          "-=0.5",
        );

      if (authError && errorRef.current) {
        tl.from(errorRef.current, { opacity: 0, duration: 0.4 }, "-=0.3");
      }

      return () => {
        tl.kill();
        targets; // referenced to avoid unused warning
      };
    });
  }, [authError]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Three.js animated background */}
      <HeroCanvas />

      {/* Gradient overlay so text stays readable over the canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-b from-brand-bg/60 via-transparent to-brand-bg/80"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface/80 px-4 py-1.5 text-xs font-medium text-brand-secondary backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
          AI-Powered YouTube Workflow
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="mb-6 text-5xl font-bold tracking-tight text-brand-text md:text-6xl lg:text-7xl"
        >
          AI YouTube{" "}
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Content Studio
          </span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mx-auto mb-10 max-w-xl text-lg text-brand-muted md:text-xl"
        >
          Research trends, generate ideas, write scripts, produce thumbnails,
          and analyse performance — in one AI-powered workflow.
        </p>

        {/* OAuth error message */}
        {authError && (
          <div
            ref={errorRef}
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {authError}
          </div>
        )}

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="xl"
            className="w-full sm:w-auto"
            aria-label="Sign in with your Google account to access the studio"
          >
            <a href={signInUrl}>
              {/* Google G icon */}
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </a>
          </Button>

          <p className="text-xs text-brand-muted">
            Personal workspace · No subscription required
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <svg
          className="h-5 w-5 text-brand-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
