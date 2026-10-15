# HERO TECH & MOTION SPEC — PHASE 0 → PHASE 2

## A. Mục tiêu

Hero giới thiệu việc doanh nghiệp có nhiều cách kết hợp nguồn lực để xử lý một vấn đề, nhấn mạnh CTA `MỞ VIỆC` và liên kết `Xem cách ghép team`. Không biến hình quân Mã thành hình ảnh mới; không hứa ghép tối ưu hoặc tự động chẩn đoán.

## B. Visual tokens (theo brief)

```css
:root {
  --ivory: #F6F3EC;
  --ink: #232725;
  --burgundy: #782D3E;
  --sand: #E9E3D9;
}
```

- Serif: tiêu đề; sans-serif: nội dung, CTA. Font thực tế chờ bàn giao.
- Mobile-first: kiểm thử 320/390/430 px trên Safari, Android Chrome và desktop.
- Image: quân Mã trước bàn cờ; ảnh gốc/layers phải đến từ asset 12/10.
- Responsive crop: không cắt mất đầu và chân quân Mã; ưu tiên `object-fit: cover` với `object-position` đã kiểm thử, hoặc giữ tỷ lệ ảnh khi cần.

## C. Phase 0 preview — các quyết định chủ ý

- Chỉ render **một ảnh tham chiếu từ PDF** (không làm parallax 3 layers giả).
- Typography, bố cục và CTA là preview candidate, không phải design freeze.
- CTA mở dialog DEMO không gửi request; không có flow form thực.
- Không tải bất kỳ thư viện, script hoặc font từ CDN; không analytics; `noindex, nofollow`.

## D. Kỹ thuật dự kiến Phase 2 (CHƯA THỰC HIỆN)

| Behavior | Desktop | Mobile | Reduced motion |
|---|---|---|---|
| Text entrance | opacity/y ngắn (GSAP) | opacity đơn giản hoặc static | static |
| Depth effect | Parallax rất nhẹ nếu có layer gốc | tĩnh hoặc giảm mạnh | static |
| Layer transitions | Chỉ khi 3 asset thực được cung cấp | Fallback tĩnh | static |
| CTA | Native focus/hover/tap | 44px+ target | không phụ thuộc animation |
| Điều hướng `Xem cách ghép team` | scroll tới section khi tồn tại | native anchor | native anchor |

**Nguyên tắc:** React điều khiển state sản phẩm; GSAP chỉ điều khiển chuyển động. Phase 0 không xác nhận khả thi tách layer từ PDF.

## E. Acceptance gate trước Phase 2

- [ ] Asset gốc 12/10 được nhận và kiểm hash/dimensions.
- [ ] Số lượng layer, transparent channels, layer order được xác nhận.
- [ ] Đã duyệt crop tại 320/390/430 và desktop.
- [ ] Founder phê duyệt Hero copy, asset, CTA, thứ tự section.
- [ ] Font và quyền sử dụng hình ảnh được xác nhận.
- [ ] Khởi chạy preview không có API, analytics, data persistence.
- [ ] Chỉ private staging; production phải được duyệt riêng.
