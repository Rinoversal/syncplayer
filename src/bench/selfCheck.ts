import { getAllAppendixBKeys } from './controlRegistry';

export interface SelfCheckReport {
  windowWidth: number;
  windowHeight: number;
  uiScale: number;
  effectiveWidthRem: number;
  effectiveHeightRem: number;
  libraryRowsVisible: number;
  aboveLibraryHeightPx: number;
  stageHeaderHeightPx: number;
  pictureSharePct: number;
  smallestTextPx: number;
  textUnder12Count: number;
  smallestTargetPx: number;
  targetsUnder32Count: number;
  targetsUnder28Count: number;
  cutOffByScrollCount: number;
  cutOffByWindowCount: number;
  coveredControlsCount: number;
  missingAccessibleNameCount: number;
  nonFocusableClickTargetsCount: number;
  horizontalScroll: boolean;
  distinctTextSizesCount: number;
  distinctTextSizesPx: number[];
  domNodeCount: number;
  presentDataCtlKeys: string[];
  totalAppendixBKeys: number;
}

function isElementVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  return true;
}

function getAccessibleName(el: HTMLElement): string {
  const aria = el.getAttribute('aria-label');
  if (aria && aria.trim()) return aria.trim();
  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl?.textContent?.trim()) return labelEl.textContent.trim();
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    if (el.id) {
      const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (lbl?.textContent?.trim()) return lbl.textContent.trim();
    }
    const parentLabel = el.closest('label');
    if (parentLabel?.textContent?.trim()) return parentLabel.textContent.trim();
    if (el instanceof HTMLInputElement && el.placeholder?.trim()) return el.placeholder.trim();
  }
  const text = el.textContent?.trim() ?? '';
  return text;
}

