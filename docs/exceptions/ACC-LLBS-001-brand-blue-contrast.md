# Exception ACC-LLBS-001: Brand-blue primary colour contrast shortfall

## Summary

The LLBS primary colour `#156082` on a white background gives a contrast ratio of 6.94:1. The WCAG (Web Content Accessibility Guidelines) 2.2 AAA threshold for normal text is 7:1. The shortfall is 0.06. This exception documents and approves that marginal gap rather than requiring the brand colour to be changed.

## Details

| Field | Value |
| --- | --- |
| Exception identifier | ACC-LLBS-001 |
| Category | Accessibility: WCAG 2.2 criterion 1.4.6 Contrast (Enhanced), Level AAA |
| Date raised | 2026-05-21 |
| Raised by | Carol (tester), during WCAG 2.2 AAA baseline audit |
| Approved by | Tim Dixon |
| Approval date | 2026-05-21 (answer 10 in the consolidated question batch) |
| Review date | 2027-05-21 |

## What this exception covers

The exception applies to white text on the primary LLBS brand colour `#156082` in the following locations on `index.html`:

- The hero call-to-action button (1rem bold text)
- The active tab selected state text (0.9375rem text)
- The Community theme label pill text
- The income-card mid-variant label text (0.9375rem text)
- Route-box h4 uppercase headings

It does not cover all uses of this colour. The large stat-card numbers (2.25rem bold) and the large income-card numbers (2.75rem bold) on the same background do meet AAA for large text, because the large-text AAA threshold is 4.5:1, not 7:1. Those elements are not part of this exception.

## Rationale

The shortfall is 0.06 below the AAA threshold. The colour passes AA (minimum 4.5:1) comfortably at 6.94:1. Darkening the primary colour enough to clear 7:1 would change the LLBS brand colour used across the strategy page, and would likely no longer match the main LLBS website at `llbs.co.uk`. The visual difference between 6.94:1 and 7:1 is not perceptible to any user.

Tim reviewed the shortfall and approved this exception on the grounds that the gap is marginal, the colour passes AA, the change required to clear AAA would alter the brand, and the LLBS brand colour is not the team's to change unilaterally.

## Residual risk

The residual risk is very low. The colour passes AA at 6.94:1 and most users, including most low-vision users, will experience no difficulty. Screen reader users are unaffected by colour contrast. The gap below AAA is 0.06 ratio points and is not perceptible.

## Conditions

This exception is valid while:

- The LLBS brand colour palette remains `#156082` as the primary teal-blue.
- The affected elements remain at normal text sizes below the WCAG large-text threshold.
- The exception is reviewed by the date above.

If the brand colour changes, or if these elements move to large text sizes, the exception must be reviewed and may no longer be needed.

## Related

- Carol's baseline audit finding 1.3, in `docs/accessibility.md`.
- ADR 005 for the dependency and self-hosting context.
