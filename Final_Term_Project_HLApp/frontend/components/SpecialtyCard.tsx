'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@/components/ui';

type SpecialtyName = 'dentistry' | 'orthopedics' | 'cardiology' | 'neurology' | 'pulmonology' | 'gastroenterology';

interface SpecialtyCardProps {
  name: SpecialtyName;
  label: string;
  selected?: boolean;
  onSelect?: (name: SpecialtyName) => void;
}

export function SpecialtyCard({ name, label, selected = false, onSelect }: SpecialtyCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = `/specialities/${name}.png`;

  // Specialty initial for fallback
  const initial = label.charAt(0).toUpperCase();

  return (
    <motion.button
      onClick={() => onSelect?.(name)}
      className={`
        relative w-full h-full min-h-[240px] rounded-[20px] overflow-hidden
        transition-all duration-300 cursor-pointer group
        ${selected ? 'ring-2 ring-accent' : ''}
      `}
      whileHover={!selected ? { y: -4 } : {}}
      whileTap={!selected ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Frosted glass background */}
      <div className="absolute inset-0 glass rounded-[20px]" />

      {/* Radial glow backdrop - lit-from-within effect */}
      <motion.div
        className="absolute inset-0 rounded-[20px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(31, 162, 255, 0.15) 0%, rgba(31, 162, 255, 0.05) 40%, transparent 70%)',
        }}
        animate={
          selected
            ? { opacity: [0.2, 0.4, 0.2] }
            : { opacity: [0.1, 0.2, 0.1] }
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content container */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 z-10">
        {/* Image container */}
        <motion.div
          className="relative w-full h-[140px] flex items-center justify-center mb-4"
          animate={selected ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={label}
              fill
              className="object-contain drop-shadow-lg"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            /* Fallback: Initial in cyan glow circle */
            <div
              className={`
                w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
                ${selected ? 'bg-accent text-white' : 'bg-accent-soft text-accent'}
              `}
            >
              {initial}
            </div>
          )}

          {/* Scan-line effect on hover */}
          {!selected && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-accent to-transparent opacity-0 rounded-lg"
              initial={{ y: '-100%', opacity: 0 }}
              whileHover={{
                y: '100%',
                opacity: [0, 0.4, 0],
                transition: { duration: 1.2, ease: 'easeInOut' },
              }}
            />
          )}
        </motion.div>

        {/* Label */}
        <h3 className="text-base font-semibold text-ink text-center">{label}</h3>

        {/* Selected badge */}
        {selected && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Badge variant="success">Selected</Badge>
          </motion.div>
        )}
      </div>

      {/* Subtle inner glass highlight */}
      <div
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)',
        }}
      />

      {/* Dim other cards when one is selected */}
      {selected === false && (
        <motion.div
          className="absolute inset-0 bg-black rounded-[20px]"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
}
