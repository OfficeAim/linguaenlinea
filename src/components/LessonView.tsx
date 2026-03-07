"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayCircle, ArrowLeft, Target, BookOpen, MessageCircle, PenTool, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Lesson {
    id: string;
    title: string;
    description?: string;
    order_index: number;
    slo_alignment: string[];
}

export default function LessonView({ id }: { id: string }) {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'understand' | 'explore' | 'practice' | 'communicate'>('understand');

    useEffect(() => {
        const fetchLesson = async () => {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setLesson(data);
            }
            setLoading(false);
        };

        fetchLesson();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-charcoal text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-coral"></div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="min-h-screen bg-brand-charcoal text-white flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
                <Link href="/" className="text-brand-coral hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    const tabs = [
        { id: 'understand', label: 'Understand', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'explore', label: 'Explore', icon: <Target className="w-4 h-4" /> },
        { id: 'practice', label: 'Practice', icon: <PenTool className="w-4 h-4" /> },
        { id: 'communicate', label: 'Communicate', icon: <MessageCircle className="w-4 h-4" /> }
    ] as const;

    return (
        <div className="min-h-screen bg-brand-charcoal text-gray-200 font-sans p-4 md:p-8 lg:max-w-6xl lg:mx-auto">
            {/* Navigation Header */}
            <header className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="flex gap-2">
                    {lesson.slo_alignment?.map((slo) => (
                        <span key={slo} className="bg-brand-charcoal-light px-3 py-1 rounded-full text-xs border border-gray-700 font-medium">
                            {slo}
                        </span>
                    ))}
                </div>
            </header>

            {/* Lesson Title Room */}
            <div className="mb-8">
                <div className="text-brand-coral font-bold tracking-widest text-sm mb-2 uppercase">Lesson {lesson.order_index}</div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{lesson.title}</h1>
            </div>

            {/* Main Video Placeholder */}
            <div className="w-full aspect-video bg-black rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative mb-12 group flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <PlayCircle className="w-20 h-20 text-white/50 group-hover:text-brand-coral transition-colors z-10 cursor-pointer drop-shadow-lg" />
                <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="text-xl font-bold">Interactive Video Lesson</h3>
                    <p className="text-gray-400">00:00 / 08:45</p>
                </div>
            </div>

            {/* Pedagogical Tabs */}
            <div className="bg-brand-charcoal-light rounded-3xl border border-gray-800 overflow-hidden shadow-xl mb-12">
                <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 px-4 font-bold transition-colors ${activeTab === tab.id
                                    ? 'bg-brand-charcoal text-brand-coral border-b-2 border-brand-coral'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-8 min-h-[300px]">
                    {activeTab === 'understand' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold text-white mb-4">Understand the Context</h2>
                            <p className="text-gray-400 leading-relaxed max-w-3xl">
                                Watch the video above to immerse yourself in the authentic context of Latin America.
                                Pay close attention to how native speakers express themselves in real-life situations.
                                Read the key vocabulary and grammar structures below before diving deeper.
                            </p>
                            {/* Placeholder for content */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-gray-800 bg-brand-charcoal">
                                    <h4 className="font-bold text-brand-gold mb-2">Key Vocabulary</h4>
                                    <ul className="space-y-2 text-gray-400">
                                        <li>• La familia (The family)</li>
                                        <li>• El hermano / La hermana (Brother / Sister)</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-800 bg-brand-charcoal">
                                    <h4 className="font-bold text-brand-coral mb-2">Grammar Focus</h4>
                                    <ul className="space-y-2 text-gray-400">
                                        <li>• Ser vs. Estar context</li>
                                        <li>• Possessive adjectives</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'explore' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
                            <Target className="w-12 h-12 text-brand-gold mx-auto mb-4 opacity-50" />
                            <h2 className="text-xl font-bold text-white mb-2">Explore the Culture</h2>
                            <p className="text-gray-400 max-w-md mx-auto">Discover cultural nuances, tips, and contrastive analyses tailored to your profile.</p>
                        </div>
                    )}
                    {activeTab === 'practice' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
                            <PenTool className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
                            <h2 className="text-xl font-bold text-white mb-2">Guided Practice</h2>
                            <p className="text-gray-400 max-w-md mx-auto">Engage with specific task-based exercises corresponding to the SLO 2026 standards.</p>
                        </div>
                    )}
                    {activeTab === 'communicate' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-12">
                            <MessageCircle className="w-12 h-12 text-brand-coral mx-auto mb-4 opacity-50" />
                            <h2 className="text-xl font-bold text-white mb-2">Communicate</h2>
                            <p className="text-gray-400 max-w-md mx-auto">Prepare to use the language. Activate your microphone or start a roleplay scenario.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Sticky Action Area */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-brand-charcoal via-brand-charcoal to-transparent md:static md:bg-transparent md:p-0 flex justify-center pb-8 border-t border-gray-800/50 md:border-none pt-24 md:pt-0">
                <button className="w-full md:w-auto bg-brand-coral hover:bg-[#ff6b3d] text-white px-12 py-4 rounded-full font-bold text-xl transition-all shadow-[0_0_30px_rgba(255,127,80,0.3)] hover:shadow-[0_0_40px_rgba(255,127,80,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    Take Unit Quiz
                </button>
            </div>
        </div>
    );
}
