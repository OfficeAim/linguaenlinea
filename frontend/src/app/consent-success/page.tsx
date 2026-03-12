'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConsentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 text-center shadow-2xl"
      >
        <div className="flex justify-center mb-8">
            <Image 
              src="/images/logo-dark-final.png" 
              alt="Linguaenlinea" 
              width={180} 
              height={60} 
            />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white">Gelukt!</h1>
          <p className="text-gray-400 text-lg">
            Bedankt voor het geven van toestemming. Het account is nu volledig geactiveerd.
          </p>
          
          <div className="mt-8">
            <Link 
              href="/login"
              className="inline-block py-4 px-10 bg-[#FF6B6B] text-white font-bold rounded-xl hover:bg-[#FF6B6B]/90 transition-all shadow-lg active:scale-95"
            >
              Ga naar Login
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
