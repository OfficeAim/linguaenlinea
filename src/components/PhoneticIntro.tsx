"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Volume2, ArrowRight, X } from 'lucide-react';

interface PhoneticItem {
  id: string;
  letter: string;
  word: string;
  type: 'vowel' | 'consonant';
  audioKey: string;
}

const PHONETIC_DATA: PhoneticItem[] = [
  { id: 'a', letter: 'A', word: 'Ana', type: 'vowel', audioKey: 'ana' },
  { id: 'e', letter: 'E', word: 'bebé', type: 'vowel', audioKey: 'bebe' },
  { id: 'i', letter: 'I', word: 'turista', type: 'vowel', audioKey: 'turista' },
  { id: 'o', letter: 'O', word: 'Roma', type: 'vowel', audioKey: 'roma' },
  { id: 'u', letter: 'U', word: 'mucho', type: 'vowel', audioKey: 'mucho' },
  { id: 'j', letter: 'J', word: 'José', type: 'consonant', audioKey: 'jose' },
  { id: 'ñ', letter: 'Ñ', word: 'español', type: 'consonant', audioKey: 'espanol' },
  { id: 'll', letter: 'LL', word: 'llamarse', type: 'consonant', audioKey: 'llamarse' },
  { id: 'h', letter: 'H', word: 'hotel', type: 'consonant', audioKey: 'hotel' },
];

interface PhoneticIntroProps {
  onClose: () => void;
}

export default function PhoneticIntro({ onClose }: PhoneticIntroProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const playAudio = async (item: PhoneticItem) => {
    setPlayingId(item.id);
    try {
      // Defensive audio architecture as requested
      const audio = new Audio(`/audio/phonetics/word_${item.audioKey}.mp3`);
      await audio.play();
      
      // Reset playing state when finished
      audio.onended = () => setPlayingId(null);
    } catch (err) {
      console.warn(`Audio for ${item.word} not yet generated`, err);
      // Wait a bit to simulate playback time if missing
      setTimeout(() => setPlayingId(null), 1000);
    }
  };

  const vowels = PHONETIC_DATA.filter(i => i.type === 'vowel');
  const consonants = PHONETIC_DATA.filter(i => i.type === 'consonant');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-brand-charcoal/40 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl no-scrollbar"
        >
          {/* Close button - hidden because we want them to finish, but good for accessibility/ESC if we wanted */}
          {/* <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button> */}

          <div className="text-center mb-10">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black text-white mb-2"
            >
              De basis van je uitspraak
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg"
            >
              Luister en herhaal de klanken voordat we beginnen.
            </motion.p>
          </div>

          <div className="space-y-12">
            {/* Vowels Section */}
            <div>
              <h3 className="text-[#e63946] font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-[#e63946]"></span>
                Las Vocales (De klinkers)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {vowels.map((item) => (
                  <PhoneticCard 
                    key={item.id} 
                    item={item} 
                    isPlaying={playingId === item.id} 
                    onClick={() => playAudio(item)} 
                  />
                ))}
              </div>
            </div>

            {/* Consonants Section */}
            <div>
              <h3 className="text-[#f4a261] font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-[#f4a261]"></span>
                Alfabeto 'Let Op!'
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {consonants.map((item) => (
                  <PhoneticCard 
                    key={item.id} 
                    item={item} 
                    isPlaying={playingId === item.id} 
                    onClick={() => playAudio(item)} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-12 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="group relative flex items-center gap-3 bg-gradient-to-r from-[#e63946] to-[#f4a261] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_0_20px_rgba(230,57,70,0.3)] transition-all hover:shadow-[0_0_30px_rgba(230,57,70,0.5)]"
            >
              ¡Empezar Lección 1!
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PhoneticCard({ item, isPlaying, onClick }: { item: PhoneticItem; isPlaying: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${
        isPlaying 
          ? 'bg-white/15 border-[#f4a261] shadow-[0_0_15px_rgba(244,162,97,0.3)]' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="text-4xl font-black text-white mb-2">{item.letter}</div>
      <div className="text-sm text-gray-400 font-medium uppercase tracking-tighter mb-4">{item.word}</div>
      
      <div className={`p-2 rounded-full transition-colors ${isPlaying ? 'bg-[#f4a261] text-brand-charcoal' : 'bg-white/10 text-gray-400'}`}>
        <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </div>

      {isPlaying && (
        <motion.div
          layoutId="pulse"
          className="absolute inset-0 rounded-2xl border-2 border-[#f4a261]"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.05, 1.1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
