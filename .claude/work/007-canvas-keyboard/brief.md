# Brief: 007-canvas-keyboard

## Preamble
- **Triage type:** Small feature
- **Mockup mode:** D — skip
- **Work folder:** 007-canvas-keyboard
- **Date opened:** 2026-06-05
- **Closes:** ACC-LLBS-002 (canvas keyboard gap exception)

## Summary

Add keyboard navigation to the photo canvas in `brand.html` so that keyboard-only users can reposition the uploaded photo and the text overlay using the arrow keys. This closes the documented WCAG 2.2 Level A exception ACC-LLBS-002 (WCAG 2.1.1 Keyboard).

The canvas currently supports only pointer-drag repositioning. The fix adds:
- `tabindex="0"` to the canvas element so it receives keyboard focus
- Arrow-key nudging for photo position when the canvas is focused
- A mechanism to toggle between moving the photo and moving the text overlay (e.g. Tab or a dedicated key)
- Arrow-key nudging for text overlay position
- A visible focus indicator on the canvas
- Updated accessible description hinting at keyboard controls

## Out of scope

- Pointer/touch drag interactions — these are not changed
- Mouse-wheel zoom keyboard equivalent — addressed separately if needed
- ARIA live announcements of pixel-level position values
- Any visual redesign of the canvas or controls panel
- Changes to `index.html` or `css/strategy.css`

## Risk and rollback

**Risk:** Low. Changes are additive — new event listeners and a `tabindex` attribute on the canvas. The existing pointer interactions are not modified.

**Rollback:** Revert `js/brand.js` and `brand.html` to restore pointer-only behaviour. No data, no build artefacts, no external dependencies affected.

## Definition of done

- [ ] Canvas element is keyboard focusable (`tabindex="0"`)
- [ ] Arrow keys nudge the photo position when the canvas is focused (photo mode active)
- [ ] A keyboard mechanism exists to nudge the text overlay position (separate mode or modifier key)
- [ ] A visible focus indicator is present on the canvas when focused
- [ ] Accessible description on the canvas (or a nearby hint) documents the keyboard controls
- [ ] Pa11y and axe pass with no WCAG 2.1.1 Keyboard failures
- [ ] Carol signs off functional and accessibility passes
- [ ] ACC-LLBS-002 exception document updated to "closed"

## Approved GitHub actions

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [x] Comment on a pull request or an issue
- [x] Create an issue
