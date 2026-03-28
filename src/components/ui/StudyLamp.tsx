"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StudyLampProps {
    isJorgeMode?: boolean;
    speechBubble?: string;
    onSpeechClick?: () => void;
}

// Idle motivational phrases in Dutch
const IDLE_PHRASES = [
    "Goed bezig! 💪",
    "Blijf oefenen!",
    "Je kunt het! 🌟",
    "Zo gaat 't goed!",
    "Elke dag beter!",
    "Geweldig werk! ✨",
    "Niet opgeven! 🔥",
    "Jij bent geweldig!",
];

/**
 * StudyLamp Component - Official Study Assistant (Jorge)
 * Role: Study Mode Toggle + Guided Tour Character.
 */
export default function StudyLamp({ isJorgeMode = false, speechBubble, onSpeechClick }: StudyLampProps) {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [isWinking, setIsWinking] = useState(false);
    const [idlePhrase, setIdlePhrase] = useState<string | null>(null);
    const phraseIndexRef = useRef(0);

    // Periodic wink animation to feel "alive"
    useEffect(() => {
        const winkInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsWinking(true);
                setTimeout(() => setIsWinking(false), 200);
            }
        }, 3000);
        return () => clearInterval(winkInterval);
    }, []);

    // Idle motivational phrases — only when NOT in Jorge tour mode
    useEffect(() => {
        if (isJorgeMode) {
            setIdlePhrase(null);
            return;
        }

        const showPhrase = () => {
            const phrase = IDLE_PHRASES[phraseIndexRef.current % IDLE_PHRASES.length];
            phraseIndexRef.current += 1;
            setIdlePhrase(phrase);
            // Hide phrase after 3 seconds
            setTimeout(() => setIdlePhrase(null), 3000);
        };

        // First phrase after 5s, then every 9s
        const initialDelay = setTimeout(showPhrase, 5000);
        const interval = setInterval(showPhrase, 9000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
            setIdlePhrase(null);
        };
    }, [isJorgeMode]);

    const toggleStudyMode = () => {
        if (!isJorgeMode) {
            setIsStudyMode(!isStudyMode);
        }
    };

    return (
        <div
            className={`flex flex-col items-center justify-center py-4 relative ${isJorgeMode ? 'z-[110]' : 'cursor-pointer group'}`}
            onClick={toggleStudyMode}
        >
            {/* Glow Effect */}
            <AnimatePresence>
                {(isStudyMode || isJorgeMode) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.6, scale: isJorgeMode ? 1.3 : 1.1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 rounded-full blur-[40px] z-0 ${isJorgeMode ? 'bg-[#f4a261]/40' : 'bg-[#D4AF37]/50'}`}
                    />
                )}
            </AnimatePresence>

            {/* Idle Speech Bubble - Dutch motivational phrases */}
            <AnimatePresence>
                {!isJorgeMode && idlePhrase && (
                    <motion.div
                        key={idlePhrase}
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: '-50%' }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            bottom: '110%',
                            left: '50%',
                            width: '180px',
                            background: 'rgba(0,0,0,0.85)',
                            zIndex: 160,
                            pointerEvents: 'none',
                        }}
                        className="border border-[#D4AF37]/60 px-3 py-2 rounded-xl shadow-lg text-center"
                    >
                        <span className="text-xs text-[#D4AF37] font-bold leading-tight">
                            {idlePhrase}
                        </span>
                        {/* Arrow pointing down toward Jorge */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop: '10px solid #D4AF37',
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Speech Bubble - REFACTORIZACIÓN CSS PURO */}
            <AnimatePresence>
                {speechBubble && (

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
                        style={{
                            position: 'absolute',
                            top: '110%',
                            left: '50%',
                            width: '280px',
                            background: 'rgba(0,0,0,0.9)',
                            zIndex: 999,
                        }}
                        className="border-2 border-[#f4a261] p-4 rounded-2xl shadow-2xl cursor-pointer backdrop-blur-md"
                        onClick={onSpeechClick}
                    >
                        <div className="relative text-sm text-white font-bold leading-relaxed">
                            {speechBubble}
                            {/* Flecha hacia arriba */}
                            <div style={{
                                position: 'absolute',
                                top: '-25px', // apuntando hacia la base de Jorge
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 0,
                                height: 0,
                                borderLeft: '15px solid transparent',
                                borderRight: '15px solid transparent',
                                borderBottom: '15px solid #f4a261'
                            }} />
                        </div>
                        <div className="mt-2 text-[10px] text-[#f4a261] font-black uppercase tracking-tighter text-right">
                            Klik om door te gaan →
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Assistant Unit */}
            <motion.div
                animate={{ 
                    y: isJorgeMode ? [0, -10, 0] : [0, -6, 0],
                    scale: isJorgeMode ? 1.1 : 1
                }}
                transition={{ duration: isJorgeMode ? 2 : 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
            >
                <svg
                    width={isJorgeMode ? "160" : "120"}
                    height={isJorgeMode ? "160" : "120"}
                    viewBox="0 0 100 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Base */}
                    <rect x="35" y="105" width="30" height="10" rx="5" fill="#2D2D44" />
                    <rect x="47" y="80" width="6" height="30" fill="#2D2D44" />

                    {/* Lamp Head Container */}
                    <motion.g
                        animate={isStudyMode || isJorgeMode ? { rotate: [0, 1, -1, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        {/* THE LAMP SHADE IS ALWAYS VISIBLE (Fix 1) */}
                        <path
                            d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30H0Z"
                            fill={isJorgeMode ? "#f4a261" : (isStudyMode ? "#D4AF37" : "#3F3F5F")}
                            transform="translate(10, 20)"
                            className="transition-colors duration-500"
                        />

                        {/* FACE AND ARMS ARE CONDITIONAL (Fix 2.2) */}
                        {isJorgeMode && (
                            <>
                                {/* Brazos Curvados Dinámicos (Jorge Expressive) */}
                                <g transform="translate(10, 20)">
                                    {/* Brazo Izquierdo */}
                                    <motion.path 
                                        d="M -5 45 Q -15 35 -10 20"
                                        stroke="#f4a261" strokeWidth="6" strokeLinecap="round" fill="none"
                                        initial={{ d: "M -5 45 Q -15 35 -10 20" }}
                                        animate={{ d: ["M -5 45 Q -15 35 -10 20", "M -5 45 Q -18 30 -12 15", "M -5 45 Q -15 35 -10 20"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    {/* Brazo Derecho */}
                                    <motion.path 
                                        d="M 65 45 Q 75 35 70 20"
                                        stroke="#f4a261" strokeWidth="6" strokeLinecap="round" fill="none"
                                        initial={{ d: "M 65 45 Q 75 35 70 20" }}
                                        animate={{ d: ["M 65 45 Q 75 35 70 20", "M 65 45 Q 78 30 72 15", "M 65 45 Q 75 35 70 20"] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                                    />
                                </g>

                                {/* Jorge Face Group */}
                                <g transform="translate(10, 20)">
                                    {/* Eyes */}
                                    <circle cx="18" cy="16" r="5" fill="white" />
                                    <circle cx="42" cy="16" r="5" fill="white" />
                                    
                                    {/* Nose */}
                                    <circle cx="30" cy="24" r="3" fill="#f4a261" />

                                    {/* Friendly Sonrisa */}
                                    <path
                                        d="M 15 32 Q 30 45 45 32" 
                                        stroke="white" 
                                        strokeWidth="3" 
                                        fill="none" 
                                        strokeLinecap="round"
                                    />
                                </g>
                            </>
                        )}
                    </motion.g>
                </svg>
            </motion.div>
        </div>
    );
}
