import React, { useId } from 'react';

export interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
  className?: string;
}

export function Switch({
  label,
  checked,
  onChange,
  disabled = false,
  dataCtl,
  dataNew,
  className = '',
}: SwitchProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={`sp-check-row ${className}`.trim()}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="sp-switch-input"
        checked={checked}
        disabled={disabled}
        data-ctl={dataCtl}
        data-new={dataNew ? '1' : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  dataCtl,
  dataNew,
  className = '',
}: CheckboxProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={`sp-check-row ${className}`.trim()}>
      <input
        id={id}
        type="checkbox"
        className="sp-checkbox"
        checked={checked}
        disabled={disabled}
        data-ctl={dataCtl}
        data-new={dataNew ? '1' : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
