// brand.js
// LLBS Photo Brander — all application behaviour for brand.html.
//
// The LLBS logo is loaded from assets/llbs-logo-brander.png, a same-origin
// asset. This removes the need for the CORS proxy fallback chain that existed
// in the original single-file version. A same-origin image does not taint
// the canvas and needs no crossOrigin attribute or proxy. See ADR 005.
//
// The colour/contrast and layout maths that do not touch the DOM live in
// brand-logic.js, extracted (work 051) so they can be unit tested in
// isolation. This file imports them rather than redefining them.

import {
  hexToRgb, hexToRgba, isDark, contrastRatio, blendOver,
  computeStripHeight, computePhotoArea, computeCoverScale
} from './brand-logic.js';

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────
var LOGO_SRC = 'assets/llbs-logo-brander.png';

// Fixed social-media output sizes (pixels)
var FORMATS = {
  square:    { w: 1080, h: 1080, label: 'Square',    ariaLabel: 'Branded Instagram and Facebook square image preview' },
  portrait:  { w: 1080, h: 1920, label: 'Portrait',  ariaLabel: 'Branded Story, Reel, and TikTok portrait image preview' },
  landscape: { w: 1600, h: 900,  label: 'Landscape', ariaLabel: 'Branded Twitter and X landscape image preview' },
  facebook:  { w: 1200, h: 630,  label: 'Facebook',  ariaLabel: 'Branded Facebook post image preview' }
};

var BRAND_HEIGHT_RATIO = 0.10;   // branding strip = 10% of canvas height
var BRAND_MIN_PX       = 80;
var BRAND_MAX_PX       = 180;
var LINE_HEIGHT_RATIO  = 0.006;  // blue line thickness relative to height
var LINE_COLOR         = '#1a56db';
var LOGO_PADDING_RATIO = 0.10;
var LOGO_VERT_PAD      = 0.12;
var TEXT_PADDING_RATIO = 0.05;   // text margin from canvas edge

// Display canvas max size on screen (CSS pixels)
var DISPLAY_MAX = 600;

// ─────────────────────────────────────────────
// DOM refs
// ─────────────────────────────────────────────
var dropZone     = document.getElementById('dropZone');
var fileInput    = document.getElementById('fileInput');
var editor       = document.getElementById('editor');
var canvas       = document.getElementById('canvas');
var ctx          = canvas.getContext('2d');
var statusEl     = document.getElementById('status');
var shareBtn     = document.getElementById('shareBtn');
var downloadBtn  = document.getElementById('downloadBtn');
var resetBtn     = document.getElementById('resetBtn');
var shareSpinner = document.getElementById('shareSpinner');
var dlFallback   = document.getElementById('download-fallback');

var formatSelect = document.getElementById('formatSelect');
var zoomSlider   = document.getElementById('zoomSlider');
var zoomValue    = document.getElementById('zoomValue');
var rotateSlider = document.getElementById('rotateSlider');
var rotateValue  = document.getElementById('rotateValue');
var centerBtn    = document.getElementById('centerBtn');
var fitBtn       = document.getElementById('fitBtn');
var textInput    = document.getElementById('textInput');
var textSize     = document.getElementById('textSize');
var textSizeValue= document.getElementById('textSizeValue');
var textFont     = document.getElementById('textFont');
var fontColor    = document.getElementById('fontColor');
var bgColor      = document.getElementById('bgColor');
var bgAlpha      = document.getElementById('bgAlpha');
var bgAlphaValue = document.getElementById('bgAlphaValue');
var contrastAA       = document.getElementById('contrastAA');
var contrastAAA      = document.getElementById('contrastAAA');
var contrastRatioEl  = document.getElementById('contrastRatio');
var contrastDetail   = document.getElementById('contrastDetail');
var keyboardModeBtn  = document.getElementById('keyboardModeBtn');

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────
var userImage = null;
var llbsLogo  = null;
var originalFileName = 'photo.jpg';

// Photo transform — in OUTPUT-canvas pixel space.
// offsetX/Y is centre of photo within the photo area.
var transform = {
  offsetX: 0,
  offsetY: 0,
  scale:   1,      // multiplier on top of fit-to-frame base scale
  rotation: 0,     // radians
  baseScale: 1     // fit-to-frame scale (multiplied with scale)
};

var currentFormat = FORMATS.square;

