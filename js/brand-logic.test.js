import { describe, it, expect } from 'vitest';
import {
  hexToRgb, hexToRgba, isDark, relLuminance, contrastRatio, blendOver,
  computeStripHeight, computePhotoArea, computeCoverScale
} from './brand-logic.js';

describe('hexToRgb', () => {
  it('converts a hex string with a leading #', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
  });

  it('converts a hex string without a leading #', () => {
    expect(hexToRgb('000000')).toEqual([0, 0, 0]);
  });

  it('converts the LLBS brand blue used for the divider line', () => {
    // #1a56db: 0x1a = 26, 0x56 = 86, 0xdb = 219
    expect(hexToRgb('#1a56db')).toEqual([26, 86, 219]);
  });
});

describe('hexToRgba', () => {
  it('builds an rgba() string with the given alpha', () => {
    expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255,0,0,0.5)');
  });

  it('builds an opaque rgba() string for alpha 1', () => {
    expect(hexToRgba('#000000', 1)).toBe('rgba(0,0,0,1)');
  });
});

describe('isDark', () => {
  it('treats black as dark', () => {
    expect(isDark('#000000')).toBe(true);
  });

  it('treats white as not dark', () => {
    expect(isDark('#ffffff')).toBe(false);
  });

  it('treats a grey just below the 140 threshold as dark', () => {
    // #8b8b8b = rgb(139,139,139); perceived luminance == 139 < 140
    expect(isDark('#8b8b8b')).toBe(true);
  });

  it('treats a grey at or above the 140 threshold as not dark', () => {
    // #8c8c8c = rgb(140,140,140); perceived luminance == 140, not < 140
    expect(isDark('#8c8c8c')).toBe(false);
  });
});

describe('relLuminance', () => {
  it('is 0 for black', () => {
    expect(relLuminance([0, 0, 0])).toBeCloseTo(0, 6);
  });

  it('is 1 for white', () => {
    expect(relLuminance([255, 255, 255])).toBeCloseTo(1, 6);
  });
});

describe('contrastRatio', () => {
  it('is 21:1 for black on white (the WCAG maximum)', () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 1);
  });

  it('is 1:1 for identical colours', () => {
    expect(contrastRatio([100, 150, 200], [100, 150, 200])).toBeCloseTo(1, 6);
  });

  it('is symmetric regardless of argument order', () => {
    const a = contrastRatio([0, 0, 0], [200, 200, 200]);
    const b = contrastRatio([200, 200, 200], [0, 0, 0]);
    expect(a).toBeCloseTo(b, 10);
  });
});

describe('blendOver', () => {
  it('returns the foreground colour unchanged at full opacity', () => {
    expect(blendOver([255, 0, 0], 1, [0, 0, 0])).toEqual([255, 0, 0]);
  });

  it('returns the background colour unchanged at zero opacity', () => {
    expect(blendOver([255, 0, 0], 0, [10, 20, 30])).toEqual([10, 20, 30]);
  });

  it('averages foreground and background at 50% opacity', () => {
    expect(blendOver([255, 0, 0], 0.5, [0, 0, 0])).toEqual([128, 0, 0]);
  });
});

describe('computeStripHeight', () => {
  it('uses the ratio when the result is within the clamp range', () => {
    // The Square format (1080x1080) at the app's real 10% ratio, 80-180 clamp
    expect(computeStripHeight(1080, 0.10, 80, 180)).toBe(108);
  });

  it('clamps to the minimum for a small format', () => {
    expect(computeStripHeight(100, 0.10, 80, 180)).toBe(80);
  });

  it('clamps to the maximum for a very tall format', () => {
    expect(computeStripHeight(5000, 0.10, 80, 180)).toBe(180);
  });
});

describe('computePhotoArea', () => {
  it('subtracts the strip height from the format height', () => {
    expect(computePhotoArea(1080, 1080, 108)).toEqual({
      x: 0, y: 0, w: 1080, h: 972, stripH: 108
    });
  });

  it('leaves the width untouched', () => {
    expect(computePhotoArea(1600, 900, 90).w).toBe(1600);
  });
});

describe('computeCoverScale', () => {
  it('picks the larger ratio so the image covers a wider area with no gaps', () => {
    // area 1000x500, image 2000x2000: sx=0.5, sy=0.25 -> cover needs 0.5
    expect(computeCoverScale(1000, 500, 2000, 2000)).toBe(0.5);
  });

  it('picks the larger ratio when the tall dimension needs more scale', () => {
    // area 500x1000, image 1000x500: sx=0.5, sy=2 -> cover needs 2
    expect(computeCoverScale(500, 1000, 1000, 500)).toBe(2);
  });

  it('returns 1 when the image already exactly fills the area', () => {
    expect(computeCoverScale(800, 600, 800, 600)).toBe(1);
  });
});
