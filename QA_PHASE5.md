# Phase 5 QA Report

**Status:** PASS for local private preview automation; not a production approval.

## Automated checks

| Check | Result |
|---|---|
| `npm test` | PASS: 9 reducer and form-schema unit tests |
| `npm run typecheck` | PASS |
| `npm run build` | PASS: Next.js statically prerenders `/` |
| `npm run test:e2e` | PASS: 30 tests across three Playwright projects |
| Axe WCAG 2 A/AA and WCAG 2.1 A/AA scans | PASS: no violations on landing, route chooser, Form A, or Form B in tested projects |
| Horizontal overflow | PASS at 320, 390, 430, and 1365 CSS pixels |
| Preview asset | PASS: local WebP loads; copied file hash matches the handover package |
| Vietnamese editorial font | PASS: self-hosted Source Serif 4 variable font and italic subset load locally |

## Browser coverage

- Chromium desktop.
- Chromium with Pixel 7 mobile emulation.
- WebKit with iPhone 13 emulation.

These are browser emulations, not physical Android or iOS devices. They do not replace Safari-on-iPhone or Android Chrome device testing before production.

## Acceptance coverage

- Public title/robots metadata remains branded and `noindex`; forms are absent until MỞ VIỆC is opened.
- Pain → solution → configuration state remains valid; changing a parent choice clears dependent selections.
- Form A validates required values, retains its draft on Back, and shows only a DEMO confirmation without a non-GET request.
- Form B validates both steps, requires a participant, caps optional difficulties at two, and preserves the tried-details branch and draft when navigating Back.
- Closing/Escape clears the form session and restores focus to the opening CTA.
- Core interactions produce no browser page errors, console errors, external requests, or form submissions.
- The old footer status strip is removed; the replacement footer has brand/product context, section navigation, an Mở việc CTA, and explicit pending slots for contact/social details.

## Not covered / release gates

- No physical device run, Core Web Vitals field data, Lighthouse run, or frame-rate measurement on target hardware.
- The current Hero image is the PDF-extracted WebP reference, not the original high-resolution/layered asset; the SHA-256 was verified against the supplied handover file.
- The approved Form A/B source was not present in the workspace. Current labels/options remain candidate content and must be reconciled before content freeze.
- Official social profile URLs, public email/phone, and any legal/privacy links have not been supplied; the footer does not invent clickable accounts or contact details.
- Founder approval, image usage rights, final brand font/wordmark, data-controller/consent, and any production endpoint remain outside this private preview.
- The preview is not hosted. If hosted, protect it with access control; `noindex` is not authentication.
