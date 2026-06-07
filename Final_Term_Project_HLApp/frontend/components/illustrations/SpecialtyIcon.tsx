'use client';

import { DentistryIcon } from './DentistryIcon';
import { OrthopedicsIcon } from './OrthopedicsIcon';
import { NeurologyIcon } from './NeurologyIcon';
import { CardiologyIcon } from './CardiologyIcon';
import { PulmonologyIcon } from './PulmonologyIcon';
import { GastroenterologyIcon } from './GastroenterologyIcon';

export type Specialty =
  | 'Dentistry'
  | 'Orthopedics'
  | 'Neurology'
  | 'Cardiology'
  | 'Pulmonology'
  | 'Gastroenterology';

interface SpecialtyIconProps {
  name: Specialty;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const specialtyMap = {
  Dentistry: DentistryIcon,
  Orthopedics: OrthopedicsIcon,
  Neurology: NeurologyIcon,
  Cardiology: CardiologyIcon,
  Pulmonology: PulmonologyIcon,
  Gastroenterology: GastroenterologyIcon,
};

export function SpecialtyIcon({
  name,
  size = 'md',
  animated = true,
}: SpecialtyIconProps) {
  const IconComponent = specialtyMap[name];

  if (!IconComponent) {
    return <div className="text-ink-soft text-sm">Unknown specialty</div>;
  }

  return <IconComponent size={size} animated={animated} />;
}
