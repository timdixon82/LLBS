# Privacy: LLBS

This document records the privacy posture for the LLBS project. It was produced during the 2026-05-30 onboarding pass and should be updated whenever the analytics or data handling approach changes.

## Analytics

`index.html` (the Living Well Together Strategy page) uses GoatCounter for privacy-respecting page view analytics. GoatCounter does not use cookies, does not fingerprint visitors, and does not collect personal data. It records page views only: the URL viewed, referrer, browser, and screen size. No individually identifiable data is stored.

`brand.html` (the Photo Brander) has no analytics.

## Data collection statement

**`index.html`:** GoatCounter collects anonymous aggregate page-view data (URL, referrer, browser, screen size). No personal data is collected. No cookies are set. No local storage is used.

**`brand.html`:** No data is collected. All photo processing happens in the browser using the Canvas API. No image, file, or user-supplied content is transmitted to any server. Photos are not stored beyond the current browser session.

Neither page collects personally identifiable information.

## Third-party services

| Service | Pages | Data received | Purpose |
|---------|-------|--------------|---------|
| GoatCounter (self-hosted or managed) | index.html only | Anonymous page view (URL, referrer, browser, screen size) | Aggregate usage analytics |

No font CDNs, authentication providers, payment processors, or other third-party services are used. All fonts and logos are self-hosted (ADR 005).

## UK GDPR obligations

GoatCounter does not collect personal data as defined under UK GDPR. Anonymous aggregate statistics are not personal data. No further UK GDPR obligations arise from this project's current data handling.

If personal data collection is introduced in a future phase (for example, contact forms or user accounts), this section must be expanded and Jed must review the changes.

### Lawful basis

Not required. No personal data is processed.

### Retention periods

Not required. No personal data is processed.

### Data subject rights

Not required. No personal data is processed. GoatCounter's anonymous page-view data cannot be attributed to an individual and therefore no subject-access, erasure, or portability obligations arise.