export function runSelfCheck(): SelfCheckReport {
  const frame = document.querySelector<HTMLElement>('[data-app-frame]') ?? document.body;
  const frameRect = frame.getBoundingClientRect();
  const uiScale =
    parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--ui-scale')) || 1;
  const rootPx = 16 * uiScale;

  /* Picture share */
  const pictureEl = frame.querySelector<HTMLElement>('[data-region="picture"]');
  let pictureSharePct = 0;
  if (pictureEl && isElementVisible(pictureEl)) {
    const pr = pictureEl.getBoundingClientRect();
    const frameArea = frameRect.width * frameRect.height;
    if (frameArea > 0) {
      pictureSharePct = Number((((pr.width * pr.height) / frameArea) * 100).toFixed(1));
    }
  }

  /* Stage header height */
  const stageHeader = frame.querySelector<HTMLElement>('.sp-stage-header');
  const stageHeaderHeightPx =
    stageHeader && isElementVisible(stageHeader)
      ? Math.round(stageHeader.getBoundingClientRect().height)
      : 0;

  /* Library rows & above-library height */
  const libraryList = frame.querySelector<HTMLElement>('[data-library-list]');
  let libraryRowsVisible = 0;
  let aboveLibraryHeightPx = 0;
  if (libraryList && isElementVisible(libraryList)) {
    const lr = libraryList.getBoundingClientRect();
    const libSlot = frame.querySelector<HTMLElement>('[data-region="library"]');
    if (libSlot) {
      aboveLibraryHeightPx = Math.max(0, Math.round(lr.top - libSlot.getBoundingClientRect().top));
    }
    const rows = libraryList.querySelectorAll<HTMLElement>('[data-library-row]');
    rows.forEach((row) => {
      const rr = row.getBoundingClientRect();
      if (rr.top >= lr.top - 1 && rr.bottom <= lr.bottom + 1) {
        libraryRowsVisible++;
      }
    });
  }

  /* Text sizes */
  const textSizesSet = new Set<number>();
  let smallestTextPx = Infinity;
  let textUnder12Count = 0;
  const allEls = frame.querySelectorAll<HTMLElement>('*');

  allEls.forEach((el) => {
    if (el.closest('[data-bench-ui]')) return;
    if (!isElementVisible(el)) return;
    let hasDirectText = false;
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim().length > 0) {
        hasDirectText = true;
        break;
      }
    }
    if (!hasDirectText) return;
    const fs = parseFloat(window.getComputedStyle(el).fontSize);
    if (!Number.isFinite(fs) || fs <= 0) return;
    const rounded = Math.round(fs * 2) / 2;
    textSizesSet.add(rounded);
    if (fs < smallestTextPx) smallestTextPx = fs;
    if (fs < 11.95) textUnder12Count++;
  });

  /* Interactive controls */
  const controlSelector =
    'button, input, select, textarea, a[href], [role="button"], [role="tab"], [role="switch"], [role="menuitem"]';
  const controls = Array.from(frame.querySelectorAll<HTMLElement>(controlSelector)).filter(
    (el) => !el.closest('[data-bench-ui]') && isElementVisible(el)
  );

  let smallestTargetPx = Infinity;
  let targetsUnder32Count = 0;
  let targetsUnder28Count = 0;
  let cutOffByScrollCount = 0;
  let cutOffByWindowCount = 0;
  let coveredControlsCount = 0;
  let missingAccessibleNameCount = 0;

  controls.forEach((el) => {
    const r = el.getBoundingClientRect();
    const minDim = Math.min(r.width, r.height);
    if (minDim < smallestTargetPx) smallestTargetPx = minDim;
    if (minDim < 31.5) targetsUnder32Count++;
    if (minDim < 27.5) targetsUnder28Count++;

    /* Cut off by frame edge */
    if (
      r.left < frameRect.left - 1 ||
      r.right > frameRect.right + 1 ||
      r.top < frameRect.top - 1 ||
      r.bottom > frameRect.bottom + 1
    ) {
      cutOffByWindowCount++;
    }

    /* Cut off by non-scrollable parent */
    let parent = el.parentElement;
    while (parent && parent !== frame) {
      const pStyle = window.getComputedStyle(parent);
      const pr = parent.getBoundingClientRect();
      if (
        (pStyle.overflowX === 'hidden' && (r.left < pr.left - 1 || r.right > pr.right + 1)) ||
        (pStyle.overflowY === 'hidden' && (r.top < pr.top - 1 || r.bottom > pr.bottom + 1))
      ) {
        cutOffByScrollCount++;
        break;
      }
      parent = parent.parentElement;
    }

    /* Covered check at center (only when inside current host browser viewport) */
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (
      cx >= Math.max(0, frameRect.left) &&
      cx <= Math.min(window.innerWidth - 1, frameRect.right) &&
      cy >= Math.max(0, frameRect.top) &&
      cy <= Math.min(window.innerHeight - 1, frameRect.bottom)
    ) {
      const hit = document.elementFromPoint(cx, cy);
      if (hit && hit !== el && !el.contains(hit) && !hit.contains(el)) {
        coveredControlsCount++;
      }
    }

    /* Accessible name */
    if (!getAccessibleName(el)) {
      missingAccessibleNameCount++;
    }
  });

  /* Non-focusable click targets */
  let nonFocusableClickTargetsCount = 0;
  allEls.forEach((el) => {
    if (el.closest('[data-bench-ui]')) return;
    if (!isElementVisible(el)) return;
    const tag = el.tagName.toLowerCase();
    if (['button', 'input', 'select', 'textarea', 'a', 'label', 'option'].includes(tag)) return;
    const role = el.getAttribute('role');
    if (role === 'separator') return;
    const hasClick = el.hasAttribute('onclick') || role === 'button';
    if (hasClick && el.tabIndex < 0) {
      nonFocusableClickTargetsCount++;
    }
  });

  /* Horizontal scroll */
  const horizontalScroll = frame.scrollWidth > frame.clientWidth + 1;

  /* data-ctl inventory */
  const presentKeysSet = new Set<string>();
  frame.querySelectorAll<HTMLElement>('[data-ctl]').forEach((el) => {
    const k = el.getAttribute('data-ctl');
    if (k) presentKeysSet.add(k);
  });

  const distinctTextSizesPx = Array.from(textSizesSet).sort((a, b) => a - b);

  return {
    windowWidth: Math.round(frameRect.width),
    windowHeight: Math.round(frameRect.height),
    uiScale,
    effectiveWidthRem: Number((frameRect.width / rootPx).toFixed(2)),
    effectiveHeightRem: Number((frameRect.height / rootPx).toFixed(2)),
    libraryRowsVisible,
    aboveLibraryHeightPx,
    stageHeaderHeightPx,
    pictureSharePct,
    smallestTextPx: smallestTextPx === Infinity ? 0 : Number(smallestTextPx.toFixed(1)),
    textUnder12Count,
    smallestTargetPx: smallestTargetPx === Infinity ? 0 : Number(smallestTargetPx.toFixed(1)),
    targetsUnder32Count,
    targetsUnder28Count,
    cutOffByScrollCount,
    cutOffByWindowCount,
    coveredControlsCount,
    missingAccessibleNameCount,
    nonFocusableClickTargetsCount,
    horizontalScroll,
    distinctTextSizesCount: distinctTextSizesPx.length,
    distinctTextSizesPx,
    domNodeCount: frame.querySelectorAll('*').length,
    presentDataCtlKeys: Array.from(presentKeysSet).sort(),
    totalAppendixBKeys: getAllAppendixBKeys().length,
  };
}

declare global {
  interface Window {
    __selfCheck?: () => SelfCheckReport;
  }
}

export function registerSelfCheckGlobal(): void {
  if (typeof window !== 'undefined') {
    window.__selfCheck = runSelfCheck;
  }
}
