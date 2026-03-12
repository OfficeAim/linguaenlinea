"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Check } from 'lucide-react';

const QUESTIONS = [
    {
        id: "name",
        title: "Wat is je naam?",
        type: "text",
        placeholder: "Vul je naam in..."
    },
    {
        id: "track",
        title: "Wat brengt je bij Linguaenlinea?",
        options: [
            { id: "dutch", label: "🎓 Ik wil slagen voor mijn examens (Dutch Track)" },
            { id: "open", label: "🌍 Ik wil Spaans leren op mijn eigen manier (Open Track)" }
        ]
    },
    {
        id: "l1",
        title: "Wat is je moedertaal?",
        options: [
            { id: "nl-nl", label: "🇳🇱 Nederlands (Nederland)" },
            { id: "nl-be", label: "🇧🇪 Nederlands (België)" },
            { id: "en-us", label: "🇺🇸 English (USA)" },
            { id: "en-gb", label: "🇬🇧 English (UK)" },
            { id: "en-ca", label: "🇨🇦 English (Canada)" },
            { id: "de", label: "🇩🇪 Deutsch" },
            { id: "fr", label: "🇫🇷 Français" },
            { id: "ar", label: "🇲🇦 Arabic" },
            { id: "tr", label: "🇹🇷 Turkish" },
            { id: "sr", label: "🇸🇷 Sranan / Papiamento" },
            { id: "other", label: "🌐 Anders" }
        ]
    },
    {
        id: "spanish_level",
        title: "Hoeveel Spaans ken je al?",
        options: [
            { id: "zero", label: "Nul — Ik heb nog nooit Spaans geleerd" },
            { id: "beginner", label: "Beginner — Ik ken een paar woorden" },
            { id: "elementary", label: "Basis — Ik kan mezelf voorstellen" },
            { id: "pre-intermediate", label: "Gemiddeld — Ik kan simpele gesprekken voeren" }
        ]
    },
    {
        id: "interests",
        title: "Welke onderwerpen interesseren je? (Kies er maximaal 3)",
        type: "multiselect",
        max: 3,
        options: [
            { id: "music", label: "🎵 Muziek (salsa, reggaeton)" },
            { id: "sports", label: "⚽ Sport (voetbal, atletiek)" },
            { id: "food", label: "🍕 Eten & Koken" },
            { id: "travel", label: "✈️ Reizen & Avontuur" },
            { id: "gaming", label: "🎮 Gamen & Technologie" },
            { id: "film", label: "🎬 Film & Series" },
            { id: "history", label: "📚 Geschiedenis & Cultuur" },
            { id: "business", label: "💼 Zakelijk & Werk" },
            { id: "art", label: "🎨 Kunst & Design" }
        ]
    },
    {
        id: "daily_minutes",
        title: "Hoeveel tijd kun je per dag besteden?",
        options: [
            { id: "10", label: "⚡ 10 minuten (micro-learning)" },
            { id: "30", label: "📖 30 minuten (standaard)" },
            { id: "60", label: "🚀 60 minuten (intensief)" }
        ]
    },
    {
        id: "learning_style",
        title: "Hoe leer je het best?",
        options: [
            { id: "listening", label: "👂 Luisteren en herhalen" },
            { id: "reading", label: "📝 Lezen en schrijven" },
            { id: "speaking", label: "🗣️ Spreken en conversatie" },
            { id: "games", label: "🎯 Games en uitdagings" }
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
                // Save to localStorage as requested
                const studentId = crypto.randomUUID();
                const studentName = answers.name || "Student"; // fallback if name not yet captured
                const studentTrack = answers.track || "dutch";

                localStorage.setItem('student_id', studentId);
                localStorage.setItem('student_name', studentName);
                localStorage.setItem('student_track', studentTrack);
                localStorage.setItem('student_level', answers.spanish_level || "zero");
                localStorage.setItem('onboarding_complete', 'true');
                localStorage.setItem('linguaenlinea_xp', '0');

                console.log("Saving to Supabase & localStorage:", answers);
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
                    Vraag {step + 1} van {QUESTIONS.length}
                    {currentQ.type === 'multiselect' && ` (Kies er maximaal ${currentQ.max})`}
                </p>

                <div className="space-y-4">
                    {currentQ.type === 'text' ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder={currentQ.placeholder}
                                className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-900 text-white focus:border-brand-coral outline-none transition-all"
                                value={answers[currentQ.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && isCurrentSelectionValid() && handleNext()}
                                autoFocus
                            />
                        </div>
                    ) : (
                        currentQ.options?.map((option) => {
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
                        })
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        className={`px-6 py-3 text-gray-400 hover:text-white transition-colors ${step === 0 ? 'invisible' : ''}`}
                    >
                        Vorige
                    </button>

                    {(currentQ.type === 'multiselect' || currentQ.type === 'text' || step === QUESTIONS.length - 1) && (
                        <button
                            onClick={handleNext}
                            disabled={!isCurrentSelectionValid() || isSubmitting}
                            className="px-8 py-3 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Opslaan...' : step === QUESTIONS.length - 1 ? 'Afronden' : 'Volgende'}
                            {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
