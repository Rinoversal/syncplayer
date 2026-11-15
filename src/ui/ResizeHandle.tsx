import React from 'react';

export interface ResizeHandleProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
}

export function ResizeHandle({
  label,
  value,
  min,
  max,
  step = 16,
  onChange,
}: ResizeHandleProps) {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startVal = value;
    const target = e.currentTarget;
    target.setPointerCapture?.(e.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      onChange(Math.max(min, Math.min(max, Math.round(startVal + delta))));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(Math.min(max, value + step));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(Math.max(min, value - step));
    }
  };

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className="sp-resize-handle"
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    />
  );
}
