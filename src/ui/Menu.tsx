import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Kbd } from './Kbd';

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  align?: 'left' | 'right';
  freezeScreenPosition?: boolean;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

export function Popover({
  open,
  onClose,
  anchorEl,
  align = 'right',
  freezeScreenPosition = false,
  ariaLabel,
  className = '',
  children,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const frozenPosRef = useRef<{ top: number; left?: number; right?: number } | null>(null);
  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number }>({ top: 48, right: 12 });

  useLayoutEffect(() => {
    if (!open) {
      frozenPosRef.current = null;
      return;
    }
    if (freezeScreenPosition && frozenPosRef.current) {
      setCoords(frozenPosRef.current);
      return;
    }
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const next =
      align === 'right'
        ? {
            top: Math.round(rect.bottom + 6),
            right: Math.max(8, Math.round(window.innerWidth - rect.right)),
          }
        : {
            top: Math.round(rect.bottom + 6),
            left: Math.max(8, Math.round(rect.left)),
          };
    if (freezeScreenPosition) {
      frozenPosRef.current = next;
    }
    setCoords(next);
  }, [open, anchorEl, align, freezeScreenPosition]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        anchorEl?.focus();
      }
    };
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      if (anchorEl?.contains(target)) return;
      onClose();
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open, onClose, anchorEl]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={ariaLabel}
      className={`sp-popover ${className}`.trim()}
      style={{
        top: `${coords.top}px`,
        left: coords.left !== undefined ? `${coords.left}px` : undefined,
        right: coords.right !== undefined ? `${coords.right}px` : undefined,
      }}
    >
      {children}
    </div>
  );
}

export interface MenuItem {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  dataCtl?: string;
  onSelect: () => void;
}

export interface MenuProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  items: MenuItem[];
  align?: 'left' | 'right';
  ariaLabel: string;
}

export function Menu({
  open,
  onClose,
  anchorEl,
  items,
  align = 'left',
  ariaLabel,
}: MenuProps) {
  return (
    <Popover open={open} onClose={onClose} anchorEl={anchorEl} align={align} ariaLabel={ariaLabel}>
      <div role="menu" aria-label={ariaLabel} className="sp-menu-list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            className="sp-menu-item"
            disabled={item.disabled}
            data-ctl={item.dataCtl}
            onClick={() => {
              item.onSelect();
              onClose();
              anchorEl?.focus();
            }}
          >
            <span>{item.label}</span>
            {item.shortcut ? <Kbd>{item.shortcut}</Kbd> : null}
          </button>
        ))}
      </div>
    </Popover>
  );
}
