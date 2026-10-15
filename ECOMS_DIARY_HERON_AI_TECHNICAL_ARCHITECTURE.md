# KIẾN TRÚC KỸ THUẬT HERON AI VÀ PHƯƠNG ÁN ỨNG DỤNG CHO ECOM’S DIARY

> **Technical architecture & implementation guide**  
> **Dự án:** Giải pháp của Ecom’s Diary  
> **Ngày tổng hợp:** 14/10/2026  
> **Trạng thái:** Đề xuất kỹ thuật để báo giá và dựng **private staging / preview**; **chưa phải Design Freeze và không được tự public**.  
> **Nền tảng đề xuất:** Next.js (App Router), React, TypeScript, GSAP, ScrollTrigger, SVG/CSS, Lenis có điều kiện.

---

## 1. Mục tiêu tài liệu và phạm vi

Tài liệu này tổng hợp phân tích kiến trúc animation của **Heron AI** được giới thiệu trên Codrops và đề xuất cách chuyển hóa thành kiến trúc triển khai cho landing page **“Giải pháp của Ecom’s Diary”**.

Mục tiêu kỹ thuật:

1. Giữ phong cách **editorial B2B, mobile-first**, chuyển động tinh tế, ưu tiên khả năng hiểu sản phẩm.
2. Giữ hình **quân Mã** và các tài sản hình ảnh có nguồn từ bản candidate; không tự thay bằng hình stock/3D mới.
3. Diễn giải được logic: **một vấn đề có nhiều hướng giải; mỗi hướng có thể có nhiều cấu hình team; Partner đề xuất, Client quyết định**.
4. Dùng React quản lý trạng thái nghiệp vụ; GSAP chỉ xử lý chuyển động và trình bày.
5. Giữ đúng Form A/B đã duyệt ở nguồn riêng; bản staging không tiếp nhận hồ sơ thật.
6. Đảm bảo accessibility, mobile Safari, tối ưu hiệu năng, cleanup, khả năng nghiệm thu.

### 1.1. Nguồn và giới hạn xác thực

**Nguồn brief:** `ECOMS-DIARY-IT-VISUAL-BRIEF-CANDIDATE-2026-10-13.pdf` (9 trang). Các quy tắc được ghi rõ trong tài liệu này được xem là yêu cầu đầu vào; phần có nhãn *candidate*, *unknown*, *chưa duyệt* phải được giữ đúng trạng thái.

