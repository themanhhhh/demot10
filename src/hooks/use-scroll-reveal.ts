"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

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
      const splitInstances: SplitText[] = [];

      revealTargets.forEach((target, index) => {
        const isImage = target.matches("img, picture");
        const trigger = {
          trigger: isImage ? target.parentElement ?? target : target,
          start: "top 86%",
          once: true,
        };

        if (target.matches("h1, h2, h3, .footer-message")) {
          splitInstances.push(SplitText.create(target, {
            type: "words, chars",
            charsClass: "reveal-char",
            mask: "chars",
            autoSplit: true,
            onSplit: (self) => gsap.from(self.chars, {
              yPercent: -120,
              scale: 1.08,
              autoAlpha: 0,
              duration: isMobile ? 0.75 : 0.9,
              stagger: isMobile ? 0.009 : 0.012,
              ease: "expo.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: trigger,
            }),
          }));
          return;
        }

        if (target.matches("p:not(.eyebrow):not(.footer-message):not(.hero-note), .hero-intro, .flow-intro, .footer-description, .footer-action > p")) {
          splitInstances.push(SplitText.create(target, {
            type: "lines, words",
            linesClass: "reveal-line++",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: 105,
              autoAlpha: 0,
              duration: isMobile ? 0.72 : 0.86,
              stagger: isMobile ? 0.035 : 0.045,
              ease: "expo.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: trigger,
            }),
          }));
          return;
        }

        gsap.fromTo(
          target,
          isImage
            ? { autoAlpha: 0, yPercent: 100 }
            : { autoAlpha: 0, y: isMobile ? 11 : 16 },
          {
            y: 0,
            yPercent: 0,
            autoAlpha: 1,
            duration: isImage ? 0.8 : isMobile ? 0.62 : 0.8,
            delay: Math.min(index * (isMobile ? 0.045 : 0.07), 0.2),
            ease: isImage ? "power3.out" : "power2.out",
            clearProps: "opacity,visibility,transform",
            scrollTrigger: trigger,
          },
        );
      });

      return () => splitInstances.forEach((split) => split.revert());
    });

    return () => media.revert();
  }, { dependencies: [targets], revertOnUpdate: true, scope: elementRef });

  return elementRef;
}
