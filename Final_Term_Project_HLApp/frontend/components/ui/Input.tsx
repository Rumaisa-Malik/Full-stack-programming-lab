'use client';

import { InputHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export function Input({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft">{icon}</div>}

        <input
          className={`
            w-full px-4 py-2 rounded-lg
            border-2 border-line
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            transition-all duration-200
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger focus:ring-danger' : ''}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-ink-soft">{helperText}</p>}
    </motion.div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  helperText?: string;
}

export function Select({
  label,
  error,
  options,
  helperText,
  className = '',
  ...props
}: SelectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <select
        className={`
          w-full px-4 py-2 rounded-lg
          border-2 border-line
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          transition-all duration-200
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-danger focus:ring-danger' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-ink-soft">{helperText}</p>}
    </motion.div>
  );
}
