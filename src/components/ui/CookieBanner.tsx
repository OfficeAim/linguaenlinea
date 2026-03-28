"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Settings } from 'lucide-react';
import Link from 'next/link';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('linguaenlinea_cookie_consent');
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('linguaenlinea_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('linguaenlinea_cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 z-[200] max-w-4xl mx-auto"
                >
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Privacidad y Cookies</h3>
                                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                    Utilizamos cookies para personalizar tu experiencia de aprendizaje y analizar nuestro tráfico.
                                    ¿Aceptas nuestra política de cookies?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleDecline}
                                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold"
                            >
                                Rechazar
                            </button>
                            <Link
                                href="/privacy"
                                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold flex items-center justify-center gap-2 border border-white/5"
                            >
                                <Settings className="w-3 h-3" /> Configurar
                            </Link>
                            <button
                                onClick={handleAccept}
                                className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8962E] text-slate-900 transition-all text-xs font-bold shadow-lg shadow-[#D4AF37]/20"
                            >
                                Aceptar
                            </button>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
