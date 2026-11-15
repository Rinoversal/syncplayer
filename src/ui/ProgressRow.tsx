import React from 'react';
import { Button } from './Button';

export interface ProgressRowProps {
  title: string;
  stage: string;
  percent?: number;
  elapsedText?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string;
}

export function ProgressRow({
  title,
  stage,
  percent,
  elapsedText,
  onCancel,
  onRetry,
  error,
}: ProgressRowProps) {
  const hasRealPct = typeof percent === 'number' && Number.isFinite(percent);
  const clamped = hasRealPct ? Math.max(0, Math.min(100, Math.round(percent))) : 0;

  return (
    <div className="sp-progress-row" role="status">
      <div className="sp-progress-top">
        <span>
          <strong>{title}</strong> · {error ? error : stage}
        </span>
        <span className="mono">
          {hasRealPct ? `${clamped}%` : elapsedText ?? ''}
        </span>
      </div>
      <div className="sp-progress-track">
        <div
          className="sp-progress-fill"
          data-indeterminate={!hasRealPct && !error ? 'true' : undefined}
          style={hasRealPct ? { width: `${clamped}%` } : undefined}
        />
      </div>
      {(onCancel || onRetry) ? (
        <div>
          {onCancel && !error ? (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          {onRetry && error ? (
            <Button variant="default" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
