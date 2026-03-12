'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Mail, Lock, Chrome, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (lockTimeRemaining === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimeRemaining]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimeRemaining(900); // 15 minutes
        setError('Te veel pogingen. Probeer het over 15 minuten opnieuw.');
      } else {
        setError(authError.message === 'Invalid login credentials' 
          ? 'Ongeldige inloggegevens. Controleer je e-mail en wachtwoord.' 
          : authError.message);
      }
      setLoading(false);
      return;
    }

    // Success! Check if profile exists
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profile && profile.onboarding_results) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) setError(error.message);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Vul je e-mailadres in om een herstellink te ontvangen.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      alert('E-mail voor wachtwoordherstel verzonden!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4 selection:bg-[#FF6B6B]/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/landing">
            <Image 
              src="/images/logo-dark-final.png" 
              alt="Linguaenlinea" 
              width={220} 
              height={80} 
              className="mb-4 cursor-pointer"
            />
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welkom terug 👋</h1>
        </div>

        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF6B6B] transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF6B6B]/50 focus:ring-1 focus:ring-[#FF6B6B]/20 transition-all"
                  placeholder="naam@voorbeeld.nl"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-400">Wachtwoord</label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 hover:underline transition-all"
                >
                  Wachtwoord vergeten?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FF6B6B] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF6B6B]/50 focus:ring-1 focus:ring-[#FF6B6B]/20 transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-sm text-[#FF6B6B] bg-[#FF6B6B]/10 p-3 rounded-lg border border-[#FF6B6B]/20"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading || isLocked}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isLocked 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]/90 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Inloggen
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A1A1A] px-2 text-gray-500">of</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-transparent border border-white/10 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            <Chrome className="w-5 h-5 text-[#D4AF37]" />
            Inloggen met Google
          </button>
        </div>

        <p className="text-center mt-8 text-gray-500">
          Nog geen account? {' '}
          <Link href="/onboarding" className="text-[#FF6B6B] font-bold hover:underline">
            Start gratis →
          </Link>
        </p>
      </motion.div>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF6B6B]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
