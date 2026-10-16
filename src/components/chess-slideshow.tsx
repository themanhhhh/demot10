"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePointerSpotlight } from "@/hooks/use-pointer-spotlight";

const slides = [
  { src: "/assets/chess/hero-chess-original.png", alt: "Quân Mã bằng đồng nổi bật trên bàn cờ, phía sau là các quân cờ được làm mờ.", label: "MỘT VIỆC · NHIỀU HƯỚNG ĐI", caption: "Góc nhìn chiến lược" },
  { src: "/assets/chess/hero-chess-team.webp", alt: "Quân Xe, Tượng và Mã bằng đồng cùng đứng trên bàn cờ trong ánh sáng ấm.", label: "ĐÚNG VAI · CÙNG PHỐI HỢP", caption: "Kết hợp nguồn lực" },
  { src: "/assets/chess/hero-chess-goal.webp", alt: "Quân Vua bằng đồng ở phía trước, quân Mã và Xe phía sau cùng hướng đến mục tiêu.", label: "CHUNG HƯỚNG · RÕ MỤC TIÊU", caption: "Cùng hướng đến kết quả" },
];

export function ChessSlideshow() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const figureRef = useRef<HTMLElement>(null);
  const spotlight = usePointerSpotlight<HTMLDivElement>();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    if (figureRef.current) observer.observe(figureRef.current);
    return () => { media.removeEventListener("change", sync); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [visible, reducedMotion, active]);

  function select(index: number) {
    setActive((index + slides.length) % slides.length);
  }

  return (
    <figure ref={figureRef} className="hero-art chess-slideshow" role="region" aria-roledescription="trình chiếu" aria-label="Góc nhìn chiến lược qua bàn cờ">
      <div className="chess-scene pointer-spotlight-region" ref={spotlight.regionRef}>
        {slides.map((slide, index) => (
          <div key={slide.src} className={`chess-slide${active === index ? " is-active" : ""}`} aria-hidden={active !== index} role="group" aria-roledescription="ảnh" aria-label={`${index + 1} / ${slides.length}`}>
            <Image src={slide.src} alt={slide.alt} fill sizes="(max-width: 620px) calc(100vw - 56px), (max-width: 900px) calc(100vw - 84px), 50vw" className="chess-reference-image" preload={index === 0} loading={index === 0 ? undefined : "eager"} />
          </div>
        ))}
        <span ref={spotlight.spotlightRef} className="pointer-spotlight" aria-hidden="true" />
        <span className="scene-label">{slides[active].label}</span>
      </div>
      <figcaption aria-live="off"><span>Một việc. Nhiều hướng đi.</span><span className="caption-rule" /><span>{slides[active].caption}</span></figcaption>
      <div className="chess-slide-controls">
        <div className="chess-slide-dots" role="group" aria-label="Chọn ảnh">
          {slides.map((slide, index) => <button key={slide.src} type="button" aria-label={`Xem ảnh ${index + 1}: ${slide.caption}`} aria-pressed={active === index} onClick={() => select(index)}><span /></button>)}
        </div>
      </div>
    </figure>
  );
}

