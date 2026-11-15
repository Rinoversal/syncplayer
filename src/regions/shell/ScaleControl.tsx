import React, { useEffect, useRef, useState } from 'react';
import {
  computeEffectiveSizeRem,
  formatScalePct,
  OVERLAY_SCALE_STEPS,
  UI_SCALE_STEPS,
} from '../../scale/scale';
import { useScale } from '../../state/appStore';
import { Button, Popover } from '../../ui';

export interface ScaleControlProps {
  frameWidthPx?: number;
  frameHeightPx?: number;
}

export function ScaleControl({ frameWidthPx, frameHeightPx }: ScaleControlProps) {
  const {
    uiScale,
    overlayScale,
    setUiScale,
    stepScale,
    resetScale,
    setOverlayScale,
  } = useScale();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const scaleOnOpenRef = useRef(uiScale);
  const [sliderIdx, setSliderIdx] = useState(() => UI_SCALE_STEPS.indexOf(uiScale));

  useEffect(() => {
    setSliderIdx(UI_SCALE_STEPS.indexOf(uiScale));
  }, [uiScale]);

  const handleToggle = () => {
    if (!open) {
      scaleOnOpenRef.current = uiScale;
    }
    setOpen((v) => !v);
  };

  const handleCloseEscOrOutside = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setUiScale(scaleOnOpenRef.current, true);
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onEsc, true);
    return () => window.removeEventListener('keydown', onEsc, true);
  }, [open, setUiScale]);

  const winW = frameWidthPx ?? (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const winH = frameHeightPx ?? (typeof window !== 'undefined' ? window.innerHeight : 800);
  const { tooLargeForWindow } = computeEffectiveSizeRem(winW, winH, uiScale);

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        aria-label={`Interface size: ${formatScalePct(uiScale)}`}
        aria-expanded={open}
        dataNew
        onClick={handleToggle}
      >
        <span className="mono">{formatScalePct(uiScale)}</span>
      </Button>

      <Popover
        open={open}
        onClose={handleCloseEscOrOutside}
        anchorEl={triggerRef.current}
        align="right"
        freezeScreenPosition
        ariaLabel="Interface size"
        className="sp-size-popover-frozen"
      >
        <div className="sp-size-pop-row">
          <span className="sp-size-pop-label">Interface size</span>
          <button
            type="button"
            className="sp-size-pop-btn"
            onClick={() => resetScale()}
            disabled={uiScale === 1}
          >
            Reset to 100%
          </button>
        </div>

        <div className="sp-size-pop-row">
          <button
            type="button"
            className="sp-size-pop-btn"
            data-ctl="lib-08"
            aria-label="Decrease interface size"
            disabled={uiScale <= UI_SCALE_STEPS[0]}
            onClick={() => stepScale(-1)}
          >
            -
          </button>
          <input
            type="range"
            aria-label="Interface size steps"
            className="sp-size-pop-slider"
            min={0}
            max={UI_SCALE_STEPS.length - 1}
            step={1}
            value={sliderIdx >= 0 ? sliderIdx : 2}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSliderIdx(idx);
              setUiScale(UI_SCALE_STEPS[idx], false);
            }}
            onPointerUp={(e) => {
              const idx = Number((e.target as HTMLInputElement).value);
              setUiScale(UI_SCALE_STEPS[idx], true);
            }}
            onKeyUp={(e) => {
              const idx = Number((e.target as HTMLInputElement).value);
              setUiScale(UI_SCALE_STEPS[idx], true);
            }}
          />
          <button
            type="button"
            className="sp-size-pop-btn"
            data-ctl="lib-09"
            aria-label="Increase interface size"
            disabled={uiScale >= UI_SCALE_STEPS[UI_SCALE_STEPS.length - 1]}
            onClick={() => stepScale(1)}
          >
            +
          </button>
          <span className="sp-size-pop-readout">{formatScalePct(uiScale)}</span>
        </div>

        <div className="sp-size-pop-row">
          <span className="sp-size-pop-label">Overlay size</span>
          <div className="sp-size-overlay-btns">
            {OVERLAY_SCALE_STEPS.map((step) => (
              <button
                key={step}
                type="button"
                className="sp-size-pop-btn"
                data-active={overlayScale === step ? 'true' : undefined}
                onClick={() => setOverlayScale(step)}
              >
                {formatScalePct(step)}
              </button>
            ))}
          </div>
        </div>

        {tooLargeForWindow ? (
          <div className="sp-size-pop-warn" role="status">
            Too large for this window
          </div>
        ) : null}
      </Popover>
    </>
  );
}
