import test from 'node:test';
import assert from 'node:assert/strict';
import {
  snapUiScale,
  snapOverlayScale,
  stepUiScale,
  formatScalePct,
  getScreenSignature,
  computeEffectiveSizeRem,
  getLayoutModeForWidthRem,
} from './scale';

test('snapUiScale snaps legacy values like 0.6 and 0.67 to 0.8 and exact steps accurately', () => {
  assert.equal(snapUiScale(0.6), 0.8);
  assert.equal(snapUiScale(0.67), 0.8);
  assert.equal(snapUiScale(0.95), 0.9);
  assert.equal(snapUiScale(1.0), 1);
  assert.equal(snapUiScale(1.22), 1.25);
  assert.equal(snapUiScale(2.0), 1.6);
  assert.equal(snapUiScale('invalid'), 1);
});

test('stepUiScale moves cleanly across the 7 steps and clamps at ends', () => {
  assert.equal(stepUiScale(1, 1), 1.1);
  assert.equal(stepUiScale(1.1, 1), 1.25);
  assert.equal(stepUiScale(1.6, 1), 1.6);
  assert.equal(stepUiScale(1, -1), 0.9);
  assert.equal(stepUiScale(0.8, -1), 0.8);
});

test('snapOverlayScale snaps to 1, 1.25, 1.5, 2', () => {
  assert.equal(snapOverlayScale(0.5), 1);
  assert.equal(snapOverlayScale(1.3), 1.25);
  assert.equal(snapOverlayScale(1.8), 2);
});

test('formatScalePct formats integer percentages', () => {
  assert.equal(formatScalePct(0.8), '80%');
  assert.equal(formatScalePct(1.25), '125%');
  assert.equal(formatScalePct(1.6), '160%');
});

test('getScreenSignature produces widthxheight@dpr keys', () => {
  assert.equal(getScreenSignature(1920, 1080, 2), '1920x1080@2');
  assert.equal(getScreenSignature(1097, 617, 1.75), '1097x617@1.75');
});

test('computeEffectiveSizeRem obeys the W/s equivalence and flags <50rem x 28rem', () => {
  const scaled = computeEffectiveSizeRem(1920, 1080, 1.25);
  const unscaled = computeEffectiveSizeRem(1920 / 1.25, 1080 / 1.25, 1);
  assert.ok(Math.abs(scaled.widthRem - unscaled.widthRem) < 1e-9);
  assert.ok(Math.abs(scaled.heightRem - unscaled.heightRem) < 1e-9);
  assert.equal(scaled.tooLargeForWindow, false);

  const tight = computeEffectiveSizeRem(1097, 617, 1.6);
  assert.equal(tight.tooLargeForWindow, true);
});

test('getLayoutModeForWidthRem maps breakpoints correctly', () => {
  assert.equal(getLayoutModeForWidthRem(45), 'drawer');
  assert.equal(getLayoutModeForWidthRem(68.56), 'two-pane');
  assert.equal(getLayoutModeForWidthRem(95), 'three-pane');
  assert.equal(getLayoutModeForWidthRem(135), 'ultrawide');
});
