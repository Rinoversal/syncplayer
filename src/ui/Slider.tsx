import React, { useId } from 'react';
import { Kbd } from './Kbd';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  sending?: boolean;
  shortcut?: string;
  disabled?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  sending = false,
  shortcut,
  disabled = false,
  dataCtl,
  dataNew,
  onChange,
  onCommit,
  formatValue,
  className = '',
}: SliderProps) {
  const id = useId();
  const display = formatValue ? formatValue(value) : `${value}${unit}`;
  return (
    <div className={`sp-slider-block ${className}`.trim()}>
      <div className="sp-slider-head">
        <label htmlFor={id}>{label}</label>
        <span className="sp-slider-meta">
          {sending ? <span className="sp-sending-tag">sending</span> : null}
          {shortcut ? <Kbd>{shortcut}</Kbd> : null}
          <span className="sp-slider-val">{display}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="sp-range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        data-ctl={dataCtl}
        data-new={dataNew ? '1' : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={(e) => onCommit?.(Number((e.target as HTMLInputElement).value))}
        onKeyUp={(e) => onCommit?.(Number((e.target as HTMLInputElement).value))}
      />
    </div>
  );
}

export interface RangeSliderProps {
  label: string;
  minVal: number;
  maxVal: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  minDataCtl?: string;
  maxDataCtl?: string;
  onChange: (minVal: number, maxVal: number) => void;
  onCommit?: (minVal: number, maxVal: number) => void;
}

export function RangeSlider({
  label,
  minVal,
  maxVal,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  disabled = false,
  minDataCtl,
  maxDataCtl,
  onChange,
  onCommit,
}: RangeSliderProps) {
  const idMin = useId();
  const idMax = useId();
  return (
    <div className="sp-slider-block">
      <div className="sp-slider-head">
        <span>{label}</span>
        <span className="sp-slider-val">
          {minVal}
          {unit} – {maxVal}
          {unit}
        </span>
      </div>
      <div className="sp-range-dual">
        <input
          id={idMin}
          type="range"
          aria-label={`${label} minimum`}
          className="sp-range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          disabled={disabled}
          data-ctl={minDataCtl}
          onChange={(e) => {
            const nextMin = Math.min(Number(e.target.value), maxVal);
            onChange(nextMin, maxVal);
          }}
          onPointerUp={() => onCommit?.(minVal, maxVal)}
          onKeyUp={() => onCommit?.(minVal, maxVal)}
        />
        <input
          id={idMax}
          type="range"
          aria-label={`${label} maximum`}
          className="sp-range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          disabled={disabled}
          data-ctl={maxDataCtl}
          onChange={(e) => {
            const nextMax = Math.max(Number(e.target.value), minVal);
            onChange(minVal, nextMax);
          }}
          onPointerUp={() => onCommit?.(minVal, maxVal)}
          onKeyUp={() => onCommit?.(minVal, maxVal)}
        />
      </div>
    </div>
  );
}
