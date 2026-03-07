"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayCircle, ArrowLeft, Target, BookOpen, MessageCircle, PenTool, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface VocabularyItem {
    es: string;
    nl: string;
    ex: string;
}

interface DialogueLine {
    speaker: string;
    text: string;
}

interface LessonContent {
    unit: number;
    lesson_number: number;
    audio_file?: string;
    vocabulary_theme?: string;
    objectives?: string;
    grammar_focus?: string;
    can_do?: string;
    vocabulary_list?: VocabularyItem[];
    grammar_explanation?: string;
    dialogue?: DialogueLine[];
    practice?: string;
}

interface Lesson {
    id: string;
    title: string;
    description?: string;
    order_index: number;
    slo_alignment: string[];
    video_url?: string;
    content_json?: LessonContent;
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
                setLesson(data as Lesson);
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

    const content = lesson.content_json;

    return (
        <div className="min-h-screen bg-brand-charcoal text-gray-200 font-sans p-4 md:p-8 lg:max-w-6xl lg:mx-auto pb-32">
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
                {content?.can_do && (
                    <div className="bg-brand-charcoal-light p-4 rounded-xl border border-gray-800 mb-4 shadow-sm">
                        <strong className="text-brand-gold">Can-do Statement:</strong>
                        <p className="text-gray-300 mt-1">{content.can_do}</p>
                    </div>
                )}
            </div>

            {/* Main Video */}
            <div className="w-full aspect-video bg-black rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative mb-12 flex items-center justify-center">
                {lesson.video_url ? (
                    <video src={lesson.video_url} controls className="w-full h-full object-cover">
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-50">
                        <PlayCircle className="w-20 h-20 text-brand-coral mb-4" />
                        <p>Video processing...</p>
                    </div>
                )}
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
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-white mb-4">Understand the Context</h2>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-gray-800 bg-brand-charcoal">
                                    <h4 className="font-bold text-brand-gold mb-4 mt-2">Key Vocabulary</h4>
                                    {content?.vocabulary_list && content.vocabulary_list.length > 0 ? (
                                        <ul className="space-y-3">
                                            {content.vocabulary_list.map((v, i) => (
                                                <li key={i} className="text-sm">
                                                    <span className="text-white font-medium">{v.es}</span> <span className="text-gray-500">—</span> <span className="text-gray-400">{v.nl}</span>
                                                    <p className="text-gray-600 italic mt-1">{v.ex}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 italic">Vocabulary coming soon...</p>
                                    )}
                                </div>
                                <div className="p-4 rounded-xl border border-gray-800 bg-brand-charcoal">
                                    <h4 className="font-bold text-brand-coral mb-2">Grammar Focus</h4>
                                    {content?.grammar_explanation ? (
                                        <div className="text-gray-300 text-sm space-y-2 whitespace-pre-wrap">
                                            {content.grammar_explanation}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Grammar notes coming soon...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'explore' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-white mb-4">Dialogue Example</h2>
                            <div className="bg-brand-charcoal p-6 rounded-xl border border-gray-800 max-w-2xl">
                                {content?.dialogue && content.dialogue.length > 0 ? (
                                    <div className="space-y-4">
                                        {content.dialogue.map((line, i) => (
                                            <div key={i} className="flex gap-4">
                                                <span className="font-bold text-brand-gold min-w-[70px]">{line.speaker}:</span>
                                                <span className="text-gray-300">{line.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Dialogue coming soon...</p>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'practice' && (
                        <div className="animate-in fade-in duration-500">
                            <h2 className="text-2xl font-bold text-white mb-4">Guided Practice</h2>
                            <div className="bg-brand-charcoal p-6 rounded-xl border border-gray-800 max-w-2xl">
                                {content?.practice ? (
                                    <div className="text-gray-300 whitespace-pre-wrap">{content.practice}</div>
                                ) : (
                                    <p className="text-gray-500 italic">Exercises coming soon...</p>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'communicate' && (
                        <div className="animate-in fade-in duration-500 text-center py-12">
                            <MessageCircle className="w-12 h-12 text-brand-coral mx-auto mb-4 opacity-50" />
                            <h2 className="text-xl font-bold text-white mb-2">Communicate</h2>
                            <p className="text-gray-400 max-w-md mx-auto">Prepare to use the language. Activate your microphone or start a roleplay scenario.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Sticky Action Area */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-charcoal border-t border-gray-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 flex justify-center">
                <button className="max-w-md w-full bg-brand-coral hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    Take Unit Quiz
                </button>
            </div>
        </div>
    );
}
