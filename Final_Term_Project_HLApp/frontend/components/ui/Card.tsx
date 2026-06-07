'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  variant?: 'glass' | 'plain' | 'outlined';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  variant = 'glass',
  interactive = false,
  onClick,
  className = '',
}: CardProps) {
  const baseStyles = 'rounded-2xl overflow-hidden';

  const variantStyles = {
    glass: 'glass p-8 shadow-soft',
    plain: 'bg-white p-8 shadow-soft rounded-2xl',
    outlined: 'bg-base border border-line p-8 rounded-2xl',
  };

  const content = (
    <motion.div
      whileHover={interactive ? { y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${interactive ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  return content;
}

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

export function CardHeader({ title, subtitle, children }: CardHeaderProps) {
  return (
    <div className="mb-6 pb-6 border-b border-line">
      {title && <h3 className="text-xl font-semibold text-ink mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="space-y-4">{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
}

export function CardFooter({ children }: CardFooterProps) {
  return (
    <div className="mt-6 pt-6 border-t border-line flex gap-3 justify-end">
      {children}
    </div>
  );
}
