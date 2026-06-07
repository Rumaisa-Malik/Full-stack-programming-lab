'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, Badge, StatusBadge } from '@/components/ui';

export interface CareVisit {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  checkupNotes: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
  };
  prescriptions: string[];
  status: 'completed' | 'active' | 'pending';
}

interface CareCurrentProps {
  visits: CareVisit[];
  currentVisitId?: string;
}

export function CareCurrent({ visits, currentVisitId }: CareCurrentProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<string | undefined>(currentVisitId);
  const [isVertical, setIsVertical] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!visits.length) {
    return (
      <Card variant="glass">
        <CardBody>
          <p className="text-center text-ink-soft py-8">No treatment history yet.</p>
        </CardBody>
      </Card>
    );
  }

  const selectedVisit = visits.find((v) => v.id === selectedVisitId) || visits[0];
  const visitIndex = visits.indexOf(selectedVisit);

  // SVG dimensions and scaling
  const svgWidth = isVertical ? 100 : 800;
  const svgHeight = isVertical ? 600 : 100;
  const padding = 40;
  const timelineStart = isVertical ? padding : padding;
  const timelineEnd = isVertical ? svgHeight - padding : svgWidth - padding;
  const timelineLength = timelineEnd - timelineStart;

  // Generate EKG-style waveform path
  const generateEKGPath = () => {
    const points: [number, number][] = [];
    const waveCount = 3;
    const waveHeight = isVertical ? 15 : 15;

    for (let i = 0; i <= visits.length; i++) {
      const progress = i / visits.length;
      const x = isVertical ? 50 : timelineStart + progress * timelineLength;
      const y = isVertical ? timelineStart + progress * timelineLength : 50;

      // EKG heartbeat pattern
      const wavePhase = (progress * waveCount * Math.PI * 2) % (Math.PI * 2);
      const wave = Math.sin(wavePhase) * waveHeight;
      const yOffset = isVertical ? wave : wave;

      if (isVertical) {
        points.push([x + yOffset, y]);
      } else {
        points.push([x, y + yOffset]);
      }
    }

    // Convert points to path
    let pathData = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i][0]} ${points[i][1]}`;
    }
    return pathData;
  };

  const ekgPath = generateEKGPath();
  const totalVisits = visits.length;

  return (
    <div className="w-full">
      {/* Timeline SVG */}
      <div className="mb-8 overflow-x-auto md:overflow-visible">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={`w-full ${isVertical ? 'h-[600px]' : 'h-[120px]'} drop-shadow-sm`}
          preserveAspectRatio="none"
        >
          {/* Define gradients */}
          <defs>
            <linearGradient id="careLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3D5573" stopOpacity="0.4" />
              <stop offset={`${(visitIndex / totalVisits) * 100}%`} stopColor="#1FA2FF" stopOpacity="0.8" />
              <stop offset={`${(visitIndex / totalVisits) * 100}%`} stopColor="#BFE4FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#BFE4FF" stopOpacity="0.2" />
            </linearGradient>

            <filter id="careGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="pulseGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1FA2FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1FA2FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Main care line - EKG waveform */}
          <motion.path
            d={ekgPath}
            stroke="url(#careLineGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#careGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Future segment - dashed line */}
          {visitIndex < totalVisits - 1 && (
            <motion.path
              d={ekgPath}
              stroke="#BFE4FF"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8,4"
              strokeLinecap="round"
              opacity="0.4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.3 }}
              style={{
                strokeDashoffset: 0,
              }}
            />
          )}

          {/* Traveling pulse - animated gradient mask */}
          <motion.circle
            cx={isVertical ? 50 : timelineStart + (visitIndex / totalVisits) * timelineLength}
            cy={isVertical ? timelineStart + (visitIndex / totalVisits) * timelineLength : 50}
            r="8"
            fill="url(#pulseGlow)"
            animate={{
              r: [8, 12, 8],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Visit nodes */}
          {visits.map((visit, idx) => {
            const x = isVertical ? 50 : timelineStart + (idx / totalVisits) * timelineLength;
            const y = isVertical ? timelineStart + (idx / totalVisits) * timelineLength : 50;
            const isSelected = visit.id === selectedVisitId;
            const isPast = idx < visitIndex;
            const isCurrent = idx === visitIndex;

            return (
              <g key={visit.id}>
                {/* Node circle */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : 6}
                  fill={isCurrent ? '#1FA2FF' : isPast ? '#0B1F3A' : '#BFE4FF'}
                  stroke={isSelected ? '#1FA2FF' : 'white'}
                  strokeWidth={isSelected ? 3 : 1}
                  opacity={isPast ? 0.7 : isCurrent ? 1 : 0.5}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ r: 8 }}
                  onClick={() => setSelectedVisitId(visit.id)}
                  animate={{
                    r: isSelected ? 8 : isCurrent ? 7 : 6,
                    filter: isCurrent ? 'drop-shadow(0 0 8px rgba(31, 162, 255, 0.6))' : 'none',
                  }}
                />

                {/* Label on hover/select */}
                {isSelected && (
                  <motion.text
                    x={x}
                    y={y + (isVertical ? 25 : -15)}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#0B1F3A"
                    fontWeight="600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {new Date(visit.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </motion.text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail Card - Current/Selected Visit */}
      <motion.div
        key={selectedVisit.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card variant="glass" className="border-l-4 border-accent">
          <CardHeader
            title={selectedVisit.specialty}
            subtitle={`Visit on ${new Date(selectedVisit.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}`}
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Doctor Info */}
              <div>
                <p className="text-sm text-ink-soft mb-2">Doctor</p>
                <p className="text-lg font-semibold text-ink">{selectedVisit.doctor}</p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-ink-soft mb-2">Status</p>
                <StatusBadge status={selectedVisit.status} />
              </div>

              {/* Vitals - if available */}
              {selectedVisit.vitals && (
                <div className="md:col-span-2">
                  <p className="text-sm text-ink-soft mb-2">Vitals</p>
                  <div className="flex gap-4">
                    {selectedVisit.vitals.bloodPressure && (
                      <div className="text-sm">
                        <p className="font-semibold text-ink">{selectedVisit.vitals.bloodPressure}</p>
                        <p className="text-xs text-ink-soft">Blood Pressure</p>
                      </div>
                    )}
                    {selectedVisit.vitals.heartRate && (
                      <div className="text-sm">
                        <p className="font-semibold text-ink">{selectedVisit.vitals.heartRate}</p>
                        <p className="text-xs text-ink-soft">Heart Rate</p>
                      </div>
                    )}
                    {selectedVisit.vitals.temperature && (
                      <div className="text-sm">
                        <p className="font-semibold text-ink">{selectedVisit.vitals.temperature}</p>
                        <p className="text-xs text-ink-soft">Temperature</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Checkup Notes */}
            <div className="mb-6">
              <p className="text-sm text-ink-soft mb-2">Checkup Notes</p>
              <p className="text-ink bg-base rounded-lg p-4">{selectedVisit.checkupNotes}</p>
            </div>

            {/* Prescriptions */}
            {selectedVisit.prescriptions.length > 0 && (
              <div>
                <p className="text-sm text-ink-soft mb-3">Medications Prescribed</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVisit.prescriptions.map((med, idx) => (
                    <Badge key={idx} variant="info">
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Timeline Navigation */}
      <div className="mt-6 flex gap-2 justify-center">
        {visits.map((visit) => (
          <motion.button
            key={visit.id}
            onClick={() => setSelectedVisitId(visit.id)}
            className={`
              h-2 rounded-full transition-all
              ${visit.id === selectedVisitId ? 'bg-accent w-8' : 'bg-line hover:bg-accent-soft w-2'}
            `}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}
