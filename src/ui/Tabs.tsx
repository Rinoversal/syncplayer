import React from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  disabled?: boolean;
  dataCtl?: string;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  ariaLabel,
  className = '',
}: TabsProps<T>) {
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    for (let step = 1; step <= items.length; step++) {
      const next = items[(idx + dir * step + items.length) % items.length];
      if (!next.disabled) {
        onChange(next.id);
        break;
      }
    }
  };

  return (
    <div role="tablist" aria-label={ariaLabel} className={`sp-tabs ${className}`.trim()}>
      {items.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === value}
          disabled={item.disabled}
          data-ctl={item.dataCtl}
          className="sp-tab"
          onClick={() => onChange(item.id)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
  dataCtl?: string;
  shortcut?: string;
}

export interface SegmentedProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = '',
}: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={`sp-segmented ${className}`.trim()}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="sp-seg-btn"
          aria-pressed={opt.value === value}
          disabled={opt.disabled}
          data-ctl={opt.dataCtl}
          title={opt.shortcut ? `${opt.label} (${opt.shortcut})` : opt.label}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
