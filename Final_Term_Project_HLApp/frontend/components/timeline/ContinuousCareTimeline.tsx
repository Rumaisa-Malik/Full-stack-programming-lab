'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface TimelineVisit {
  id: string;
  date: string;
  followUpDate?: string;
  doctor: string;
  specialty: string;
  status: 'completed' | 'active' | 'pending';
  checkupNotes?: string;
  vitals?: Record<string, string>;
}

interface ContinuousCareTimelineProps {
  visits: TimelineVisit[];
}

export function ContinuousCareTimeline({ visits }: ContinuousCareTimelineProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<string | undefined>(visits[0]?.id);

  if (!visits.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No treatment history yet</p>
      </div>
    );
  }

  const selectedVisit = visits.find((v) => v.id === selectedVisitId) || visits[0];

  return (
    <div className="w-full">
      {/* Timeline Container */}
      <div className="space-y-8">
        {/* Main Timeline Track */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-slate-200"></div>

          {/* Timeline Items */}
          <div className="space-y-6">
            {visits.map((visit, idx) => {
              const isCompleted = visit.status === 'completed';
              const isActive = visit.status === 'active';
              const isPending = visit.status === 'pending';
              const isSelected = visit.id === selectedVisitId;

              return (
                <motion.div
                  key={visit.id}
                  className="relative pl-20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-2">
                    {isCompleted ? (
                      /* Completed State: Indigo badge with checkmark */
                      <motion.div
                        className="w-12 h-12 bg-[#3B51BF] rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    ) : isActive ? (
                      /* Active State: White core with heavy indigo border */
                      <motion.div
                        className="w-12 h-12 bg-white border-4 border-[#3B51BF] rounded-full shadow-lg flex items-center justify-center"
                        animate={{
                          scale: [1, 1.15, 1],
                          boxShadow: [
                            '0 0 0 0px rgba(59, 81, 191, 0.4)',
                            '0 0 0 8px rgba(59, 81, 191, 0.2)',
                            '0 0 0 0px rgba(59, 81, 191, 0.4)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-3 h-3 bg-[#3B51BF] rounded-full"></div>
                      </motion.div>
                    ) : (
                      /* Pending State: Simple outline */
                      <motion.div
                        className="w-12 h-12 bg-white border-2 border-slate-300 rounded-full shadow"
                        whileHover={{ scale: 1.08 }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Visit Card */}
                  <motion.div
                    onClick={() => setSelectedVisitId(visit.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50 border-2 border-[#3B51BF] shadow-md'
                        : 'bg-white border border-slate-200 hover:border-[#3B51BF]'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{visit.specialty}</h4>
                        <p className="text-sm text-slate-600">Dr. {visit.doctor}</p>
                      </div>
                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          isCompleted
                            ? 'bg-green-100 text-green-700'
                            : isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                      </span>
                    </div>

                    {/* Visit Date & Follow-up Info Flags */}
                    <div className="mb-3 flex gap-2 flex-wrap">
                      <div className="bg-indigo-50 text-[#3B51BF] border border-indigo-100 rounded-md p-2 inline-block text-xs font-medium">
                        Visit: {new Date(visit.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      {visit.followUpDate && (
                        <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md p-2 inline-block text-xs font-medium">
                          Follow-up: {new Date(visit.followUpDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 pt-3 border-t border-indigo-200 space-y-2"
                      >
                        {visit.checkupNotes && (
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Checkup Notes</p>
                            <p className="text-sm text-slate-700 italic">"{visit.checkupNotes}"</p>
                          </div>
                        )}

                        {visit.vitals && Object.keys(visit.vitals).length > 0 && (
                          <div>
                            <p className="text-xs text-slate-600 mb-2">Vitals</p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(visit.vitals).map(([key, value]) => (
                                <div key={key} className="bg-indigo-50 p-2 rounded border border-indigo-100">
                                  <p className="text-xs text-slate-600 capitalize">{key}</p>
                                  <p className="text-sm font-semibold text-[#3B51BF]">{value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Timeline Legend */}
        <div className="flex gap-6 pt-6 border-t border-slate-200 flex-wrap">
          {visits.some(v => v.status === 'completed') && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#3B51BF] rounded-full"></div>
              <span className="text-sm text-slate-600">Completed</span>
            </div>
          )}
          {visits.some(v => v.status === 'active') && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-[#3B51BF] rounded-full"></div>
              <span className="text-sm text-slate-600">Active</span>
            </div>
          )}
          {visits.some(v => v.status === 'pending') && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded-full"></div>
              <span className="text-sm text-slate-600">Pending</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
