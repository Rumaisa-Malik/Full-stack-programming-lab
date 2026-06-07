'use client';

import { useState } from 'react';
import { SpecialtyCard } from '@/components/SpecialtyCard';
import { Card, CardHeader, CardBody } from '@/components/ui';

type SpecialtyName = 'dentistry' | 'orthopedics' | 'cardiology' | 'neurology' | 'pulmonology' | 'gastroenterology';

const specialties = [
  { name: 'dentistry' as SpecialtyName, label: 'Dentistry' },
  { name: 'orthopedics' as SpecialtyName, label: 'Orthopedics' },
  { name: 'cardiology' as SpecialtyName, label: 'Cardiology' },
  { name: 'neurology' as SpecialtyName, label: 'Neurology' },
  { name: 'pulmonology' as SpecialtyName, label: 'Pulmonology' },
  { name: 'gastroenterology' as SpecialtyName, label: 'Gastroenterology' },
];

export default function SpecialtiesPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyName | null>(null);

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-2">Medical Specialties</h1>
        <p className="text-ink-soft mb-12">
          Browse our available medical specialties. Each specialty card features a premium
          2D medical image with animated glow and interactive effects.
        </p>

        {/* Main grid showcase */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Specialty Selection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <SpecialtyCard
                key={specialty.name}
                name={specialty.name}
                label={specialty.label}
                selected={selectedSpecialty === specialty.name}
                onSelect={setSelectedSpecialty}
              />
            ))}
          </div>
          {selectedSpecialty && (
            <p className="text-ink-soft mt-6 text-center">
              You selected: <span className="font-semibold text-accent">{specialties.find(s => s.name === selectedSpecialty)?.label}</span>
            </p>
          )}
        </section>

        {/* Feature description */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Design Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader title="Frosted Glass Cards" />
              <CardBody>
                <p className="text-ink-soft text-sm">
                  Each card uses a premium glassmorphism design with backdrop blur, subtle borders,
                  and soft shadows for a clean, clinical aesthetic.
                </p>
              </CardBody>
            </Card>

            <Card variant="glass">
              <CardHeader title="Glowing Medical Images" />
              <CardBody>
                <p className="text-ink-soft text-sm">
                  Images are lit from within with a soft radial cyan glow, creating the illusion
                  of anatomical renders with volumetric lighting.
                </p>
              </CardBody>
            </Card>

            <Card variant="glass">
              <CardHeader title="Smooth Interactions" />
              <CardBody>
                <p className="text-ink-soft text-sm">
                  Cards lift on hover, images scale slightly, and a cyan scan-line sweeps across
                  to signal "examining." Respects prefers-reduced-motion for accessibility.
                </p>
              </CardBody>
            </Card>

            <Card variant="glass">
              <CardHeader title="Responsive Layout" />
              <CardBody>
                <p className="text-ink-soft text-sm">
                  2 columns on mobile, 3–4 on desktop. Cards maintain equal heights and consistent
                  spacing. Graceful image-error fallback using specialty initials.
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Technical specs */}
        <section>
          <h2 className="text-2xl font-bold text-ink mb-6">Technical Details</h2>
          <Card>
            <CardBody>
              <ul className="space-y-3 text-ink-soft text-sm">
                <li>
                  <strong className="text-ink">Image Source:</strong> Next.js Image component with fill + object-contain
                </li>
                <li>
                  <strong className="text-ink">Image Path:</strong> /public/specialities/{'{name}'}.png (transparent backgrounds)
                </li>
                <li>
                  <strong className="text-ink">Card Size:</strong> ~180–200px height, equal width, responsive grid
                </li>
                <li>
                  <strong className="text-ink">Glow Effect:</strong> Radial gradient backdrop (#1FA2FF at 10–20% opacity)
                </li>
                <li>
                  <strong className="text-ink">Idle Animation:</strong> 3s pulsing glow loop (Framer Motion)
                </li>
                <li>
                  <strong className="text-ink">Hover Animation:</strong> 4px lift, 5% image scale, cyan scan-line top→bottom (1.2s)
                </li>
                <li>
                  <strong className="text-ink">Selected State:</strong> Cyan ring border + "Selected" badge + intensified glow
                </li>
                <li>
                  <strong className="text-ink">Fallback:</strong> Specialty initial in glowing circle (50/50 cyan-to-ink) if image fails
                </li>
              </ul>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