// Text state — centre of text block in output-canvas pixels.
var textState = {
  x: 0,
  y: 0,
  customPlaced: false,
  bounds: null  // last drawn bounding box for hit-testing {x,y,w,h}
};

// Keyboard move target — which element arrow keys nudge when the canvas is focused.
// Initialise to 'photo' so keyboard users get photo-move immediately on focus.
var keyboardMoveTarget = 'photo';

// ─────────────────────────────────────────────
// Logo loading
// ─────────────────────────────────────────────
// The logo is served from the same origin as the page (assets/).
// It does not require a crossOrigin attribute.
// If the load fails, the branding strip renders without the logo.
function loadImage(src) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload  = function () { resolve(img); };
    img.onerror = function () { reject(new Error('Failed to load: ' + src)); };
    img.src = src;
  });
}

// ─────────────────────────────────────────────
// Photo area helpers
// ─────────────────────────────────────────────
function getStripHeight() {
  return computeStripHeight(currentFormat.h, BRAND_HEIGHT_RATIO, BRAND_MIN_PX, BRAND_MAX_PX);
}

function getPhotoArea() {
  return computePhotoArea(currentFormat.w, currentFormat.h, getStripHeight());
}

function computeFitBaseScale() {
  if (!userImage) { return 1; }
  var area = getPhotoArea();
  // Fit-to-frame: cover the photo area (no empty borders)
  return computeCoverScale(area.w, area.h, userImage.naturalWidth, userImage.naturalHeight);
}

function recentrePhoto() {
  var area = getPhotoArea();
  transform.offsetX = area.x + area.w / 2;
  transform.offsetY = area.y + area.h / 2;
}

function applyFormat(key) {
  currentFormat = FORMATS[key];
  canvas.width  = currentFormat.w;
  canvas.height = currentFormat.h;
  canvas.setAttribute('aria-label', currentFormat.ariaLabel);
  sizeCanvasForDisplay();

  if (userImage) {
    transform.baseScale = computeFitBaseScale();
    recentrePhoto();
  }
  // Re-anchor text to the new frame's default position
  textState.customPlaced = false;
  drawComposite();
}

function sizeCanvasForDisplay() {
  // Constrain CSS size while keeping internal resolution
  var aspect = currentFormat.w / currentFormat.h;
  var cssW, cssH;
  if (aspect >= 1) {
    cssW = Math.min(DISPLAY_MAX, currentFormat.w);
    cssH = cssW / aspect;
  } else {
    cssH = Math.min(DISPLAY_MAX, currentFormat.h);
    cssW = cssH * aspect;
  }
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';
}

// ─────────────────────────────────────────────
// Composite and draw
// ─────────────────────────────────────────────
function drawComposite() {
  var W    = currentFormat.w;
  var H    = currentFormat.h;
  var area = getPhotoArea();

  // Background
  ctx.fillStyle = '#1a2942';
  ctx.fillRect(0, 0, W, H);

  // Photo area background (in case photo does not fully cover)
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(area.x, area.y, area.w, area.h);

  // Clip to photo area, then draw the photo with current transform
  if (userImage) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(area.x, area.y, area.w, area.h);
    ctx.clip();

    var totalScale = transform.baseScale * transform.scale;
    ctx.translate(transform.offsetX, transform.offsetY);
    ctx.rotate(transform.rotation);
    ctx.drawImage(
      userImage,
      -userImage.naturalWidth  * totalScale / 2,
      -userImage.naturalHeight * totalScale / 2,
      userImage.naturalWidth   * totalScale,
      userImage.naturalHeight  * totalScale
    );
    ctx.restore();
  }

  // Overlay text (constrained inside the photo area, with padding)
  drawText(area);

  // Branding strip
  drawBrandingStrip(area);
}

