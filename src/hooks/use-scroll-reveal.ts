"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useScrollReveal<T extends HTMLElement>(targets?: string) {
  const elementRef = useRef<T>(null);

  useGSAP(() => {
    const element = elementRef.current;
    if (!element) return;

    const revealTargets = targets
      ? Array.from(element.querySelectorAll<HTMLElement>(targets))
      : [element];
    if (!revealTargets.length) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const isMobile = window.matchMedia("(max-width: 620px)").matches;
      revealTargets.forEach((target, index) => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: isMobile ? 11 : 16 },
          {
            y: 0,
            autoAlpha: 1,
            duration: isMobile ? 0.52 : 0.72,
            delay: Math.min(index * (isMobile ? 0.045 : 0.06), 0.18),
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: {
              trigger: target,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });

    return () => media.revert();
  }, { dependencies: [targets], revertOnUpdate: true, scope: elementRef });

  return elementRef;
}
