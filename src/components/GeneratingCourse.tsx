'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { TextShimmer } from '@/components/ui/text-shimmer';

interface GeneratingCourseProps {
    studentName: string;
    onComplete: () => void;
}

const STEPS = [
    { icon: '🧠', text: 'Analizando je profiel...' },
    { icon: '🎯', text: 'Bepalen van je startniveau...' },
    { icon: '🇨🇺', text: 'Cubaanse audio klaarzetten...' },
    { icon: '📚', text: 'SLO Kerndoelen koppelen...' },
    { icon: '⚡', text: 'XP systeem activeren...' },
    { icon: '🏆', text: 'Achievements unlocking...' },
];

export default function GeneratingCourse({
    studentName,
    onComplete
}: GeneratingCourseProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= STEPS.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setDone(true);
                        setTimeout(onComplete, 1200);
                    }, 600);
                    return prev;
                }
                return prev + 1;
            });
        }, 1200);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-50 px-6">

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <Image
                    src="/images/logo-linguaenlinea-final.png"
                    alt="Linguaenlinea"
                    width={200}
                    height={50}
                    className="h-16 w-auto object-contain"
                />
            </motion.div>

            {/* Greeting */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-400 text-lg mb-10 text-center"
            >
                Welkom, <span className="text-white font-bold">{studentName}</span>!
            </motion.p>

            {/* Main shimmer text */}
            <div className="mb-12 text-center">
                <TextShimmer
                    duration={1.8}
                    className="text-3xl md:text-4xl font-black [--base-color:#FF6B6B] [--base-gradient-color:#FFB800]"
                >
                    Jouw cursus wordt aangemaakt...
                </TextShimmer>
            </div>

            {/* Steps list */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
                {STEPS.map((step, index) => (
                    <AnimatePresence key={index}>
                        {index <= currentStep && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <span className="text-lg">{step.icon}</span>
                                <span className={`text-sm font-medium ${index === currentStep
                                    ? 'text-white'
                                    : 'text-slate-500'
                                    }`}>
                                    {step.text}
                                </span>
                                {index < currentStep && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-auto text-green-400 text-xs font-bold"
                                    >
                                        ✓
                                    </motion.span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                ))}
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-sm mt-10">
                <div className="bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB800] rounded-full"
                        initial={{ width: '0%' }}
                        animate={{
                            width: `${((currentStep + 1) / STEPS.length) * 100}%`
                        }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-slate-600 text-xs text-center mt-2">
                    {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
                </p>
            </div>

            {/* Done state */}
            <AnimatePresence>
                {done && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 text-center"
                    >
                        <span className="text-4xl">🚀</span>
                        <p className="text-[#FF6B6B] font-bold mt-2">
                            Klaar! Je cursus is klaar.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
