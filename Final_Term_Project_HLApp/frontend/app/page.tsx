'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                MF
              </div>
              <span className="text-xl font-bold text-indigo-600">MediFlow</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition">Features</a>
              <a href="#why-us" className="text-slate-600 hover:text-indigo-600 transition">Why Us</a>
              <a href="#team" className="text-slate-600 hover:text-indigo-600 transition">Our Team</a>
              <Link href="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Login
              </Link>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden pb-4 space-y-2">
              <a href="#features" className="block text-slate-600 hover:text-indigo-600">Features</a>
              <a href="#why-us" className="block text-slate-600 hover:text-indigo-600">Why Us</a>
              <a href="#team" className="block text-slate-600 hover:text-indigo-600">Our Team</a>
              <Link href="/login" className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center">Login</Link>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-5xl md:text-6xl font-bold text-ink mb-6 leading-tight">
            Healthcare Management <span className="text-indigo-600">Reimagined</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Connect with 15+ specialist doctors across 6 specialties. Book appointments, track treatments, and manage your health all in one place.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/login" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-lg">
              Get Started
            </Link>
            <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium text-lg">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <p className="text-3xl font-bold text-indigo-600">15+</p>
              <p className="text-slate-600">Specialist Doctors</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <p className="text-3xl font-bold text-indigo-600">6</p>
              <p className="text-slate-600">Specialties</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <p className="text-3xl font-bold text-indigo-600">100%</p>
              <p className="text-slate-600">Secure</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <img
            src="/images/landing/hero.png"
            alt="Healthcare"
            className="w-full h-full object-cover rounded-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23e0e7ff' width='400' height='400'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' font-size='24' fill='%23818cf8' font-family='Arial'%3EHero Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="bg-slate-50 py-20 md:py-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need for modern healthcare management</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: 'appointment',
                title: 'Smart Appointment Booking',
                desc: 'Book appointments with specialists, get instant confirmations, and receive reminders.'
              },
              {
                id: 'tracking',
                title: 'Treatment Tracking',
                desc: 'Monitor your treatment progress with detailed timelines, visits, and prescriptions.'
              },
              {
                id: 'prescription',
                title: 'Prescription Management',
                desc: 'View all prescriptions, medication schedules, and follow-up instructions in one place.'
              },
              {
                id: 'secure',
                title: 'Secure & Private',
                desc: 'Bank-level encryption ensures your medical data is always protected and confidential.'
              },
              {
                id: 'accessible',
                title: 'Always Accessible',
                desc: 'Access your health records anytime, anywhere on any device with our responsive platform.'
              },
              {
                id: 'collaboration',
                title: 'Doctor Collaboration',
                desc: 'Doctors can coordinate care and share treatment information seamlessly.'
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.id === 'appointment' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                    {feature.id === 'tracking' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                    {feature.id === 'prescription' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.452a6 6 0 00-3.86.454l-.612.054a6 6 0 00-2.166 10.544c1.519.882 2.866 1.431 4.157 1.431 2.773 0 5.807-1.329 7.434-3.558.2-.253.371-.505.51-.756h1.616a2 2 0 002-2V5a2 2 0 00-2-2h-7.383c.956 1.278 1.5 2.794 1.5 4.432V15.428z" />}
                    {feature.id === 'secure' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />}
                    {feature.id === 'accessible' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                    {feature.id === 'collaboration' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.656v2.5" />}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Us Section */}
      <motion.section
        id="why-us"
        className="max-w-7xl mx-auto px-4 py-20 md:py-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="aspect-square rounded-2xl overflow-hidden"
          >
            <img
              src="/images/landing/doctors.png"
              alt="Our Team"
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23dcfce7' width='400' height='400'/%3E%3Ctext x='50%' y='50%' text-anchor='middle' dy='.3em' font-size='24' fill='%2322c55e' font-family='Arial'%3ETeam Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-bold text-ink mb-6">Why Choose MediFlow?</h2>
            <div className="space-y-6">
              {[
                { title: 'Expert Specialists', desc: '15+ doctors across 6 specialties, all verified and experienced.' },
                { title: 'Instant Appointments', desc: 'Real-time booking confirmation with flexible scheduling.' },
                { title: 'Complete Medical History', desc: 'All your treatments, visits, and prescriptions in one timeline.' },
                { title: 'Trusted by Thousands', desc: 'Join thousands of patients managing their health efficiently.' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h3 className="font-bold text-ink mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">✓</span>
                    {item.title}
                  </h3>
                  <p className="text-slate-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        id="team"
        className="bg-slate-50 py-20 md:py-28"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h2 className="text-4xl font-bold text-ink mb-4">Meet Our Specialist Team</h2>
            <p className="text-xl text-slate-600">15+ Expert Doctors Across 6 Specialties</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { specialty: 'Cardiology', count: 3 },
              { specialty: 'Dentistry', count: 3 },
              { specialty: 'Neurology', count: 2 },
              { specialty: 'Orthopedics', count: 3 },
              { specialty: 'Pulmonology', count: 2 },
              { specialty: 'Gastroenterology', count: 2 },
            ].map((spec, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-8 rounded-xl border border-slate-200 text-center hover:shadow-lg transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-20 h-20 mx-auto mb-4">
                  <img
                    src={`/specialities/${spec.specialty.toLowerCase()}.png`}
                    alt={spec.specialty}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">{spec.specialty}</h3>
                <p className="text-indigo-600 font-bold text-lg">{spec.count} Experts</p>
                <p className="text-slate-600 text-sm mt-2">Specialized care you can trust</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Ready to Take Control of Your Health?
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Join thousands of patients who are managing their healthcare more efficiently with MediFlow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/login" className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-slate-100 transition">
              Get Started Now →
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">MF</div>
                <span className="font-bold text-lg">MediFlow</span>
              </div>
              <p className="text-slate-400">Healthcare management for modern patients.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#why-us" className="hover:text-white transition">Why Us</a></li>
                <li><a href="#team" className="hover:text-white transition">Our Team</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2026 MediFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
