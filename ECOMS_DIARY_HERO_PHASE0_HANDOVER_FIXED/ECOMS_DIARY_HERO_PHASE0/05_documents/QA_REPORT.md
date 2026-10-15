# QA QUICK CHECK — HERO PHASE 0

**Kiểm thử bằng Chromium headless với HTML/CSS/JS nội tuyến để tránh hạn chế truy cập file URL trong môi trường kiểm thử.** Tệp ZIP vẫn chứa bản HTML/CSS/JS tách riêng để mở thông thường.

| Viewport | Scroll width | Image | CTA dialog | Browser errors |
|---|---|---|---|---|
| Desktop 1440 × 900 | 1440 (không tràn ngang) | Load thành công (1032px) | Mở/đóng thành công | Không |
| Mobile 390 × 844 | 390 (không tràn ngang) | Load thành công | Mở/đóng thành công | Không |
| Mobile 320 × 720 | 320 (không tràn ngang) | Load thành công | Mở/đóng thành công | Không |

Ảnh chụp full-page trong thư mục `06_QA_screenshots/`.

**Chưa kiểm thử:** Safari thiết bị thật, performance budget/LCP/INP, screen reader, font bản quyền, layer animation, form integration. Những mục này chưa đạt điều kiện nghiệm thu Phase 2+.
