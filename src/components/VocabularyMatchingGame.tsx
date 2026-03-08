"use client";

import { useState, useEffect, Fragment } from 'react';
import { Target, CheckCircle, ArrowRight } from 'lucide-react';

interface VocabularyItem {
    es: string;
    nl: string;
    ex?: string;
}

interface VocabularyMatchingGameProps {
    items: VocabularyItem[];
    onComplete?: () => void;
}

export default function VocabularyMatchingGame({ items, onComplete }: VocabularyMatchingGameProps) {
    const gameItems = items.slice(0, 6);

    const [leftCards, setLeftCards] = useState<{ id: string, text: string }[]>([]);
    const [rightCards, setRightCards] = useState<{ id: string, text: string }[]>([]);

    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [selectedRight, setSelectedRight] = useState<string | null>(null);

    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const left = gameItems.map((item, idx) => ({ id: `pair-${idx}`, text: item.es }));

        const rightInitial = gameItems.map((item, idx) => ({ id: `pair-${idx}`, text: item.nl }));

        const shuffleArray = (array: { id: string, text: string }[]) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        const right = shuffleArray(rightInitial);

        setLeftCards(left);
        setRightCards(right);
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
                }, 800);
            }
        }
    }, [selectedLeft, selectedRight]);

    const isComplete = matchedIds.size === gameItems.length && gameItems.length > 0;

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-3 items-center">
                {leftCards.map((lCard, index) => {
                    const rCard = rightCards[index];
                    if (!lCard || !rCard) return null;

                    const lIsMatched = matchedIds.has(lCard.id);
                    const lIsSelected = selectedLeft === lCard.id;
                    const lErrorClass = lIsSelected && isError ? 'animate-[shake_0.4s_ease-in-out] bg-red-900/50 border-red-500' : '';

                    const rIsMatched = matchedIds.has(rCard.id);
                    const rIsSelected = selectedRight === rCard.id;
                    const rErrorClass = rIsSelected && isError ? 'animate-[shake_0.4s_ease-in-out] bg-red-900/50 border-red-500' : '';

                    return (
                        <Fragment key={index}>
                            {/* Left Column - Spanish */}
                            <button
                                key={`left-${lCard.id}`}
                                disabled={lIsMatched || (!lIsSelected && selectedLeft !== null)}
                                onClick={() => setSelectedLeft(lCard.id)}
                                className={`w-full h-14 px-2 text-sm rounded-xl font-medium transition-all duration-300 text-center border overflow-hidden relative flex items-center justify-center
                                    ${lIsMatched
                                        ? 'bg-[#4CAF50]/10 border-[#FF6B6B] text-[#FF6B6B]'
                                        : lIsSelected
                                            ? 'bg-brand-coral/20 border-brand-coral text-white'
                                            : 'bg-[#2a2a3e] border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-[#3a3a4e]'}
                                    ${lErrorClass}
                                `}
                            >
                                {lIsMatched && <CheckCircle className="absolute left-3 w-4 h-4 text-[#FF6B6B]" />}
                                <span className="line-clamp-2 leading-tight px-6">{lCard.text}</span>
                            </button>

                            {/* Right Column - Dutch */}
                            <button
                                key={`right-${rCard.id}`}
                                disabled={rIsMatched || (!rIsSelected && selectedRight !== null)}
                                onClick={() => setSelectedRight(rCard.id)}
                                className={`w-full h-14 px-2 text-sm rounded-xl font-medium transition-all duration-300 text-center border overflow-hidden relative flex items-center justify-center
                                    ${rIsMatched
                                        ? 'bg-[#4CAF50]/10 border-[#FF6B6B] text-[#FF6B6B]'
                                        : rIsSelected
                                            ? 'bg-brand-coral/20 border-brand-coral text-white'
                                            : 'bg-[#2a2a3e] border-gray-700 text-gray-200 hover:border-gray-500 hover:bg-[#3a3a4e]'}
                                    ${rErrorClass}
                                `}
                            >
                                <span className="line-clamp-2 leading-tight px-6">{rCard.text}</span>
                                {rIsMatched && <CheckCircle className="absolute right-3 w-4 h-4 text-[#FF6B6B]" />}
                            </button>
                        </Fragment>
                    );
                })}
            </div>

            {/* Success Message */}
            {isComplete && (
                <div className="mt-8 p-6 bg-brand-charcoal-light border border-[#4CAF50] rounded-xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 shadow-xl">
                    <Target className="w-12 h-12 text-[#4CAF50] mb-3" />
                    <h3 className="text-2xl font-bold text-white mb-2">¡Muy bien!</h3>
                    <p className="text-gray-300 mb-6 font-medium">Alle paren zijn succesvol gevonden.</p>
                    <button
                        onClick={onComplete}
                        className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-brand-charcoal px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                        Ga verder naar Explore <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
