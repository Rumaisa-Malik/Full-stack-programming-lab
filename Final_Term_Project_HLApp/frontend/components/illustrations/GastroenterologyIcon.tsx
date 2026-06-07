'use client';

import { motion } from 'framer-motion';

interface GastroenterologyIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function GastroenterologyIcon({
  size = 'md',
  animated = true,
}: GastroenterologyIconProps) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const peristalticVariants = {
    animate: (i: number) => ({
      cx: [40 + i * 10, 45 + i * 10, 40 + i * 10],
      cy: [35 + i * 5, 45 + i * 5, 35 + i * 5],
      r: [2.5, 4, 2.5],
      opacity: [0.3, 0.8, 0.3],
      transition: { duration: 2.5, repeat: Infinity, delay: i * 0.2 },
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
          <radialGradient id="stomachGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#BFE4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1FA2FF" stopOpacity="0.1" />
          </radialGradient>

          <linearGradient id="stomachGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BFE4FF" />
            <stop offset="50%" stopColor="#1FA2FF" />
            <stop offset="100%" stopColor="#0B4F8C" />
          </linearGradient>

          <filter id="stomachGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow aura */}
        <ellipse cx="50" cy="52" rx="46" ry="42" fill="url(#stomachGlow)" opacity="0.3" />

        {/* Esophagus */}
        <g filter="url(#stomachGlow)">
          <path
            d="M 50 15 Q 48 25 50 35"
            stroke="#1FA2FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Stomach depth layer */}
          <path
            d="M 50 33 Q 32 42 32 57 Q 32 72 50 77 Q 68 72 68 57 Q 68 42 50 33"
            fill="url(#stomachGradient)"
            opacity="0.4"
          />

          {/* Main stomach outline */}
          <path
            d="M 50 35 Q 35 40 35 55 Q 35 70 50 75 Q 65 70 65 55 Q 65 40 50 35"
            stroke="#1FA2FF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stomach detail folds with glow */}
          <path
            d="M 45 50 Q 50 52 55 50"
            stroke="#BFE4FF"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <path
            d="M 43 60 Q 50 63 57 60"
            stroke="#BFE4FF"
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* Small intestine exit */}
          <path
            d="M 60 75 Q 70 80 75 90 M 65 75 Q 72 82 75 92"
            stroke="#1FA2FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Peristaltic wave circles */}
        <motion.circle
          cx="40"
          cy="35"
          r="2.5"
          fill="#BFE4FF"
          custom={0}
          variants={peristalticVariants}
          animate={animated ? 'animate' : 'initial'}
        />
        <motion.circle
          cx="50"
          cy="40"
          r="2.5"
          fill="#BFE4FF"
          custom={1}
          variants={peristalticVariants}
          animate={animated ? 'animate' : 'initial'}
        />
        <motion.circle
          cx="60"
          cy="50"
          r="2.5"
          fill="#BFE4FF"
          custom={2}
          variants={peristalticVariants}
          animate={animated ? 'animate' : 'initial'}
        />

        {/* Pulsing glow ring */}
        <motion.circle
          cx="50"
          cy="52"
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
