"use client";

import { useState, useEffect } from 'react';
import { Target, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabularyMatchProps {
    pairs: { id: number; es: string; nl: string }[];
    onComplete: (score: number) => void;
}

interface Card {
    pairId: number;
    text: string;
    type: 'es' | 'nl';
}

export default function VocabularyMatchGame({ pairs, onComplete }: VocabularyMatchProps) {
    const [esCards, setEsCards] = useState<Card[]>([]);
    const [nlCards, setNlCards] = useState<Card[]>([]);
    const [selected, setSelected] = useState<{ card: Card; index: number } | null>(null);
    const [matched, setMatched] = useState<number[]>([]);
    const [errorIndex, setErrorIndex] = useState<{ type: 'es' | 'nl'; index: number } | null>(null);

    useEffect(() => {
        const es = pairs.map(p => ({ pairId: p.id, text: p.es, type: 'es' as const }));
        const nl = pairs.map(p => ({ pairId: p.id, text: p.nl, type: 'nl' as const }));
        
        const shuffle = (array: Card[]) => [...array].sort(() => Math.random() - 0.5);
        
        setEsCards(shuffle(es));
        setNlCards(shuffle(nl));
    }, [pairs]);

    const handleCardClick = (card: Card, index: number) => {
        if (matched.includes(card.pairId) || errorIndex) return;

        if (!selected) {
            setSelected({ card, index });
            return;
        }

        // If clicking the same card, deselect
        if (selected.card.type === card.type && selected.index === index) {
            setSelected(null);
            return;
        }

        // If clicking same column, switch selection
        if (selected.card.type === card.type) {
            setSelected({ card, index });
            return;
        }

        // Check for match
        if (selected.card.pairId === card.pairId) {
            // Match success
            const newMatched = [...matched, card.pairId];
            setMatched(newMatched);
            setSelected(null);

            if (newMatched.length === pairs.length) {
                onComplete(100);
            }
        } else {
            // Match error
            setErrorIndex({ type: card.type, index });
            // The selected card also shakes, so we need its info for the other column
            setTimeout(() => {
                setErrorIndex(null);
                setSelected(null);
            }, 600);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="grid grid-cols-2 gap-8">
                {/* Spanish Column */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-center text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Español</h3>
                    {esCards.map((card, idx) => {
                        const isSelected = selected?.card.type === 'es' && selected.index === idx;
                        const isMatched = matched.includes(card.pairId);
                        const isError = (errorIndex?.type === 'es' && errorIndex.index === idx) || 
                                      (errorIndex && selected?.card.type === 'es' && selected.index === idx);

                        return (
                            <CardItem
                                key={`es-${idx}`}
                                card={card}
                                isSelected={isSelected}
                                isMatched={isMatched}
                                isError={Boolean(isError)}
                                onClick={() => handleCardClick(card, idx)}
                            />
                        );
                    })}
                </div>

                {/* Dutch Column */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-center text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Nederlands</h3>
                    {nlCards.map((card, idx) => {
                        const isSelected = selected?.card.type === 'nl' && selected.index === idx;
                        const isMatched = matched.includes(card.pairId);
                        const isError = (errorIndex?.type === 'nl' && errorIndex.index === idx) || 
                                      (errorIndex && selected?.card.type === 'nl' && selected.index === idx);

                        return (
                            <CardItem
                                key={`nl-${idx}`}
                                card={card}
                                isSelected={isSelected}
                                isMatched={isMatched}
                                isError={Boolean(isError)}
                                onClick={() => handleCardClick(card, idx)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function CardItem({ card, isSelected, isMatched, isError, onClick }: { 
    card: Card; 
    isSelected: boolean; 
    isMatched: boolean; 
    isError: boolean;
    onClick: () => void;
}) {
    return (
        <motion.button
            onClick={onClick}
            disabled={isMatched}
            animate={
                isError ? { 
                    x: [-15, 15, -15, 15, 0],
                    borderColor: ["#ef4444", "rgba(239, 68, 68, 0)", "#ef4444", "rgba(239, 68, 68, 0)", "#ef4444"]
                } : 
                isMatched ? { 
                    scale: [1, 1.05, 1], 
                    boxShadow: [
                        "0 0 0px rgba(244,162,97,0)", 
                        "0 0 25px rgba(244,162,97,0.8)", 
                        "0 0 15px rgba(244,162,97,0.5)"
                    ]
                } : 
                {}
            }
            transition={{ duration: isError ? 0.5 : 0.4 }}
            className={`
                relative w-full p-4 min-h-[70px] flex items-center justify-center rounded-2xl border-2 font-bold transition-all duration-200
                ${isMatched 
                    ? 'bg-[#1a1a2e] border-[#f4a261] text-[#f4a261] opacity-60 cursor-default' 
                    : isSelected
                        ? 'bg-[#f4a261]/20 border-[#f4a261] text-white shadow-[0_0_15px_rgba(244,162,97,0.3)]'
                        : isError
                            ? 'bg-red-500/10 border-red-500 text-red-500'
                            : 'bg-[#2a2a3e] border-white/10 text-slate-300 hover:border-white/30 hover:bg-[#32324d]'
                }
            `}
        >
            <AnimatePresence>
                {isMatched && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-3"
                    >
                        <CheckCircle className="w-5 h-5 text-[#f4a261]" />
                    </motion.div>
                )}
            </AnimatePresence>
            <span className="text-sm md:text-base px-6">{card.text}</span>
        </motion.button>
    );
}
