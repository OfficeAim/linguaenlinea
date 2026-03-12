"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

    const [showAccountCreation, setShowAccountCreation] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const currentQ = QUESTIONS[step];

    const calculateAge = (birthday: string) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const isMinor = dob ? calculateAge(dob) < 16 : false;

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
            setShowAccountCreation(true);
        }
    };

    const handleCreateAccount = async () => {
        if (!privacyAccepted) {
            setAuthError('Je moet akkoord gaan met de privacyverklaring.');
            return;
        }

        if (isMinor && !parentEmail) {
            setAuthError('Ouder of voogd e-mail is verplicht.');
            return;
        }

        setIsSubmitting(true);
        setAuthError(null);

        try {
            // 1. Supabase Sign Up
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: answers.name,
                    }
                }
            });

            console.log("SignUp response data:", authData);
            console.log("SignUp response error:", signUpError ? JSON.stringify(signUpError, Object.getOwnPropertyNames(signUpError), 2) : "None");

            if (signUpError) throw signUpError;

            if (authData.user) {
                // 2. Create Profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        l1: answers.l1,
                        track: answers.track,
                        interests: answers.interests,
                        language_preference: answers.l1,
                        onboarding_results: answers,
                        dob: dob,
                        parent_email: isMinor ? parentEmail : null,
                        parental_consent_status: isMinor ? 'pending_parental_consent' : 'approved',
                        role: 'student',
                        xp: 0,
                        energy: 5,
                        streak: 0
                    });

                if (profileError) throw profileError;

                // 3. Save to localStorage for migration/legacy support
                localStorage.setItem('student_id', authData.user.id);
                localStorage.setItem('student_name', answers.name);
                localStorage.setItem('student_track', answers.track);
                localStorage.setItem('student_level', answers.spanish_level);
                localStorage.setItem('onboarding_complete', 'true');

                // 4. Send parental consent email if minor
                if (isMinor) {
                    await fetch('/api/auth/parental-consent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: authData.user.id,
                            parentEmail: parentEmail,
                            studentName: answers.name
                        })
                    });
                }

                onComplete();
            }
        } catch (e: any) {
            console.error("Error creating account DIAGNOSTIC START");
            console.error("Type of error:", typeof e);
            console.error("Error instance of AuthError:", e instanceof Error);
            console.error("Error FULL (Stringify):", JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
            console.error("Raw Error:", e);
            console.error("Error message:", e?.message);
            console.error("Error status:", e?.status);
            console.error("Error details:", e?.error_description || e?.details);
            console.error("Error code:", e?.code);
            console.error("Error DIAGNOSTIC END");
            
            setAuthError(e.message || e?.error_description || e?.details || "Er is een fout opgetreden bij het aanmaken van je account.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleAuth = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) setAuthError(error.message);
    };

    const isCurrentSelectionValid = () => {
        if (currentQ.type === 'multiselect') {
            return (answers[currentQ.id]?.length || 0) > 0;
        }
        return !!answers[currentQ.id];
    };

    if (showAccountCreation) {
        return (
            <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center p-4 md:p-6 overflow-x-hidden">
                <div className="w-full max-w-2xl bg-brand-charcoal-light rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-800">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center leading-tight">Maak je account aan</h1>
                    <p className="text-gray-400 mb-6 md:mb-8 text-center text-sm md:text-base">Sla je voortgang op en begin met leren</p>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Email</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-900 text-white focus:border-brand-coral outline-none transition-all"
                                placeholder="naam@voorbeeld.nl"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Wachtwoord</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-900 text-white focus:border-brand-coral outline-none transition-all pr-12"
                                        placeholder="Min. 8 tekens"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Geboortedatum</label>
                                <input 
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full p-4 rounded-xl border-2 border-gray-700 bg-gray-900 text-white focus:border-brand-coral outline-none transition-all"
                                />
                            </div>
                        </div>

                        {isMinor && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-2 p-4 bg-brand-gold/5 rounded-xl border border-brand-gold/20"
                            >
                                <label className="text-sm font-medium text-brand-gold">Email van ouder of voogd (verplicht)</label>
                                <p className="text-xs text-gray-400 mb-2">Je bent jonger dan 16. We sturen een toestemmingsmail naar je ouder of voogd.</p>
                                <input 
                                    type="email"
                                    value={parentEmail}
                                    onChange={(e) => setParentEmail(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:border-brand-gold outline-none transition-all"
                                    placeholder="ouder@voorbeeld.nl"
                                />
                            </motion.div>
                        )}

                        <div className="flex items-start gap-3">
                            <input 
                                type="checkbox"
                                id="privacy"
                                checked={privacyAccepted}
                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-900 text-brand-coral focus:ring-brand-coral"
                            />
                            <label htmlFor="privacy" className="text-sm text-gray-400">
                                Ik ga akkoord met de <Link href="/privacy" className="text-brand-coral hover:underline">privacyverklaring</Link> ✓
                            </label>
                        </div>

                        {authError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {authError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <button 
                                onClick={handleCreateAccount}
                                disabled={isSubmitting || !email || !password || !dob}
                                className="w-full py-4 bg-brand-coral hover:bg-brand-coral-hover text-white rounded-xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? 'Bezig met maken...' : 'Account aanmaken & beginnen'}
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-brand-charcoal-light px-2 text-gray-500">of</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleGoogleAuth}
                                className="w-full py-4 bg-transparent border-2 border-gray-700 text-white rounded-xl font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Doorgaan met Google
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowAccountCreation(false)}
                        className="mt-6 text-gray-500 hover:text-white transition-colors w-full text-sm font-medium py-2"
                    >
                        ← Terug naar vragen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center p-3 md:p-6 overflow-x-hidden">
            <div className="w-full max-w-2xl bg-brand-charcoal-light rounded-2xl shadow-2xl p-5 md:p-10 border border-gray-800">

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 md:mb-10 overflow-hidden">
                    <div
                        className="h-full bg-brand-coral transition-all duration-300 ease-out"
                        style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{currentQ.title}</h1>
                <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">
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
                                    className={`w-full text-left p-3.5 md:p-5 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${isSelected ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-700 hover:border-brand-coral hover:bg-brand-coral/5'}`}
                                >
                                    <span className="text-base md:text-lg text-gray-200 leading-tight">{option.label}</span>
                                    {isSelected && <Check className="text-brand-gold w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ml-2" />}
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
