"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Globe,
    Rocket,
    Zap,
    Trophy,
    Library,
    Volume2,
    Bot,
    ChevronRight,
    Facebook,
    CheckCircle2,
    Play,
    Users,
    BookOpen,
    Menu,
    X
} from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { useInView, animate } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { TypewriterTestimonial } from "@/components/ui/typewriter-testimonial";
import { useRef, useEffect } from "react";
import { SplineScene } from "@/components/ui/splite";
import { AudioWavePlayer } from "@/components/ui/audio-wave-player";
import Image from "next/image";

const StatItem = ({ end, label, icon: Icon, suffix = "" }: { end: number, label: string, icon: any, suffix?: string }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(nodeRef, { once: true });

    useEffect(() => {
        if (isInView && nodeRef.current) {
            const node = nodeRef.current;
            const controls = animate(0, end, {
                duration: 2,
                onUpdate(value) {
                    node.textContent = Math.round(value) + suffix;
                },
            });
            return () => controls.stop();
        }
    }, [isInView, end, suffix]);

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-4 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-4xl font-black text-[#FF6B6B]" ref={nodeRef}>0{suffix}</div>
            <div className="text-slate-400 font-bold text-sm uppercase tracking-wider text-center">{label}</div>
        </div>
    );
};

export default function LandingPage() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleStart = () => {
        router.push("/onboarding");
    };

    const scrollToHowItWorks = () => {
        const element = document.getElementById("how-it-works");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="bg-background-dark text-slate-100 antialiased font-display">
            {/* NAVIGATION */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 mt-4">
                        <Image
                            src="/images/logo-linguaenlinea-final.png"
                            alt="Linguaenlinea"
                            width={160}
                            height={54}
                            className="h-16 md:h-20 w-auto object-contain"
                        />
                        <span className="hidden sm:inline-block text-[8px] md:text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium text-center">aprende aprendiendo</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/over-ons" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Over ons</Link>
                        <Link href="/faq" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">FAQ</Link>
                        <Link href="/contact" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Contact</Link>
                        <button onClick={() => router.push('/login')} className="px-6 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">Inloggen</button>
                        <button
                            onClick={handleStart}
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Start gratis →
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-background-dark/95 border-b border-white/10 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
                        <Link href="/over-ons" className="text-lg font-bold text-slate-300">Over ons</Link>
                        <Link href="/faq" className="text-lg font-bold text-slate-300">FAQ</Link>
                        <Link href="/contact" className="text-lg font-bold text-slate-300">Contact</Link>
                        <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                            <button onClick={() => router.push('/login')} className="w-full py-4 text-slate-300 font-bold border border-white/10 rounded-xl">Inloggen</button>
                            <button
                                onClick={handleStart}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold"
                            >
                                Start nu gratis →
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-8 lg:px-16 text-center bg-mesh">
                <AnimatedShaderBackground />
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-10">
                    <span className="absolute top-1/4 left-10 text-primary text-4xl font-bold rotate-12">¡Hola!</span>
                    <span className="absolute top-1/3 right-20 text-primary text-3xl font-bold -rotate-6">Me llamo...</span>
                    <span className="absolute bottom-1/4 left-20 text-primary text-2xl font-bold -rotate-12">Buenos días</span>
                    <span className="absolute bottom-1/3 right-10 text-primary text-4xl font-bold rotate-6">¿Cómo te llamas?</span>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
                        🇳🇱 Speciaal voor Nederlandse scholieren
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white font-display">
                        Leer Spaans. <span className="text-primary">Gratis.</span><br className="hidden sm:block" /> In 10 minuten per dag.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
                        Echte audio-activiteiten + AI-uitleg op maat voor het Nederlandse schoolprogramma.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                        <button
                            onClick={handleStart}
                            className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-[0_0_40px_rgba(255,107,107,0.4)] transition-all hover:scale-105 active:scale-95"
                        >
                            Start nu gratis ▶
                        </button>
                        <button
                            onClick={scrollToHowItWorks}
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all font-display"
                        >
                            Bekijk hoe het werkt ↓
                        </button>
                    </div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 -mt-8 md:-mt-16 relative z-20">
                <div className="bg-card-dark border border-white/10 rounded-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 shadow-2xl">
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1">
                        <Library className="w-6 h-6 text-primary mb-1" />
                        <div>
                            <span className="text-white font-bold text-lg md:text-xl block">24 lessen</span>
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Content</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1">
                        <Zap className="w-6 h-6 text-gold mb-1" />
                        <div>
                            <span className="text-white font-bold text-lg md:text-xl block">XP systeem</span>
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Gamification</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1">
                        <Trophy className="w-6 h-6 text-primary mb-1" />
                        <div>
                            <span className="text-white font-bold text-lg md:text-xl block">Achievements</span>
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Progressie</span>
                        </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1">
                        <Users className="w-6 h-6 text-gold mb-1" />
                        <div>
                            <span className="text-white font-bold text-lg md:text-xl block">Community</span>
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Interactie</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-12 md:py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Het beste van twee werelden</h2>
                    <p className="text-slate-400 text-lg md:text-xl font-display">Echte stemmen. Slimme uitleg.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="relative bg-black/50 border border-white/10 rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                        {/* Cuban flag background */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                            <span className="text-[180px] md:text-[280px] opacity-15 blur-[2px] scale-150">🇨🇺</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6 w-full">
                            <div className="text-center">
                                <div className="text-4xl mb-3">🎵</div>
                                <h3 className="text-xl font-black text-white mb-2">
                                    Echte Cubaanse audio
                                </h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                    Geen robots, maar authentieke stemmen.
                                    Leer de taal horen zoals die echt gesproken wordt.
                                </p>
                            </div>

                            <AudioWavePlayer
                                src="/audio/U1 L1 A1.mp3"
                                label="Luister fragment — Les 1.1"
                            />
                        </div>
                    </div>

                    <div className="relative bg-black/50 border border-white/10 rounded-3xl overflow-hidden">
                        {/* Desktop: Spline robot */}
                        <div className="hidden md:block h-[300px] relative">
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-full"
                            />
                        </div>

                        {/* Mobile fallback */}
                        <div className="md:hidden flex items-center justify-center py-10 text-6xl">
                            🤖
                        </div>

                        <div className="p-6 md:p-8">
                            <a
                                href="https://notebooklm.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mb-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-4 py-2 transition-all group"
                            >
                                <svg width="20" height="20" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="192" height="192" rx="40" fill="#1A73E8" />
                                    <path d="M96 40C65.07 40 40 65.07 40 96s25.07 56 56 56 56-25.07 56-56S126.93 40 96 40zm0 96c-22.09 0-40-17.91-40-40s17.91-40 40-40 40 17.91 40 40-17.91 40-40 40z" fill="white" />
                                    <path d="M96 72c-13.25 0-24 10.75-24 24s10.75 24 24 24 24-10.75 24-24-10.75-24-24-24z" fill="white" />
                                </svg>
                                <div className="flex flex-col text-left">
                                    <span className="text-white text-xs font-bold leading-tight">
                                        NotebookLM
                                    </span>
                                    <span className="text-slate-400 text-[10px] leading-tight">
                                        by Google
                                    </span>
                                </div>
                                <svg className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                            <h3 className="text-xl font-black text-white mb-2">
                                AI-uitleg op maat
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Gepersonaliseerd op basis van SLO Kerndoelen 37-39 en NotebookLM technologie voor een dieper begrip.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white/5">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-12 text-center">Zo ziet een les eruit</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="bg-card-dark p-6 md:p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all flex flex-col items-center text-center">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                                <Image
                                    src="/images/icons/3d-book.png"
                                    alt="Zelfstudie"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-primary font-black text-2xl mb-2 font-display">Zelfstudie</div>
                            <h4 className="text-lg md:text-xl font-bold text-white mb-2 uppercase tracking-tight">Understand</h4>
                            <p className="text-slate-400 text-sm font-display">Focus op woordenschat, grammatica en je specifieke leerdoel voor deze sessie.</p>
                        </div>
                        <div className="bg-card-dark p-6 md:p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all flex flex-col items-center text-center">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                                <Image
                                    src="/images/icons/3d-mic.png"
                                    alt="Oefening"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-primary font-black text-2xl mb-2 font-display">Oefening</div>
                            <h4 className="text-lg md:text-xl font-bold text-white mb-2 uppercase tracking-tight">Explore + Practice</h4>
                            <p className="text-slate-400 text-sm font-display">Luister naar audio, vul woorden in en maak interactieve oefeningen die direct feedback geven.</p>
                        </div>
                        <div className="bg-card-dark p-6 md:p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all flex flex-col items-center text-center">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6">
                                <Image
                                    src="/images/icons/3d-community.png"
                                    alt="Community"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-primary font-black text-2xl mb-2 font-display">Community</div>
                            <h4 className="text-lg md:text-xl font-bold text-white mb-2 uppercase tracking-tight">Communicate</h4>
                            <p className="text-slate-400 text-sm font-display">Rond af met een quiz, verdien je achievements en deel je voortgang met de community.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LESSON PREVIEW ANIMATION */}
            <section className="bg-background-dark overflow-hidden">
                <ContainerScroll
                    titleComponent={
                        <div className="flex flex-col items-center mb-8">
                            <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-2">
                                Wat je leert in <span className="text-primary">Les 1.1</span>
                            </h2>
                            <div className="h-1.5 w-32 bg-primary rounded-full"></div>
                        </div>
                    }
                >
                    <div className="bg-card-dark h-full">
                        <div className="flex border-b border-white/10 bg-white/5">
                            <button className="px-6 py-4 text-primary font-bold border-b-2 border-primary">Understand</button>
                            <button className="px-6 py-4 text-slate-400 font-bold hover:text-white transition-colors">Explore</button>
                            <button className="px-6 py-4 text-slate-400 font-bold hover:text-white transition-colors">Practice</button>
                            <button className="px-6 py-4 text-slate-400 font-bold hover:text-white transition-colors">Communicate</button>
                        </div>
                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar h-[calc(100%-60px)]">
                            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-xl">
                                <h5 className="text-primary font-bold uppercase text-xs tracking-widest mb-1 flex items-center gap-2">
                                    <Rocket className="w-3 h-3" /> Leerdoel
                                </h5>
                                <p className="text-white font-medium">Je kunt jezelf voorstellen en anderen begroeten in het Spaans.</p>
                            </div>
                            <div>
                                <h5 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Vocabulary</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-white font-medium">¡Hola!</span>
                                        <span className="text-slate-500 text-xs text-right ml-2 leading-tight">Hallo</span>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-white font-medium leading-tight">Buenos días</span>
                                        <span className="text-slate-500 text-xs text-right ml-2 leading-tight">Morgen</span>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-white font-medium">Me llamo...</span>
                                        <span className="text-slate-500 text-xs text-right ml-2 leading-tight">Ik heet...</span>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
                                        <span className="text-white font-medium">¿Y tú?</span>
                                        <span className="text-slate-500 text-xs text-right ml-2 leading-tight">En jij?</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">SER Conjugation (Zijn)</h5>
                                <div className="overflow-hidden rounded-xl border border-white/5">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-slate-400 font-display">
                                            <tr><th className="p-3">Persoon</th><th className="p-3">Spaans</th><th className="p-3">Nederlands</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 font-display">
                                            <tr className="hover:bg-white/5 transition-colors"><td className="p-3 text-slate-400">Yo</td><td className="p-3 text-white font-bold">soy</td><td className="p-3 text-slate-400 italic">ik ben</td></tr>
                                            <tr className="hover:bg-white/5 transition-colors"><td className="p-3 text-slate-400">Tú</td><td className="p-3 text-white font-bold">eres</td><td className="p-3 text-slate-400 italic">jij bent</td></tr>
                                            <tr className="hover:bg-white/5 transition-colors"><td className="p-3 text-slate-400">Él / Ella</td><td className="p-3 text-white font-bold">es</td><td className="p-3 text-slate-400 italic">hij / zij is</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContainerScroll>
            </section>

            {/* BADGES & COMMUNITY */}
            <section className="relative py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
                <AnimatedShaderBackground />
                <div className="relative z-10 max-w-6xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-white mb-8 text-center">Verdien je badges. Deel je succes.</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="w-64 bg-card-dark p-6 rounded-2xl border border-white/10 rotate-3 transform hover:rotate-0 transition-all hover:scale-110 shadow-xl">
                            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-yellow-500 text-4xl">⭐</span>
                            </div>
                            <p className="text-center text-white font-bold mb-1">Student A</p>
                            <p className="text-center text-xs text-slate-500 font-bold mb-4">100% ⭐⭐⭐</p>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="bg-[#FFB800] h-full w-full"></div>
                            </div>
                            <p className="text-[10px] text-center mt-4 text-slate-600 font-bold uppercase tracking-widest">linguaenlinea.eu</p>
                        </div>
                        <div className="w-64 bg-card-dark p-6 rounded-2xl border border-white/10 -rotate-2 transform hover:rotate-0 transition-all hover:scale-110 shadow-xl">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary text-4xl">🏆</span>
                            </div>
                            <p className="text-center text-white font-bold mb-1">Student B</p>
                            <p className="text-center text-xs text-slate-500 font-bold mb-4">80% ⭐⭐</p>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-4/5"></div>
                            </div>
                            <p className="text-[10px] text-center mt-4 text-slate-600 font-bold uppercase tracking-widest">linguaenlinea.eu</p>
                        </div>
                        <div className="w-64 bg-card-dark p-6 rounded-2xl border border-white/10 rotate-1 transform hover:rotate-0 transition-all hover:scale-110 shadow-xl">
                            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-400 text-4xl">🎖️</span>
                            </div>
                            <p className="text-center text-white font-bold mb-1">Student C</p>
                            <p className="text-center text-xs text-slate-500 font-bold mb-4">90% ⭐⭐⭐</p>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-9/10"></div>
                            </div>
                            <p className="text-[10px] text-center mt-4 text-slate-600 font-bold uppercase tracking-widest">linguaenlinea.eu</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS COUNTER */}
            <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#1a1a2e] to-[#0D0D0D]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 md:index-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Groeiende <span className="text-primary">gemeenschap</span>
                        </h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full opacity-50"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatItem end={24} label="Leerlingen ingeschreven" icon={Users} suffix="+" />
                        <StatItem end={87} label="Lessen voltooid" icon={BookOpen} suffix="+" />
                        <StatItem end={12} label="Scholen & docenten" icon={GraduationCap} suffix="+" />
                        <StatItem end={3} label="Landen bereikt 🌎" icon={Globe} suffix="+" />
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-[#0D0D0D]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Wat zeggen onze <span className="text-[#FF6B6B]">leerlingen?</span>
                    </h2>
                    <p className="text-slate-400 mb-12 md:mb-16">Beweeg over een avatar om te lezen</p>
                    <TypewriterTestimonial testimonials={[
                        {
                            image: "/images/Finn_Leerling_headshot.png",
                            text: "Ik snap eindelijk hoe Spaans werkt. De lessen zijn kort en duidelijk, niet saai zoals op school.",
                            name: "Finn",
                            role: "Leerling, 14 jaar"
                        },
                        {
                            image: "/images/Noor__Leerling_headshot.png",
                            text: "Ik heb in 2 weken meer geleerd dan in een heel jaar met een boek. Super handig!",
                            name: "Noor",
                            role: "Leerling, 16 jaar"
                        },
                        {
                            image: "/images/Marieke__Moeder_headshot.png",
                            text: "Mijn dochter gebruikt het elke avond. Gratis, veilig en echt effectief. Aanrader!",
                            name: "Marieke",
                            role: "Moeder"
                        },
                        {
                            image: "/images/Sandra__Spaans_docent_headshot.png",
                            text: "Eindelijk een platform dat aansluit bij het Nederlandse schoolprogramma. Ik verwijs al mijn leerlingen door.",
                            name: "Sandra",
                            role: "Spaans docent"
                        }
                    ]} />
                </div>
            </section>

            {/* SLO INFO */}
            <section className="py-10 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Aansluitend op het Nederlandse schoolprogramma</h2>
                    <p className="text-slate-400 mb-8">Voor docenten en ouders</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary font-bold text-sm">SLO 38C</span>
                        <span className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary font-bold text-sm">SLO 39A</span>
                        <span className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary font-bold text-sm">SLO 39B</span>
                    </div>
                </div>
            </section>

            {/* FACEBOOK CTA */}
            <section className="py-12 px-4 md:px-8 lg:px-16">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card-dark border-l-8 border-[#1877F2] p-8 md:p-12 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
                            <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center text-white text-3xl shadow-lg shadow-[#1877F2]/30 flex-shrink-0">
                                <Facebook className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-white mb-2 font-display">Word lid van de Community</h3>
                                <p className="text-slate-400 font-display text-sm">Oefen samen met andere leerlingen op Facebook.</p>
                            </div>
                        </div>
                        <a href="https://www.facebook.com/linguaenlinea" target="_blank" className="w-full lg:w-auto text-center bg-[#1877F2] hover:bg-[#1877F2]/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                            Ga naar Facebook →
                        </a>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-12 px-4 md:px-8 lg:px-16">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-orange-500 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
                        <h2 className="text-3xl md:text-6xl font-black tracking-tight font-display">Klaar om te beginnen?</h2>
                        <p className="text-white/80 text-lg md:text-xl font-display">Gratis. Altijd. Voor iedereen.</p>
                        <button
                            onClick={handleStart}
                            className="w-full sm:w-auto bg-[#0D0D0D] text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current text-white" /> Start nu gratis
                        </button>
                    </div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 md:py-16 px-4 md:px-8 lg:px-16 border-t border-white/5 bg-background-dark">
                <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 md:gap-12">
                    <div className="flex flex-col items-center gap-2">
                        <Image
                            src="/images/logo-linguaenlinea-final.png"
                            alt="Linguaenlinea"
                            width={160}
                            height={54}
                            className="h-16 w-auto object-contain"
                        />
                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium text-center">aprende aprendiendo</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 font-bold text-sm font-display">
                        <Link className="hover:text-primary transition-colors" href="/over-ons">Over ons</Link>
                        <Link className="hover:text-primary transition-colors" href="/contact">Contact</Link>
                        <Link className="hover:text-primary transition-colors" href="/privacy">Privacy</Link>
                        <Link className="hover:text-primary transition-colors" href="/faq">FAQ</Link>
                        <a className="hover:text-primary transition-colors" href="https://www.facebook.com/linguaenlinea" target="_blank">Facebook</a>
                    </div>
                    <div className="text-slate-600 text-[10px] md:text-xs font-medium font-display text-center">
                        © 2026 Linguaenlinea. Alle rechten voorbehouden.
                    </div>
                </div>
            </footer>
        </div>
    );
}