function drawText(area) {
  var text = textInput.value.trim();
  if (!text) { textState.bounds = null; return; }

  var pad        = Math.round(currentFormat.w * TEXT_PADDING_RATIO);
  var maxW       = area.w - pad * 2;
  var fontSize   = parseInt(textSize.value, 10);
  var lineHeight = Math.round(fontSize * 1.2);
  var font       = textFont.value;
  var bdPadX     = Math.round(fontSize * 0.5);
  var bdPadY     = Math.round(fontSize * 0.25);

  ctx.save();
  ctx.font = '700 ' + fontSize + 'px ' + font;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';

  var lines  = wrapText(text, maxW);
  var blockH = lines.length * lineHeight;

  // Measure widest line for hit-testing
  var blockW = 0;
  lines.forEach(function (line) {
    var w = Math.min(maxW, ctx.measureText(line).width);
    if (w > blockW) { blockW = w; }
  });

  // Default position: bottom-centred on first draw
  if (!textState.customPlaced) {
    textState.x = area.x + area.w / 2;
    textState.y = area.y + area.h - pad - blockH / 2;
  }

  // Clamp centre so the whole block stays inside the photo area + padding
  var halfW = blockW / 2 + bdPadX;
  var halfH = blockH / 2 + bdPadY;
  textState.x = Math.max(area.x + pad + halfW, Math.min(textState.x, area.x + area.w - pad - halfW));
  textState.y = Math.max(area.y + pad + halfH, Math.min(textState.y, area.y + area.h - pad - halfH));

  var centreX = textState.x;
  var topY    = textState.y - blockH / 2;

  // Background pill (transparent if alpha is 0)
  var alpha = parseInt(bgAlpha.value, 10) / 100;
  if (alpha > 0) {
    ctx.fillStyle = hexToRgba(bgColor.value, alpha);
    lines.forEach(function (line, i) {
      var w     = Math.min(maxW, ctx.measureText(line).width) + bdPadX * 2;
      var lineY = topY + i * lineHeight;
      roundRect(ctx, centreX - w / 2, lineY - bdPadY, w, lineHeight + bdPadY, Math.round(fontSize * 0.18));
      ctx.fill();
    });
  }

  // Stroke helps legibility when the background is transparent or near-transparent.
  if (alpha < 0.6) {
    ctx.lineWidth   = Math.max(2, Math.round(fontSize * 0.06));
    ctx.strokeStyle = isDark(fontColor.value) ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)';
    lines.forEach(function (line, i) {
      ctx.strokeText(line, centreX, topY + i * lineHeight);
    });
  }

  ctx.fillStyle = fontColor.value;
  lines.forEach(function (line, i) {
    ctx.fillText(line, centreX, topY + i * lineHeight);
  });

  // Cache bounds (includes background-pill padding) for hit-testing
  textState.bounds = {
    x: centreX - blockW / 2 - bdPadX,
    y: topY - bdPadY,
    w: blockW + bdPadX * 2,
    h: blockH + bdPadY * 2
  };

  ctx.restore();
}

// ─────────────────────────────────────────────
// Colour helpers and WCAG contrast
// ─────────────────────────────────────────────
// hexToRgb, hexToRgba, isDark, contrastRatio, and blendOver are imported
// from brand-logic.js (see the import block at the top of this file).

function updateContrastBadge() {
  var fg       = hexToRgb(fontColor.value);
  var bg       = hexToRgb(bgColor.value);
  var alpha    = parseInt(bgAlpha.value, 10) / 100;
  var fontSize = parseInt(textSize.value, 10);
  // Bold >= 18.66px (14pt) counts as "large" per WCAG
  var large     = fontSize >= 18.66;
  var aaThresh  = large ? 3.0 : 4.5;
  var aaaThresh = large ? 4.5 : 7.0;

  if (alpha < 0.05) {
    // Fully transparent — contrast depends on the photo behind the text.
    setPill(contrastAA,  null, 'AA - N/A');
    setPill(contrastAAA, null, 'AAA - N/A');
    contrastRatioEl.textContent = '-:1';
    contrastDetail.textContent =
      'Transparent background: contrast depends on the photo. Pick a background colour or rely on the text stroke for legibility.';
    return;
  }

  // For semi-transparent, blend the bg colour onto a neutral mid-grey
  // (proxy for an arbitrary photo) to get a representative ratio.
  var effective = alpha >= 0.999 ? bg : blendOver(bg, alpha, [128, 128, 128]);
  var ratio     = contrastRatio(fg, effective);
  var passAA    = ratio >= aaThresh;
  var passAAA   = ratio >= aaaThresh;

  setPill(contrastAA,  passAA,  'AA '  + (passAA  ? 'Pass' : 'Fail'));
  setPill(contrastAAA, passAAA, 'AAA ' + (passAAA ? 'Pass' : 'Fail'));
  contrastRatioEl.textContent = ratio.toFixed(2) + ':1';

  var sizeNote = large ? 'large text (18.66px bold or larger)' : 'normal text';
  var detail   = 'Ratio ' + ratio.toFixed(2) + ':1 vs ' + sizeNote + '. ';
  detail += passAAA ? 'Meets WCAG AAA.'
          : passAA  ? 'Meets WCAG AA but fails AAA.'
                    : 'Fails WCAG AA.';
  if (alpha < 0.999) { detail += ' Estimated over a mid-grey photo.'; }
  contrastDetail.textContent = detail;
}

