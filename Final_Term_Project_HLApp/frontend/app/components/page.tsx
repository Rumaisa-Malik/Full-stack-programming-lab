'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  Badge,
  StatusBadge,
  Loader,
  Skeleton,
  Modal,
  ConfirmModal,
  useToast,
} from '@/components/ui';

export default function ComponentsPage() {
  const [selectedModal, setSelectedModal] = useState<'none' | 'confirm' | 'normal'>('none');
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: 'cardiology',
  });

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-ink mb-12">Component Library</h1>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Buttons</h2>
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="mt-4">
                <Button disabled>Disabled</Button>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass">
              <CardHeader title="Glass Card" subtitle="Frosted glass effect" />
              <CardBody>
                <p className="text-ink-soft">This is a glass card with backdrop blur.</p>
              </CardBody>
            </Card>

            <Card variant="plain" interactive>
              <CardHeader title="Plain Card" />
              <CardBody>
                <p className="text-ink-soft">Interactive plain card with hover effect.</p>
              </CardBody>
            </Card>

            <Card variant="outlined">
              <CardHeader title="Outlined Card" />
              <CardBody>
                <p className="text-ink-soft">Outlined card with subtle border.</p>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Form Inputs</h2>
          <Card>
            <CardBody>
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                helperText="We'll never share your email"
              />
              <Select
                label="Specialty"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                options={[
                  { value: 'cardiology', label: 'Cardiology' },
                  { value: 'neurology', label: 'Neurology' },
                  { value: 'dentistry', label: 'Dentistry' },
                ]}
              />
              <Input label="With Error" error="This field is required" />
            </CardBody>
          </Card>
        </section>

        {/* Badges */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Badges</h2>
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <StatusBadge status="pending" />
                <StatusBadge status="approved" />
                <StatusBadge status="rejected" />
                <StatusBadge status="completed" />
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Loaders */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Loaders</h2>
          <Card>
            <CardBody>
              <div className="flex gap-8 items-center">
                <div>
                  <p className="text-sm text-ink-soft mb-3">Spinner</p>
                  <Loader variant="spinner" size="md" />
                </div>
                <div>
                  <p className="text-sm text-ink-soft mb-3">Pulse</p>
                  <Loader variant="pulse" size="md" />
                </div>
                <div>
                  <p className="text-sm text-ink-soft mb-3">Heartbeat (EKG)</p>
                  <Loader variant="heartbeat" size="md" />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-ink mt-8 mb-3">Skeletons</h3>
              <Skeleton height="h-4" count={3} />
            </CardBody>
          </Card>
        </section>

        {/* Modals & Toasts */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Modals & Toasts</h2>
          <Card>
            <CardBody>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  onClick={() => setSelectedModal('normal')}
                >
                  Open Modal
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setSelectedModal('confirm')}
                >
                  Confirm Modal
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => addToast('Success!', 'success')}
                >
                  Toast Success
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => addToast('This is an error', 'error')}
                >
                  Toast Error
                </Button>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Modal & Confirm Modal */}
        <Modal
          isOpen={selectedModal === 'normal'}
          onClose={() => setSelectedModal('none')}
          title="Sample Modal"
        >
          <p className="text-ink-soft mb-4">
            This is a sample modal component with glassmorphism design.
          </p>
          <Button onClick={() => setSelectedModal('none')}>Close</Button>
        </Modal>

        <ConfirmModal
          isOpen={selectedModal === 'confirm'}
          onClose={() => setSelectedModal('none')}
          onConfirm={() => {
            addToast('Confirmed!', 'success');
            setSelectedModal('none');
          }}
          title="Confirm Action"
          message="Are you sure you want to proceed?"
          isDangerous
        />
      </div>
    </div>
  );
}
