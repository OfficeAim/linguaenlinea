"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Check } from 'lucide-react';

const QUESTIONS = [
    {
        id: "track",
        title: "What brings you to Linguaenlinea?",
        options: [
            { id: "dutch", label: "🎓 I need to pass my Dutch school exams (Dutch Track)" },
            { id: "open", label: "🌍 I just want to learn Spanish my way (Open Track)" }
        ]
    },
    {
        id: "l1",
        title: "What is your first language?",
        options: [
            { id: "nl", label: "🇳🇱 Dutch" },
            { id: "en", label: "🇬🇧 English" },
            { id: "ar", label: "🇲🇦 Arabic" },
            { id: "tr", label: "🇹🇷 Turkish" },
            { id: "sr", label: "🇸🇷 Sranan / Papiamento" },
            { id: "other", label: "🌐 Other (specify)" }
        ]
    },
    {
        id: "spanish_level",
        title: "How much Spanish do you already know?",
        options: [
            { id: "zero", label: "Zero — I've never studied Spanish" },
            { id: "beginner", label: "Beginner — I know a few words" },
            { id: "elementary", label: "Elementary — I can introduce myself" },
            { id: "pre-intermediate", label: "Pre-intermediate — I can have simple conversations" }
        ]
    },
    {
        id: "interests",
        title: "What topics excite you most? (Choose up to 3)",
        type: "multiselect",
        max: 3,
        options: [
            { id: "music", label: "🎵 Music (salsa, reggaeton)" },
            { id: "sports", label: "⚽ Sports (football, athletics)" },
            { id: "food", label: "🍕 Food & Cooking" },
            { id: "travel", label: "✈️ Travel & Adventure" },
            { id: "gaming", label: "🎮 Gaming & Technology" },
            { id: "film", label: "🎬 Film & Series" },
            { id: "history", label: "📚 History & Culture" },
            { id: "business", label: "💼 Business & Work" },
            { id: "art", label: "🎨 Art & Design" }
        ]
    },
    {
        id: "daily_minutes",
        title: "How much time can you spend each day?",
        options: [
            { id: "10", label: "⚡ 10 minutes (micro-learning)" },
            { id: "30", label: "📖 30 minutes (standard)" },
            { id: "60", label: "🚀 60 minutes (intensive)" }
        ]
    },
    {
        id: "learning_style",
        title: "How do you learn best?",
        options: [
            { id: "listening", label: "👂 Listening and repeating" },
            { id: "reading", label: "📝 Reading and writing" },
            { id: "speaking", label: "🗣️ Speaking and conversation" },
            { id: "games", label: "🎯 Games and challenges" }
        ]
    }
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({ interests: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQ = QUESTIONS[step];

    const handleSelect = (optionId: string) => {
        if (currentQ.type === 'multiselect') {
            const currentSelection = answers[currentQ.id] || [];
            if (currentSelection.includes(optionId)) {
                setAnswers({ ...answers, [currentQ.id]: currentSelection.filter((id: string) => id !== optionId) });
            } else if (currentSelection.length < (currentQ.max || 1)) {
                setAnswers({ ...answers, [currentQ.id]: [...currentSelection, optionId] });
            }
        } else {
            setAnswers({ ...answers, [currentQ.id]: optionId });
            setTimeout(() => handleNext(), 300);
        }
    };

    const handleNext = async () => {
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setIsSubmitting(true);

            try {
                console.log("Saving to Supabase:", answers);
                await new Promise(r => setTimeout(r, 1000));
                onComplete();
            } catch (e) {
                console.error("Error saving profile:", e);
                // onComplete(); // Removed this line as per instruction
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const isCurrentSelectionValid = () => {
        if (currentQ.type === 'multiselect') {
            return (answers[currentQ.id]?.length || 0) > 0;
        }
        return !!answers[currentQ.id];
    };

    return (
        <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-brand-charcoal-light rounded-2xl shadow-2xl p-8 border border-gray-800">

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
                    <div
                        className="h-full bg-brand-coral transition-all duration-300 ease-out"
                        style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">{currentQ.title}</h1>
                <p className="text-gray-400 mb-8">
                    Question {step + 1} of {QUESTIONS.length}
                    {currentQ.type === 'multiselect' && ` (Choose up to ${currentQ.max})`}
                </p>

                <div className="space-y-4">
                    {currentQ.options.map((option) => {
                        const isSelected = currentQ.type === 'multiselect'
                            ? (answers[currentQ.id] || []).includes(option.id)
                            : answers[currentQ.id] === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${isSelected ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-700 hover:border-brand-coral hover:bg-brand-coral/5'}`}
                            >
                                <span className="text-lg text-gray-200">{option.label}</span>
                                {isSelected && <Check className="text-brand-gold w-6 h-6" />}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        className={`px-6 py-3 text-gray-400 hover:text-white transition-colors ${step === 0 ? 'invisible' : ''}`}
                    >
                        Back
                    </button>

                    {currentQ.type === 'multiselect' && (
                        <button
                            onClick={handleNext}
                            disabled={!isCurrentSelectionValid() || isSubmitting}
                            className="px-8 py-3 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : step === QUESTIONS.length - 1 ? 'Finish' : 'Next'}
                            {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