function setPill(el, state, label) {
  el.textContent = label;
  el.className   = 'contrast-pill ' + (state === true ? 'pass' : state === false ? 'fail' : 'na');
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y,     x + w, y + h, r);
  c.arcTo(x + w, y + h, x,     y + h, r);
  c.arcTo(x,     y + h, x,     y,     r);
  c.arcTo(x,     y,     x + w, y,     r);
  c.closePath();
}

function wrapText(text, maxWidth) {
  var paragraphs = text.split(/\n/);
  var lines      = [];
  paragraphs.forEach(function (paragraph) {
    var words = paragraph.split(/\s+/);
    var line  = '';
    words.forEach(function (word) {
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) { lines.push(line); }
  });
  return lines;
}

function drawBrandingStrip(area) {
  var stripY = area.y + area.h;
  var stripH = area.stripH;
  var lineH  = Math.max(3, Math.round(currentFormat.h * LINE_HEIGHT_RATIO));

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, stripY, currentFormat.w, stripH);

  ctx.fillStyle = LINE_COLOR;
  ctx.fillRect(0, stripY, currentFormat.w, lineH);

  if (llbsLogo) {
    var stripBody = stripH - lineH;
    var availH   = stripBody * (1 - LOGO_VERT_PAD * 2);
    var availW   = currentFormat.w * (1 - LOGO_PADDING_RATIO * 2);
    var aspect   = llbsLogo.naturalWidth / llbsLogo.naturalHeight;

    var logoW = availW;
    var logoH = logoW / aspect;
    if (logoH > availH) { logoH = availH; logoW = logoH * aspect; }

    var logoX = (currentFormat.w - logoW) / 2;
    var logoY = stripY + lineH + (stripBody - logoH) / 2;
    ctx.drawImage(llbsLogo, logoX, logoY, logoW, logoH);
  }
}

// ─────────────────────────────────────────────
// File handling
// ─────────────────────────────────────────────
function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    setStatus('Please choose a valid image file (JPEG, PNG, WEBP, or GIF).'); return;
  }

  originalFileName = file.name.replace(/\.[^.]+$/, '') + '_llbs_branded.jpg';
  setStatus('Loading image...');

  var objectURL = URL.createObjectURL(file);
  loadImage(objectURL).then(function (img) {
    userImage = img;
    dropZone.style.display = 'none';
    editor.style.display   = 'flex';

    if (!llbsLogo) {
      setStatus('Loading LLBS logo...');
      loadImage(LOGO_SRC).then(function (logo) {
        llbsLogo = logo;
        initEditor();
      }).catch(function () {
        // Logo is unavailable; the strip renders without it. Not an error.
        setStatus('Logo unavailable - branding strip shown without logo.');
        initEditor();
      });
    } else {
      initEditor();
    }
  }).catch(function () {
    setStatus('Could not read the selected image file.');
  });
}

function initEditor() {
  applyFormat(formatSelect.value);
  resetControls();
  updateContrastBadge();
  setStatus('Ready. Drag the photo to reposition it. Drag the text on the canvas to position the overlay.');
}

function resetControls() {
  zoomSlider.value = 100;
  zoomValue.textContent = '100%';
  rotateSlider.value = 0;
  rotateValue.textContent = '0 degrees';
  transform.scale    = 1;
  transform.rotation = 0;
  textState.customPlaced = false;
  textState.bounds       = null;
}

// ─────────────────────────────────────────────
// Controls
// ─────────────────────────────────────────────
formatSelect.addEventListener('change', function (e) { applyFormat(e.target.value); });

zoomSlider.addEventListener('input', function (e) {
  transform.scale = parseInt(e.target.value, 10) / 100;
  zoomValue.textContent = e.target.value + '%';
  drawComposite();
});

