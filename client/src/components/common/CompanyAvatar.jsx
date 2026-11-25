import React from 'react';

const COLORS = [
  'bg-primary/10 text-primary border-primary/20',
  'bg-secondary/10 text-secondary border-secondary/20',
  'bg-success/10 text-success border-success/20',
  'bg-warning/10 text-warning border-warning/20',
  'bg-danger/10 text-danger border-danger/20',
];

export function CompanyAvatar({ name = '', size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CO';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = COLORS[Math.abs(hash) % COLORS.length];

  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-xs font-semibold',
    lg: 'h-11 w-11 text-sm font-bold',
  }[size] || 'h-9 w-9 text-xs font-semibold';

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border select-none ${colorClass} ${sizeClasses} ${className}`}
      aria-label={`${name} logo`}
    >
      {initials}
    </div>
  );
}