**Nguồn nghiên cứu:** [Codrops – Heron AI, 12/10/2026](https://tympanus.net/codrops/2026/10/12/heron-ai/).

**Quy ước trong file:**

- **[BRIEF]**: Yêu cầu hoặc trạng thái được nêu trong PDF của Ecom’s Diary.
- **[HERON]**: Cơ chế đã được thảo luận từ case study Heron AI (ví dụ: GSAP ticker, Lenis, SVG mask, Canvas cursor, Barba.js).
- **[ĐỀ XUẤT]**: Thiết kế/giải pháp kỹ thuật đề nghị cho Ecom’s Diary, **không được suy diễn là source code hoặc công nghệ gốc mà Heron sử dụng**.
- **[CHƯA CHỐT]**: Cần chủ dự án/Founder hoặc bên phụ trách xác nhận trước khi triển khai chính thức.

> **Lưu ý:** Đây là bản tổng hợp/thiết kế triển khai từ phân tích trước, **không phải reverse engineering toàn bộ source code Heron**, cũng không chứng minh chính xác nội bộ triển khai của họ ngoài thông tin công khai trong case study.

---

## 2. Tóm tắt kiến trúc và lựa chọn công nghệ

**Kiến trúc khuyến nghị:**

```text
                      Next.js App Router
                 Routing / SEO / Assets / SSR
                              |
               +--------------+--------------+
               |                             |
       React Product State              Motion Engine
       reducer / data model            GSAP + ScrollTrigger
       scenarios / forms               Flip / SVG / Lenis
               |                             |
               +--------------+--------------+
                              |
                  UI / Interaction Layer
             Hero | Pain | Why | Team | Forms
                              |
                  Optional production API
                Validation / Admin / Audit
```

**Nguyên tắc quan trọng nhất:** *React quyết định nội dung/trạng thái; GSAP quyết định cách chuyển đổi giữa các trạng thái*. Không để các timeline tự tạo hoặc sửa dữ liệu nghiệp vụ một cách ngầm định.

| Công nghệ | Chức năng dự kiến | Mức ưu tiên |
|---|---|---|
| Next.js App Router + TypeScript | Cấu trúc ứng dụng, tối ưu tài nguyên, metadata | Bắt buộc (theo stack đề xuất) |
| React state / reducer | Pain, solution, team configuration, Deal preview, Form A/B | Bắt buộc |
| Tailwind CSS / CSS variables | Layout, responsive, design tokens | Nên dùng |
| GSAP + ScrollTrigger | Section reveal, scrub, storytelling theo scroll | Nên dùng |
| GSAP Flip | Animation chuyển bố cục card nguồn lực | Nên dùng nếu có reorder/layout morph |
| SVG / CSS mask | Chuyển hình Hero theo trạng thái | Có chọn lọc |
| Lenis | Smooth scrolling trên thiết bị phù hợp | Tùy chọn |
| Canvas cursor | Con trỏ tùy chỉnh | Không ưu tiên |
| Barba.js | Page transitions riêng biệt | Không đề xuất cho bản đầu trên Next.js |
| Three.js / WebGL | 3D thời gian thực | Không cần trong giai đoạn đầu |

### 2.1. So sánh Heron AI với Ecom’s Diary

| Cơ chế Heron | Bài học kỹ thuật | Ứng dụng cho Ecom’s Diary |
|---|---|---|
| Scroll-driven storytelling | Dẫn câu chuyện qua các trạng thái có nghĩa | Từ vấn đề kinh doanh đến việc hình thành Deal |
| Shared animation clock | Đồng bộ các animation cùng một nhịp cập nhật | Đồng bộ Lenis, ScrollTrigger và các lớp Hero |
| DOM-to-image coordinates | Giữ marker chính xác khi ảnh bị crop/scale | Hotspot trên bàn cờ nếu thực sự cần |
| SVG mask/displacement | Chuyển ảnh có chiều sâu và liên kết về mặt ý tưởng | Chuyển giữa các lớp/trạng thái quân Mã |
| Pointer interaction | Người dùng chủ động khám phá thay vì chỉ xem | Chọn Pain, hướng giải, cấu hình team |
| Canvas cursor | Tạo tương tác con trỏ đặc trưng | Chưa cần, không dùng trên mobile |
| Barba.js | Tạo chuyển cảnh giữa trang | Thay bằng transitions theo React state trong một landing |

---

## 3. Ràng buộc thiết kế và nội dung từ brief

### 3.1. Các quyết định và trạng thái phê duyệt

- **[BRIEF – ĐÃ CHỐT]** Tên hiển thị public: **“Giải pháp của Ecom’s Diary”**. Không để lộ tên sản phẩm nội bộ trong giao diện, metadata, SEO, thông báo, alt text, file public hay nội dung chia sẻ.
- **[BRIEF – CANDIDATE]** Hero quân Mã, headline “Một việc kinh doanh. Nhiều cách ghép team.”, 3 Pain và thứ tự section mới chưa được Founder phê duyệt cuối.
- **[BRIEF – ĐÃ CHỐT]** Partner đưa ra hướng giải; Client ra quyết định. Không hứa tự động tối ưu, không tạo Partner giả/case giả/giá Deal thật hay kết quả bảo đảm.
- **[BRIEF – FORM GỐC]** Câu hỏi, lựa chọn và logic Form A/B dựa vào nguồn được duyệt ngày 11/10; không tự đặt câu hỏi mới.
- **[BRIEF – UNKNOWN]** Domain, hệ thống/email tiếp nhận hồ sơ, admin, chủ thể dữ liệu, consent và retention; cần quyết định trước production.
- **[BRIEF]** Chỉ private staging để preview/báo giá cho đến khi đáp ứng điều kiện duyệt; không thu dữ liệu hoặc tiền thật ở giai đoạn này.

### 3.2. Design tokens

| Token | Giá trị |
|---|---|
| Ivory | `#F6F3EC` |
| Ink | `#232725` |
| Burgundy | `#782D3E` |
| Sand | `#E9E3D9` |
| Typography | Serif cho heading; sans-serif cho nội dung; hỗ trợ tiếng Việt đầy đủ |
| Hướng thẩm mỹ | Editorial B2B, nhiều khoảng trắng, tiết chế, ưu tiên dễ đọc |
| Mobile yêu cầu test | iOS Safari 320 / 390 / 430 px, Android Chrome |

### 3.3. Thứ tự section theo candidate

```text
Hero (quân Mã) + MỞ VIỆC / Xem cách ghép team
    ↓
00 – Nhận diện vấn đề (3 Pain)
    ↓
01 – Vì sao? (In-house / Agency / Freelancer + phối hợp)
    ↓
02 – Cách ghép team
     Việc → Partner đề xuất → Hướng giải → Team → Deal
    ↓
03 – Bạn muốn bắt đầu thế nào?
     Trao đổi trước (Form A) | Gửi bối cảnh (Form B)
```

**Không đưa trở lại section so sánh cấu hình Deal/ngân sách độc lập**, kể cả dưới dạng accordion. Không tự bổ sung trường ngân sách trong Form A/B.

---

## 4. Kiến trúc dự án Next.js

Đề xuất tổ chức thư mục:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── ChessHero.tsx
│   │   ├── PainSelector.tsx
│   │   ├── WhyEcom.tsx
│   │   ├── TeamBuilder.tsx
│   │   └── OpenWork.tsx
│   ├── forms/
│   │   ├── FormA.tsx
│   │   └── FormB.tsx
│   └── motion/
│       ├── MotionProvider.tsx
│       ├── ScrollReveal.tsx
│       ├── InkReveal.tsx
│       └── LayoutTransition.tsx
│
├── features/
│   └── deal-demo/
│       ├── model.ts
│       ├── reducer.ts
│       └── scenarios.ts
│
├── hooks/
│   ├── useReducedMotion.ts
│   └── useImageCoordinates.ts
│
└── lib/
    ├── gsap.ts
    └── design-tokens.ts

public/
└── assets/
    └── chess/
        ├── chess-base.webp
        ├── chess-depth.webp
        └── chess-overlay.webp
```

**Lưu ý:** Tên file ảnh trong cấu trúc trên chỉ là placeholder. Phải nhận đúng asset candidate gốc, kiểm tra bản quyền/quyền sử dụng, lớp ảnh thực tế, độ phân giải và crop trước khi coding.

Để giảm JavaScript phía client, giữ các thành phần nội dung tĩnh dưới dạng Server Components nếu phù hợp; dùng Client Components cho DOM animation, pointer events và các flow có state.

---

## 5. Motion Engine: GSAP + ScrollTrigger + Lenis

### 5.1. Tư duy đồng bộ frame

**[HERON]** Heron mô tả cách đồng bộ Lenis, hiệu ứng con trỏ và các chuyển động khác theo GSAP ticker. Mục đích là tránh nhiều vòng lặp `requestAnimationFrame` cập nhật thiếu đồng bộ.

**[ĐỀ XUẤT]** Trong Next.js:

1. Tạo một `MotionProvider` được mount một lần ở phạm vi landing.
2. Khởi tạo Lenis chỉ khi cần và khi thiết bị phù hợp.
3. Đăng ký `lenis.raf` với GSAP ticker, chuyển đơn vị thời gian từ **giây sang mili giây**.
4. Kết nối `lenis.on('scroll', ScrollTrigger.update)`.
5. Cleanup ticker, listener và Lenis khi provider unmount.
6. Mỗi section dùng `useGSAP()` để tự quản lý timeline/trigger của section.

Cài package:

```bash
npm install gsap @gsap/react lenis
```

#### MotionProvider.tsx

```tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const finePointer = window.matchMedia("(pointer: fine)");

    // Phiên bản MVP: chỉ dùng smooth scroll khi thiết bị phù hợp.
    if (reducedMotion.matches || !finePointer.matches) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
    });

    const handleScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000); // GSAP = seconds; Lenis = milliseconds
    };

    gsap.ticker.add(tick);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", handleScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

