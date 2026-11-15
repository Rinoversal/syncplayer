import React, { useRef, useState } from 'react';
import { Kbd } from './Kbd';

export interface TooltipProps {
  label: string;
  shortcut?: string;
  children: React.ReactElement;
}

export function Tooltip({ label, shortcut, children }: TooltipProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const show = () => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      top: Math.min(window.innerHeight - 36, Math.round(rect.bottom + 6)),
      left: Math.max(8, Math.min(window.innerWidth - 180, Math.round(rect.left))),
    });
  };

  const hide = () => setPos(null);

  return (
    <span
      ref={wrapRef}
      className="sp-tooltip-wrap"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {pos ? (
        <span
          role="tooltip"
          className="sp-tooltip"
          style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
        >
          <span>{label}</span>
          {shortcut ? <Kbd>{shortcut}</Kbd> : null}
        </span>
      ) : null}
    </span>
  );
}
