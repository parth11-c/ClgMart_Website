"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS (Restored 3D Depth)
  ---------------------------------------------------------------------- */
  
  /* OUTSIDE THE CARD: Theme-aware text (Shadow in Light Mode, Glow in Dark Mode) */
  .text-3d-matte {
      color: var(--color-foreground);
      text-shadow: 
          0 10px 30px color-mix(in srgb, var(--color-foreground) 20%, transparent), 
          0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0); /* Hardware acceleration to prevent WebKit clipping bug */
      filter: 
          drop-shadow(0px 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent)) 
          drop-shadow(0px 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }

  /* INSIDE THE CARD: Hardcoded Silver/White for the dark background, deep rich shadows */
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) 
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  /* Deep Physical Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(145deg, #f94449 0%, #150203 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.04);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Realistic iPhone Mockup Hardware */
  .iphone-bezel {
      background-color: #111;
      box-shadow: 
          inset 0 0 0 2px #52525B, 
          inset 0 0 0 7px #000, 
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: 
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.02);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #18181B;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.05), inset 0 3px 8px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.5);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
}

export function CinematicHero({ 
  brandName = "ClgMart",
  tagline1 = "Buy & sell on campus,",
  tagline2 = "trusted student marketplace.",
  metricValue = 500,
  metricLabel = "Campus Listings",
  ctaHeading = "Join your campus marketplace.",
  ctaDescription = "Download ClgMart today. Trade books, tech, and gear securely with verified students at your college.",
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // 1. High-Performance Mouse Interaction Logic (Using requestAnimationFrame)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);
      
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  },[]);

  // 2. Complex 6-Phase Cinematic Scroll Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Base setup
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".mockup-scroll-wrapper", ".card-right-text"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      // Reset all phase components (Phases 1-6)
      gsap.set([
        ".phase-2", ".phase-3", ".phase-4", ".phase-5", ".phase-6",
        ".card-left-text-2", ".card-left-text-3", ".card-left-text-4", ".card-left-text-5", ".card-left-text-6",
        ".floating-badge-2", ".floating-badge-3", ".floating-badge-4", ".floating-badge-5", ".floating-badge-6"
      ], { autoAlpha: 0 });

      // Stagger elements setup
      gsap.set(".phone-widget-1", { y: 40, autoAlpha: 0, scale: 0.95 });
      gsap.set(".phone-widget-2", { y: 40, autoAlpha: 0, scale: 0.95 });
      gsap.set(".phone-widget-3", { y: 40, autoAlpha: 0, scale: 0.95 });
      gsap.set(".phone-widget-4", { y: 40, autoAlpha: 0, scale: 0.95 });
      gsap.set(".phone-widget-5", { y: 40, autoAlpha: 0, scale: 0.95 });
      gsap.set(".phone-widget-6", { y: 40, autoAlpha: 0, scale: 0.95 });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=24000", // Vastly extended scroll space for all 6 phases
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        // ------------------ Intro & Phase 1 ------------------
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        
        // Phase 1 widgets animate in
        .to(".phone-widget-1", { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0")
        
        // Phase 1 badges and left text
        .fromTo(".floating-badge-1", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        .fromTo(".card-left-text-1", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        
        .to({}, { duration: 3 }) // Pause at Phase 1

        // ------------------ Transition to Phase 2 ------------------
        .to([".phase-1", ".card-left-text-1", ".floating-badge-1"], { y: -30, autoAlpha: 0, ease: "power3.in", duration: 1.5, stagger: 0.1 })
        
        // Phase 2 elements fade in
        .to([".phase-2", ".card-left-text-2", ".floating-badge-2"], { autoAlpha: 1, duration: 0.1 })
        .fromTo(".card-left-text-2", { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "<")
        .to(".phone-widget-2", { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "<")
        .fromTo(".floating-badge-2", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: 10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5 }, "<")
        
        .to({}, { duration: 3 }) // Pause at Phase 2

        // ------------------ Transition to Phase 3 ------------------
        .to([".phase-2", ".card-left-text-2", ".floating-badge-2"], { y: -30, autoAlpha: 0, ease: "power3.in", duration: 1.5, stagger: 0.1 })
        
        // Phase 3 elements fade in
        .to([".phase-3", ".card-left-text-3", ".floating-badge-3"], { autoAlpha: 1, duration: 0.1 })
        .fromTo(".card-left-text-3", { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "<")
        .to(".phone-widget-3", { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "<")
        .fromTo(".floating-badge-3", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5 }, "<")

        .to({}, { duration: 3 }) // Pause at Phase 3

        // ------------------ Transition to Phase 4 (Product Listing) ------------------
        .to([".phase-3", ".card-left-text-3", ".floating-badge-3"], { y: -30, autoAlpha: 0, ease: "power3.in", duration: 1.5, stagger: 0.1 })
        
        // Phase 4 elements fade in
        .to([".phase-4", ".card-left-text-4", ".floating-badge-4"], { autoAlpha: 1, duration: 0.1 })
        .fromTo(".card-left-text-4", { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "<")
        .to(".phone-widget-4", { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "<")
        .fromTo(".floating-badge-4", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: 10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5 }, "<")

        .to({}, { duration: 3 }) // Pause at Phase 4

        // ------------------ Transition to Phase 5 (Categories & Search) ------------------
        .to([".phase-4", ".card-left-text-4", ".floating-badge-4"], { y: -30, autoAlpha: 0, ease: "power3.in", duration: 1.5, stagger: 0.1 })
        
        // Phase 5 elements fade in
        .to([".phase-5", ".card-left-text-5", ".floating-badge-5"], { autoAlpha: 1, duration: 0.1 })
        .fromTo(".card-left-text-5", { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "<")
        .to(".phone-widget-5", { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "<")
        .fromTo(".floating-badge-5", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5 }, "<")

        .to({}, { duration: 3 }) // Pause at Phase 5

        // ------------------ Transition to Phase 6 (Sustainable Reuse) ------------------
        .to([".phase-5", ".card-left-text-5", ".floating-badge-5"], { y: -30, autoAlpha: 0, ease: "power3.in", duration: 1.5, stagger: 0.1 })
        
        // Phase 6 elements fade in
        .to([".phase-6", ".card-left-text-6", ".floating-badge-6"], { autoAlpha: 1, duration: 0.1 })
        .fromTo(".card-left-text-6", { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "<")
        .to(".phone-widget-6", { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "<")
        .fromTo(".floating-badge-6", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: 10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5 }, "<")

        .to({}, { duration: 3 }) // Pause at Phase 6
        
        // ------------------ Outro ------------------
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 }) 
        .to({}, { duration: 1.5 })
        .to([".mockup-scroll-wrapper", ".floating-badge-6", ".card-left-text-6", ".card-right-text", ".phase-6"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        // Responsive card pullback sizing
        .to(".main-card", { 
          width: isMobile ? "92vw" : "85vw", 
          height: isMobile ? "92vh" : "85vh", 
          borderRadius: isMobile ? "32px" : "40px", 
          ease: "expo.inOut", 
          duration: 1.8 
        }, "pullback") 
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  },[metricValue]); 

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background text-foreground font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />

      {/* ParthB Watermark Signature */}
      <div className="absolute top-6 right-6 z-50 text-sm md:text-base font-mono tracking-[0.25em] text-neutral-500/50 select-none pointer-events-none">
        PARTHB
      </div>

      {/* BACKGROUND LAYER: Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d">
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {tagline2}
        </h1>
      </div>

      {/* BACKGROUND LAYER 2: Tactile CTA Buttons */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {ctaHeading}
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <a href="/coming-soon" aria-label="Download on the App Store" className="btn-modern-light flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <svg className="w-8 h-8 transition-transform group-hover:scale-105" fill="currentColor" viewBox="0 0 384 512" aria-hidden="true">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-[-2px]">Download on the</div>
              <div className="text-xl font-bold leading-none tracking-tight">App Store</div>
            </div>
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.parth1127.ClgMartApp" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play" className="btn-modern-dark flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background">
            <svg className="w-7 h-7 transition-transform group-hover:scale-105" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
               <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
            </svg>
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-[-2px]">Get it on</div>
              <div className="text-xl font-bold leading-none tracking-tight">Google Play</div>
            </div>
          </a>
        </div>
      </div>

      {/* FOREGROUND LAYER: The Physical Deep Blue Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* DYNAMIC RESPONSIVE GRID: Flex-col on mobile to force order, Grid on desktop */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">
            
            {/* 1. TOP (Mobile) / RIGHT (Desktop): BRAND NAME */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-6xl md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tighter text-card-silver-matte lg:mt-0">
                {brandName}
              </h2>
            </div>

            {/* 2. MIDDLE (Mobile) / CENTER (Desktop): IPHONE MOCKUP */}
            <div className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[380px] lg:h-[600px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              
              {/* Inner wrapper for safe CSS scaling that doesn't conflict with GSAP */}
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                
                {/* The iPhone Bezel */}
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  {/* Physical Hardware Buttons */}
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  {/* Inner Screen Container */}
                  <div className="absolute inset-[7px] bg-[#050914] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10 relative">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    {/* Dynamic Island Notch */}
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    </div>

                    {/* PHASE 1 UI: Marketplace Feed */}
                    <div className="phase-1 absolute inset-0 pt-12 px-5 pb-8 flex flex-col pointer-events-none">
                      <div className="phone-widget-1 flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">Marketplace</span>
                          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Campus Deals</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 text-neutral-200 flex items-center justify-center font-bold text-sm border border-white/10 shadow-lg shadow-black/50">CM</div>
                      </div>

                      <div className="phone-widget-1 relative w-44 h-44 mx-auto flex items-center justify-center mb-8 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                          <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#3B82F6" strokeWidth="12" />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <span className="counter-val text-4xl font-extrabold tracking-tighter text-white">0</span>
                          <span className="text-[8px] text-blue-200/50 uppercase tracking-[0.1em] font-bold mt-0.5">{metricLabel}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="phone-widget-1 widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center mr-3 border border-blue-400/20 shadow-inner">
                            <svg className="w-4 h-4 text-blue-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-bold text-neutral-200 truncate">Calculus 14th Ed</p>
                            <p className="text-[10px] text-neutral-400">$35 • Textbooks</p>
                          </div>
                        </div>

                        <div className="phone-widget-1 widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center mr-3 border border-emerald-400/20 shadow-inner">
                            <svg className="w-4 h-4 text-emerald-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-bold text-neutral-200 truncate">Apple iPad Pro</p>
                            <p className="text-[10px] text-neutral-400">$320 • Electronics</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PHASE 2 UI: WhatsApp Integration */}
                    <div className="phase-2 absolute inset-0 pt-12 px-5 pb-8 flex flex-col opacity-0 pointer-events-none">
                      <div className="phone-widget-2 flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">AL</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                              Alex (Seller)
                              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full font-bold">WhatsApp</span>
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium">Auto-generated deep link</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-4 mt-2">
                        <div className="phone-widget-2 self-end max-w-[85%] bg-emerald-800/80 backdrop-blur-md rounded-2xl rounded-tr-sm p-3 border border-emerald-500/20 shadow-lg">
                          <p className="text-[11px] text-white leading-relaxed">Hi Alex! I&apos;m interested in your &apos;Calculus 14th Ed&apos; listed on ClgMart. Is it still available?</p>
                          <span className="text-[8px] text-emerald-200 mt-1 block text-right font-medium">10:42 AM</span>
                        </div>
                        
                        <div className="phone-widget-2 self-start max-w-[85%] bg-neutral-800/80 backdrop-blur-md rounded-2xl rounded-tl-sm p-3 border border-white/5 shadow-lg">
                          <p className="text-[11px] text-white leading-relaxed">Hey! Yes, it is. I&apos;m on campus near the library right now.</p>
                          <span className="text-[8px] text-neutral-400 mt-1 block">10:45 AM</span>
                        </div>

                        <div className="phone-widget-2 self-end max-w-[85%] bg-emerald-800/80 backdrop-blur-md rounded-2xl rounded-tr-sm p-3 border border-emerald-500/20 shadow-lg">
                          <p className="text-[11px] text-white leading-relaxed">Great, I can meet you there in 5 minutes!</p>
                          <span className="text-[8px] text-emerald-200 mt-1 block text-right font-medium">10:46 AM</span>
                        </div>
                      </div>

                      <div className="phone-widget-2 mt-auto w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 border border-emerald-400/20 text-white font-bold text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" aria-hidden="true">
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                        Chat on WhatsApp
                      </div>
                    </div>

                    {/* PHASE 3 UI: Verified Profile */}
                    <div className="phase-3 absolute inset-0 pt-12 px-5 pb-8 flex flex-col items-center opacity-0 pointer-events-none">
                      <div className="phone-widget-3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-[0_0_30px_rgba(79,70,229,0.4)] mt-4 mb-4 relative">
                        <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center border-2 border-neutral-900">
                           <span className="text-3xl font-black text-white">JD</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#050914] shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      </div>
                      
                      <div className="phone-widget-3 text-center mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight">John Doe</h2>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          <span className="text-[11px] text-emerald-400 font-medium">john.doe@college.edu</span>
                        </div>
                      </div>

                      <div className="w-full space-y-3">
                        <div className="phone-widget-3 w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center backdrop-blur-sm">
                          <div className="flex flex-col">
                            <span className="text-[11px] text-neutral-400 font-medium">Verification Status</span>
                            <span className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                              Verified Student
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <span className="text-lg">🛡️</span>
                          </div>
                        </div>

                        <div className="phone-widget-3 w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center backdrop-blur-sm">
                          <div className="flex flex-col">
                            <span className="text-[11px] text-neutral-400 font-medium">Access Code</span>
                            <span className="text-xs font-mono font-bold text-white mt-1">CAMPUS-MEMBER</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <span className="text-lg">🔑</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PHASE 4 UI: Simple Product Listing */}
                    <div className="phase-4 absolute inset-0 pt-12 px-5 pb-8 flex flex-col opacity-0 pointer-events-none">
                      <span className="phone-widget-4 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 text-left">Dashboard</span>
                      <h4 className="phone-widget-4 text-base font-extrabold tracking-tight text-white mb-4 text-left">Create New Listing</h4>

                      {/* Image Upload Box */}
                      <div className="phone-widget-4 w-full h-28 bg-white/5 border-2 border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center mb-4 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center">
                          <span className="text-2xl text-emerald-400">📷</span>
                        </div>
                        <div className="mt-8 text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                          study_lamp.png (1.2 MB) ✓
                        </div>
                      </div>

                      {/* Listing Inputs Mockup */}
                      <div className="space-y-3">
                        <div className="phone-widget-4 widget-depth rounded-xl p-3 flex flex-col items-start gap-1">
                          <span className="text-[8px] text-neutral-400 uppercase tracking-wider font-bold">Product Title</span>
                          <span className="text-xs font-bold text-white">LED Dorm Desk Lamp</span>
                        </div>

                        <div className="phone-widget-4 flex gap-3">
                          <div className="flex-1 widget-depth rounded-xl p-3 flex flex-col items-start gap-1">
                            <span className="text-[8px] text-neutral-400 uppercase tracking-wider font-bold">Category</span>
                            <span className="text-xs font-bold text-white">Hostel Items</span>
                          </div>
                          <div className="w-24 widget-depth rounded-xl p-3 flex flex-col items-start gap-1">
                            <span className="text-[8px] text-neutral-400 uppercase tracking-wider font-bold">Price</span>
                            <span className="text-xs font-bold text-white">$15</span>
                          </div>
                        </div>
                      </div>

                      <div className="phone-widget-4 mt-auto w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-lg shadow-blue-500/20 text-white">
                        Publish Listing
                      </div>
                    </div>

                    {/* PHASE 5 UI: Product Categories & Search */}
                    <div className="phase-5 absolute inset-0 pt-12 px-5 pb-8 flex flex-col opacity-0 pointer-events-none">
                      {/* Search Input */}
                      <div className="phone-widget-5 w-full h-11 bg-white/10 border border-white/15 rounded-xl flex items-center px-3 mb-4 shadow-inner">
                        <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span className="text-xs font-semibold text-white tracking-wide">Mini Fridge</span>
                        <div className="ml-auto w-4 h-4 rounded-full bg-white/15 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-neutral-400">✖</span>
                        </div>
                      </div>

                      {/* Category Selector Pills */}
                      <div className="phone-widget-5 flex gap-2 overflow-x-auto pb-3 mb-3 border-b border-white/5 no-scrollbar">
                        <span className="text-[10px] px-3 py-1 bg-blue-500 text-white rounded-full font-bold shadow-md shadow-blue-500/30 shrink-0">Hostel Items</span>
                        <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-full font-medium shrink-0">Books</span>
                        <span className="text-[10px] px-3 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-full font-medium shrink-0">Electronics</span>
                      </div>

                      {/* Results */}
                      <div className="space-y-3">
                        <div className="phone-widget-5 widget-depth rounded-2xl p-3 flex items-center border-l-4 border-l-blue-500">
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-bold text-white truncate">Compact Mini Fridge</p>
                            <p className="text-[10px] text-blue-300 font-semibold mt-0.5">$45 • Excellent condition</p>
                            <p className="text-[8px] text-neutral-400 mt-1">Listed by Sarah T. • Hostel B</p>
                          </div>
                          <span className="text-xs font-bold text-neutral-200">Hostel</span>
                        </div>

                        <div className="phone-widget-5 widget-depth rounded-2xl p-3 flex items-center border-l-4 border-l-blue-500">
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-bold text-white truncate">Under-Bed Storage Organizer</p>
                            <p className="text-[10px] text-blue-300 font-semibold mt-0.5">$12 • Moving out sale</p>
                            <p className="text-[8px] text-neutral-400 mt-1">Listed by Alex K. • Hostel C</p>
                          </div>
                          <span className="text-xs font-bold text-neutral-200">Hostel</span>
                        </div>
                      </div>
                    </div>

                    {/* PHASE 6 UI: Sustainable Resource Reuse */}
                    <div className="phase-6 absolute inset-0 pt-12 px-5 pb-8 flex flex-col opacity-0 pointer-events-none">
                      <div className="phone-widget-6 flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">My Impact</span>
                          <span className="text-base font-bold tracking-tight text-white">Sustainability Hub</span>
                        </div>
                        <span className="w-7 h-7 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-sm">🌱</span>
                      </div>

                      {/* Sustainability Impact Dashboard */}
                      <div className="phone-widget-6 w-full bg-gradient-to-br from-emerald-600/30 to-teal-600/20 border border-emerald-400/30 rounded-2xl p-4 mb-4 backdrop-blur-sm shadow-xl flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-2">
                          <span className="text-xl">♻️</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">Eco-friendly Exchanger</h4>
                        <p className="text-[9px] text-emerald-200 mt-0.5">Reducing campus waste</p>
                        
                        <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-500/20 text-center">
                          <div>
                            <p className="text-xs font-extrabold text-white">8</p>
                            <p className="text-[7px] text-neutral-300 uppercase tracking-wider">Reused</p>
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-white">$140</p>
                            <p className="text-[7px] text-neutral-300 uppercase tracking-wider">Saved</p>
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-white">12kg</p>
                            <p className="text-[7px] text-neutral-300 uppercase tracking-wider">CO2 Saved</p>
                          </div>
                        </div>
                      </div>

                      {/* Recycled Products Log */}
                      <span className="phone-widget-6 text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-2 text-left">Sustainable Cycle</span>
                      <div className="space-y-2">
                        <div className="phone-widget-6 widget-depth rounded-xl px-3 py-2 flex justify-between items-center">
                          <span className="text-xs font-bold text-neutral-200">Reused Electronics</span>
                          <span className="text-[8px] font-semibold text-emerald-400">Completed</span>
                        </div>
                        <div className="phone-widget-6 widget-depth rounded-xl px-3 py-2 flex justify-between items-center">
                          <span className="text-xs font-bold text-neutral-200">Recycled Textbooks</span>
                          <span className="text-[8px] font-semibold text-emerald-400">Completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-50 pointer-events-none" />
                  </div>
                </div>

                {/* Phase 1 Badges */}
                <div className="floating-badge-1 absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-blue-500/20 to-blue-900/10 flex items-center justify-center border border-blue-400/30 shadow-inner">
                    <span className="text-base lg:text-xl drop-shadow-lg" aria-hidden="true">📚</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Listed Textbooks</p>
                    <p className="text-blue-200/50 text-[10px] lg:text-xs font-medium">Sold in 2 hours!</p>
                  </div>
                </div>
                <div className="floating-badge-1 absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-indigo-500/20 to-indigo-900/10 flex items-center justify-center border border-indigo-400/30 shadow-inner">
                    <span className="text-base lg:text-lg drop-shadow-lg" aria-hidden="true">🎓</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Campus Meetups</p>
                    <p className="text-blue-200/50 text-[10px] lg:text-xs font-medium">Verified students only</p>
                  </div>
                </div>

                {/* Phase 2 Badges */}
                <div className="floating-badge-2 opacity-0 absolute flex top-10 lg:top-20 left-[-10px] lg:left-[-60px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30">
                    <span className="text-base lg:text-xl drop-shadow-lg">💬</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold">WhatsApp Link</p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs">Connect in 1 tap</p>
                  </div>
                </div>

                {/* Phase 3 Badges */}
                <div className="floating-badge-3 opacity-0 absolute flex bottom-16 lg:bottom-24 right-[-20px] lg:right-[-90px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30">
                    <span className="text-base lg:text-xl drop-shadow-lg">🛡️</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold">Student Verified</p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs">College email confirmed</p>
                  </div>
                </div>

                {/* Phase 4 Badges */}
                <div className="floating-badge-4 opacity-0 absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-blue-500/20 to-blue-900/10 flex items-center justify-center border border-blue-400/30">
                    <span className="text-base lg:text-xl drop-shadow-lg">📤</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold">List Instantly</p>
                    <p className="text-blue-200/50 text-[10px] lg:text-xs">List in 30 seconds</p>
                  </div>
                </div>

                {/* Phase 5 Badges */}
                <div className="floating-badge-5 opacity-0 absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-amber-500/20 to-amber-900/10 flex items-center justify-center border border-amber-400/30">
                    <span className="text-base lg:text-xl drop-shadow-lg">🔍</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold">Quick Discovery</p>
                    <p className="text-amber-200/50 text-[10px] lg:text-xs">Search by categories</p>
                  </div>
                </div>

                {/* Phase 6 Badges */}
                <div className="floating-badge-6 opacity-0 absolute flex top-10 lg:top-20 left-[-10px] lg:left-[-60px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30">
                    <span className="text-base lg:text-xl drop-shadow-lg">♻️</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold">Sustainable Cycle</p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs">Reuse & recycle resources</p>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. BOTTOM (Mobile) / LEFT (Desktop): ACCOUNTABILITY TEXT (6 PHASES) */}
            <div className="order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0 relative h-[150px] lg:h-[200px]">
              {/* Phase 1 Text */}
              <div className="card-left-text-1 absolute inset-0 flex flex-col justify-center">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                  Your campus store, redefined.
                </h3>
                <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                  <span className="text-white font-semibold">ClgMart</span> is the ultimate student-to-student marketplace. Verified college students can easily buy, sell, and trade textbooks, electronics, and daily essentials safely within their campus network.
                </p>
              </div>

              {/* Phase 2 Text */}
              <div className="card-left-text-2 absolute inset-0 flex flex-col justify-center opacity-0 pointer-events-none">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                  WhatsApp Contact Link.
                </h3>
                <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                  Connect instantly. Buyers can contact sellers directly through auto-generated <span className="text-white font-semibold">WhatsApp deep links</span>, facilitating faster and familiar communication without the bloat of in-app messaging.
                </p>
              </div>

              {/* Phase 3 Text */}
              <div className="card-left-text-3 absolute inset-0 flex flex-col justify-center opacity-0 pointer-events-none">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                  Verified Student Access.
                </h3>
                <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                  Trade with total confidence. <span className="text-white font-semibold">ClgMart</span> requires secure campus authentication to join, ensuring verified campus users only to eliminate spam and fake accounts.
                </p>
              </div>

              {/* Phase 4 Text */}
              <div className="card-left-text-4 absolute inset-0 flex flex-col justify-center opacity-0 pointer-events-none">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                  Simple Product Listing.
                </h3>
                <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                  Declutter your dorm in seconds. Upload images, write a description, select a category, and list your items instantly through a simple, streamlined <span className="text-white font-semibold">seller dashboard</span>.
                </p>
              </div>

              {/* Phase 5 Text */}
              <div className="card-left-text-5 absolute inset-0 flex flex-col justify-center opacity-0 pointer-events-none">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                  Organized Campus Search.
                </h3>
                <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                  Find exactly what you need quickly. Browse listings organized by categories like books, electronics, accessories, and hostel items, instead of searching through <span className="text-white font-semibold">chaotic chat groups</span>.
                </p>
              </div>

              {/* Phase 6 Text */}
              <div className="card-left-text-6 absolute inset-0 flex flex-col justify-center opacity-0 pointer-events-none">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-0 lg:mb-5 tracking-tight">
                  Sustainable Campus Reuse.
                </h3>
                <p className="hidden md:block text-blue-100/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-sm lg:max-w-none">
                  Promote sustainability and reduce waste within your college. Save money and support your campus ecosystem by <span className="text-white font-semibold">recycling and reusing</span> gadgets, books, and hostel gear.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}