**Kiểm tra thêm trước production:** Phản ứng khi người dùng thay đổi thiết lập reduced motion trong lúc đang mở trang; wheel/keyboard scrolling, anchor links, scroll lock khi mở dialog và các trường hợp React Strict Mode.

### 5.2. useGSAP() và cleanup

Dùng `@gsap/react` cho animation phụ thuộc DOM component; tránh đăng ký ScrollTrigger mới mỗi lần re-render mà không cleanup.

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      }
    );
  }, { scope: ref });

  return <section ref={ref}>{children}</section>;
}
```

Với animation được tạo **sau sự kiện click**, cần đưa vào context phù hợp (ví dụ `contextSafe()`) hoặc tự quản lý lifecycle. Khi media query thay đổi, dùng `gsap.matchMedia()` để revert/rebuild đúng cách.

### 5.3. Phân loại animation

| Nhóm | Ai điều khiển | Ví dụ |
|---|---|---|
| Scroll presentation | ScrollTrigger | Section reveal, parallax Hero |
| User interaction | React state → GSAP | Chọn Pain, solution, team config |
| Visual transition | CSS/SVG + GSAP | Image wipe, mask, text reveal |
| Continuous pointer effect | Shared ticker nếu thực sự cần | Marker, cursor effect |
| Form transitions | React state + GSAP ngắn | Chọn route, mở/đóng form |

---

## 6. Hero quân Mã: layered image và image-coordinate mapping

### 6.1. Phương án Hero

**[BRIEF]** Hero dùng đúng ảnh quân Mã trước bàn cờ, không tự thay bằng quân Vua hoặc ảnh stock; cần giữ headline/CTA theo candidate để Founder đánh giá.

**[ĐỀ XUẤT]** Nếu bộ ảnh candidate cho phép ghép nhiều lớp:

- **Background:** không chuyển động hoặc chuyển động rất nhẹ.
- **Midground:** chuyển dịch Y nhỏ theo scroll.
- **Foreground:** quân Mã/chi tiết chủ đạo chuyển động rõ hơn nhưng biên độ tiết chế.
- **Content:** typography và CTA luôn dễ đọc, khả dụng khi JavaScript chưa sẵn sàng.

Chỉ dùng hiệu ứng này khi ba lớp hình thực tế phù hợp. Không mặc định rằng ba lớp ảnh của tài liệu đều được tách theo chiều sâu foreground/midground/background.

### 6.2. Xử lý tọa độ khi `object-fit: cover`

**[HERON]** Những điểm đánh dấu trên ảnh/bản vẽ có thể lệch khi container thay đổi kích thước hoặc hình bị crop. Tọa độ nên được ánh xạ từ hệ tọa độ ảnh gốc sang tọa độ vùng hiển thị.

```ts
type FitMode = "cover" | "contain";

