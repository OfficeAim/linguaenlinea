"use client";

import { motion } from 'framer-motion';
import { Volume2, ChevronRight } from 'lucide-react';

interface PhoneticIntroProps {
    onComplete: () => void;
}

export default function PhoneticIntro({ onComplete }: PhoneticIntroProps) {
    return (
        <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center p-3 md:p-6 overflow-x-hidden">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-brand-charcoal-light rounded-2xl shadow-2xl p-6 md:p-12 border border-gray-800 text-center"
            >
                <div className="w-20 h-20 bg-brand-coral/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Volume2 className="text-brand-coral w-10 h-10" />
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                    Spaans klinkt anders! 🗣️
                </h1>
                
                <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
                    Wist je dat de <span className="text-brand-gold font-bold">"H"</span> in het Spaans altijd stil is? 
                    En dat de <span className="text-brand-gold font-bold">"J"</span> klinkt als onze "G"? 
                    <br/><br/>
                    Geen zorgen, we beginnen bij de basis zodat je direct als een native klinkt.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-brand-gold font-bold">Hola</span>
                        <p className="text-sm text-slate-400">Wordt: "Ola" (De H is stil)</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-brand-gold font-bold">Jardín</span>
                        <p className="text-sm text-slate-400">Wordt: "Gardín" (De J is een G)</p>
                    </div>
                </div>

                <button
                    onClick={onComplete}
                    className="w-full py-4 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
                >
                    Ik ben er klaar voor!
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
        </div>
    );
}
