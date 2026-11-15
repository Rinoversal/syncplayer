import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: 'left' | 'right';
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  side = 'left',
  headerActions,
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKey);
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="sp-drawer-backdrop"
      data-side={side}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sp-drawer-panel"
      >
        <div className="sp-drawer-head">
          <h2 className="sp-panel-title">{title}</h2>
          <div className="sp-panel-actions">
            {headerActions}
            <IconButton
              aria-label={`Close ${title}`}
              tooltip="Close"
              shortcut="Esc"
              icon={<X size="1em" strokeWidth={1.5} />}
              onClick={onClose}
            />
          </div>
        </div>
        <div className="sp-drawer-body">{children}</div>
      </div>
    </div>
  );
}

export interface PanelProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  dataRegion?: string;
}

export function Panel({
  title,
  actions,
  className = '',
  children,
  dataRegion,
}: PanelProps) {
  return (
    <section className={`sp-panel ${className}`.trim()} data-region={dataRegion}>
      <header className="sp-panel-head">
        <h2 className="sp-panel-title">{title}</h2>
        {actions ? <div className="sp-panel-actions">{actions}</div> : null}
      </header>
      <div className="sp-panel-body">{children}</div>
    </section>
  );
}