export function mapImagePoint(
  imageX: number,
  imageY: number,
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  fit: FitMode = "cover"
) {
  const scaleX = containerWidth / imageWidth;
  const scaleY = containerHeight / imageHeight;

  const scale = fit === "cover"
    ? Math.max(scaleX, scaleY)
    : Math.min(scaleX, scaleY);

  const renderedWidth = imageWidth * scale;
  const renderedHeight = imageHeight * scale;

  // Giả định object-position: center center
  const offsetX = (containerWidth - renderedWidth) / 2;
  const offsetY = (containerHeight - renderedHeight) / 2;

  return {
    x: offsetX + imageX * scale,
    y: offsetY + imageY * scale,
  };
}
```

Cần điều chỉnh offset khi `object-position` thay đổi; nếu ảnh bị transform bởi GSAP, các điểm tương tác cũng phải theo cùng phép biến đổi. Chỉ triển khai hotspot khi thật sự có giá trị UX, không thêm hotspot chỉ để trình diễn kỹ thuật.

### 6.3. SVG mask / ink transition

**[HERON]** Hiệu ứng chuyển từ trạng thái ảnh A sang B có thể được thực hiện bằng mask và SVG filter như `feTurbulence`, `feDisplacementMap`, blur/contrast, gắn tiến độ với scroll.

**[ĐỀ XUẤT]** Ưu tiên xây MVP bằng CSS `clip-path` hoặc mask đơn giản; chỉ nâng cấp displacement filter khi mục tiêu hình ảnh rõ ràng và thiết bị đạt performance budget.

```text
State A image
     +
State B image
     +
SVG/CSS mask [progress: 0..1]
     ↓
Scene transition on scroll
```

Không để những filter nặng chạy liên tục trên iPhone nếu gây jank hoặc nóng máy. Hỗ trợ fallback tĩnh và `prefers-reduced-motion`.

---

## 7. Section 00: Nhận diện vấn đề (3 Pain)

**Mục tiêu UX:** Người dùng không chỉ đọc ba card, mà có thể **chọn một vấn đề** và nhìn thấy bối cảnh minh họa thay đổi tương ứng.

**[ĐỀ XUẤT]**

- Dùng card/tab có semantics rõ ràng (`button`, `aria-pressed` hoặc tab pattern nếu phù hợp).
- Khi lựa chọn thay đổi, React cập nhật nội dung trước; GSAP animate phần chuyển trạng thái.
- Desktop có thể dùng sticky reveal; mobile dùng card dọc, tap để chọn.
- Không tự viết nội dung 3 Pain khi Founder chưa duyệt copy cuối.

**Acceptance:** chọn mỗi Pain cập nhật đúng tình huống; nội dung và focus không bị mất; hoạt động khi tắt JS animation.

---

## 8. Section 01–02: “Vì sao?” và Team Builder tương tác

### 8.1. Product model quan trọng nhất

**[BRIEF]** Một vấn đề kinh doanh có thể có **nhiều hướng giải do Partner chuyên môn đề xuất**. Một hướng giải lại có thể có **nhiều cấu hình team**. Nguồn lực có thể phối hợp từ đội ngũ sẵn có với Agency, Freelancer hoặc chuyên gia. Deal cần làm rõ vai trò, phạm vi, nguồn lực, cam kết; Client quyết định cuối cùng.

Sơ đồ logic:

```text
BUSINESS PROBLEM
     |
     v
PARTNER PROPOSES SOLUTIONS [DEMO]
     |
     +----------+----------+
     |                     |
  Solution A            Solution B
     |                     |
   +---+                +---+---+
   |   |                |   |   |
  A1  A2               B1  B2  B3
   |   |                |   |   |
   +---+----------------+---+---+
                   |
          TEAM CONFIGURATION
          In-house / Agency /
          Freelancer / Expert
                   |
                   v
           DEAL PREVIEW [DEMO]
        Scope / Role / Resources /
           Commitments to clarify
                   |
                   v
           CLIENT DECISION
```

Đây là quan hệ **1 vấn đề → N hướng → N cấu hình**, không phải một carousel tuyến tính hoặc bộ chọn “phương án tốt nhất”.

### 8.2. Data model TypeScript

```ts
type SolutionId = string;
type TeamConfigId = string;

