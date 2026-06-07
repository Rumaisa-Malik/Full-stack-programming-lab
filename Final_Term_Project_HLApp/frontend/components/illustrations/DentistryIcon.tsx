'use client';

import { motion } from 'framer-motion';

interface DentistryIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function DentistryIcon({ size = 'md', animated = true }: DentistryIconProps) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const idleVariants = {
    animate: {
      scale: [1, 1.05, 1],
      filter: [
        'drop-shadow(0 0 8px rgba(31, 162, 255, 0.3))',
        'drop-shadow(0 0 16px rgba(31, 162, 255, 0.6))',
        'drop-shadow(0 0 8px rgba(31, 162, 255, 0.3))',
      ],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className={`${sizeMap[size]} flex items-center justify-center cursor-pointer`}
      variants={idleVariants}
      animate={animated ? 'animate' : 'initial'}
      whileHover={animated ? { filter: 'drop-shadow(0 0 20px rgba(31, 162, 255, 0.9))' } : {}}
      initial={{ scale: 1, filter: 'drop-shadow(0 0 4px rgba(31, 162, 255, 0.2))' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
          {/* Glow gradient */}
          <radialGradient id="toothGlow" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#BFE4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1FA2FF" stopOpacity="0.1" />
          </radialGradient>

          {/* 3D depth gradient */}
          <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BFE4FF" />
            <stop offset="50%" stopColor="#1FA2FF" />
            <stop offset="100%" stopColor="#0B4F8C" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx="50" cy="50" r="45" fill="url(#toothGlow)" opacity="0.4" />

        {/* Main tooth with 3D effect */}
        <g filter="url(#glow)">
          {/* Shadow/depth layer */}
          <path
            d="M 50 12 Q 63 22 63 40 Q 63 68 50 82 Q 37 68 37 40 Q 37 22 50 12"
            fill="url(#toothGradient)"
            opacity="0.5"
          />

          {/* Main tooth outline */}
          <path
            d="M 50 10 Q 65 20 65 40 Q 65 70 50 85 Q 35 70 35 40 Q 35 20 50 10"
            stroke="#1FA2FF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Highlight for 3D depth */}
          <path
            d="M 45 20 Q 48 35 48 55"
            stroke="#BFE4FF"
            strokeWidth="2"
            opacity="0.7"
            strokeLinecap="round"
          />
        </g>

        {/* Root with detail */}
        <g opacity="0.8">
          <path
            d="M 42 85 Q 40 95 38 100"
            stroke="#1FA2FF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 50 85 L 50 100"
            stroke="#1FA2FF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 58 85 Q 60 95 62 100"
            stroke="#1FA2FF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Pulsing glow effect */}
        <motion.circle
          cx="50"
          cy="48"
          r="48"
          fill="none"
          stroke="#1FA2FF"
          strokeWidth="0.5"
          opacity="0"
          animate={
            animated
              ? {
                  r: [45, 55, 45],
                  opacity: [0.3, 0, 0.3],
                }
              : {}
          }
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}
