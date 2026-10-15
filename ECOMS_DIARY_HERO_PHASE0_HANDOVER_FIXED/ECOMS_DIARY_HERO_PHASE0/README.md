# HERO QUÂN MÃ — PHASE 0 HANDOVER

**Dự án:** Giải pháp của Ecom’s Diary  
**Trạng thái:** CANDIDATE — CHỜ FOUNDER DUYỆT · **PRIVATE PREVIEW ONLY**  
**Ngày chuẩn bị:** 14/10/2026  
**Nguồn duy nhất cho asset hiện có:** `ECOMS-DIARY-IT-VISUAL-BRIEF-CANDIDATE-2026-10-13.pdf` (9 trang).

## 1. Những gì đã chuẩn bị

| Hạng mục | File | Ý nghĩa |
|---|---|---|
| Ảnh quân Mã | `01_source_from_pdf/horse-reference-pdf-page3.jpg` | 1032×640, trích trực tiếp từ ảnh nhúng trang 3 (Hình 03) |
| Screenshot desktop | `01_source_from_pdf/hero-desktop-reference-pdf-page1.jpg` | 1440×966, trích ảnh minh họa bố cục (Hình 01) |
| Screenshot mobile | `01_source_from_pdf/hero-mobile-reference-pdf-page2.jpg` | 390×1041, trích mockup mobile (Hình 02) |
| Ảnh tối ưu cho preview | `02_optimized_reference/horse-reference-pdf-preview.webp` | WebP dựng từ ảnh quân Mã PDF, không bổ sung chi tiết |
| Preview HTML/CSS/JS | `03_preview/` | Mở `index.html` bằng trình duyệt, không gọi API |
| Component Next.js | `04_nextjs_component/` | Mã tham khảo, không thay đổi ứng dụng hiện tại |
| Manifest & điều kiện duyệt | `05_documents/` | Nguồn gốc, kích thước, phần còn thiếu, motion spec |

**Quan trọng:** Ảnh `horse-reference-pdf-page3.jpg` là **ảnh trích từ PDF**, không phải file hình gốc chất lượng production. Đừng đổi tên thành `hero-original` hoặc coi đây là layer cuối cùng. Screenshot desktop/mobile chứa chữ và giao diện nên **không được** sử dụng nguyên ảnh làm Hero trong code (sẽ gây chữ dính ảnh và không responsive).

## 2. Cách xem nhanh

1. Giải nén ZIP.
2. Mở `03_preview/index.html` bằng Chrome/Edge/Safari. Không cần server hoặc cài package.
3. Thử Desktop (~1440px), Mobile (390px), và Mobile (320px).
4. Các CTA trong preview chỉ mở thông báo **DEMO**, không gửi request hay nhận lead.

## 3. Sử dụng component Next.js

- Copy `04_nextjs_component/ChessHero.tsx` và `ChessHero.module.css` vào `src/components/sections/`.
- Copy `02_optimized_reference/horse-reference-pdf-preview.webp` vào `public/assets/chess/horse-reference-pdf-preview.webp`.
- Tại page/layout, truyền các callback `onOpenWork` và `onViewTeam` **đã được triển khai thật trong DEMO**. Không cần thêm API.
- Phải xác nhận quyền dùng ảnh, font, asset cuối trước khi public.

## 4. Những gì KHÔNG có trong PDF

- Source HTML/CSS/JS Hero quân Mã ngày 12/10.
- File ảnh gốc độ phân giải cao hoặc tệp thiết kế gốc có layer.
- Xác nhận chính xác số file layer, vị trí các điểm neo, transparent masks, mapping giữa 3 ảnh/trạng thái.
- File font/wordmark gốc có giấy phép; typography trong preview là **font fallback**, không phải brand-font được chứng thực.
- Bản Design Freeze / chấp thuận cuối của Founder đối với Hero, headline và 3 Pain.

**Không được tự tách layer giả, nội suy ảnh bằng AI, thay quân Mã bằng stock, hoặc tạo nội dung Partner/Deal giả để lấp phần thiếu.**

## 5. Ranh giới triển khai

- Phase 0: kiểm kê asset, dựng bố cục tham chiếu và xác minh có thể dùng source nào.
- Phase 2: kiểm thử animation (chỉ sau khi nhận asset layer thật), GSAP/ScrollTrigger, reduced motion.
- Phase 3: tích hợp thành landing đầy đủ, review mobile và motion.
- Phase 6: production chỉ sau Design Freeze, QA, phê duyệt pháp lý.

Tham khảo `05_documents/APPROVAL_MATRIX.md` và `05_documents/HERO_MOTION_SPEC.md` để giao việc.