type ResourceType =
  | "IN_HOUSE"
  | "AGENCY"
  | "FREELANCER"
  | "EXPERT";

interface TeamConfiguration {
  id: TeamConfigId;
  resources: ResourceType[];
  roleDescriptions: string[];
}

interface Solution {
  id: SolutionId;
  title: string;
  description: string;
  configurations: TeamConfiguration[];
}

interface BusinessScenario {
  id: string;
  problem: string;
  solutions: Solution[];
}

interface DemoState {
  scenarioId: string | null;
  solutionId: SolutionId | null;
  configurationId: TeamConfigId | null;
}
```

**Nguyên tắc dữ liệu:** Scenario chỉ là minh họa, không được trình bày thành case khách hàng thật; không hiển thị tên Partner thật/giả như thể họ sẵn sàng tham gia. Gắn nhãn `DEMO` rõ ràng ở section và Deal preview.

### 8.3. Reducer đảm bảo state nhất quán

Khi thay hướng giải, phải reset cấu hình không còn hợp lệ.

```ts
type DemoAction =
  | { type: "SELECT_SCENARIO"; scenarioId: string }
  | { type: "SELECT_SOLUTION"; solutionId: string }
  | { type: "SELECT_CONFIGURATION"; configurationId: string }
  | { type: "RESET" };

const initialState: DemoState = {
  scenarioId: null,
  solutionId: null,
  configurationId: null,
};

