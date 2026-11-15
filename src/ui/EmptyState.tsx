import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`sp-empty ${className}`.trim()}>
      {icon ? <div aria-hidden="true">{icon}</div> : null}
      <h3 className="sp-empty-title">{title}</h3>
      <p className="sp-empty-desc">{description}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
