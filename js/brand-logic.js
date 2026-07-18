// brand-logic.js
// Pure, DOM-free helper functions used by the LLBS Photo Brander
// (brand.js). Extracted (work 051) so the colour, contrast, and layout
// maths can be unit tested in isolation from the canvas- and
// DOM-dependent code that draws and wires up the editor. This is a
// minimal, behaviour-preserving extraction: no calculation here changed
// from the code that used to live inline in brand.js.

// ─────────────────────────────────────────────
// Colour helpers and WCAG contrast
// ─────────────────────────────────────────────

// Converts a 6-digit hex colour string (with or without a leading '#')
// into an [r, g, b] array of 0-255 integers.
export function hexToRgb(hex) {
  var h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16)
  ];
}

// Converts a hex colour and an alpha (0-1) into an rgba() CSS string.
export function hexToRgba(hex, alpha) {
  var rgb = hexToRgb(hex);
  return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
}

// True when a hex colour's perceived luminance (Rec. 709 weights) is
// below the midpoint threshold used to choose a light or dark stroke
// for text legibility.
export function isDark(hex) {
  var rgb = hexToRgb(hex);
  return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) < 140;
}

// WCAG relative luminance of an [r, g, b] colour (0-255 components).
// https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
export function relLuminance(rgb) {
  return [0, 1, 2].reduce(function (sum, i) {
    var v = rgb[i] / 255;
    var linearised = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return sum + [0.2126, 0.7152, 0.0722][i] * linearised;
  }, 0);
}

// WCAG contrast ratio between two [r, g, b] colours. Result is always
// >= 1 (identical colours) and <= 21 (black on white or vice versa).
// https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
export function contrastRatio(rgb1, rgb2) {
  var l1 = relLuminance(rgb1);
  var l2 = relLuminance(rgb2);
  var hi = Math.max(l1, l2);
  var lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

// Alpha-composites an [r, g, b] foreground colour over an [r, g, b]
// background colour, returning the resulting opaque [r, g, b].
export function blendOver(fg, alpha, bg) {
  return [0, 1, 2].map(function (i) {
    return Math.round(fg[i] * alpha + bg[i] * (1 - alpha));
  });
}

// ─────────────────────────────────────────────
// Canvas layout maths
// ─────────────────────────────────────────────

// The branding strip's pixel height for a given output format height,
// clamped between minPx and maxPx.
export function computeStripHeight(formatHeight, ratio, minPx, maxPx) {
  return Math.min(maxPx, Math.max(minPx, Math.round(formatHeight * ratio)));
}

// The photo area (excludes the branding strip) for a given output
// format and strip height.
export function computePhotoArea(formatWidth, formatHeight, stripHeight) {
  return { x: 0, y: 0, w: formatWidth, h: formatHeight - stripHeight, stripH: stripHeight };
}

// The "cover" scale factor that fits an image of size (imgW x imgH)
// to fully cover an area of size (areaW x areaH) with no empty
// borders, cropping whichever dimension overflows.
export function computeCoverScale(areaW, areaH, imgW, imgH) {
  var sx = areaW / imgW;
  var sy = areaH / imgH;
  return Math.max(sx, sy);
}
