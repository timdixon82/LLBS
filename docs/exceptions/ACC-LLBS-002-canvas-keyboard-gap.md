# Exception ACC-LLBS-002: Canvas photo-positioning is pointer-only

## Summary

The LLBS Photo Brander (`brand.html`) allows users to reposition their uploaded photo on the canvas by dragging with a pointer device. There is no keyboard equivalent for fine dragging. This exception documents and approves that gap, on the basis that coarse positioning is achievable by keyboard via the existing controls, and that implementing full keyboard dragging would require significant additional JavaScript.

## Details

| Field | Value |
| --- | --- |
| Exception identifier | ACC-LLBS-002 |
| Category | Accessibility: WCAG 2.2 criterion 2.1.1 Keyboard, Level A; 2.1.3 Keyboard (No Exception), Level AAA |
| Date raised | 2026-05-21 |
| Raised by | Carol (tester), during WCAG 2.2 AAA baseline audit (finding 2.9) |
| Approved by | Tim Dixon |
| Approval date | 2026-05-21 (answer 12 in the consolidated question batch) |
| Review date | 2027-05-21 |

## What this exception covers

The exception covers only the fine photo-repositioning interaction on the canvas in `brand.html`. Specifically:

- Dragging the photo to an arbitrary position within the canvas frame.
- Dragging the overlay text block to an arbitrary position.

Both interactions use pointer events (`pointerdown`, `pointermove`, `pointerup`) and mouse-wheel zoom with no keyboard equivalent.

This exception does not cover other keyboard accessibility issues on `brand.html`. All other controls must be keyboard-operable. The file upload area (finding 2.2), the form controls, the action buttons, and the canvas accessible name (finding 2.3) are separate issues and are not covered by this exception.

## Rationale

The keyboard controls panel provides a meaningful path to the primary outputs for keyboard users:

- The zoom slider adjusts photo scale.
- The rotation slider adjusts photo rotation.
- The Re-centre button resets the photo to the centre of the canvas.
- The Fit to Frame button resets scale and rotation.
- Text size and position sliders adjust the overlay text.

These controls give a keyboard user sufficient control to produce a usable branded image, even without fine pixel-level dragging. The primary purpose of the tool is to produce a consistently branded image with the LLBS logo strip, which does not require precise photo positioning.

Implementing full keyboard equivalents for pointer-drag repositioning (typically arrow-key nudging on a focused canvas element) would require substantial additional JavaScript and a revised interaction model for the canvas. Tim accepted this as a documented exception rather than a required fix for this adoption phase.

## Residual risk

The residual risk is moderate. This is a Level A keyboard failure (WCAG 2.1.1) for the drag interaction specifically. A keyboard-only user or a switch access user cannot fine-position a photo or text overlay by dragging. They can achieve centred or approximate positioning using the Re-centre control and the sliders.

The tool is intended for LLBS staff and volunteers creating social media images. The impact of an imprecise photo position in a branded image is low. However, any staff member who relies exclusively on keyboard navigation will experience a reduced capability with this tool.

## Conditions

This exception is valid while:

- The Re-centre button, zoom slider, and rotation slider all remain keyboard-operable.
- No other keyboard path to photo repositioning becomes feasible without major JavaScript refactoring.
- The exception is reviewed by the date above.

If a future development sprint adds arrow-key nudging to the canvas, this exception should be closed.

## Related

- Carol's baseline audit finding 2.9, in `docs/accessibility.md`.
- Requirements section 5.3 (photo positioning) and acceptance criteria in `docs/requirements.md`.
