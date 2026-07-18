# Requirements: 007-canvas-keyboard

**Goal:** Close ACC-LLBS-002 by adding arrow-key nudging to the canvas in `brand.html`, making photo and text-overlay repositioning fully keyboard-operable (WCAG 2.2, 2.1.1 Level A; 2.1.3 Level AAA).

---

## Functional requirements

1. **Canvas is keyboard-focusable.** The canvas already carries `tabindex="0"` in `brand.html` (line 63). No HTML change needed. Confirm this attribute is preserved after Sean's edits.

2. **Arrow keys nudge photo position (photo mode).** When the canvas has keyboard focus and photo mode is active, pressing an arrow key moves `transform.offsetX` (Left/Right) or `transform.offsetY` (Up/Down) by **5 px** (output-canvas pixels). Holding Shift increases the increment to **20 px**. After each nudge, call `drawComposite()`. This mirrors how pointer-drag updates those same state variables (see `pointermove` handler, lines 570-585 of `js/brand.js`).

3. **Keyboard mode toggle between photo and text.** Add a visible, labelled toggle button in the controls panel — between the "Re-centre photo" / "Fit to frame" row and the text section divider — that switches the canvas between "Move photo" mode and "Move text" mode. The button label must reflect the current mode, e.g. "Canvas arrows: moving photo (switch to text)". The toggle must be keyboard-operable (it is a `<button>`, so this is automatic). Pressing the button when no text is present has no effect on text state but should not error.

   Rationale for a button over Tab: Tab on a focused canvas must remain free to move keyboard focus away from the canvas to the next focusable element. A labelled button avoids hijacking Tab and makes the mode discoverable.

4. **Arrow keys nudge text overlay position (text mode).** When canvas is focused and text mode is active, pressing an arrow key moves `textState.x` (Left/Right) or `textState.y` (Up/Down) by **5 px** (20 px with Shift). Set `textState.customPlaced = true` after each nudge, then call `drawComposite()`. This matches how pointer-drag updates `textState` (lines 575-578 of `js/brand.js`).

5. **Visible focus ring on the canvas.** No `:focus` rule exists for the canvas element in `css/brand.css` (the file styles `canvas:active` but not `canvas:focus` or `canvas:focus-visible`). Add a `canvas:focus-visible` rule that renders a focus ring consistent with the existing control-focus style: `outline: 3px solid #1a56db; outline-offset: 3px;`. The existing `border-radius: 8px` on the canvas means the outline will be inset slightly — use `outline-offset: 3px` to keep it clear of the shadow.

6. **Accessible description of keyboard controls.** The canvas already has `aria-label` set dynamically to the format description (e.g. "Branded Instagram and Facebook square image preview") via `applyFormat()` (line 143 of `js/brand.js`). Add a static `aria-describedby` pointing to a visually-hidden hint element adjacent to the canvas. The hint text must read: "When focused, arrow keys move the photo or text overlay. Hold Shift for a larger step. Use the mode toggle button to switch between moving the photo and moving the text." Place the hint element inside `.canvas-wrap` so it stays adjacent in the DOM.

7. **`drawComposite()` handles redraw.** No changes to the draw pipeline. Each nudge dispatches a `drawComposite()` call; the function already redraws the full composite from current state.

---

## Acceptance criteria

- [ ] Tabbing to the canvas focuses it; a visible focus ring appears. (Satisfies DoD: canvas is keyboard-focusable, visible focus indicator present.)
- [ ] In photo mode, each arrow key press moves the photo 5 px in the correct direction and redraws immediately. (Satisfies DoD: arrow keys nudge photo position.)
- [ ] Shift + arrow key moves the photo 20 px per press. (Satisfies DoD: arrow keys nudge photo position.)
- [ ] The mode toggle button is reachable by keyboard, has a descriptive label that reflects the current mode, and switches arrow-key behaviour between photo and text. (Satisfies DoD: keyboard mechanism for text overlay mode.)
- [ ] In text mode with overlay text present, each arrow key press moves the text 5 px in the correct direction and redraws. `textState.customPlaced` is `true` after the first nudge. (Satisfies DoD: keyboard mechanism for text overlay.)
- [ ] In text mode with no text entered, arrow keys cause no error and do not move the photo. (Robustness.)
- [ ] Arrow key presses on a focused canvas do not scroll the page. (`e.preventDefault()` is in place.)
- [ ] The canvas `aria-describedby` hint is read by a screen reader when the canvas receives focus (manual test with NVDA or VoiceOver).
- [ ] Pa11y and axe report no WCAG 2.1.1 Keyboard failures. (Satisfies DoD: Pa11y and axe pass.)
- [ ] Carol signs off functional and accessibility passes. (Satisfies DoD: Carol sign-off.)
- [ ] `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md` is updated to record the exception as closed. (Satisfies DoD: exception document updated.)

---

## Implementation notes for Sean

**Where drag logic lives:** `js/brand.js`, lines 544-604. The `pointerdown` handler (line 560) sets `dragTarget` to `'photo'` or `'text'`. The `pointermove` handler (lines 570-585) branches on `dragTarget` and updates the same state variables the keyboard handler will update.

**State variables to update:**

| Target | X variable | Y variable | Extra flag to set |
|---|---|---|---|
| Photo | `transform.offsetX` | `transform.offsetY` | none |
| Text | `textState.x` | `textState.y` | `textState.customPlaced = true` |

Both variables are in output-canvas pixel space. The nudge increment (5 px / 20 px with Shift) is already in that space, so no coordinate conversion is needed — unlike pointer events, which go through `canvasToImagePixels()` (line 549).

**How `drawComposite()` is called:** Every control calls it directly after updating state (see zoom/rotate/center listeners, lines 497-522). The keyboard handler should do the same: update state, then call `drawComposite()`.

**Where to attach the keydown listener:** Attach to the canvas element, not `document`. Guard with `if (!userImage) { return; }` — identical to the `pointerdown` guard (line 561). Prevent default on the four arrow keys to stop page scroll.

**Mode state:** A single boolean (e.g. `var keyboardMoveTarget = 'photo';`) toggled by the new button's `click` listener is sufficient. Initialise to `'photo'` so keyboard users get photo-move behaviour immediately on focus without needing to interact with the toggle first.

**Focus ring:** Add to `css/brand.css` after the `canvas:active` rule (line 156). Use `canvas:focus-visible` rather than `canvas:focus` to avoid painting the ring on mouse click (browsers that support `:focus-visible` suppress it for pointer interactions automatically).

**Hint element placement:** Inside `.canvas-wrap` (line 62 of `brand.html`), after the canvas. Use the existing `.visually-hidden` class (already in use on `#fileInput`, line 44) to hide it visually while keeping it in the accessibility tree.
