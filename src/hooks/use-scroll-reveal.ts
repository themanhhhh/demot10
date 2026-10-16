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
      gsap.fromTo(
        revealTargets,
        { autoAlpha: 0, y: isMobile ? 12 : 20 },
        {
          y: 0,
          autoAlpha: 1,
          duration: isMobile ? 0.42 : 0.58,
          stagger: revealTargets.length > 1 ? (isMobile ? 0.045 : 0.075) : 0,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            once: true,
          },
        },
      );
    });

    return () => media.revert();
  }, { dependencies: [targets], revertOnUpdate: true, scope: elementRef });

  return elementRef;
}
