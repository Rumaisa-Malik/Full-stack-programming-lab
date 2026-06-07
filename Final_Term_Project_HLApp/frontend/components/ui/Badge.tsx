'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

const variants = {
  default: 'bg-line text-ink',
  success: 'bg-success bg-opacity-10 text-success',
  danger: 'bg-danger bg-opacity-10 text-danger',
  warning: 'bg-yellow-500 bg-opacity-10 text-yellow-700',
  info: 'bg-accent bg-opacity-10 text-accent',
};

const sizes = {
  sm: 'px-2 py-1 text-xs rounded',
  md: 'px-3 py-1.5 text-sm rounded-lg',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  return (
    <span className={`
      font-semibold inline-block
      ${variants[variant]}
      ${sizes[size]}
    `}>
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'active' | 'inactive';
}

const statusConfig = {
  pending: { variant: 'warning' as const, label: 'Pending' },
  approved: { variant: 'success' as const, label: 'Approved' },
  rejected: { variant: 'danger' as const, label: 'Rejected' },
  completed: { variant: 'success' as const, label: 'Completed' },
  active: { variant: 'success' as const, label: 'Active' },
  inactive: { variant: 'default' as const, label: 'Inactive' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
