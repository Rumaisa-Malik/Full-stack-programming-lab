'use client';

import { motion } from 'framer-motion';

interface OrthopedicsIconProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function OrthopedicsIcon({ size = 'md', animated = true }: OrthopedicsIconProps) {
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
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="boneGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#BFE4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1FA2FF" stopOpacity="0.1" />
          </radialGradient>

          <linearGradient id="boneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B4F8C" />
            <stop offset="50%" stopColor="#1FA2FF" />
            <stop offset="100%" stopColor="#0B4F8C" />
          </linearGradient>

          <filter id="boneGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow aura */}
        <ellipse cx="50" cy="50" rx="48" ry="40" fill="url(#boneGlow)" opacity="0.3" />

        {/* Depth shaft */}
        <g filter="url(#boneGlow)">
          <path
            d="M 18 50 L 82 50"
            stroke="url(#boneGradient)"
            strokeWidth="6"
            opacity="0.4"
            strokeLinecap="round"
          />

          {/* Main shaft */}
          <path
            d="M 20 50 L 80 50"
            stroke="#1FA2FF"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Left knob with gradient */}
          <circle cx="20" cy="50" r="8" fill="url(#boneGlow)" opacity="0.5" />
          <circle cx="20" cy="50" r="8" stroke="#1FA2FF" strokeWidth="2.5" fill="none" />
          <circle cx="20" cy="50" r="5" fill="#1FA2FF" opacity="0.4" />

          {/* Right knob with gradient */}
          <circle cx="80" cy="50" r="8" fill="url(#boneGlow)" opacity="0.5" />
          <circle cx="80" cy="50" r="8" stroke="#1FA2FF" strokeWidth="2.5" fill="none" />
          <circle cx="80" cy="50" r="5" fill="#1FA2FF" opacity="0.4" />

          {/* Joint highlights */}
          <path
            d="M 16 46 Q 20 48 24 46"
            stroke="#BFE4FF"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M 76 46 Q 80 48 84 46"
            stroke="#BFE4FF"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>

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
