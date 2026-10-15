"use client";

import Image from "next/image";
import styles from "./ChessHero.module.css";

type ChessHeroProps = {
  /** Connect to the approved route selector; never submit data directly. */
  onOpenWork: () => void;
  /** Scroll/navigate to the Team Builder DEMO section. */
  onViewTeam: () => void;
};

/**
 * CANDIDATE PRIVATE PREVIEW — NOT APPROVED FOR PRODUCTION.
 * Uses a PDF-extracted reference image, NOT an original 3-layer asset.
 * Keep state/business logic outside this component.
 */
export function ChessHero({ onOpenWork, onViewTeam }: ChessHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="chess-hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>GIẢI PHÁP CỦA ECOM’S DIARY</p>
        <h1 id="chess-hero-title" className={styles.title}>
          Một việc kinh doanh.
          <span>Nhiều cách ghép team.</span>
        </h1>
        <p className={styles.lead}>
          Bắt đầu từ việc cần giải quyết. Xem xét các hướng giải do
          Partner chuyên môn đề xuất, kết hợp nguồn lực và hình thành
          Deal có cam kết.
        </p>
        <div className={styles.actions}>
          <button className={styles.primary} type="button" onClick={onOpenWork}>
            MỞ VIỆC <span aria-hidden="true">↗</span>
          </button>
          <button className={styles.secondary} type="button" onClick={onViewTeam}>
            Xem cách ghép team <span aria-hidden="true">↓</span>
          </button>
        </div>
        <p className={styles.note}>
          Partner chuyên môn đề xuất hướng giải. Bạn quyết định cuối cùng.
        </p>
      </div>
      <figure className={styles.visual}>
        <Image
          src="/assets/chess/horse-reference-pdf-preview.webp"
          alt="Quân Mã màu đồng ở tiền cảnh trên bàn cờ, phía sau là các quân cờ khác"
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          className={styles.picture}
          priority
        />
        <span className={styles.kicker}>GÓC NHÌN CỦA BẠN</span>
        <figcaption className={styles.caption}>
          <span>Một việc. Nhiều ẩn số.</span>
          <small>Chọn một tình huống bên dưới để lật mở những khả năng phối hợp.</small>
        </figcaption>
      </figure>
    </section>
  );
}
