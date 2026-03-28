"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PlayCircle, ArrowLeft, Target, BookOpen, MessageCircle, PenTool, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import VocabularyMatchingGame from './VocabularyMatchingGame';
import VocabularyMatchGame from './VocabularyMatchGame';
import InteractivePractice from './InteractivePractice';
import UnitQuiz from './UnitQuiz';
import AchievementCard from './AchievementCard';
import HulpkaartPanel from './HulpkaartPanel';
import PhoneticIntro from '@/components/PhoneticIntro';

interface GrammarRule {
    title: string;
    content: string;
}

interface VocabularyItem {
    es: string;
    nl: string;
    ex: string;
}

interface DialogueLine {
    speaker: string;
    text: string;
    blanks?: string[];
    hints?: string[];
}

interface LessonContent {
    unit: number;
    lesson_number: number;
    audio_file?: string;
    vocabulary_theme?: string;
    objectives?: string;
    grammar_focus?: string;
    vocabulary_theme_nl?: string;
    can_do?: string;
    vocabulary_list?: VocabularyItem[];
    grammar_explanation?: string;
    grammar?: {
        rules: GrammarRule[];
    };
    dialogue?: {
        title: string;
        lines: { speaker: string; text: string; blanks?: string[]; hints?: string[] }[];
    } | DialogueLine[];
    vocabulary_game?: { spanish: string; dutch: string }[];
    dialogue_audio_url?: string;
    practice?: string | {
        exercises: {
            instruction: string;
            sentences: string[];
            correct_answers: string[];
            answer_key: string;
        }[];
    };
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

const getStudentId = () => {
    if (typeof window === 'undefined') return '00000000-0000-0000-0000-000000000000';
    let id = localStorage.getItem('student_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('student_id', id);
    }
    return id;
}

export default function LessonView({ id }: { id: string }) {
    const supabase = createClient();

    const [mounted, setMounted] = useState(false);
    const [studentId, setStudentId] = useState<string | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'understand' | 'explore' | 'practice' | 'communicate'>('understand');
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [content, setContent] = useState<LessonContent | null>(null); // Added content state

    // Quiz Progress State
    const [quizPassed, setQuizPassed] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [studentName, setStudentName] = useState('');
    const [studentAvatar, setStudentAvatar] = useState('');
    const [achievedDate, setAchievedDate] = useState('');
    const [justPassedScore, setJustPassedScore] = useState<number | null>(null);
    const [xpTotal, setXpTotal] = useState(0);
    const [showXpToast, setShowXpToast] = useState(false);
    const [hulpkaartCollapsed, setHulpkaartCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showPhoneticIntro, setShowPhoneticIntro] = useState(false);
    const [vocabularyMatchComplete, setVocabularyMatchComplete] = useState(false);

    // Load XP and Student ID on mount
    useEffect(() => {
        setMounted(true);
        const xp = localStorage.getItem('xp_total');
        if (xp) setXpTotal(parseInt(xp, 10));

        const syncStudentId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (localStorage.getItem('student_id') !== user.id) {
                    console.log("Syncing student_id in LessonView:", user.id);
                    localStorage.setItem('student_id', user.id);
                }
                setStudentId(user.id);
            } else {
                let sId = localStorage.getItem('student_id');
                if (!sId) {
                    sId = crypto.randomUUID();
                    localStorage.setItem('student_id', sId);
                }
                setStudentId(sId);
            }
        };

        syncStudentId();

        // Check for phonetic intro on client-only mount
        if (!localStorage.getItem('phonetic_intro_seen')) {
            setShowPhoneticIntro(true);
        }
    }, []);

    const handleShareFacebook = () => {
        const newXp = xpTotal + 50;
        setXpTotal(newXp);
        localStorage.setItem('xp_total', newXp.toString());
        setShowXpToast(true);
        setTimeout(() => setShowXpToast(false), 4000);
    };

    // Interactive Practice State
    const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string[]>>({});
    const [practiceChecked, setPracticeChecked] = useState<Record<number, boolean>>({});
    const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setHulpkaartCollapsed(mobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Interactive Dialogue State
    const [dialogueAnswers, setDialogueAnswers] = useState<Record<number, string>>({});
    const [dialogueChecked, setDialogueChecked] = useState(false);

    const checkDialogue = () => setDialogueChecked(true);
    const resetDialogue = () => {
        setDialogueAnswers({});
        setDialogueChecked(false);
    };

    useEffect(() => {
        if (!id) return;

        const fetchLesson = async () => {
            try {
                const { data, error } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                if (data) {
                    setLesson(data);
                    let lessonContent: LessonContent;
                    if (typeof data.content_json === 'string') {
                        lessonContent = JSON.parse(data.content_json);
                    } else {
                        lessonContent = data.content_json;
                    }
                    setContent(lessonContent);
                }
            } catch (err: any) {
                console.error('Error fetching lesson:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [id]);

    // Check if student passed the quiz
    useEffect(() => {
        if (!id) return;

        const checkQuizStatus = async () => {
            if (!studentId) return;
            try {
                // 1. Get the quiz ID for this lesson
                const { data: quizData } = await supabase
                    .from('quizzes')
                    .select('id')
                    .eq('lesson_id', id)
                    .single();

                if (quizData) {
                    // 2. Check if student passed it
                    const { data: resultData } = await supabase
                        .from('quiz_results')
                        .select('passed, score, created_at')
                        .eq('student_id', studentId)
                        .eq('quiz_id', quizData.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (resultData && resultData.passed) {
                        setQuizPassed(true);
                        setQuizScore(resultData.score);
                        const dateNum = new Date(resultData.created_at);
                        setAchievedDate(`${dateNum.getDate()}-${dateNum.getMonth() + 1}-${dateNum.getFullYear()}`);
                    }
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url')
                    .eq('id', studentId)
                    .maybeSingle();

                if (profile) {
                    setStudentName(profile.display_name || '');
                    setStudentAvatar(profile.avatar_url || '');
                }
            } catch (err) {
                console.error("Error checking quiz status:", err);
            }
        };

        checkQuizStatus();
    }, [id, isQuizOpen]);

    const interactiveDialogueLines: DialogueLine[] = [
        { speaker: "Estudiante", text: "¡_____ días!", blanks: ["Buenos"], hints: ["begroeting"] },
        { speaker: "Profesor", text: "¡_____ días!", blanks: ["Buenos"], hints: ["begroeting"] },
        { speaker: "Estudiante", text: "Me _____ Ana Vega, soy una nueva _____.", blanks: ["llamo", "estudiante"], hints: ["naam werkwoord + rol"] },
        { speaker: "Profesor", text: "¡Ah, _____ Ana, mucho _____!", blanks: ["bienvenida", "gusto"], hints: ["verwelkoming + kennismaking"] },
        { speaker: "Estudiante", text: "_____, profesor.", blanks: ["Igualmente"], hints: ["kennismaking antwoord"] },
    ];

    const getDialogueLines = (): DialogueLine[] => {
        if (!content?.dialogue) return interactiveDialogueLines;
        if (Array.isArray(content.dialogue)) return content.dialogue;
        return content.dialogue.lines;
    };

    const dialogueLines = getDialogueLines();
    const flatDialogueAnswers = dialogueLines.flatMap((l: DialogueLine) => ('blanks' in l ? l.blanks : []) || []);

    if (!mounted || loading) {
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
        { id: 'understand', label: 'Begrijpen', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'explore', label: 'Verkennen', icon: <Target className="w-4 h-4" /> },
        { id: 'practice', label: 'Oefenen', icon: <PenTool className="w-4 h-4" /> },
        { id: 'communicate', label: 'Communiceren', icon: <MessageCircle className="w-4 h-4" /> }
    ] as const;

    // const content = lesson.content_json; // This line is now replaced by the content state

    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : '';
    };

    return (
        <div className="min-h-screen bg-brand-charcoal text-gray-200 font-sans relative flex flex-col lg:flex-row items-start overflow-visible">
            <div className={`flex-1 w-full transition-all duration-500 ${!hulpkaartCollapsed && !isMobile ? 'lg:mr-0' : ''}`}>
            {isQuizOpen && (
                <UnitQuiz
                    lessonId={lesson.id}
                    lessonOrder={lesson.order_index}
                    lessonTitle={lesson.title}
                    studentId={studentId || ''}
                    onClose={(finished) => {
                        setIsQuizOpen(false);
                        if (finished) {
                            setActiveTab('communicate');
                            setTimeout(() => {
                                document.getElementById('communicate-tab')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }
                    }}
                    onShowAchievement={(score: number) => {
                        setIsQuizOpen(false);
                        setActiveTab('communicate');
                        setJustPassedScore(score);
                        setTimeout(() => {
                            document.getElementById('communicate-tab')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }}
                />
            )}
            <div className="px-4 md:px-8 lg:px-16 py-8 lg:max-w-7xl lg:mx-auto pb-32">
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
                    <h1 className="text-2xl md:text-5xl font-black text-white mb-4">{lesson.title}</h1>
                        {content?.can_do && (
                            <div className="border-l-4 border-primary bg-white/5 p-4 md:p-6 rounded-2xl mb-8 shadow-sm">
                                <div className="text-accent-gold text-xs font-black mb-2 uppercase tracking-widest">🎯 Leerdoel</div>
                                <p className="text-slate-300 text-base md:text-lg">
                                {(() => {
                                    // Remove ALL CAPS (words with 2+ uppercase letters)
                                    const noAllCaps = content.can_do.replace(/\b[A-Z]{2,}\b/g, (match) => match.toLowerCase());
                                    // Split by keywords to bold
                                    const parts = noAllCaps.split(/\b(kan|kunnen|begrijpen|gebruiken|voorstellen|stellen|beantwoorden)\b/i);
                                    return parts.map((part, i) => {
                                        if (/^(kan|kunnen|begrijpen|gebruiken|voorstellen|stellen|beantwoorden)$/i.test(part)) {
                                            return <strong key={i} className="font-bold text-white">{part.toLowerCase()}</strong>;
                                        }
                                        return <span key={i} className="font-normal">{part}</span>;
                                    });
                                })()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Main Video */}
                <div className="w-full aspect-video bg-black rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative mb-12 flex items-center justify-center">
                    {lesson.video_url ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(lesson.video_url)}`}
                            className="w-full aspect-video rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
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
                                id={`${tab.id}-tab`}
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
                                <h2 className="text-2xl font-bold text-white mb-4">Begrijp de Context</h2>

                                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="p-6 rounded-xl border border-gray-800 bg-[#1a1a2e]">
                                        <h4 className="font-bold text-brand-gold mb-6 text-lg">Woordenschat</h4>
                                        {content?.vocabulary_game || content?.vocabulary_list ? (
                                            <VocabularyMatchingGame items={content.vocabulary_game || content.vocabulary_list || []} onComplete={() => setActiveTab('explore')} />
                                        ) : (
                                            <p className="text-gray-500 italic">Vocabulary coming soon...</p>
                                        )}
                                    </div>
                                    <div className="p-6 rounded-xl border border-gray-800 bg-[#1a1a2e]">
                                        <h4 className="font-bold text-brand-coral mb-6 text-lg">Grammatica</h4>

                                        <div className="space-y-6">
                                            {/* Special premium formatting for Lesson 1.1 (Restored from history) */}
                                            {(content?.unit === 1 && content?.lesson_number === 1) ? (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                    {/* Block 1: Pronouns */}
                                                    <div className="bg-[#2a2a3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                                                        <h5 className="font-bold text-[#e63946] mb-4 text-base tracking-wide uppercase">Persoonlijke voornaamwoorden</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['yo (ik)', 'tú (jij)', 'él/ella/usted (hij/zij/u)', 'nosotros/-as (wij)', 'vosotros/-as (jullie)', 'ellos/ellas/ustedes (zij/u mv)'].map((p, i) => (
                                                                <span key={i} className="px-4 py-2 bg-[#1a1a2e] border border-[#f4a261] rounded-full text-sm text-[#f4a261] font-bold shadow-inner">
                                                                    {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Block 2: SER */}
                                                    <div className="bg-[#2a2a3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                                                        <h5 className="font-bold text-[#e63946] mb-4 text-base tracking-wide uppercase">SER (zijn)</h5>
                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-300">
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>yo</span> <span className="text-[#f4a261] font-black">soy</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>nosotros/-as</span> <span className="text-[#f4a261] font-black">somos</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>tú</span> <span className="text-[#f4a261] font-black">eres</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>vosotros/-as</span> <span className="text-[#f4a261] font-black">sois</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>él/ella/usted</span> <span className="text-[#f4a261] font-black">es</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>ellos/ellas/ustedes</span> <span className="text-[#f4a261] font-black">son</span></div>
                                                        </div>
                                                    </div>

                                                    {/* Block 3: LLAMARSE */}
                                                    <div className="bg-[#2a2a3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                                                        <h5 className="font-bold text-[#e63946] mb-4 text-base tracking-wide uppercase">LLAMARSE (heten)</h5>
                                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-300">
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>yo</span> <span className="text-[#f4a261] font-black">me llamo</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>nosotros/-as</span> <span className="text-[#f4a261] font-black">nos llamamos</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>tú</span> <span className="text-[#f4a261] font-black">te llamas</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>vosotros/-as</span> <span className="text-[#f4a261] font-black">os llamáis</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>él/ella/usted</span> <span className="text-[#f4a261] font-black">se llama</span></div>
                                                            <div className="flex justify-between border-b border-gray-600/30 pb-2"><span>ellos/ellas/ustedes</span> <span className="text-[#f4a261] font-black">se llaman</span></div>
                                                        </div>
                                                    </div>

                                                    {/* Block 4: Contrast */}
                                                    <div className="bg-[#2a2a3e] p-6 rounded-xl border border-gray-700 shadow-xl">
                                                        <h5 className="font-bold text-[#e63946] mb-4 text-base tracking-wide uppercase">Contrast Nederlands ↔ Spaans</h5>
                                                        <div className="flex gap-4">
                                                            <div className="flex-1 bg-[#1a1a2e] p-4 rounded-lg border border-gray-700 shadow-md">
                                                                <div className="text-xs uppercase text-gray-500 font-bold mb-3 tracking-widest border-b border-gray-800 pb-1">Nederlands</div>
                                                                <ul className="text-sm text-gray-400 space-y-3 italic">
                                                                    <li>ik heet Jeroen</li>
                                                                    <li>ik ben student</li>
                                                                    <li>ik ben 35 jaar</li>
                                                                </ul>
                                                            </div>
                                                            <div className="flex-1 bg-[#1a1a2e] p-4 rounded-lg border border-gray-700 shadow-md">
                                                                <div className="text-xs uppercase font-bold mb-3 text-[#e63946] tracking-widest border-b border-[#e63946]/20 pb-1">Español</div>
                                                                <ul className="text-sm space-y-3">
                                                                    <li className="text-[#f4a261] font-bold">me llamo Jeroen</li>
                                                                    <li className="text-[#f4a261] font-bold">soy estudiante</li>
                                                                    <li className="text-[#f4a261] font-bold">tengo 35 años</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : content?.grammar?.rules ? (
                                                content.grammar.rules.map((rule: any, idx: number) => {
                                                    const isCommaList = !rule.content.includes('|') && !rule.content.includes('→') && rule.content.includes(',');
                                                    const isArrowList = rule.content.includes('→');
                                                    
                                                    return (
                                                        <div key={idx} className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 shadow-lg mb-6 last:mb-0">
                                                            <h5 className="font-bold text-brand-coral mb-4 text-base flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-coral"></div>
                                                                {rule.title}
                                                            </h5>
                                                            
                                                            {isCommaList ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {rule.content.split(',').map((p: string, i: number) => (
                                                                        <span key={i} className="px-3 py-1.5 bg-brand-charcoal border border-gray-700 rounded-lg text-sm text-brand-gold font-medium hover:border-brand-coral/30 transition-colors">
                                                                            {p.trim()}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : isArrowList ? (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                                    {rule.content.split(/[|]|\.\s+/).map((part: string, i: number) => {
                                                                        if (!part.trim()) return null;
                                                                        const hasArrow = part.includes('→');
                                                                        return (
                                                                            <div key={i} className="p-3 bg-black/20 rounded-xl border border-white/5 flex justify-between items-center group hover:border-brand-coral/30 transition-colors shadow-inner">
                                                                                {hasArrow ? (
                                                                                    <>
                                                                                        <span className="text-gray-400 font-medium">{part.split('→')[0].trim()}</span>
                                                                                        <span className="text-accent-gold font-bold">{part.split('→')[1].trim()}</span>
                                                                                    </>
                                                                                ) : (
                                                                                    <span className="text-gray-300">
                                                                                        {part.split(/(\*.*?\*)/g).map((sub, j) => {
                                                                                            if (sub.startsWith('*') && sub.endsWith('*')) {
                                                                                                return <span key={j} className="text-accent-gold font-bold px-1">{sub.slice(1, -1)}</span>;
                                                                                            }
                                                                                            return sub;
                                                                                        })}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                                                    {rule.content.split('|').map((part: string, i: number) => (
                                                                        <div key={i} className={part.includes('→') ? 'py-2 border-b border-white/5 last:border-0 flex justify-between' : 'mb-2'}>
                                                                            {part.includes('→') ? (
                                                                                <>
                                                                                    <span className="text-gray-400">{part.split('→')[0].trim()}</span>
                                                                                    <span className="text-accent-gold font-bold">{part.split('→')[1].trim()}</span>
                                                                                </>
                                                                            ) : (
                                                                                part.split(/(\*.*?\*)/g).map((sub, j) => {
                                                                                    if (sub.startsWith('*') && sub.endsWith('*')) {
                                                                                        return <span key={j} className="text-accent-gold font-bold px-1">{sub.slice(1, -1)}</span>;
                                                                                    }
                                                                                    return sub;
                                                                                })
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-gray-500 italic p-4 text-center">Geen grammaticale regels gevonden voor deze les.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'explore' && (
                            <div className="animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-white mb-4">Dialogue Example</h2>
                                <div className="mb-4 p-3 bg-[#2a2a3e] rounded-lg border-l-4 border-[#FFB800]">
                                    <p className="text-gray-300 text-sm whitespace-pre-line">
                                        🎧 Luister naar het dialoog en vul de ontbrekende woorden in. De woorden staan in het audio — luister goed!
                                    </p>
                                </div>
                                <div className="bg-brand-charcoal p-6 rounded-xl border border-gray-800 max-w-2xl">
                                    {content?.dialogue_audio_url && (
                                        <div className="mb-6 p-4 bg-[#1a1a2e] rounded-lg">
                                            <p className="text-[#FFB800] text-sm font-semibold mb-3">
                                                🔊 Beluister het dialoog
                                            </p>
                                            <audio
                                                controls
                                                className="w-full"
                                                src={content.dialogue_audio_url}
                                            >
                                                Your browser does not support audio.
                                            </audio>
                                            <p className="text-gray-400 text-xs mt-2 italic">
                                                Tip: Luister meerdere keren en probeer daarna de zinnen hardop na te zeggen.
                                            </p>
                                        </div>
                                    )}
                                    <div className="space-y-6">
                                        {(() => {
                                            let globalBlankIdx = 0;
                                            return dialogueLines.map((line: DialogueLine, i: number) => {
                                                const hasBlanks = 'blanks' in line && line.blanks && line.blanks.length > 0;
                                                const parts = hasBlanks ? line.text.split('_____') : [line.text];

                                                return (
                                                    <div key={i} className="flex gap-4 items-start">
                                                        <span className={`font-bold min-w-[95px] mt-1 ${line.speaker === 'Estudiante' || line.speaker === 'Elena' ? 'text-brand-coral' : 'text-[#FFB800]'}`}>{line.speaker}:</span>
                                                        <div className="text-gray-300 flex-1 leading-loose">
                                                            {parts.map((part: string, pIdx: number) => {
                                                                if (pIdx === parts.length - 1) return <span key={pIdx}>{part}</span>;
                                                                if (!hasBlanks) return <span key={pIdx}>{part}</span>;

                                                                const blankId = globalBlankIdx++;
                                                                const correctAns = flatDialogueAnswers[blankId];
                                                                const isCorrect = dialogueAnswers[blankId]?.toLowerCase().trim() === correctAns.toLowerCase();
                                                                const isWrong = dialogueChecked && !isCorrect;

                                                                return (
                                                                    <span key={pIdx}>
                                                                        {part}
                                                                        <span className="inline-block mx-1">
                                                                            <input
                                                                                type="text"
                                                                                className={`w-28 px-2 py-1 bg-[#2a2a3e] border rounded text-white text-center transition-colors focus:outline-none focus:border-brand-coral ${isCorrect && dialogueChecked ? 'border-green-500 text-green-400' : isWrong ? 'border-red-500 text-red-400' : 'border-gray-600'}`}
                                                                                value={dialogueAnswers[blankId] || ''}
                                                                                onChange={(e) => {
                                                                                    setDialogueAnswers(prev => ({ ...prev, [blankId]: e.target.value }));
                                                                                    if (dialogueChecked) setDialogueChecked(false);
                                                                                }}
                                                                                disabled={dialogueChecked && isCorrect}
                                                                            />
                                                                        </span>
                                                                        {isWrong && (
                                                                            <span className="block mt-1 text-sm text-brand-gold">
                                                                                Antwoord: {correctAns}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                );
                                                            })}

                                                            {/* Render the hints if they exist for this line */}
                                                            {'hints' in line && line.hints && line.hints.length > 0 && (
                                                                <div className="text-gray-400 text-sm mt-1 mb-2 font-mono">
                                                                    💡 Hint: {line.hints.join(' + ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}

                                        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                                            <button
                                                onClick={checkDialogue}
                                                className="bg-brand-coral hover:bg-[#ff6b3d] text-white px-6 py-2 rounded font-bold transition-colors"
                                            >
                                                Controleren
                                            </button>

                                            {dialogueChecked && (
                                                <div className="flex items-center gap-4">
                                                    <span className="text-brand-gold font-bold">
                                                        {Object.keys(dialogueAnswers).filter(k => dialogueAnswers[Number(k)]?.toLowerCase().trim() === flatDialogueAnswers[Number(k)]?.toLowerCase()).length} / {flatDialogueAnswers.length} correct
                                                    </span>
                                                    <button
                                                        onClick={resetDialogue}
                                                        className="text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        Opnieuw
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Auto-flow Button for Explore -> Practice */}
                                        {dialogueChecked && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="mt-8 p-6 bg-gradient-to-br from-green-600/20 to-green-900/40 border border-green-500/50 rounded-2xl text-center shadow-lg"
                                            >
                                                <button
                                                    onClick={() => setActiveTab('practice')}
                                                    className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl font-black transition-all flex items-center gap-3 mx-auto shadow-xl hover:scale-105"
                                                >
                                                    Volgende stap → <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'practice' && (
                            <div className="animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-white mb-6">Guided Practice</h2>
                                <div className="max-w-4xl mx-auto space-y-12">
                                    {/* Vocabulary Match Game */}
                                    <div className="bg-[#1a1a2e] p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f4a261] to-transparent opacity-50" />
                                        <div className="text-center mb-8">
                                            <h3 className="text-xl md:text-2xl font-black text-white mb-2">Vocabulario: Saludos y Presentaciones</h3>
                                            <p className="text-white font-medium">Empareja las expresiones en español con su significado en neerlandés.</p>
                                            <p className="text-gray-400 italic text-sm">Verbind de Spaanse uitdrukkingen met hun Nederlandse betekenis.</p>
                                        </div>
                                        
                                        <VocabularyMatchGame 
                                            pairs={[
                                                { id: 1, es: "¡Hola!", nl: "Hallo! / Hoi!" },
                                                { id: 2, es: "¡Buenos días!", nl: "Goedemorgen!" },
                                                { id: 3, es: "¿Cómo te llamas?", nl: "Hoe heet je?" },
                                                { id: 4, es: "Me llamo...", nl: "Ik heet..." },
                                                { id: 5, es: "Mucho gusto", nl: "Aangenaam" },
                                                { id: 6, es: "¿De dónde eres?", nl: "Waar kom je vandaan?" }
                                            ]}
                                            onComplete={() => setVocabularyMatchComplete(true)}
                                        />
                                    </div>

                                    {/* Existing Practice Content */}
                                    <div className="max-w-3xl mx-auto">
                                        {typeof content?.practice === 'object' && content.practice.exercises ? (
                                            <InteractivePractice
                                                exercises={content.practice.exercises}
                                                answers={practiceAnswers}
                                                setAnswers={setPracticeAnswers}
                                                checked={practiceChecked}
                                                setChecked={setPracticeChecked}
                                                showKey={showAnswers}
                                                setShowKey={setShowAnswers}
                                            />
                                        ) : content?.practice ? (
                                            <div className="bg-brand-charcoal p-6 rounded-xl border border-gray-800 text-gray-300 whitespace-pre-wrap">
                                                {content.practice as string}
                                            </div>
                                        ) : (
                                            <div className="bg-brand-charcoal p-6 rounded-xl border border-gray-800">
                                                <p className="text-gray-500 italic">Exercises coming soon...</p>
                                            </div>
                                        )}

                                        {(practiceChecked[0] || vocabularyMatchComplete) && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="mt-8 p-6 bg-gradient-to-br from-green-600/20 to-green-900/40 border border-green-500/50 rounded-2xl text-center shadow-lg"
                                            >
                                                <button
                                                    onClick={() => setActiveTab('communicate')}
                                                    className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl font-black transition-all flex items-center gap-3 mx-auto shadow-xl hover:scale-105"
                                                >
                                                    Volgende stap → <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'communicate' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Práctica comunicativa</h2>
                                    {xpTotal > 0 && (
                                        <div className="text-[#FFB800] text-sm font-bold bg-[#FFB800]/10 px-3 py-1 rounded-full">
                                            ⚡ Jouw XP: {xpTotal}
                                        </div>
                                    )}
                                </div>

                                {showXpToast && (
                                    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right fade-in duration-300">
                                        <div className="bg-[#4CAF50] text-white px-6 py-4 rounded-xl shadow-2xl border border-[#4CAF50]/50">
                                            <p className="font-bold">+50 XP verdiend! 🎉</p>
                                            <p className="text-sm">Je hebt je resultaat gedeeld!</p>
                                        </div>
                                    </div>
                                )}

                                {(justPassedScore !== null || quizPassed) ? (
                                    <AchievementCard
                                        studentName={studentName}
                                        studentAvatar={studentAvatar}
                                        score={justPassedScore !== null ? justPassedScore : quizScore}
                                        lessonTitle={lesson?.title || ''}
                                        lessonNumber={`${content?.unit || 1}.${content?.lesson_number || 1}`}
                                        achievedDate={achievedDate || (mounted ? new Date().toLocaleDateString('nl-NL') : '')}
                                        facebookShareUrl={`https://www.facebook.com/sharer/sharer.php?u=https://www.linguaenlinea.eu&quote=${encodeURIComponent(`🏆 Ik heb zojuist Les 1.1 behaald op @Linguaenlinea met ${justPassedScore !== null ? justPassedScore : quizScore}%!\n\nMe llamo [naam], soy de Holanda y aprendo español 🇪🇸\n\nLeer ook gratis Spaans 👉\nhttps://linguaenlinea.eu\n\n#linguaenlinea #learnspanish #español #gratis #nederlandsspaans #a1español`)}`}
                                        onShareFacebook={handleShareFacebook}
                                    />
                                ) : (
                                    <div className="mb-6 p-4 bg-[#1a1a2e] rounded-xl border border-gray-700 text-center">
                                        <p className="text-gray-400">
                                            🔒 Voltooi de les quiz om je milestone te ontgrendelen
                                        </p>
                                        <button
                                            onClick={() => setIsQuizOpen(true)}
                                            className="mt-3 text-[#FF6B6B] text-sm underline hover:text-white"
                                        >
                                            → Neem de les quiz
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Facebook Community */}
                                    <div className="p-4 bg-[#1a1a2e] rounded-xl border border-[#1877F2]/30">
                                        <h4 className="text-[#1877F2] font-semibold mb-2">
                                            📘 Linguaenlinea Community
                                        </h4>
                                        <p className="text-gray-300 text-sm mb-3">
                                            Oefen je Spaans met andere studenten. Stel jezelf voor in het Spaans in de groep!
                                        </p>
                                        <a
                                            href="https://www.facebook.com/linguaenlinea"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[#1877F2] text-sm hover:underline"
                                        >
                                            Ga naar de Facebook groep →
                                        </a>
                                    </div>

                                    {/* Speaking Challenge */}
                                    <div className="p-4 bg-[#1a1a2e] rounded-xl border border-[#FF6B6B]/30">
                                        <h4 className="text-[#FF6B6B] font-semibold mb-2">
                                            🎤 Spreekuitdaging
                                        </h4>
                                        <p className="text-gray-300 text-sm mb-3">
                                            Oefen hardop. Zeg deze zin in het Spaans:
                                        </p>
                                        <div className="bg-[#2a2a3e] p-3 rounded-lg text-center mb-3">
                                            <p className="text-white font-semibold italic">
                                                &quot;Me llamo [jouw naam], soy de [jouw stad] y aprendo español.&quot;
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                Zeg het 3 keer hardop voor de beste resultaten
                                            </p>
                                        </div>
                                        <p className="text-gray-400 text-xs">
                                            💡 Tip: Neem jezelf op met je telefoon en luister terug. Zo hoor je je eigen uitspraak!
                                        </p>
                                    </div>

                                    {/* Auto-flow Button for Communicate -> Quiz */}
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-8 p-6 bg-gradient-to-br from-brand-coral/20 to-brand-coral/40 border border-brand-coral/50 rounded-2xl text-center shadow-lg"
                                    >
                                        <button
                                            onClick={() => setIsQuizOpen(true)}
                                            className="bg-brand-coral text-white hover:bg-[#ff6b3d] px-8 py-3 rounded-xl font-black transition-all flex items-center gap-3 mx-auto shadow-xl hover:scale-105"
                                        >
                                            Naar de Quiz → <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </motion.div>

                                    {/* Next Lesson Preview */}
                                    <div className="p-4 bg-[#1a1a2e] rounded-xl border border-[#FF6B6B]/30">
                                        <h4 className="text-[#FFB800] font-semibold mb-2">
                                            ➡️ Klaar voor Les 1.2?
                                        </h4>
                                        <p className="text-gray-300 text-sm mb-3">
                                            In Les 1.2 leer je over &quot;El aula&quot; — voorwerpen in de klas benoemen.
                                        </p>
                                        <button
                                            onClick={() => window.history.back()}
                                            className="text-[#FF6B6B] text-sm hover:underline"
                                        >
                                            ← Terug naar Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Sticky Action Area */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-charcoal border-t border-gray-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 flex justify-center">
                    <button
                        onClick={() => setIsQuizOpen(true)}
                        className="max-w-md w-full bg-brand-coral hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-3"
                    >
                        <CheckCircle className="w-6 h-6" />
                        Neem de les quiz
                    </button>
                </div>
            </div>
            </div>
            
            {(content as any)?.hulpkaart && (
                <HulpkaartPanel 
                    data={(content as any).hulpkaart}
                    isCollapsed={hulpkaartCollapsed}
                    onToggle={() => setHulpkaartCollapsed(!hulpkaartCollapsed)}
                    isMobile={isMobile}
                />
            )}
            {showPhoneticIntro && lesson.id === '5af4ce5e-3dc2-4056-8a8a-29e089869c21' && (
                <PhoneticIntro 
                    onClose={() => {
                        localStorage.setItem('phonetic_intro_seen', 'true');
                        setShowPhoneticIntro(false);
                    }} 
                />
            )}
        </div>
    );
}
