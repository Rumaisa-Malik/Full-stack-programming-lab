'use client';

import { motion } from 'framer-motion';

interface CardiologyIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function CardiologyIcon({ size = 'md', animated = true }: CardiologyIconProps) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <motion.div
      className={`${sizeMap[size]} flex items-center justify-center cursor-pointer`}
      whileHover={animated ? { filter: 'drop-shadow(0 0 20px rgba(31, 162, 255, 0.9))' } : {}}
      initial={{ scale: 1, filter: 'drop-shadow(0 0 4px rgba(31, 162, 255, 0.2))' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
          {/* Heart radial glow */}
          <radialGradient id="heartGlow" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#BFE4FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1FA2FF" stopOpacity="0.1" />
          </radialGradient>

          {/* 3D heart gradient */}
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BFE4FF" />
            <stop offset="50%" stopColor="#1FA2FF" />
            <stop offset="100%" stopColor="#0B4F8C" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="heartGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow aura */}
        <circle cx="50" cy="50" r="48" fill="url(#heartGlow)" opacity="0.3" />

        {/* 3D depth layer */}
        <g filter="url(#heartGlow)">
          <path
            d="M 50 87 C 22 72 12 57 12 47 C 12 32 22 22 32 22 C 42 22 50 32 50 42 C 50 32 58 22 68 22 C 78 22 88 32 88 47 C 88 57 78 72 50 87 Z"
            fill="url(#heartGradient)"
            opacity="0.4"
          />

          {/* Main heart outline */}
          <path
            d="M 50 85 C 20 70 10 55 10 45 C 10 30 20 20 30 20 C 40 20 50 30 50 40 C 50 30 60 20 70 20 C 80 20 90 30 90 45 C 90 55 80 70 50 85 Z"
            stroke="#1FA2FF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Highlight for 3D effect */}
          <path
            d="M 32 32 Q 40 35 45 45"
            stroke="#BFE4FF"
            strokeWidth="1.5"
            opacity="0.8"
            strokeLinecap="round"
          />
        </g>

        {/* Animated heartbeat EKG line */}
        <motion.polyline
          points="20,62 25,58 30,68 35,52 45,62 55,48 60,68 65,52 75,62 80,58 85,62"
          stroke="#1FA2FF"
          strokeWidth="1.5"
          fill="none"
          opacity={0.8}
          animate={
            animated
              ? {
                  opacity: [0.3, 0.9, 0.3],
                  strokeWidth: [0.8, 2, 0.8],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulsing glow ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#1FA2FF"
          strokeWidth="0.5"
          opacity="0"
          animate={
            animated
              ? {
                  r: [45, 55, 45],
                  opacity: [0.4, 0, 0.4],
                }
              : {}
          }
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* Beat pulse (scale) */}
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          fill="#1FA2FF"
          opacity="0"
          animate={
            animated
              ? {
                  r: [33, 38, 33],
                  opacity: [0.2, 0, 0.2],
                }
              : {}
          }
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
}
