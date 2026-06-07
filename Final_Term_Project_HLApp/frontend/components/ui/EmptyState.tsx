'use client';

import { motion } from 'framer-motion';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-ink mb-2">{title}</h3>
      <p className="text-center text-ink-soft max-w-md mb-6">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
