"use client";

import { useState, useEffect, Fragment } from 'react';
import { Target, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabularyItem {
    es: string;
    nl: string;
}

interface VocabularyMatchingGameProps {
    items: { spanish: string; dutch: string }[] | { es: string; nl: string }[];
    onComplete?: () => void;
}

export default function VocabularyMatchingGame({ items, onComplete }: VocabularyMatchingGameProps) {
    // Normalize items to { es, nl }
    const normalizedItems: VocabularyItem[] = (items || []).map(item => ({
        es: 'spanish' in item ? item.spanish : item.es,
        nl: 'dutch' in item ? item.dutch : item.nl
    })).slice(0, 6);

    const [leftCards, setLeftCards] = useState<{ id: string, text: string }[]>([]);
    const [rightCards, setRightCards] = useState<{ id: string, text: string }[]>([]);

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);

    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const left = normalizedItems.map((item, idx) => ({ id: `pair-${idx}`, text: item.es }));
        const rightInitial = normalizedItems.map((item, idx) => ({ id: `pair-${idx}`, text: item.nl }));

        const shuffleArray = (array: any[]) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        setLeftCards(left);
        setRightCards(shuffleArray(rightInitial));
    }, [items]);

    useEffect(() => {
        if (selectedLeft && selectedRight) {
            if (selectedLeft === selectedRight) {
                // Match
                setMatchedIds(prev => {
                    const next = new Set(prev);
                    next.add(selectedLeft);
                    return next;
                });
                setSelectedLeft(null);
                setSelectedRight(null);
            } else {
                // Error
                setIsError(true);
                setTimeout(() => {
                    setIsError(false);
                    setSelectedLeft(null);
                    setSelectedRight(null);
                }, 600);
            }
        }
    }, [selectedLeft, selectedRight]);

    const isComplete = matchedIds.size === normalizedItems.length && normalizedItems.length > 0;

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {/* Left Column - Spanish */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2">Español</p>
                    {leftCards.map((card) => {
                        const isMatched = matchedIds.has(card.id);
                        const isSelected = selectedLeft === card.id;
                        
                        return (
                            <motion.button
                                key={`left-${card.id}`}
                                layout
                                disabled={isMatched || isError}
                                onClick={() => setSelectedLeft(card.id)}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-4 min-h-[4rem] text-sm md:text-base rounded-2xl font-semibold border-2 transition-all duration-200 relative
                                    ${isMatched 
                                        ? 'bg-green-500/10 border-green-500/50 text-green-400 cursor-default' 
                                        : isSelected
                                            ? 'bg-brand-coral/20 border-brand-coral text-white shadow-[0_0_15px_rgba(230,57,70,0.3)]'
                                            : 'bg-[#2a2a3e] border-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-[#34344e]'}
                                    ${isSelected && isError ? 'border-red-500 bg-red-500/10' : ''}
                                `}
                            >
                                <AnimatePresence>
                                    {isMatched && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {card.text}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right Column - Dutch */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2">Nederlands</p>
                    {rightCards.map((card) => {
                        const isMatched = matchedIds.has(card.id);
                        const isSelected = selectedRight === card.id;

                        return (
                            <motion.button
                                key={`right-${card.id}`}
                                layout
                                disabled={isMatched || isError}
                                onClick={() => setSelectedRight(card.id)}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-4 min-h-[4rem] text-sm md:text-base rounded-2xl font-semibold border-2 transition-all duration-200 relative
                                    ${isMatched 
                                        ? 'bg-green-500/10 border-green-500/50 text-green-400 cursor-default' 
                                        : isSelected
                                            ? 'bg-brand-coral/20 border-brand-coral text-white shadow-[0_0_15px_rgba(230,57,70,0.3)]'
                                            : 'bg-[#2a2a3e] border-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-[#34344e]'}
                                    ${isSelected && isError ? 'border-red-500 bg-red-500/10' : ''}
                                `}
                            >
                                <AnimatePresence>
                                    {isMatched && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute left-3 top-1/2 -translate-y-1/2"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {card.text}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-8 bg-gradient-to-br from-green-600/20 to-green-900/40 border border-green-500/50 rounded-3xl text-center shadow-2xl backdrop-blur-sm"
                    >
                        <div className="bg-green-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">¡Excelente!</h3>
                        <p className="text-green-100/80 mb-6 font-medium">Has emparejado todo correctamente.</p>
                        <button
                            onClick={onComplete}
                            className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 rounded-2xl font-black transition-all flex items-center gap-3 mx-auto shadow-xl hover:scale-105"
                        >
                            ¡Vamos al siguiente paso! <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
