"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function usePointerSpotlight<T extends HTMLElement>() {
  const regionRef = useRef<T>(null);
  const spotlightRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const region = regionRef.current;
    const spotlight = spotlightRef.current;
    if (!region || !spotlight) return;
    const target = region;
    const overlay = spotlight;

    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const point = { x: 50, y: 50 };
      target.style.setProperty("--pointer-x", "50%");
      target.style.setProperty("--pointer-y", "50%");

      const moveX = gsap.quickTo(point, "x", {
        duration: 0.24,
        ease: "power3.out",
        onUpdate: () => target.style.setProperty("--pointer-x", `${point.x}%`),
      });
      const moveY = gsap.quickTo(point, "y", {
        duration: 0.24,
        ease: "power3.out",
        onUpdate: () => target.style.setProperty("--pointer-y", `${point.y}%`),
      });
      const fade = gsap.quickTo(overlay, "autoAlpha", { duration: 0.18, ease: "power1.out" });

      function handlePointerMove(event: PointerEvent) {
        if (event.pointerType === "touch") return;
        const bounds = target.getBoundingClientRect();
        moveX(Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)));
        moveY(Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)));
        fade(1);
      }

      function handlePointerLeave() {
        fade(0);
      }

      target.addEventListener("pointermove", handlePointerMove, { passive: true });
      target.addEventListener("pointerleave", handlePointerLeave, { passive: true });

      return () => {
        target.removeEventListener("pointermove", handlePointerMove);
        target.removeEventListener("pointerleave", handlePointerLeave);
      };
    });

    return () => media.revert();
  }, { scope: regionRef });

  return { regionRef, spotlightRef };
}