function createDemoReducer(scenarios: BusinessScenario[]) {
  return (state: DemoState, action: DemoAction): DemoState => {
    switch (action.type) {
      case "SELECT_SCENARIO": {
        const exists = scenarios.some(s => s.id === action.scenarioId);
        return exists
          ? { scenarioId: action.scenarioId, solutionId: null, configurationId: null }
          : state;
      }
      case "SELECT_SOLUTION": {
        const scenario = scenarios.find(s => s.id === state.scenarioId);
        const exists = scenario?.solutions.some(s => s.id === action.solutionId);
        return exists
          ? { ...state, solutionId: action.solutionId, configurationId: null }
          : state;
      }
      case "SELECT_CONFIGURATION": {
        const scenario = scenarios.find(s => s.id === state.scenarioId);
        const solution = scenario?.solutions.find(s => s.id === state.solutionId);
        const exists = solution?.configurations.some(c => c.id === action.configurationId);
        return exists ? { ...state, configurationId: action.configurationId } : state;
      }
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };
}
```

Đây là code ví dụ cho state domain, chưa bao gồm nội dung kịch bản thật, form hay server.

### 8.4. GSAP Flip cho thay đổi bố cục

Quy trình đúng với React:

1. Trước khi thay state, chụp vị trí/layout các card liên quan bằng `Flip.getState(...)`.
2. `dispatch()` thay đổi state hợp lệ.
3. Sau khi React commit DOM mới, chạy `Flip.from(...)` để nội suy từ vị trí cũ sang vị trí mới.
4. Cleanup animation khi thay cấu hình nhanh hoặc component unmount.
5. Nếu reduced motion bật, cập nhật trực tiếp không cần Flip.

**Không dùng GSAP để tự sắp xếp lại DOM mà React đang quản lý.**

### 8.5. Những chuyển động phù hợp

| Tương tác | Trạng thái React | Animation |
|---|---|---|
| Chọn Pain | `scenarioId` | Card active + content crossfade |
| Chọn hướng A/B | `solutionId` | Flip/reveal cấu hình hợp lệ |
| Chọn team A1/A2 | `configurationId` | Reorder card + Deal preview cập nhật |
| Xem quá trình | Không đổi nghiệp vụ | ScrollTrigger vẽ đường kết nối, reveal các bước |
| Mở Deal preview | State đã hợp lệ | Fade/expand ngắn; luôn nhãn DEMO |

---

## 9. Section 03: MỞ VIỆC và Form A/B

### 9.1. Yêu cầu bắt buộc

- Hero, header và footer dùng CTA chung **“MỞ VIỆC”** dẫn đến một điểm chọn cách bắt đầu.
- Hai route: **Trao đổi trước (Form A)** và **Gửi bối cảnh (Form B)**.
- Hai form **ẩn mặc định**; không hiển thị sẵn cả hai form dài trên landing.
- Cho phép **đóng** và **quay lại** từ form về màn chọn.
- Form A có **5 nhóm trên một trang**; Form B có **8 nhóm qua hai bước**, theo nguồn được duyệt ngày 11/10.
- Không thêm trường ngân sách, chiến lược hoặc “nguyên nhân thật”.
- Client-side và server-side validation cần thống nhất khi triển khai production.

**Các trường required theo brief:**

| Form A | Form B |
|---|---|
| Việc | Việc |
| Doanh nghiệp/thương hiệu | Ai đang tham gia (multi-select) |
| Sản phẩm/kênh | Doanh nghiệp |
| Quyền quyết định | Kênh |
| Họ tên | Quyền quyết định |
| Điện thoại/Zalo | Họ tên |
| Consent | Điện thoại/Zalo, Consent |

Form B còn có: khó khăn tùy chọn tối đa hai lựa chọn; nhánh “Đã thử” mở câu hỏi ngắn tùy chọn. **Bảng trên chỉ tóm tắt required, không thay thế các câu hỏi/choices gốc cần được bàn giao riêng.**

### 9.2. State machine cho form

```ts
type FormView =
  | "closed"
  | "choose-route"
  | "form-a"
  | "form-b"
  | "demo-result";

// closed -> choose-route
// choose-route -> form-a | form-b | closed
// form-a -> choose-route | demo-result | closed
// form-b -> choose-route | demo-result | closed
// demo-result -> choose-route | closed
```

**Đề xuất UX:** `choose-route` hiển thị hai card. Click một card sẽ chuyển nội dung sang form tương ứng bằng animation ngắn và có nút Back/Close. Nếu dùng modal/dialog, xử lý focus trap, Escape, keyboard navigation, scrolling và focus return. Nên giữ tạm dữ liệu người dùng đã nhập trong component state khi quay lại nếu chưa chủ động reset, đồng thời đảm bảo staging không thu thập/gửi dữ liệu cá nhân thật.

### 9.3. Staging vs production

| Vấn đề | Staging (hiện tại) | Production (sau duyệt) |
|---|---|---|
| Gửi form | Mô phỏng, ghi rõ **CHƯA GỬI THẬT** | Server xác nhận nhận hồ sơ thành công |
| API | Mock / không có endpoint thu lead | API validation, anti-spam, xử lý lỗi |
| Dữ liệu cá nhân | Không lưu/thu hồ sơ thật | Có retention, access control, backup |
| Email/admin | Chưa chốt | Chốt hộp thư, người nhận, phân quyền |
| Consent | Chưa dùng để tiếp nhận lead thật | Văn bản/chủ thể dữ liệu được duyệt |
| Thanh toán | Không thu | Không suy diễn thu 2 triệu khi submit |
| Xử lý retry | Không gửi thật | Tránh tạo bản ghi trùng khi retry/lỗi mạng |

Staging cần hạn chế truy cập (authentication hoặc cơ chế private preview được duyệt); chỉ dùng `robots.txt` không đủ để bảo vệ môi trường riêng tư.

---

## 10. Tối ưu hiệu năng, accessibility và responsive

### 10.1. Chiến lược theo thiết bị

| Thành phần | Desktop | Mobile |
|---|---|---|
| Hero quân Mã | Layered parallax tiết chế | Ảnh tĩnh hoặc reveal ngắn |
| 3 Pain | Sticky cards/reveal | Card xếp dọc, tap |
| “Vì sao?” | FLIP nhóm nguồn lực nếu có tương tác | Transition đơn giản |
| Team Builder | Sơ đồ tương tác, các card đổi vị trí | Stepper/card dọc, có thể chọn bằng tap |
| Ink mask | Thử nghiệm có kiểm soát | Fallback opacity/clip-path |
| Lenis | Tùy điều kiện | Ưu tiên native scrolling |
| Custom cursor | Không cần MVP | Không sử dụng |

### 10.2. Performance budget đề xuất

Đây là **mục tiêu**, không phải số liệu đo thực tế:

| Chỉ số | Ngưỡng mục tiêu |
|---|---|
| LCP | ≤ 2,5 giây |
| INP | ≤ 200 ms |
| CLS | ≤ 0,1 |
| Animation | Hướng tới 60 FPS trên thiết bị đủ năng lực |
| Lighthouse Mobile | Mục tiêu nội bộ ≥ 90, cần đo và điều chỉnh |

Đánh giá Core Web Vitals trên dữ liệu người dùng thực khi production đã có traffic; kết quả Lighthouse lab chỉ là một nguồn đo, không thay thế đo thực tế.

### 10.3. Quy tắc kỹ thuật

- Ưu tiên animate `transform` và `opacity`; hạn chế thay đổi thuộc tính gây layout/repaint liên tục.
- Không chạy nhiều hiệu ứng SVG filter, sticky pin và cursor loop cùng thời điểm nếu không cần.
- Lazy-init hiệu ứng không thiết yếu gần viewport; chỉ tải code/assets khi cần.
- `next/image`, khai báo `sizes`, kích thước ảnh, tối ưu WebP/AVIF và phiên bản crop mobile; tránh gây CLS.
- Cân nhắc preload ảnh Hero quan trọng, **không preload tất cả lớp ảnh nặng**.
- Giữ accessibility khi tắt animation, dùng `prefers-reduced-motion`.
- Test touchscreen: không phụ thuộc hover, mouse wheel hoặc pointer tracking.
- Tách text và CTA khỏi các lớp hình ảnh nếu animation có thể làm nội dung khó đọc.
- Kiểm tra UI với text tiếng Việt thực tế, không chỉ placeholder tiếng Anh.

### 10.4. Vì sao không dùng Barba.js ở giai đoạn đầu?

**[HERON]** Heron có mô tả page transitions bằng Barba.js. **[ĐỀ XUẤT]** Ecom’s Diary hiện là một landing page với các route form nội bộ, nên nên thực hiện chuyển trạng thái ngay trong React. Trộn Barba.js (thay DOM khi điều hướng) với Next.js App Router có thể tăng độ phức tạp về hydration, lifecycle và state synchronization. Chỉ cân nhắc route-transition giải pháp phù hợp Next.js nếu dự án phát sinh nhiều trang thực sự cần chuyển cảnh.

---

## 11. Lộ trình triển khai và nghiệm thu

> Chỉ là thứ tự giai đoạn kỹ thuật đề xuất; brief chưa chốt deadline, ngân sách hoặc owner. Không xem đây là báo giá.

| Giai đoạn | Nội dung | Điều kiện nghiệm thu |
|---|---|---|
| P0 – Technical spike | Hero thử nghiệm + shared ticker + một lựa chọn Team Builder | Đo hiệu năng desktop/mobile, chứng minh cập nhật state đúng |
| P1 – Foundation | Next.js, tokens, responsive layout, component hierarchy | Landing tĩnh đúng 5 section; đúng brand candidate |
| P2 – Interactive storytelling | 3 Pain, Why, Team Builder, solution/config/Deal DEMO | Các lựa chọn tạo thay đổi có nghĩa; không fake Partner |
| P3 – Form A/B | Route selection, form logic gốc, validation, back/close | Hai form ẩn mặc định, staging không gửi thật |
| P4 – Quality | QA mobile Safari/Android/desktop, accessibility, performance | PASS/FAIL, không overflow, không console errors |
| P5 – Production gates | Backend, consent, admin, bảo mật, hosting/domain | Chỉ thực hiện sau phê duyệt tương ứng |

### 11.1. Checklist QA

- [ ] Tên hiển thị public đúng ở header, footer, metadata, alt, form, thông báo và chia sẻ.
- [ ] Không xuất hiện tên nội bộ ở bất cứ phần public nào.
- [ ] Hero giữ ảnh quân Mã candidate và headline/CTA đúng bản preview cần phê duyệt.
- [ ] CTA MỞ VIỆC ở các vị trí dẫn về cùng một luồng.
- [ ] Chọn Pain cập nhật đúng nội dung liên quan.
- [ ] Mỗi hướng giải có thể có nhiều cấu hình team; state cập nhật hợp lệ.
- [ ] Thay hướng giải reset cấu hình/Deal preview cũ khi không còn phù hợp.
- [ ] Role Partner, Client, Deal Lead, Deal hiển thị đúng semantics; có nhãn DEMO rõ ràng.
- [ ] Không có carousel ngân sách độc lập và không có khoảng trắng lớn khi chuyển hướng giải.
- [ ] Các animation không làm sai state và không phá tương tác khi bị tắt.
- [ ] GSAP/ScrollTrigger/Lenis cleanup đúng khi unmount/remount.
- [ ] Reduced motion và keyboard navigation sử dụng được.
- [ ] Form A/B ẩn mặc định; có back/close, focus return, validation và consent.
- [ ] Staging không lưu/gửi hồ sơ thật, không thông báo giả rằng đã đặt lịch/được nhận.
- [ ] iOS Safari 320/390/430px, Android Chrome, desktop không overflow/scroll-jank nghiêm trọng.
- [ ] Không có lỗi console trong các flow chính.
- [ ] IT bàn giao URL staging private, source code, changelog, bảng PASS/FAIL và danh mục vấn đề chưa chốt.

### 11.2. Phân tách đầu việc dự toán

1. **Frontend staging + responsive + animation.**
2. **Form A/B + API + admin** (khi được duyệt triển khai phần tiếp nhận hồ sơ).
3. **Hosting, bảo mật, consent/retention, backup và vận hành.**
4. **QA mobile/desktop, sửa lỗi và bàn giao mã nguồn.**
5. **Go-live và domain**, chỉ sau khi Founder/đơn vị liên quan phê duyệt.

---

## 12. Rủi ro kỹ thuật và biện pháp xử lý

| Rủi ro | Tác động | Biện pháp |
|---|---|---|
| Dùng nhiều animation cùng lúc | Jank, ảnh hưởng INP | Giới hạn animation đồng thời, đo trên mobile thật |
| GSAP trực tiếp thay nghiệp vụ/DOM | Mất đồng bộ UI và dữ liệu | React reducer là nguồn sự thật duy nhất |
| Hotspot lệch do object-fit | Click sai vị trí | Coordinate mapping + ResizeObserver khi cần |
| Lạm dụng SVG filter | GPU/CPU nặng trên iOS | Fallback CSS, media query, reduced-motion |
| Lenis xung đột modal/anchor/keyboard | UX cuộn lỗi | Conditional init, kiểm thử scroll lock và anchor |
| Thêm Barba vào Next.js | Lifecycle/hydration phức tạp | Không dùng ở MVP |
| Thiếu source Form A/B | Tự chế nội dung trái brief | Yêu cầu file Founder-approved ngày 11/10 |
| Dùng hình candidate như final | Sai thẩm quyền phê duyệt | Preview ghi rõ candidate, chờ Design Freeze |
| Staging có API nhận lead thật | Rủi ro dữ liệu/pháp lý | Private staging, mock, không lưu PII |
| Hero nặng và CLS | LCP/CLS kém | Tối ưu ảnh, kích thước cố định, ưu tiên tải có chọn lọc |

---

## 13. Đề xuất triển khai ưu tiên

### Mức 1 — Core interaction (phải làm trước)

- State model/reducer cho Pain, Solution, Team và Deal.
- Form route state với back/close.
- GSAP ScrollTrigger phục vụ storytelling ở những vị trí cần thiết.
- Mobile-first layout, reduced motion và cơ chế cleanup.

### Mức 2 — Visual storytelling (sau khi state đúng)

- Hero quân Mã dựa trên asset gốc; layered parallax ở desktop nếu phù hợp.
- GSAP Flip cho các card nguồn lực.
- SVG mask cho chuyển ảnh thật sự giúp giải thích câu chuyện.

### Mức 3 — Progressive enhancement (chỉ sau khi đo hiệu năng)

- Lenis trên thiết bị phù hợp.
- SVG displacement/ink transition phức tạp.
- Pointer tracking và những hiệu ứng trang trí bổ sung.

**Khuyến nghị triển khai:** Dựng **technical prototype gồm Hero quân Mã + Team Builder** trước. Prototype cần có một bài toán minh họa, ít nhất hai hướng giải, nhiều cấu hình team và Deal preview cập nhật đúng khi người dùng lựa chọn. Đây là cách nhanh nhất để kiểm chứng phần kiến trúc có rủi ro và giá trị lớn nhất trước khi xây đầy đủ landing.

---

## 14. Danh sách nguồn tham khảo kỹ thuật

### Brief dự án

- **ECOMS-DIARY-IT-VISUAL-BRIEF-CANDIDATE-2026-10-13.pdf**, 9 trang. Các trang đặc biệt liên quan:
  - Trang 1–3: Tên public, Hero quân Mã, style, CTA, giới hạn phê duyệt.
  - Trang 4: Thứ tự section và logic ghép team.
  - Trang 5–6: Form A/B, validation, staging/production.
  - Trang 7–9: Nguồn asset, trạng thái phê duyệt, QA và rủi ro go-live.

### Tham khảo ngoài

- [Codrops – Heron AI (12/10/2026)](https://tympanus.net/codrops/2026/10/12/heron-ai/)
- [GSAP – React integration](https://gsap.com/resources/React/)
- [GSAP – ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP – Flip](https://gsap.com/docs/v3/Plugins/Flip/)
- [Lenis – source và hướng dẫn tích hợp](https://github.com/darkroomengineering/lenis)
- [Next.js – Image Component](https://nextjs.org/docs/app/api-reference/components/image)
- [web.dev – Core Web Vitals](https://web.dev/articles/vitals)

---

## 15. Những thông tin cần nhận thêm trước khi bắt tay triển khai

- [ ] Source HTML và asset ba trạng thái/lớp Hero quân Mã ngày 12/10.
- [ ] Bản visual system Ecom’s Diary V1.2 nếu cần chuẩn hóa đầy đủ typography/spacing.
- [ ] Nội dung 3 Pain và headline/hero copy cuối sau Founder duyệt.
- [ ] Source Form A/B Founder-approved ngày 11/10 (toàn bộ câu hỏi/choices/logic nhánh).
- [ ] Quyết định UX cuối về các tương tác trong phần Ghép team.
- [ ] Yêu cầu thiết bị mục tiêu và baseline hiệu năng.
- [ ] Quyết định hệ thống API/admin/email, chủ thể dữ liệu và consent trước production.
- [ ] Phê duyệt Design Freeze và quyền sử dụng asset trước go-live.

**Kết luận:** Nên kế thừa **tư duy animation phục vụ câu chuyện sản phẩm** của Heron hơn là sao chép nguyên kiểu hiệu ứng. Đối với Ecom’s Diary, giá trị cốt lõi nằm ở **interactive Team Builder** và việc thể hiện rõ mối quan hệ giữa bài toán – hướng giải – nguồn lực – Deal. Kiến trúc React state + GSAP giúp thể hiện điều đó nhất quán, có thể kiểm thử và nâng cấp dần mà không đánh đổi khả năng sử dụng trên mobile.
