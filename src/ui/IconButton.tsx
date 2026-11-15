import React from 'react';
import { Loader2 } from 'lucide-react';
import type { ButtonVariant, ControlSize } from './Button';
import { Tooltip } from './Tooltip';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  icon: React.ReactNode;
  tooltip?: string;
  shortcut?: string;
  variant?: ButtonVariant;
  size?: ControlSize;
  pressed?: boolean;
  busy?: boolean;
  error?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      tooltip,
      shortcut,
      variant = 'ghost',
      size = 'md',
      pressed,
      busy = false,
      error = false,
      disabled,
      dataCtl,
      dataNew,
      className = '',
      type = 'button',
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) {
    const btn = (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        className={`sp-btn sp-icon-btn ${className}`.trim()}
        data-variant={variant}
        data-size={size}
        data-error={error ? 'true' : undefined}
        data-ctl={dataCtl}
        data-new={dataNew ? '1' : undefined}
        aria-pressed={pressed}
        aria-busy={busy || undefined}
        disabled={disabled || busy}
        {...rest}
      >
        {busy ? <Loader2 size="1.05em" strokeWidth={1.5} className="sp-spin" aria-hidden="true" /> : icon}
      </button>
    );

    if (tooltip || shortcut) {
      return (
        <Tooltip label={tooltip ?? ariaLabel} shortcut={shortcut}>
          {btn}
        </Tooltip>
      );
    }

    return btn;
  }
);
