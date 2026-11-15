import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { ControlSize } from './Button';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  size?: ControlSize;
  error?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { options, size = 'md', error = false, dataCtl, dataNew, className = '', ...rest },
    ref
  ) {
    return (
      <span className={`sp-select-wrap ${className}`.trim()}>
        <select
          ref={ref}
          className="sp-select"
          data-size={size}
          data-error={error ? 'true' : undefined}
          data-ctl={dataCtl}
          data-new={dataNew ? '1' : undefined}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size="1em" strokeWidth={1.5} className="sp-select-chevron" aria-hidden="true" />
      </span>
    );
  }
);
