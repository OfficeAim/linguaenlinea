"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { PlayCircle, Trophy, Target, BookOpen, Clock, Lock, CheckCircle2 } from 'lucide-react';

interface EnrichedLesson {
    id: string;
    title: string;
    order_index: number;
    slo_alignment: string[];
    status: 'locked' | 'current' | 'completed';
    bestScore?: number;
}

export default function Dashboard() {
    const [lessons, setLessons] = useState<EnrichedLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchLessons = async () => {
            // Dummy user ID since auth isn't wired up yet
            const dummyUserId = "11111111-1111-1111-1111-111111111111";

            try {
                // 1. Fetch Lessons
                const { data: lessonsData, error: lessonsError } = await supabase
                    .from('lessons')
                    .select('*')
                    .order('order_index');

                if (lessonsError || !lessonsData) {
                    console.error("Error fetching lessons:", lessonsError);
                    setLoading(false);
                    return;
                }

                // 2. Fetch Quiz Results for progression logic
                // Using lesson_id to match quiz_id for simplicity
                const { data: quizData, error: quizError } = await supabase
                    .from('quiz_results')
                    .select('*')
                    .eq('student_id', dummyUserId);

                const quizResults = quizData || [];

                // 3. Process Progression Logic
                // Lesson N+1 starts Unlocked ONLY if Lesson N is Completed (score >= 70)
                let isPreviousCompleted = true; // Lesson 1 is unlocked by default

                const enrichedLessons: EnrichedLesson[] = lessonsData.map((lesson: any) => {
                    const lessonQuizzes = quizResults.filter(q => q.quiz_id === lesson.id);
                    const bestScore = lessonQuizzes.length > 0
                        ? Math.max(...lessonQuizzes.map(q => q.score || 0))
                        : 0;

                    const isCompleted = bestScore >= 70;

                    let status: 'locked' | 'current' | 'completed' = 'locked';

                    if (isPreviousCompleted) {
                        status = isCompleted ? 'completed' : 'current';
                    }

                    // For the next iteration, the previous lesson is considered completed 
                    // only if the current lesson is completed.
                    isPreviousCompleted = isCompleted;

                    return {
                        id: lesson.id,
                        title: lesson.title,
                        order_index: lesson.order_index,
                        slo_alignment: lesson.slo_alignment || [],
                        status,
                        bestScore
                    };
                });

                setLessons(enrichedLessons);
            } catch (err) {
                console.error("Unexpected error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-brand-charcoal text-white p-6 md:p-12 font-sans">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gold shadow-lg shadow-brand-gold/20">
                        <img src="/avatar-dutch-latino.png" alt="Student Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-gold to-brand-coral">¡Hola, Estudiante!</h1>
                        <p className="text-gray-400">Dutch Track • A1 Level</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-brand-charcoal-light px-4 py-2 rounded-xl border border-gray-800 shadow-md">
                        <Trophy className="text-brand-gold w-5 h-5" />
                        <span className="font-bold">120 XP</span>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Learning Path */}
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Target className="text-brand-coral" />
                        Your Learning Path
                    </h2>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="p-6 bg-brand-charcoal-light rounded-2xl border border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-6 animate-pulse">
                                    <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-5 bg-gray-800 w-48 rounded"></div>
                                        <div className="h-4 bg-gray-800 w-32 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ) : lessons.length > 0 ? (
                            lessons.map(lesson => (
                                <div key={lesson.id} className={`p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all ${lesson.status === 'locked'
                                    ? 'bg-brand-charcoal-light opacity-60 border border-gray-800'
                                    : lesson.status === 'completed'
                                        ? 'bg-brand-charcoal border border-brand-gold/20 shadow-lg shadow-brand-gold/5'
                                        : 'bg-gradient-to-r from-brand-charcoal-light to-[#2a2a2a] border border-brand-coral/30 shadow-lg shadow-brand-coral/5 hover:border-brand-coral/50'
                                    }`}>
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-bold text-lg ${lesson.status === 'locked'
                                            ? 'bg-gray-800 text-gray-500'
                                            : lesson.status === 'completed'
                                                ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'
                                                : 'bg-brand-coral/20 text-brand-coral border border-brand-coral/30'
                                            }`}>
                                            {lesson.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : lesson.order_index}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${lesson.status === 'locked' ? 'text-gray-400' : 'text-gray-200'}`}>
                                                {lesson.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {lesson.slo_alignment?.map((slo) => (
                                                        <span key={slo} className="bg-brand-charcoal px-2 py-1 rounded text-xs border border-gray-700 text-gray-300">
                                                            {slo}
                                                        </span>
                                                    ))}
                                                </div>
                                                {lesson.status === 'completed' && lesson.bestScore !== undefined && (
                                                    <span className="text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-1 rounded">
                                                        Score: {lesson.bestScore}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {lesson.status === 'locked' ? (
                                        <button
                                            disabled
                                            className="px-6 py-3 shrink-0 rounded-xl font-bold flex items-center gap-2 transition-all bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                                        >
                                            <Lock className="w-5 h-5" /> Locked
                                        </button>
                                    ) : (
                                        <Link
                                            href={`/lesson/${lesson.id}`}
                                            className={`px-6 py-3 shrink-0 rounded-xl font-bold flex items-center gap-2 transition-all ${lesson.status === 'completed'
                                                ? 'bg-brand-charcoal-light hover:bg-gray-700 text-brand-gold border border-gray-700 hover:border-brand-gold/50 shadow-md'
                                                : 'bg-brand-coral hover:bg-[#ff6b3d] text-white shadow-md shadow-brand-coral/20'
                                                }`}
                                        >
                                            {lesson.status === 'completed' ? (
                                                <><Clock className="w-5 h-5" /> Review</>
                                            ) : (
                                                <><PlayCircle className="w-5 h-5" /> Start Lesson</>
                                            )}
                                        </Link>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 bg-brand-charcoal-light rounded-2xl border border-gray-800 text-center shadow-lg">
                                <Clock className="w-12 h-12 text-brand-gold mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-gray-200 mb-2">Preparing your custom path...</h3>
                                <p className="text-gray-400">We are tailoring the perfect Spanish lessons based on your interests.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Right Column: Profile & Interests */}
                <aside className="space-y-8">
                    <div className="bg-brand-charcoal-light p-6 rounded-2xl border border-gray-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-coral/10 rounded-bl-full -mr-8 -mt-8"></div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                            <BookOpen className="text-brand-coral w-5 h-5" />
                            Focus Areas
                        </h2>
                        <ul className="space-y-3 relative z-10">
                            <li className="flex items-center justify-between p-3 bg-brand-charcoal rounded-xl border border-gray-800 shadow-sm md:shadow-none hover:border-gray-700 transition-colors">
                                <span className="text-gray-300">🎵 Salsa & Reggaeton</span>
                                <span className="text-brand-gold text-xs font-bold px-2 py-1 bg-brand-gold/10 rounded">Active</span>
                            </li>
                            <li className="flex items-center justify-between p-3 bg-brand-charcoal rounded-xl border border-gray-800 shadow-sm md:shadow-none hover:border-gray-700 transition-colors">
                                <span className="text-gray-300">✈️ Travel in Mexico</span>
                                <span className="text-brand-gold text-xs font-bold px-2 py-1 bg-brand-gold/10 rounded">Active</span>
                            </li>
                        </ul>
                    </div>

                    {/* Logo element for branding */}
                    <div className="flex justify-center pt-8 opacity-40 hover:opacity-100 transition-opacity">
                        <img src="/logo-dark-final.png" alt="Linguaenlinea" className="max-w-[200px] object-contain mix-blend-screen" />
                    </div>
                </aside>

            </main>
        </div>
    );
}
