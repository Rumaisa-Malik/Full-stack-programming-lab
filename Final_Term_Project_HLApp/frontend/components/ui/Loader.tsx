'use client';

import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'heartbeat';
}

export function Loader({ size = 'md', variant = 'heartbeat' }: LoaderProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  if (variant === 'spinner') {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeMap[size]} border-3 border-accent border-t-transparent rounded-full`}
      />
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${sizeMap[size]} bg-accent rounded-full opacity-60`}
      />
    );
  }

  // Heartbeat variant - EKG style
  return (
    <div className={`${sizeMap[size]} flex items-center`}>
      <svg viewBox="0 0 100 30" className="w-full h-full">
        <motion.polyline
          points="0,15 10,15 15,10 20,20 25,15 35,15 45,10 50,20 55,15 70,15 80,15 100,15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          initial={{ strokeDasharray: 200 }}
          animate={{ strokeDasharray: [200, 200] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-accent"
        />
      </svg>
    </div>
  );
}

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export function Skeleton({
  width = 'w-full',
  height = 'h-4',
  className = '',
  count = 1,
}: SkeletonProps) {
  const skeletons = Array(count)
    .fill(0)
    .map((_, i) => (
      <motion.div
        key={i}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`${width} ${height} bg-line rounded-lg ${i < count - 1 ? 'mb-4' : ''} ${className}`}
      />
    ));

  return <>{skeletons}</>;
}

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function LoadingState({
  isLoading,
  children,
  loadingComponent = <Loader />,
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {loadingComponent}
      </div>
    );
  }

  return <>{children}</>;
}
