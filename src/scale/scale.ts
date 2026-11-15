import type { WindowKind } from '../types/electron';

export const UI_SCALE_STEPS = [0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.6] as const;
export type UiScaleStep = (typeof UI_SCALE_STEPS)[number];

export const OVERLAY_SCALE_STEPS = [1, 1.25, 1.5, 2] as const;
export type OverlayScaleStep = (typeof OVERLAY_SCALE_STEPS)[number];

export const SCALE_STORAGE_KEYS = {
  global: 'syncplayer_ui_scale',
  byScreen: 'syncplayer_ui_scale_by_screen',
  overlay: 'syncplayer_overlay_scale',
} as const;

export function windowScaleKey(kind: WindowKind): string {
  return kind === 'main' ? SCALE_STORAGE_KEYS.global : `syncplayer_ui_scale_${kind}`;
}

export function windowScreenScaleKey(kind: WindowKind): string {
  return kind === 'main' ? SCALE_STORAGE_KEYS.byScreen : `syncplayer_ui_scale_by_screen_${kind}`;
}

export function snapUiScale(value: unknown): UiScaleStep {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || num <= 0) return 1;
  let best: UiScaleStep = UI_SCALE_STEPS[0];
  let bestDist = Math.abs(num - best);
  for (let i = 1; i < UI_SCALE_STEPS.length; i++) {
    const step = UI_SCALE_STEPS[i];
    const dist = Math.abs(num - step);
    if (dist < bestDist) {
      best = step;
      bestDist = dist;
    }
  }
  return best;
}

export function snapOverlayScale(value: unknown): OverlayScaleStep {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || num <= 0) return 1;
  let best: OverlayScaleStep = OVERLAY_SCALE_STEPS[0];
  let bestDist = Math.abs(num - best);
  for (let i = 1; i < OVERLAY_SCALE_STEPS.length; i++) {
    const step = OVERLAY_SCALE_STEPS[i];
    const dist = Math.abs(num - step);
    if (dist < bestDist) {
      best = step;
      bestDist = dist;
    }
  }
  return best;
}

export function stepUiScale(current: number, delta: -1 | 1): UiScaleStep {
  const snapped = snapUiScale(current);
  const idx = UI_SCALE_STEPS.indexOf(snapped);
  const nextIdx = Math.max(0, Math.min(UI_SCALE_STEPS.length - 1, idx + delta));
  return UI_SCALE_STEPS[nextIdx];
}

export function formatScalePct(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

export function getScreenSignature(
  width: number,
  height: number,
  dpr: number
): string {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const r = Number.isFinite(dpr) && dpr > 0 ? Number(dpr.toFixed(2)) : 1;
  return `${w}x${h}@${r}`;
}

export function computeEffectiveSizeRem(
  widthPx: number,
  heightPx: number,
  scale: number
): { widthRem: number; heightRem: number; tooLargeForWindow: boolean } {
  const rootPx = 16 * (scale > 0 ? scale : 1);
  const widthRem = widthPx / rootPx;
  const heightRem = heightPx / rootPx;
  return {
    widthRem,
    heightRem,
    tooLargeForWindow: widthRem < 50 || heightRem < 28,
  };
}

export type WorkspaceLayoutMode = 'drawer' | 'two-pane' | 'three-pane' | 'ultrawide';

export function getLayoutModeForWidthRem(widthRem: number): WorkspaceLayoutMode {
  if (widthRem < 56) return 'drawer';
  if (widthRem < 80) return 'two-pane';
  if (widthRem <= 120) return 'three-pane';
  return 'ultrawide';
}
