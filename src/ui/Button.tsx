import React from 'react';
import { Loader2 } from 'lucide-react';
import './ui.css';

export type ButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';
export type ControlSize = 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  pressed?: boolean;
  busy?: boolean;
  error?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'default',
      size = 'md',
      pressed,
      busy = false,
      error = false,
      disabled,
      dataCtl,
      dataNew,
      className = '',
      children,
      type = 'button',
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={`sp-btn ${className}`.trim()}
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
        {busy ? <Loader2 size="1em" strokeWidth={1.5} className="sp-spin" aria-hidden="true" /> : null}
        {children}
      </button>
    );
  }
);
