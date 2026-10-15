# Giải pháp của Ecom’s Diary

Private interactive preview. This frontend does not send or persist form data.

## Run locally

```sh
npm install
npm run dev
```

Run reducer tests with `npm test`. Create a production build with `npm run build` and serve it with `npm run start`.

## Stack

- Next.js App Router, React 19, and TypeScript
- Tailwind CSS 4 with shadcn/ui New York component conventions
- Radix UI primitives, Lucide icons, GSAP and ScrollTrigger
- Self-hosted Source Serif 4 (OFL) for Vietnamese editorial typography; final brand font remains unconfirmed
- React Hook Form with Zod validation

## Asset and approval gates

- The Hero uses a WebP reference extracted from the candidate brief, not the original high-resolution asset. Replace it with the approved source before production.
- Reconcile Form A/B field labels and choices with the Founder-approved source forms.
- Supply official social URLs and public contact/privacy details before making the footer links live.
- Confirm the legal data controller and consent copy before any real submission flow is connected.
- Protect any hosted preview with access control; `noindex` is not authentication.
