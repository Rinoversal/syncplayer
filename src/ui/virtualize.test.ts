import test from 'node:test';
import assert from 'node:assert/strict';
import { computeVisibleRange, computeVisibleGridRange } from './virtualize';

test('computeVisibleRange includes overscan on random jumps so no frame is blank', () => {
  const res = computeVisibleRange({
    itemCount: 21000,
    itemHeight: 56,
    scrollTop: 500000,
    viewportHeight: 600,
    overscan: 6,
  });
  assert.ok(res.startIndex > 0);
  assert.ok(res.endIndex >= res.startIndex + 10);
  assert.equal(res.totalHeight, 21000 * 56);
});

test('computeVisibleRange handles empty list cleanly', () => {
  const res = computeVisibleRange({
    itemCount: 0,
    itemHeight: 56,
    scrollTop: 0,
    viewportHeight: 600,
  });
  assert.equal(res.endIndex, -1);
  assert.equal(res.totalHeight, 0);
});

test('computeVisibleGridRange calculates rows and indices accurately', () => {
  const res = computeVisibleGridRange({
    itemCount: 103,
    columns: 4,
    rowHeight: 200,
    scrollTop: 400,
    viewportHeight: 450,
    overscanRows: 2,
  });
  assert.equal(res.totalRows, 26);
  assert.equal(res.startRow, 0);
  assert.ok(res.endIndex >= 15);
});
