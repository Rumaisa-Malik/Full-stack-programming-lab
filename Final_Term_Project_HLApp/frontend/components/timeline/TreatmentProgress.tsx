'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui';
import { useState } from 'react';

export interface TreatmentProgressData {
  appointmentDate: string;
  specialty: string;
  doctor: string;
  status: 'pending' | 'approved' | 'active' | 'completed';
  phase: string;
  visitsCompleted: number;
  visitsScheduled: number;
  followUpsDue: number;
  followUpsCompleted: number;
  treatmentStartDate?: string;
  estimatedEndDate?: string;
}

interface KineticCareTimelineProps {
  treatment: TreatmentProgressData;
  isLatest?: boolean;
}

const stages = [
  {
    label: 'Appointment',
    sublabel: 'Scheduled',
    emoji: '📅',
    color: 'from-blue-400 to-cyan-400',
    bgColor: 'bg-blue-500/20',
  },
  {
    label: 'Assessment',
    sublabel: 'Initial',
    emoji: '🔍',
    color: 'from-purple-400 to-pink-400',
    bgColor: 'bg-purple-500/20',
  },
  {
    label: 'Treatment',
    sublabel: 'Active',
    emoji: '💪',
    color: 'from-orange-400 to-red-400',
    bgColor: 'bg-orange-500/20',
  },
  {
    label: 'Follow-up',
    sublabel: 'Recovery',
    emoji: '🎯',
    color: 'from-green-400 to-emerald-400',
    bgColor: 'bg-green-500/20',
  },
];

const getStageIndex = (status: string): number => {
  if (status === 'completed') return 3;
  if (status === 'active') return 2;
  if (status === 'approved') return 1;
  return 0;
};

export function KineticCareTimeline({ treatment, isLatest }: KineticCareTimelineProps) {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const currentStage = getStageIndex(treatment.status);

  const progressPercentage = ((currentStage + 1) / stages.length) * 100;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <div
        className={`relative rounded-3xl border-2 border-accent/40 overflow-hidden bg-gradient-to-br from-accent/5 via-base to-accent-soft/5 p-8 ${
          isLatest ? 'ring-2 ring-accent/60' : ''
        }`}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent-soft/10 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-bold text-ink mb-1">{treatment.specialty}</h3>
                <p className="text-sm text-ink-soft">Dr. {treatment.doctor}</p>
              </div>
              <Badge
                variant={
                  treatment.status === 'completed'
                    ? 'success'
                    : treatment.status === 'active'
                      ? 'success'
                      : 'warning'
                }
              >
                {treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1)}
              </Badge>
            </div>
          </motion.div>

          {/* Kinetic Progress Bar */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-ink">Care Journey</p>
              <p className="text-xs font-bold text-accent">{Math.round(progressPercentage)}%</p>
            </div>

            {/* Animated progress bar */}
            <div className="relative h-2 bg-base/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-accent via-accent-soft to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />

              {/* Shimmering effect */}
              <motion.div
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{ x: [-400, 400] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Stage Timeline */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            <div className="grid grid-cols-4 gap-3">
              {stages.map((stage, idx) => {
                const isCompleted = idx <= currentStage;
                const isCurrent = idx === currentStage;

                return (
                  <motion.div
                    key={idx}
                    className="relative"
                    onHoverStart={() => setHoveredStage(idx)}
                    onHoverEnd={() => setHoveredStage(null)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {/* Connector line */}
                    {idx < stages.length - 1 && (
                      <motion.div
                        className="absolute top-8 left-[60%] w-[50%] h-1 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                        style={{
                          background: isCompleted
                            ? 'linear-gradient(to right, #1FA2FF, #BFE4FF)'
                            : '#d1d5db',
                          originX: 0,
                        }}
                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                      />
                    )}

                    {/* Stage bubble */}
                    <motion.div
                      className={`
                        relative rounded-full w-16 h-16 flex flex-col items-center justify-center text-2xl
                        cursor-pointer transition-all
                        ${
                          isCurrent
                            ? `bg-gradient-to-br ${stage.color} text-white shadow-lg shadow-accent/40`
                            : isCompleted
                              ? `bg-gradient-to-br ${stage.color} text-white opacity-70`
                              : 'bg-base/50 text-ink-soft'
                        }
                      `}
                      animate={
                        isCurrent
                          ? {
                              scale: [1, 1.15, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(31, 162, 255, 0.6)',
                                '0 0 0 12px rgba(31, 162, 255, 0.2)',
                                '0 0 0 0 rgba(31, 162, 255, 0)',
                              ],
                            }
                          : hoveredStage === idx
                            ? { scale: 1.1 }
                            : {}
                      }
                      transition={{
                        duration: isCurrent ? 2 : 0.3,
                        repeat: isCurrent ? Infinity : 0,
                      }}
                    >
                      {stage.emoji}

                      {/* Pulse ring for current */}
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-white"
                          animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>

                    {/* Labels */}
                    <motion.div
                      className="text-center mt-3"
                      animate={{ y: hoveredStage === idx ? -4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className={`text-xs font-bold ${isCompleted ? 'text-ink' : 'text-ink-soft'}`}>
                        {stage.label}
                      </p>
                      <p className={`text-xs ${isCompleted ? 'text-accent' : 'text-ink-soft/60'}`}>
                        {stage.sublabel}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>


          {/* Status Message */}
          <motion.div
            className="p-4 rounded-2xl border border-accent/30 bg-accent/5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.p className="text-sm text-ink flex items-start gap-2">
              <motion.span
                className="text-lg"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💡
              </motion.span>
              <span>
                {treatment.status === 'pending' && (
                  <>
                    <span className="font-semibold text-accent">Awaiting Confirmation</span> — Your
                    appointment is scheduled. Once approved, your treatment journey begins.
                  </>
                )}
                {treatment.status === 'approved' && (
                  <>
                    <span className="font-semibold text-accent">Ready to Begin</span> — Your appointment
                    has been confirmed. Treatment begins soon.
                  </>
                )}
                {treatment.status === 'active' && (
                  <>
                    <span className="font-semibold text-accent">Keep Going!</span> — You're progressing
                    well. Attend all visits and follow-ups for best results.
                  </>
                )}
                {treatment.status === 'completed' && (
                  <>
                    <span className="font-semibold text-success">Mission Accomplished!</span> — You've
                    successfully completed your treatment. Great work!
                  </>
                )}
              </span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
