import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export type NoticeTone = 'info' | 'ok' | 'warn' | 'error';

export interface NoticeProps {
  tone?: NoticeTone;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const ICONS = {
  info: Info,
  ok: CheckCircle2,
  warn: AlertTriangle,
  error: AlertCircle,
} as const;

export function Notice({ tone = 'info', children, action, className = '' }: NoticeProps) {
  const Icon = ICONS[tone];
  const liveRole = tone === 'error' ? 'alert' : 'status';
  return (
    <div role={liveRole} data-tone={tone} className={`sp-notice ${className}`.trim()}>
      <div className="sp-notice-main">
        <Icon size="1.05em" strokeWidth={1.5} aria-hidden="true" />
        <span>{children}</span>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
