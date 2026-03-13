"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PlayCircle, ArrowLeft, Target, BookOpen, MessageCircle, PenTool, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import VocabularyMatchingGame from './VocabularyMatchingGame';
import InteractivePractice from './InteractivePractice';
import UnitQuiz from './UnitQuiz';
import AchievementCard from './AchievementCard';

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

    // Load XP and Student ID on mount
    useEffect(() => {
        setMounted(true);
        const xp = localStorage.getItem('xp_total');
        if (xp) setXpTotal(parseInt(xp, 10));

        let sId = localStorage.getItem('student_id');
        if (!sId) {
            sId = crypto.randomUUID();
            localStorage.setItem('student_id', sId);
        }
        setStudentId(sId);
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
                    if (typeof data.content_json === 'string') {
                        setContent(JSON.parse(data.content_json));
                    } else {
                        setContent(data.content_json);
                    }
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
        { speaker: "Estudiante", text: "Me _____ Ana Vega, soy una nueva _____.", blanks: ["llamo", "estudiante"], hints: ["naam werkwoord", "rol"] },
        { speaker: "Profesor", text: "¡Ah, _____ Ana, mucho _____!", blanks: ["bienvenida", "gusto"], hints: ["verwelkoming", "kennismaking"] },
        { speaker: "Estudiante", text: "_____, profesor.", blanks: ["Encantada"], hints: ["kennismaking antwoord"] },
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
        { id: 'understand', label: 'Understand', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'explore', label: 'Explore', icon: <Target className="w-4 h-4" /> },
        { id: 'practice', label: 'Practice', icon: <PenTool className="w-4 h-4" /> },
        { id: 'communicate', label: 'Communicate', icon: <MessageCircle className="w-4 h-4" /> }
    ] as const;

    // const content = lesson.content_json; // This line is now replaced by the content state

    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : '';
    };

    return (
        <div className="min-h-screen bg-brand-charcoal text-gray-200 font-sans relative">
            {isQuizOpen && (
                <UnitQuiz
                    lessonId={lesson.id}
                    lessonOrder={lesson.order_index}
                    lessonTitle={lesson.title}
                    studentId={studentId || ''}
                    onClose={() => setIsQuizOpen(false)}
                    onShowAchievement={(score: number) => {
                        setIsQuizOpen(false);
                        setActiveTab('communicate');
                        setJustPassedScore(score);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
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

                                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="p-6 rounded-xl border border-gray-800 bg-[#1a1a2e]">
                                        <h4 className="font-bold text-brand-gold mb-6 text-lg">Vocabulary Match</h4>
                                        {content?.vocabulary_game || content?.vocabulary_list ? (
                                            <VocabularyMatchingGame items={content.vocabulary_game || content.vocabulary_list || []} onComplete={() => setActiveTab('explore')} />
                                        ) : (
                                            <p className="text-gray-500 italic">Vocabulary coming soon...</p>
                                        )}
                                    </div>
                                    <div className="p-6 rounded-xl border border-gray-800 bg-[#1a1a2e]">
                                        <h4 className="font-bold text-brand-coral mb-6 text-lg">Grammar Focus</h4>

                                        <div className="space-y-6">
                                            {content?.grammar?.rules ? (
                                                content.grammar.rules.map((rule, idx) => (
                                                    <div key={idx} className="bg-[#2a2a3e] p-4 rounded-lg border border-gray-700">
                                                        <h5 className="font-bold text-white mb-3 text-sm">{rule.title}</h5>
                                                        <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{rule.content}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="space-y-6">
                                                    {/* Fallback to original Lesson 1.1 hardcoded grammar if no dynamic rule exists */}
                                                    <div className="bg-[#2a2a3e] p-4 rounded-lg border border-gray-700">
                                                        <h5 className="font-bold text-white mb-3 text-sm">Persoonlijke voornaamwoorden</h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="px-3 py-1 bg-[#1a1a2e] border border-gray-600 rounded-full text-sm text-gray-300">yo (ik)</span>
                                                            <span className="px-3 py-1 bg-[#1a1a2e] border border-gray-600 rounded-full text-sm text-gray-300">tú (jij)</span>
                                                            <span className="px-3 py-1 bg-[#1a1a2e] border border-gray-600 rounded-full text-sm text-gray-300">él/ella/usted (hij/zij/u)</span>
                                                        </div>
                                                    </div>
                                                </div>
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
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'practice' && (
                            <div className="animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-white mb-6">Guided Practice</h2>
                                <div className="max-w-3xl">
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
    );
}
