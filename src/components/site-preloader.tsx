"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function SitePreloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const startedAt = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    let introTween: gsap.core.Tween | undefined;
    let finishTween: gsap.core.Tween | undefined;
    let exitTween: gsap.core.Tween | undefined;
    const counter = { value: 0 };

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(overlay, {
        autoAlpha: 1,
        pointerEvents: "auto",
        clipPath: "inset(0% 0% 0% 0%)",
      });

      introTween = gsap.to(counter, {
        value: 88,
        duration: 2.1,
        ease: "steps(14)",
        onUpdate: () => setProgress(Math.floor(counter.value)),
      });

      const heroImage = document.querySelector<HTMLImageElement>(".chess-reference-image");
      const imageReady = !heroImage || heroImage.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            heroImage.addEventListener("load", () => resolve(), { once: true });
            heroImage.addEventListener("error", () => resolve(), { once: true });
          });
      const fontsReady = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
      const safetyTimeout = new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, 3000));
      });

      void Promise.race([Promise.all([imageReady, fontsReady]), safetyTimeout]).then(() => {
        if (cancelled) return;

        const remainingMinimumTime = Math.max(0, 560 - (performance.now() - startedAt));
        timers.push(setTimeout(() => {
          if (cancelled) return;

          introTween?.kill();
          finishTween = gsap.to(counter, {
            value: 100,
            duration: 0.28,
            ease: "steps(3)",
            onUpdate: () => setProgress(Math.floor(counter.value)),
            onComplete: () => {
              exitTween = gsap.to(overlay, {
                clipPath: "inset(100% 0% 0% 0%)",
                duration: 0.82,
                ease: "expo.inOut",
                onComplete: () => gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" }),
              });
            },
          });
        }, remainingMinimumTime));
      });
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      introTween?.kill();
      finishTween?.kill();
      exitTween?.kill();
      media.revert();
    };
  }, []);

  return (
    <div ref={overlayRef} className="site-preloader" aria-hidden="true">
      <div className="preloader-inner">
        <div className="preloader-header">
          <span className="preloader-wordmark">
            <span className="preloader-mark">E</span>
            <span>Ecom’s Diary</span>
          </span>
          <span className="preloader-index">MỘT VIỆC · NHIỀU HƯỚNG ĐI</span>
        </div>

        <div className="preloader-content">
          <div className="preloader-copy">
            <p className="preloader-eyebrow"><span />ĐANG CHUẨN BỊ KHÔNG GIAN</p>
            <p className="preloader-counter"><span>{String(progress).padStart(2, "0")}</span><em>%</em></p>
            <p className="preloader-caption">Một việc kinh doanh.<br /><i>Nhiều cách ghép team.</i></p>
          </div>

          <figure className="preloader-art">
            <Image
              src="/assets/chess/hero-chess-original.png"
              alt=""
              fill
              sizes="(max-width: 620px) calc(100vw - 56px), (max-width: 900px) calc(100vw - 84px), 50vw"
              preload
              className="preloader-image"
            />
            <figcaption><span>01 / 04</span><span>GÓC NHÌN CHIẾN LƯỢC</span></figcaption>
          </figure>
        </div>

        <div className="preloader-footer">
          <span>CHIẾN LƯỢC</span><span className="preloader-progress"><i style={{ transform: `scaleX(${progress / 100})` }} /></span><span>ECOM’S DIARY</span>
        </div>
      </div>
    </div>
  );
}