rotateSlider.addEventListener('input', function (e) {
  var deg = parseInt(e.target.value, 10);
  transform.rotation = deg * Math.PI / 180;
  rotateValue.textContent = deg + ' degrees';
  drawComposite();
});

centerBtn.addEventListener('click', function () {
  recentrePhoto();
  drawComposite();
});

fitBtn.addEventListener('click', function () {
  transform.baseScale = computeFitBaseScale();
  transform.scale    = 1;
  transform.rotation = 0;
  zoomSlider.value = 100; zoomValue.textContent = '100%';
  rotateSlider.value = 0; rotateValue.textContent = '0 degrees';
  recentrePhoto();
  drawComposite();
});

textInput.addEventListener('input', drawComposite);
textFont.addEventListener('change', drawComposite);

fontColor.addEventListener('input', function () { updateContrastBadge(); drawComposite(); });
bgColor.addEventListener('input',   function () { updateContrastBadge(); drawComposite(); });
bgAlpha.addEventListener('input', function (e) {
  bgAlphaValue.textContent = e.target.value + '%';
  updateContrastBadge();
  drawComposite();
});

textSize.addEventListener('input', function (e) {
  textSizeValue.textContent = e.target.value + 'px';
  updateContrastBadge();
  drawComposite();
});

// ─────────────────────────────────────────────
// Drag on canvas (pointer events — mouse and touch)
// ─────────────────────────────────────────────
var dragging    = false;
var dragTarget  = null;  // 'photo' | 'text'
var lastPointer = null;

function canvasToImagePixels(clientX, clientY) {
  var rect = canvas.getBoundingClientRect();
  var sx   = canvas.width  / rect.width;
  var sy   = canvas.height / rect.height;
  return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
}

function pointInBounds(p, b) {
  return b && p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
}

canvas.addEventListener('pointerdown', function (e) {
  if (!userImage) { return; }
  var p = canvasToImagePixels(e.clientX, e.clientY);
  // Prefer dragging the text block when the pointer is over it
  dragTarget  = (textInput.value.trim() && pointInBounds(p, textState.bounds)) ? 'text' : 'photo';
  dragging    = true;
  canvas.setPointerCapture(e.pointerId);
  lastPointer = p;
});

canvas.addEventListener('pointermove', function (e) {
  if (!dragging || !userImage) { return; }
  var p  = canvasToImagePixels(e.clientX, e.clientY);
  var dx = p.x - lastPointer.x;
  var dy = p.y - lastPointer.y;
  if (dragTarget === 'text') {
    textState.x += dx;
    textState.y += dy;
    textState.customPlaced = true;
  } else {
    transform.offsetX += dx;
    transform.offsetY += dy;
  }
  lastPointer = p;
  drawComposite();
});

