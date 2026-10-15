# Cách tích hợp vào Next.js

1. Cài Next.js/TypeScript theo Phase 1, chưa tự migration trong Phase 0.
2. Copy `ChessHero.tsx` và `ChessHero.module.css` vào `src/components/sections/`.
3. Copy ảnh tối ưu trong ZIP vào `public/assets/chess/horse-reference-pdf-preview.webp`.
4. Tại một Client Component, import `ChessHero` và cung cấp **hai callback có thật**:

```tsx
<ChessHero
  onOpenWork={() => setFormView("choose-route")}
  onViewTeam={() => document.getElementById("team-builder")?.scrollIntoView({ behavior: "smooth" })}
/>
```

Ví dụ trên yêu cầu `setFormView` thuộc state luồng DEMO đã triển khai và section tồn tại với `id="team-builder"`. Không dùng ví dụ như code chạy độc lập. Thử `prefers-reduced-motion` trước khi áp dụng smooth scrolling trên thiết bị thật.

**Chưa dùng GSAP/layering trong component này:** phase 0 chưa có asset layer gốc, và việc thêm animation cần được kiểm chứng riêng ở Phase 2.
