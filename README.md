# Giải pháp của Ecom’s Diary

Landing page with Form A/B lead submission through a server-side webhook. The app validates and forwards submissions but does not store them.

## Run locally

```sh
npm install
npm run dev
```

## Lead delivery

Set `LEAD_WEBHOOK_URL` in the server environment to the HTTPS endpoint that receives leads. The endpoint receives a JSON body with `id`, `formType` (`a` or `b`), `submittedAt`, and validated form `data`. It also receives an `Idempotency-Key` header. Set `LEAD_WEBHOOK_TOKEN` if the receiver expects a bearer token. Keep both values server-side; do not prefix them with `NEXT_PUBLIC_`.

The form only confirms success after the webhook returns a 2xx response. Without a configured webhook, the API returns an unavailable response and the form displays a retry message. Submissions are not stored by this application. Configure retention, access control, and backups in the receiving CRM.

Run reducer tests with `npm test`. Create a production build with `npm run build` and serve it with `npm run start`.

## Stack

- Next.js App Router, React 19, and TypeScript
- Tailwind CSS 4 with shadcn/ui New York component conventions
- Radix UI primitives, Lucide icons, GSAP and ScrollTrigger
- Self-hosted Source Serif 4 (OFL) for Vietnamese editorial typography; final brand font remains unconfirmed
- React Hook Form with Zod validation

## Launch details to finalize

- The Hero uses a WebP reference extracted from the candidate brief. Replace it with the approved high-resolution asset before production.
- Reconcile Form A/B field labels and choices with the Founder-approved source forms.
- Supply official social URLs and public contact/privacy details before making the footer links live.
- Confirm the data controller and publish the final privacy notice before public launch.
