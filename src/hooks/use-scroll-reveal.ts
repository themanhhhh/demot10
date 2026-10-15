"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useScrollReveal<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);

  useGSAP(() => {
    const element = elementRef.current;
    if (!element) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        element,
        { y: 18 },
        {
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            once: true,
          },
        },
      );
    });

    return () => media.revert();
  }, { scope: elementRef });

  return elementRef;
}
