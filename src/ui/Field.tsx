import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: (inputId: string) => React.ReactNode;
  className?: string;
}

export function Field({ label, hint, error, htmlFor, children, className = '' }: FieldProps) {
  const autoId = useId();
  const id = htmlFor ?? autoId;
  return (
    <div className={`sp-field ${className}`.trim()}>
      <label className="sp-field-label" htmlFor={id}>
        <span>{label}</span>
      </label>
      {children(id)}
      {error ? (
        <div className="sp-field-error" role="alert">
          <AlertCircle size="1em" strokeWidth={1.5} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <div className="sp-field-hint">{hint}</div>
      ) : null}
    </div>
  );
}

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ error = false, dataCtl, dataNew, className = '', ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={`sp-input ${className}`.trim()}
        data-error={error ? 'true' : undefined}
        data-ctl={dataCtl}
        data-new={dataNew ? '1' : undefined}
        {...rest}
      />
    );
  }
);

export interface TextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  dataCtl?: string;
  dataNew?: boolean;
}

export const TextareaInput = React.forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  function TextareaInput({ error = false, dataCtl, dataNew, className = '', ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={`sp-textarea ${className}`.trim()}
        data-error={error ? 'true' : undefined}
        data-ctl={dataCtl}
        data-new={dataNew ? '1' : undefined}
        {...rest}
      />
    );
  }
);
