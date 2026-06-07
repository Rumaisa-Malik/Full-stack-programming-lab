'use client';

import { motion } from 'framer-motion';

interface NeurologyIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function NeurologyIcon({ size = 'md', animated = true }: NeurologyIconProps) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const pulseVariants = {
    animate: (i: number) => ({
      r: [3, 5, 3],
      opacity: [0.4, 0.9, 0.4],
      transition: { duration: 1.5, repeat: Infinity, delay: i * 0.3 },
    }),
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
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#BFE4FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1FA2FF" stopOpacity="0.1" />
          </radialGradient>

          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BFE4FF" />
            <stop offset="50%" stopColor="#1FA2FF" />
            <stop offset="100%" stopColor="#0B4F8C" />
          </linearGradient>

          <filter id="brainGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow aura */}
        <circle cx="50" cy="48" r="46" fill="url(#brainGlow)" opacity="0.35" />

        {/* Depth layer */}
        <g filter="url(#brainGlow)">
          <path
            d="M 50 17 Q 68 23 73 36 Q 76 50 73 64 Q 68 77 50 82 Q 32 77 27 64 Q 24 50 27 36 Q 32 23 50 17"
            fill="url(#brainGradient)"
            opacity="0.4"
          />

          {/* Main outline */}
          <path
            d="M 50 15 Q 70 20 75 35 Q 78 50 75 65 Q 70 80 50 85 Q 30 80 25 65 Q 22 50 25 35 Q 30 20 50 15"
            stroke="#1FA2FF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Brain wrinkles with highlight */}
          <path
            d="M 40 35 Q 50 40 60 35"
            stroke="#BFE4FF"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <path
            d="M 40 50 Q 50 55 60 50"
            stroke="#BFE4FF"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <path
            d="M 40 65 Q 50 70 60 65"
            stroke="#BFE4FF"
            strokeWidth="1.2"
            opacity="0.7"
          />
        </g>

        {/* Synaptic pulses with glow */}
        <motion.circle
          cx="35"
          cy="40"
          r="3"
          fill="#BFE4FF"
          opacity="0.5"
          custom={0}
          variants={pulseVariants}
          animate={animated ? 'animate' : 'initial'}
        />
        <motion.circle
          cx="50"
          cy="28"
          r="3"
          fill="#BFE4FF"
          opacity="0.5"
          custom={1}
          variants={pulseVariants}
          animate={animated ? 'animate' : 'initial'}
        />
        <motion.circle
          cx="65"
          cy="40"
          r="3"
          fill="#BFE4FF"
          opacity="0.5"
          custom={2}
          variants={pulseVariants}
          animate={animated ? 'animate' : 'initial'}
        />
        <motion.circle
          cx="50"
          cy="67"
          r="3"
          fill="#BFE4FF"
          opacity="0.5"
          custom={3}
          variants={pulseVariants}
          animate={animated ? 'animate' : 'initial'}
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
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}
