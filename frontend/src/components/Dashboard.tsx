"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import {
    BookOpen,
    Lock,
    Trophy,
    MessageSquare,
    Users,
    Briefcase,
    Building2,
    Play,
    CheckCircle2,
    FileQuestion,
    TrendingUp,
    Flame,
    Layout,
    ChevronRight,
    LogOut,
    Menu,
    X,
    Home,
    Settings,
    MoreVertical
} from 'lucide-react';
import StudyLamp from './ui/StudyLamp';

interface EnrichedLesson {
    id: string;
    title: string;
    order_index: number;
    content_json: any;
    status: 'locked' | 'unlocked' | 'completed';
    bestScore?: number;
}

const UNIT_NAMES = [
    "¿Quién eres?",
    "La familia",
    "Comidas",
    "Ciudades",
    "Comunicaciones",
    "Así era"
];

const ICON_MAP: Record<string, any> = {
    "chat": MessageSquare,
    "family_restroom": Users,
    "work": Briefcase,
    "location_city": Building2,
    "book": BookOpen,
    "play": Play,
};

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const [lessons, setLessons] = useState<EnrichedLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [xp, setXp] = useState(0);
    const [currentDayOfWeek, setCurrentDayOfWeek] = useState<number | null>(null);

    const [activeUnitNumber, setActiveUnitNumber] = useState(1);
    const [studentName, setStudentName] = useState('Student');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            localStorage.clear();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        setMounted(true);

        // Load XP and Name from localStorage
        const savedXp = localStorage.getItem('linguaenlinea_xp') || '0';
        setXp(parseInt(savedXp, 10));

        const name = localStorage.getItem('student_name') || 'Student';
        setStudentName(name);

        const fetchLessons = async () => {
            // Priority to student_id from local storage
            const studentId = localStorage.getItem('student_id') || "11111111-1111-1111-1111-111111111111";

            try {
                // Setting current day of week on mount
                const now = new Date();
                setCurrentDayOfWeek((now.getDay() + 6) % 7);

                // 1. Fetch Dutch track lessons
                const { data: lessonsData, error: lessonsError } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('track', 'dutch')
                    .order('order_index');

                if (lessonsError || !lessonsData) {
                    console.error("Error fetching lessons:", lessonsError);
                    setLoading(false);
                    return;
                }

                // 2. Fetch Quiz Results
                const { data: quizData, error: quizError } = await supabase
                    .from('quiz_results')
                    .select('*')
                    .eq('student_id', studentId);

                const quizResults = quizData || [];

                // 3. Process Progression
                let isPreviousCompleted = true;

                const enrichedLessons: EnrichedLesson[] = lessonsData.map((lesson: any) => {
                    const lessonQuizzes = quizResults.filter(q => q.quiz_id === lesson.id);
                    const bestScore = lessonQuizzes.length > 0
                        ? Math.max(...lessonQuizzes.map(q => q.score || 0))
                        : 0;

                    const isCompleted = bestScore >= 70;
                    let status: 'locked' | 'unlocked' | 'completed' = 'locked';

                    if (isPreviousCompleted) {
                        status = isCompleted ? 'completed' : 'unlocked';
                    }

                    isPreviousCompleted = isCompleted;

                    return {
                        id: lesson.id,
                        title: lesson.title,
                        order_index: lesson.order_index,
                        content_json: lesson.content_json || {},
                        status,
                        bestScore
                    };
                });

                setLessons(enrichedLessons);

                // Auto-select the unit of the first unlocked lesson
                const firstUnlocked = enrichedLessons.find(l => l.status === 'unlocked');
                if (firstUnlocked) {
                    const unitObj = Math.ceil(firstUnlocked.order_index / 4);
                    setActiveUnitNumber(unitObj);
                }

            } catch (err) {
                console.error("Unexpected error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    if (!mounted) return null;

    const completedLessons = lessons.filter(l => l.status === 'completed');
    const completedCount = completedLessons.length;
    const totalCount = lessons.length || 24;

    const quizzesDone = completedCount;
    const averageScore = completedCount > 0
        ? Math.round(completedLessons.reduce((acc, curr) => acc + (curr.bestScore || 0), 0) / completedCount)
        : 0;

    // Group lessons by units
    const groupedUnits: { unitNumber: number; name: string; lessons: EnrichedLesson[], isLocked: boolean, progress: number }[] = [];
    for (let i = 0; i < 6; i++) {
        const unitLessons = lessons.filter(l => l.order_index >= (i * 4) + 1 && l.order_index <= (i + 1) * 4);
        if (unitLessons.length > 0) {
            const isLocked = unitLessons.every(l => l.status === 'locked');
            const unitCompleted = unitLessons.filter(l => l.status === 'completed').length;
            const progress = Math.round((unitCompleted / unitLessons.length) * 100);

            groupedUnits.push({
                unitNumber: i + 1,
                name: UNIT_NAMES[i],
                lessons: unitLessons,
                isLocked,
                progress
            });
        }
    }

    const activeUnit = groupedUnits.find(u => u.unitNumber === activeUnitNumber) || groupedUnits[0];
    const nextLesson = lessons.find(l => l.status === 'unlocked');

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background-dark text-slate-100 font-display relative">

            {/* MOBILE HEADER */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-background-dark/90 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Image
                        src="/images/logo-linguaenlinea-final.png"
                        alt="Linguaenlinea"
                        width={120}
                        height={30}
                        className="h-8 w-auto object-contain"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-accent-gold font-bold uppercase">{xp} XP</span>
                        <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-accent-gold" style={{ width: `${Math.min((xp / 500) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-white/10"
                    >
                        🧑‍🎓
                    </button>
                </div>
            </header>

            {/* 1. LEFT SIDEBAR (DRAWER ON MOBILE) */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />
            <aside className={`fixed md:relative inset-y-0 left-0 w-[240px] flex-shrink-0 border-r border-slate-800/50 bg-background-dark flex flex-col p-6 z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="mb-2">
                        <Image
                            src="/images/logo-linguaenlinea-final.png"
                            alt="Linguaenlinea"
                            width={160}
                            height={40}
                            className="h-12 w-auto object-contain"
                        />
                        <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">aprende aprendiendo</p>
                    </div>
                    <button className="md:hidden p-2 text-slate-500" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col gap-1 flex-grow overflow-y-auto custom-scrollbar">
                    <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mb-4 uppercase">curriculum</p>
                    {groupedUnits.map((unit) => {
                        const isActive = unit.unitNumber === activeUnitNumber;
                        return (
                            <button
                                key={unit.unitNumber}
                                disabled={unit.isLocked}
                                onClick={() => setActiveUnitNumber(unit.unitNumber)}
                                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 
                  ${isActive
                                        ? 'bg-primary/10 border-l-4 border-primary'
                                        : unit.isLocked
                                            ? 'text-slate-600 cursor-not-allowed opacity-50'
                                            : 'text-slate-400 hover:bg-slate-800/30'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {unit.isLocked ? (
                                        <Lock className="w-4 h-4" />
                                    ) : (
                                        <BookOpen className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                                    )}
                                    <span className={`text-sm font-semibold ${isActive ? 'text-slate-100' : ''}`}>
                                        Unit {unit.unitNumber}
                                    </span>
                                </div>
                                {!unit.isLocked && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400'}`}>
                                        {unit.progress}%
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-accent-gold/10 border border-accent-gold/20">
                        <Trophy className="text-accent-gold w-5 h-5" />
                        <div>
                            <p className="text-[10px] text-accent-gold font-bold uppercase tracking-wider">Totaal XP</p>
                            <p className="text-slate-100 font-bold">{xp.toLocaleString()} XP</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 mt-2 text-slate-500 hover:text-primary hover:bg-white/5 rounded-xl transition-all group"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-bold">Uitloggen</span>
                    </button>
                </div>
            </aside>

            {/* 2. CENTER CONTENT */}
            <main className="flex-grow overflow-y-auto custom-scrollbar bg-background-dark p-4 md:p-8 pb-32 md:pb-8">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-500 animate-pulse">
                            <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-primary animate-spin mb-4"></div>
                            <p>Cargando unidades...</p>
                        </div>
                    ) : (
                        <>
                            <header className="mb-10">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mb-4 md:mb-6 leading-tight">
                                    Unidad {activeUnit?.unitNumber} — {activeUnit?.name}
                                </h2>
                                <div className="bg-slate-800/30 rounded-full h-4 w-full relative overflow-hidden shadow-inner">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,107,107,0.5)]"
                                        style={{ width: `${activeUnit?.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-slate-400 text-sm">Unit voortgang</p>
                                    <p className="text-primary text-sm font-bold">{activeUnit?.progress}% voltooid</p>
                                </div>
                            </header>

                            <div className="flex flex-col gap-4">
                                {activeUnit?.lessons.map((lesson) => {
                                    const isCompleted = lesson.status === 'completed';
                                    const isUnlocked = lesson.status === 'unlocked';
                                    const isLocked = lesson.status === 'locked';

                                    // Map local icons based on index or title if needed
                                    const LessonIcon = isLocked ? Lock : (ICON_MAP[lesson.content_json?.icon] || MessageSquare);

                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`relative overflow-hidden transition-all duration-300 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-0
                        ${isCompleted
                                                    ? 'bg-[#121812] border-l-4 border-green-500 shadow-lg'
                                                    : isUnlocked
                                                        ? 'bg-card-dark border-l-4 border-[#FF6B6B] shadow-2xl hover:bg-[#1f1f3a]'
                                                        : 'bg-card-dark/40 border-l-4 border-slate-700/50 opacity-80'}`}
                                        >
                                            <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                                                <div className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl flex items-center justify-center
                          ${isCompleted
                                                        ? 'bg-green-500/10'
                                                        : isUnlocked
                                                            ? 'bg-primary/20'
                                                            : 'bg-slate-800'}`}>
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="text-green-500 w-6 h-6 md:w-8 md:h-8" />
                                                    ) : (
                                                        <LessonIcon className={`w-6 h-6 md:w-8 md:h-8 ${isUnlocked ? 'text-primary' : 'text-slate-500'}`} />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-500 text-[10px] md:text-xs font-bold">{lesson.order_index}.</span>
                                                        <h3 className={`text-base md:text-lg font-bold truncate ${isLocked ? 'text-slate-500' : 'text-slate-100'}`}>
                                                            {lesson.title}
                                                        </h3>
                                                    </div>
                                                    <p className={`text-xs md:text-sm mt-0.5 line-clamp-2 ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
                                                        {lesson.content_json?.can_do
                                                            ? lesson.content_json.can_do.length > 80
                                                                ? lesson.content_json.can_do.substring(0, 80) + "..."
                                                                : lesson.content_json.can_do
                                                            : "Oefen je Spaans in deze les."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                                {isLocked ? (
                                                    <button className="flex-grow sm:flex-grow-0 bg-slate-800 text-slate-500 font-bold py-2.5 px-6 rounded-lg text-sm cursor-not-allowed border border-slate-700">
                                                        Vergrendeld
                                                    </button>
                                                ) : isUnlocked ? (
                                                    <Link
                                                        href={`/lesson/${lesson.id}`}
                                                        className="flex-grow sm:flex-grow-0 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold py-2.5 px-6 rounded-lg text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF6B6B]/20 active:scale-95 text-center"
                                                    >
                                                        Start les <Play className="w-4 h-4 fill-current" />
                                                    </Link>
                                                ) : (
                                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                                        <span className="text-green-500 text-[10px] md:text-xs font-bold bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">
                                                            {lesson.bestScore}%
                                                        </span>
                                                        <Link
                                                            href={`/lesson/${lesson.id}`}
                                                            className="flex-grow sm:flex-grow-0 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-6 rounded-lg text-sm transition-colors border border-slate-600 text-center"
                                                        >
                                                            Herhaal
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* 3. RIGHT PANEL */}
            <aside className="w-[320px] flex-shrink-0 border-l border-slate-800/50 bg-background-dark p-8 flex flex-col hidden xl:flex overflow-y-auto custom-scrollbar">

                {/* 1. CIRCULAR PROGRESS WIDGET */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none"
                                stroke="#ffffff10" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.9" fill="none"
                                stroke="#FF6B6B" strokeWidth="3"
                                strokeDasharray={`${activeUnit?.progress || 0} 100`}
                                strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center 
      justify-center">
                            <span className="text-white font-black text-lg">
                                {activeUnit?.progress || 0}%
                            </span>
                            <span className="text-slate-400 text-[10px]">Unit {activeUnit?.unitNumber || 1}</span>
                        </div>
                    </div>
                    <span className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-wider">Unit voortgang</span>
                </div>

                {/* STUDY ASSISTANT (JORGE LAMP) */}
                <StudyLamp />

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative mb-4 group">
                        <div className="w-24 h-24 rounded-full bg-card-dark flex items-center justify-center border-2 border-slate-700 shadow-xl overflow-hidden transition-transform group-hover:scale-105">
                            <span className="text-5xl">🧑‍🎓</span>
                        </div>
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background-dark shadow-md"></div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-100">{studentName}</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mt-2 border border-primary/20">
                        Nederlands Track A1
                    </span>
                </div>

                <div className="mb-8 p-4 bg-slate-800/20 rounded-2xl border border-slate-800/50">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dagelijks Doel</p>
                        <p className="text-sm font-bold text-accent-gold">{xp} / 500 XP</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-full h-2 w-full shadow-inner overflow-hidden">
                        <div
                            className="h-full bg-accent-gold rounded-full transition-all duration-1000 shadow-[0_0_8px_#FFB800]"
                            style={{ width: `${Math.min((xp / 500) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2 text-center font-medium">Nog {(500 - xp) > 0 ? (500 - xp) : 0} XP tot je doel!</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-card-dark p-4 rounded-xl border border-slate-800/50 hover:border-primary/30 transition-colors">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Voltooid</p>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-primary w-4 h-4" />
                            <p className="text-xl font-extrabold text-slate-100">{completedCount}</p>
                        </div>
                    </div>
                    <div className="bg-card-dark p-4 rounded-xl border border-slate-800/50 hover:border-primary/30 transition-colors">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Quizzen</p>
                        <div className="flex items-center gap-2">
                            <FileQuestion className="text-primary w-4 h-4" />
                            <p className="text-xl font-extrabold text-slate-100">{quizzesDone}</p>
                        </div>
                    </div>
                    <div className="bg-card-dark p-4 rounded-xl border border-slate-800/50 hover:border-primary/30 transition-colors">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Score</p>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-primary w-4 h-4" />
                            <p className="text-xl font-extrabold text-slate-100">{averageScore}%</p>
                        </div>
                    </div>
                    <div className="bg-card-dark p-4 rounded-xl border border-slate-800/50 hover:border-primary/30 transition-colors">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Streak</p>
                        <div className="flex items-center gap-2">
                            <Flame className="text-primary w-4 h-4" />
                            <p className="text-xl font-extrabold text-slate-100">1</p>
                        </div>
                    </div>
                </div>

                {/* 2. WEEKLY STREAK WIDGET */}
                <div className="bg-white/5 rounded-2xl p-4 mt-0 mb-4 border border-white/5">
                    <p className="text-slate-400 text-xs font-bold uppercase 
tracking-wider mb-3">Deze week</p>
                    <div className="flex justify-between">
                        {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day, i) => (
                            <div key={day} className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-full flex items-center 
  justify-center text-xs font-bold transition-all duration-300
  ${currentDayOfWeek !== null && i < currentDayOfWeek
                                        ? 'bg-[#FF6B6B] text-white shadow-[0_0_10px_rgba(255,107,107,0.3)]'
                                        : currentDayOfWeek !== null && i === currentDayOfWeek
                                            ? 'bg-white/20 text-white border border-white/30 animate-pulse'
                                            : 'bg-white/10 text-slate-500'}`}>
                                    {currentDayOfWeek !== null && i < currentDayOfWeek ? '✓' : day[0]}
                                </div>
                                <span className="text-[10px] text-slate-500">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. LAST BADGE WIDGET */}
                <div className="bg-gradient-to-br from-[#FFB800]/20 to-[#FF6B6B]/20 
  border border-[#FFB800]/30 rounded-2xl p-4 mb-8">
                    <p className="text-slate-400 text-xs font-bold uppercase 
    tracking-wider mb-3">Laatste badge</p>
                    <div className="flex items-center gap-3">
                        <div className="text-4xl animate-bounce">🏆</div>
                        <div>
                            <p className="text-white font-bold text-sm">Eerste stap!</p>
                            <p className="text-slate-400 text-[10px] leading-tight mt-1">
                                Voltooi les 1 om je badge te verdienen
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto">
                    {nextLesson ? (
                        /* 4. NEXT LESSON CTA WIDGET */
                        <div className="bg-gradient-to-br from-[#FF6B6B] to-[#ff5252] 
  rounded-2xl p-4 mt-4 cursor-pointer hover:scale-[1.02] 
  transition-transform shadow-lg shadow-[#FF6B6B]/30"
                            onClick={() => router.push(`/lesson/${nextLesson.id}`)}>
                            <p className="text-white/70 text-[10px] font-bold uppercase 
    tracking-wider mb-1">Volgende les</p>
                            <p className="text-white font-black text-base mb-3">
                                {nextLesson?.title || 'Me llamo...'}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-white/80 text-xs">
                                    Les {nextLesson.order_index} · Unit {Math.ceil(nextLesson.order_index / 4)}
                                </span>
                                <div className="bg-white/20 rounded-full px-3 py-1">
                                    <span className="text-white text-xs font-bold">
                                        Start ▶
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button className="w-full bg-slate-800 text-slate-500 font-extrabold py-4 rounded-xl cursor-not-allowed">
                            Alles voltooid!
                        </button>
                    )}
                    <p className="text-center text-slate-500 text-xs mt-4">Klaar voor de volgende stap?</p>
                </div>
            </aside>

            {/* MOBILE BOTTOM NAVIGATION */}
            <nav className="fixed bottom-0 left-0 w-full md:hidden bg-background-dark/90 backdrop-blur-md border-t border-white/5 p-4 flex items-center justify-around z-40">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-primary' : 'text-slate-400'}`}
                >
                    <Home className={`w-6 h-6 ${pathname === '/dashboard' ? 'border-b-2 border-primary pb-1' : ''}`} />
                    <span className="text-[10px] font-bold uppercase text-primary">Home</span>
                </button>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex flex-col items-center gap-1 text-slate-400"
                >
                    <BookOpen className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Lessen</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <Trophy className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Rank</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Instel.</span>
                </button>
            </nav>

            {/* MOBILE PROFILE OVERLAY */}
            {isProfileOpen && (
                <div className="md:hidden fixed inset-0 z-[60] bg-background-dark p-6 flex flex-col items-center animate-in slide-in-from-right duration-300">
                    <button 
                        onClick={() => setIsProfileOpen(false)}
                        className="absolute top-6 right-6 p-2 text-slate-400"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="mt-12 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full bg-card-dark flex items-center justify-center border-2 border-slate-700 shadow-xl overflow-hidden mb-6">
                            <span className="text-6xl">🧑‍🎓</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-100">{studentName}</h3>
                        <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full mt-3 border border-primary/20">
                            Nederlands Track A1
                        </span>
                    </div>

                    <div className="w-full mt-10 grid grid-cols-2 gap-4">
                         <div className="bg-card-dark p-4 rounded-xl border border-slate-800/50">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">XP</p>
                            <p className="text-xl font-extrabold text-slate-100">{xp}</p>
                        </div>
                        <div className="bg-card-dark p-4 rounded-xl border border-slate-800/50">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Badge</p>
                            <p className="text-xl font-extrabold text-slate-100">🏆</p>
                        </div>
                    </div>

                    <div className="mt-auto w-full space-y-4">
                        <button className="w-full py-4 text-slate-300 font-bold border border-white/5 rounded-2xl flex items-center justify-center gap-3">
                            <Settings className="w-5 h-5" /> Account Instellingen
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl transition-all active:scale-95"
                        >
                            Uitloggen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