function endDrag(e) {
  if (!dragging) { return; }
  dragging = false;
  try { canvas.releasePointerCapture(e.pointerId); } catch (_err) { /* ignore */ }
}
canvas.addEventListener('pointerup',     endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave',  endDrag);

// Wheel zoom
canvas.addEventListener('wheel', function (e) {
  if (!userImage) { return; }
  e.preventDefault();
  var cur  = parseInt(zoomSlider.value, 10);
  var next = Math.max(10, Math.min(400, cur + (e.deltaY < 0 ? 5 : -5)));
  zoomSlider.value = next;
  zoomSlider.dispatchEvent(new Event('input'));
}, { passive: false });

// ─────────────────────────────────────────────
// Keyboard navigation on canvas (WCAG 2.1.1, closes ACC-LLBS-002)
// ─────────────────────────────────────────────

// Update the mode-toggle button label to reflect current keyboardMoveTarget.
function updateKeyboardModeLabel() {
  if (keyboardMoveTarget === 'photo') {
    keyboardModeBtn.textContent = 'Canvas arrows: moving photo (switch to text)';
  } else {
    keyboardModeBtn.textContent = 'Canvas arrows: moving text (switch to photo)';
  }
}

// Toggle arrow-key target between photo and text overlay.
keyboardModeBtn.addEventListener('click', function () {
  keyboardMoveTarget = (keyboardMoveTarget === 'photo') ? 'text' : 'photo';
  updateKeyboardModeLabel();
});

// Arrow-key nudging when canvas is focused.
canvas.addEventListener('keydown', function (e) {
  // Do nothing until a photo has been loaded.
  if (!userImage) { return; }

  var isArrow = e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                e.key === 'ArrowUp'   || e.key === 'ArrowDown';

  if (isArrow) {
    // Prevent the page from scrolling while the canvas is focused.
    e.preventDefault();

    var step = e.shiftKey ? 20 : 5;
    var dx = 0;
    var dy = 0;
    if (e.key === 'ArrowLeft')  { dx = -step; }
    if (e.key === 'ArrowRight') { dx =  step; }
    if (e.key === 'ArrowUp')    { dy = -step; }
    if (e.key === 'ArrowDown')  { dy =  step; }

    if (keyboardMoveTarget === 'text') {
      // Only nudge text if there is overlay text to move.
      if (textInput.value.trim()) {
        textState.x += dx;
        textState.y += dy;
        textState.customPlaced = true;
      }
    } else {
      transform.offsetX += dx;
      transform.offsetY += dy;
    }

    drawComposite();
  }

  if (e.key === 't' || e.key === 'T') {
    keyboardMoveTarget = (keyboardMoveTarget === 'photo') ? 'text' : 'photo';
    updateKeyboardModeLabel();
  }
});

// ─────────────────────────────────────────────
// Share
// ─────────────────────────────────────────────
shareBtn.addEventListener('click', function () {
  if (!navigator.canShare) { dlFallback.style.display = 'block'; return; }

  shareSpinner.style.display = 'inline-block';
  setStatus('Preparing to share...');

  canvas.toBlob(function (blob) {
    if (!blob) {
      setStatus('Could not create the image for sharing.');
      shareSpinner.style.display = 'none';
      return;
    }
    var file = new File([blob], originalFileName, { type: 'image/jpeg' });

    if (!navigator.canShare({ files: [file] })) {
      dlFallback.style.display = 'block';
      setStatus('');
      shareSpinner.style.display = 'none';
      return;
    }

    navigator.share({
      files: [file],
      title: 'LLBS Branded Photo',
      text:  'Shared via LLBS Photo Brander — llbs.co.uk'
    }).then(function () {
      setStatus('Shared successfully.');
    }).catch(function (err) {
      setStatus(err.name === 'AbortError' ? 'Ready.' : 'Share failed: ' + err.message);
    }).finally(function () {
      shareSpinner.style.display = 'none';
    });
  }, 'image/jpeg', 0.92);
});

// ─────────────────────────────────────────────
// Download
// ─────────────────────────────────────────────
downloadBtn.addEventListener('click', function () {
  canvas.toBlob(function (blob) {
    var a      = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = originalFileName;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    setStatus('Download started.');
  }, 'image/jpeg', 0.92);
});

// ─────────────────────────────────────────────
// Reset
// ─────────────────────────────────────────────
resetBtn.addEventListener('click', function () {
  userImage = null;
  fileInput.value  = '';
  textInput.value  = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  editor.style.display   = 'none';
  dropZone.style.display = '';
  dlFallback.style.display = 'none';
  resetControls();
  updateContrastBadge();
  setStatus('');
});

// ─────────────────────────────────────────────
// Controls form: prevent default submission (all controls are JS-driven)
// ─────────────────────────────────────────────
var controlsForm = document.querySelector('.controls');
if (controlsForm) {
  controlsForm.addEventListener('submit', function (e) { e.preventDefault(); });
}

// ─────────────────────────────────────────────
// Drag and drop upload
// ─────────────────────────────────────────────
dropZone.addEventListener('click', function () { fileInput.click(); });
// Keyboard activation: Enter and Space trigger the file browser,
// matching the behaviour expected of an element with role="button".
dropZone.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener('change', function (e) { handleFile(e.target.files[0]); });

dropZone.addEventListener('dragover', function (e) {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', function () {
  dropZone.classList.remove('drag-over');
});
dropZone.addEventListener('drop', function (e) {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  handleFile(e.dataTransfer.files[0]);
});

// ─────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────
function setStatus(msg) {
  statusEl.textContent = msg;
}

// Pre-warm the logo: load it in the background so it is ready when the first
// photo is uploaded. Failure is silent; drawBrandingStrip checks for null.
loadImage(LOGO_SRC).then(function (img) {
  llbsLogo = img;
}).catch(function () {
  // Logo will be loaded again (and fail gracefully) on first file open.
});
