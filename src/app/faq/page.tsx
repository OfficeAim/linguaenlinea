"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Plus, Minus, Users, GraduationCap, School } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQCategoryProps {
    title: string;
    icon: React.ReactNode;
    items: FAQItem[];
    borderColor: string;
    activeColor: string;
}

const FAQCategory = ({ title, icon, items, borderColor, activeColor }: FAQCategoryProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className={`bg-white/5 border-l-4 ${borderColor} p-8 rounded-3xl space-y-6`}>
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5`}>
                    {icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">{title}</h2>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between text-left py-2 group"
                        >
                            <span className={`text-lg font-bold transition-colors ${openIndex === index ? activeColor : 'text-slate-300 group-hover:text-white'}`}>
                                {item.question}
                            </span>
                            {openIndex === index ? (
                                <Minus className={`w-5 h-5 ${activeColor}`} />
                            ) : (
                                <Plus className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            )}
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="py-4 text-slate-400 leading-relaxed text-lg">
                                        {item.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default function FAQPage() {
    const router = useRouter();

    const categories = [
        {
            title: "Voor ouders",
            icon: <Users className="w-6 h-6 text-primary" />,
            borderColor: "border-primary",
            activeColor: "text-primary",
            items: [
                {
                    question: "Is Linguaenlinea gratis?",
                    answer: "Ja, volledig gratis. Geen abonnement, geen verborgen kosten. Wij geloven dat goed onderwijs voor iedereen toegankelijk moet zijn."
                },
                {
                    question: "Is het platform veilig voor mijn kind?",
                    answer: "Ja. We verzamelen minimale gegevens en verkopen nooit informatie aan derden. Alles is conform de Nederlandse AVG-wetgeving. Lees meer in ons privacybeleid."
                },
                {
                    question: "Voor welke leeftijd is Linguaenlinea bedoeld?",
                    answer: "Het platform is ontworpen voor leerlingen van 12 tot 18 jaar, maar iedereen die Spaans wil leren is welkom."
                },
                {
                    question: "Hoe wordt de inhoud gemaakt?",
                    answer: "Alle lessen worden gemaakt door Rody Figueroa, een ervaren Spaans docent. We gebruiken NotebookLM (Google) als kennisbank voor de lesinhoud, zodat alles pedagogisch verantwoord is."
                }
            ]
        },
        {
            title: "Voor leerlingen",
            icon: <GraduationCap className="w-6 h-6 text-accent-gold" />,
            borderColor: "border-accent-gold",
            activeColor: "text-accent-gold",
            items: [
                {
                    question: "Hoe begin ik?",
                    answer: "Maak een gratis account aan, doorloop de onboarding en start direct met Les 1.1. Je voortgang wordt automatisch opgeslagen."
                },
                {
                    question: "Moet ik iets installeren?",
                    answer: "Nee. Linguaenlinea werkt volledig in de browser — op je laptop, tablet of telefoon."
                },
                {
                    question: "Wat zijn XP-punten?",
                    answer: "XP (ervaringspunten) verdien je door lessen te voltooien, quizzen goed te beantwoorden en elke dag in te loggen. Hoe meer XP, hoe verder je komt!"
                },
                {
                    question: "Kan ik zelf mijn tempo bepalen?",
                    answer: "Absoluut. Je leert wanneer jij wilt, zo snel of langzaam als jij wilt. Geen deadlines, geen druk."
                },
                {
                    question: "Welke taal wordt gebruikt in de lessen?",
                    answer: "De instructies zijn in het Nederlands, de lesstof is in het Spaans. Zo leer je stap voor stap zonder je verloren te voelen."
                }
            ]
        },
        {
            title: "Voor leraren",
            icon: <School className="w-6 h-6 text-blue-500" />,
            borderColor: "border-blue-500",
            activeColor: "text-blue-500",
            items: [
                {
                    question: "Kan ik Linguaenlinea gebruiken in mijn klas?",
                    answer: "Ja! Het platform is speciaal ontworpen voor gebruik op school én thuis. Je kunt leerlingen doorverwijzen naar specifieke lessen die aansluiten bij je methode."
                },
                {
                    question: "Welke technologie zit achter het platform?",
                    answer: "Linguaenlinea is gebouwd met Next.js en Supabase. De lesinhoud wordt samengesteld via NotebookLM. Het platform wordt continu verbeterd door Antigravity (AI-ontwikkelaar) en Stitch (UI-ontwerp)."
                },
                {
                    question: "Hoe neem ik contact op voor samenwerking?",
                    answer: "Via onze contactpagina of via de Facebook community. We staan altijd open voor samenwerking met scholen en docenten."
                },
                {
                    question: "Is er een leraaromgeving of dashboard?",
                    answer: "Nog niet, maar het staat op de roadmap! Wil je op de hoogte blijven? Volg ons op Facebook of neem contact op."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 antialiased font-display relative">
            <DotPattern />
            <div className="relative z-10">
                {/* NAV */}
                <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-dark/80 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                                <ArrowLeft className="w-4 h-4" /> Terug
                            </button>
                            <div className="flex flex-col items-center gap-2 mt-4 ml-10">
                                <Image
                                    src="/images/logo-linguaenlinea-final.png"
                                    alt="Linguaenlinea"
                                    width={200}
                                    height={50}
                                    className="h-24 w-auto object-contain"
                                />
                                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium text-center">aprende aprendiendo</span>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Veelgestelde <span className="text-primary">vragen</span>
                        </h1>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                            Alles wat je wilt weten over Linguaenlinea
                        </p>
                    </motion.div>

                    <div className="space-y-12">
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <FAQCategory {...cat} />
                            </motion.div>
                        ))}
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="py-10 px-6 border-t border-white/5 bg-background-dark">
                    <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <Image
                                src="/images/logo-linguaenlinea-final.png"
                                alt="Linguaenlinea"
                                width={180}
                                height={45}
                                className="h-20 w-auto object-contain"
                            />
                            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium text-center">aprende aprendiendo</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 text-slate-400 font-bold text-sm font-display">
                            <a className="hover:text-primary transition-colors" href="/over-ons">Over ons</a>
                            <a className="hover:text-primary transition-colors" href="/contact">Contact</a>
                            <a className="hover:text-primary transition-colors" href="/privacy">Privacy</a>
                            <a className="hover:text-primary transition-colors" href="/faq">FAQ</a>
                            <a className="hover:text-primary transition-colors" href="https://www.facebook.com/linguaenlinea" target="_blank">Facebook</a>
                        </div>
                        <div className="text-slate-600 text-xs font-medium font-display">
                            © 2026 Linguaenlinea. Alle rechten voorbehouden.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
