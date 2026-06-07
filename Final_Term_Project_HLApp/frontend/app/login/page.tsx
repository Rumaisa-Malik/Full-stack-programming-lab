'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Get user from localStorage to determine redirect
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const role = parsedUser.role;

        // Redirect to appropriate dashboard based on role
        if (role === 'patient') {
          router.push('/patient/dashboard');
        } else if (role === 'doctor') {
          router.push('/doctor/dashboard');
        } else if (role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Visual (Hidden on Mobile) */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col items-center justify-center p-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background circles */}
        <motion.div
          className="absolute w-96 h-96 bg-white rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-indigo-400 rounded-full opacity-10 blur-3xl -bottom-10 -right-10"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 text-3xl font-bold text-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            MF
          </motion.div>
          <h2 className="text-5xl font-bold mb-4">Welcome to MediFlow</h2>
          <p className="text-lg text-white/90 mb-8 max-w-sm mx-auto leading-relaxed">
            Your comprehensive healthcare management platform. Manage appointments, treatments, and medical records in one place.
          </p>

          {/* Feature list */}
          <div className="space-y-4 text-left max-w-sm mx-auto">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">APT</div>
              <span className="text-white/90">Book appointments with specialists</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">TRX</div>
              <span className="text-white/90">Track treatments and prescriptions</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">HST</div>
              <span className="text-white/90">Monitor your health progress</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md">
                MF
              </div>
              <h1 className="text-3xl font-bold text-slate-900">MediFlow</h1>
            </motion.div>
            <p className="text-slate-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Create one
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-8 border-t border-indigo-200">
            <p className="text-slate-600 text-sm font-semibold mb-4 text-center">Demo Credentials</p>
            <div className="space-y-2">
              <motion.button
                type="button"
                onClick={() => {
                  setEmail('admin@mediflow.dev');
                  setPassword('Passw0rd!');
                }}
                className="w-full text-left px-4 py-2 rounded-lg border border-indigo-200 hover:bg-slate-50 text-slate-700 text-sm transition-all flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">A</div>
                <div className="flex-1">
                  <span className="font-semibold">Admin</span><br className="hidden" />
                  <span className="text-xs text-slate-500">admin@mediflow.dev</span>
                </div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setEmail('ayesha.khan@mediflow.dev');
                  setPassword('Passw0rd!');
                }}
                className="w-full text-left px-4 py-2 rounded-lg border border-indigo-200 hover:bg-slate-50 text-slate-700 text-sm transition-all flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-6 h-6 rounded bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">D</div>
                <div className="flex-1">
                  <span className="font-semibold">Doctor</span><br className="hidden" />
                  <span className="text-xs text-slate-500">ayesha.khan@mediflow.dev</span>
                </div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  setEmail('ali.raza@example.com');
                  setPassword('Passw0rd!');
                }}
                className="w-full text-left px-4 py-2 rounded-lg border border-indigo-200 hover:bg-slate-50 text-slate-700 text-sm transition-all flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-6 h-6 rounded bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">P</div>
                <div className="flex-1">
                  <span className="font-semibold">Patient</span><br className="hidden" />
                  <span className="text-xs text-slate-500">ali.raza@example.com</span>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
