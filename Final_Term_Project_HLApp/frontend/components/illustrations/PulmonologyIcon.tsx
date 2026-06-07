'use client';

import { motion } from 'framer-motion';

interface PulmonologyIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function PulmonologyIcon({ size = 'md', animated = true }: PulmonologyIconProps) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <motion.div
      className={`${sizeMap[size]} flex items-center justify-center cursor-pointer`}
      whileHover={animated ? { filter: 'drop-shadow(0 0 20px rgba(31, 162, 255, 0.9))' } : {}}
      initial={{ filter: 'drop-shadow(0 0 4px rgba(31, 162, 255, 0.2))' }}
      animate={
        animated
          ? {
              filter: [
                'drop-shadow(0 0 8px rgba(31, 162, 255, 0.3))',
                'drop-shadow(0 0 16px rgba(31, 162, 255, 0.6))',
                'drop-shadow(0 0 8px rgba(31, 162, 255, 0.3))',
              ],
            }
          : {}
      }
      transition={{ duration: 3, repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="lungGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#BFE4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1FA2FF" stopOpacity="0.1" />
          </radialGradient>

          <linearGradient id="lungGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B4F8C" />
            <stop offset="50%" stopColor="#1FA2FF" />
            <stop offset="100%" stopColor="#BFE4FF" />
          </linearGradient>

          <filter id="lungGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow aura */}
        <ellipse cx="50" cy="50" rx="46" ry="42" fill="url(#lungGlow)" opacity="0.3" />

        {/* Left lung */}
        <g filter="url(#lungGlow)">
          {/* Depth layer */}
          <path
            d="M 20 33 Q 12 50 20 68 Q 26 78 36 78 Q 42 60 42 45 Q 42 28 36 18 Q 24 18 20 33"
            fill="url(#lungGradient)"
            opacity="0.4"
          />

          {/* Main outline */}
          <path
            d="M 20 35 Q 15 50 20 65 Q 25 75 35 75 Q 40 60 40 45 Q 40 30 35 20 Q 25 20 20 35"
            stroke="#1FA2FF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Breathing detail */}
          <motion.circle
            cx="30"
            cy="50"
            r="5"
            fill="#1FA2FF"
            opacity="0.3"
            animate={
              animated
                ? {
                    opacity: [0.1, 0.5, 0.1],
                    r: [4, 6, 4],
                  }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity }}
          />
        </g>

        {/* Right lung */}
        <g filter="url(#lungGlow)">
          {/* Depth layer */}
          <path
            d="M 80 33 Q 88 50 80 68 Q 74 78 64 78 Q 58 60 58 45 Q 58 28 64 18 Q 76 18 80 33"
            fill="url(#lungGradient)"
            opacity="0.4"
          />

          {/* Main outline */}
          <path
            d="M 80 35 Q 85 50 80 65 Q 75 75 65 75 Q 60 60 60 45 Q 60 30 65 20 Q 75 20 80 35"
            stroke="#1FA2FF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Breathing detail */}
          <motion.circle
            cx="70"
            cy="50"
            r="5"
            fill="#1FA2FF"
            opacity="0.3"
            animate={
              animated
                ? {
                    opacity: [0.1, 0.5, 0.1],
                    r: [4, 6, 4],
                  }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity }}
          />
        </g>

        {/* Trachea */}
        <path
          d="M 50 20 Q 48 15 50 10 M 50 20 Q 52 15 50 10"
          stroke="#1FA2FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
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
                  opacity: [0.3, 0, 0.3],
                }
              : {}
          }
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}
