"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Lock, Eye, Save, Gavel } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

export default function PrivacyPage() {
    const router = useRouter();

    const sections = [
        {
            title: "1. Verzamelde gegevens",
            icon: <Eye className="w-5 h-5 text-primary" />,
            content: "We vragen alleen wat echt nodig is: je naam, e-mailadres en je voortgang in de lessen. Meer hebben we niet nodig om je Spaans te leren."
        },
        {
            title: "2. Gebruik van gegevens",
            icon: <Save className="w-5 h-5 text-primary" />,
            content: "Jouw gegevens gebruiken we alleen om het platform te laten werken en jouw voortgang bij te houden. We verkopen nooit iets. Nooit."
        },
        {
            title: "3. Opslag en Beveiliging",
            icon: <Lock className="w-5 h-5 text-primary" />,
            content: "We gebruiken Supabase — een veilige Europese database. Jouw gegevens staan versleuteld opgeslagen en zijn alleen voor jou toegankelijk."
        },
        {
            title: "4. Jouw Rechten (AVG)",
            icon: <ShieldCheck className="w-5 h-5 text-primary" />,
            content: "Wil je weten welke gegevens we hebben? Of wil je ze laten verwijderen? Stuur een e-mail naar linguaenlinea2@gmail.com — we regelen het binnen 30 dagen."
        },
        {
            title: "5. Cookies",
            icon: <Gavel className="w-5 h-5 text-primary" />,
            content: "We gebruiken alleen the cookies die nodig zijn om de site te laten werken. Geen advertenties, geen tracking, geen gedoe."
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
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/images/logo-dark-final.png"
                                    alt="Linguaenlinea"
                                    width={140}
                                    height={35}
                                    className="h-7 w-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Privacy <span className="text-primary">Policy</span>
                        </h1>
                        <p className="text-slate-400 text-lg mb-12 max-w-2xl">
                            Wij geloven in eerlijkheid. Hier lees je precies wat we doen met jouw gegevens — in gewone taal, zonder juridisch jargon.
                        </p>

                        <div className="space-y-12">
                            {sections.map((section, index) => (
                                <motion.section
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 border border-white/10 p-8 rounded-3xl"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                            {section.icon}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed text-lg">
                                        {section.content}
                                    </p>
                                </motion.section>
                            ))}
                        </div>

                        <div className="mt-16 bg-accent-gold/10 border border-accent-gold/20 p-8 rounded-3xl">
                            <h3 className="text-accent-gold font-bold text-xl mb-2">Vragen?</h3>
                            <p className="text-slate-300">
                                Heb je vragen over ons privacybeleid? Neem dan gerust contact met ons op via de <a href="/contact" className="text-accent-gold hover:underline font-bold">contactpagina</a>.
                            </p>
                        </div>

                        <p className="mt-12 text-slate-500 text-sm">
                            Laatst bijgewerkt: 9 maart 2026
                        </p>
                    </motion.div>
                </main>

                {/* FOOTER */}
                <footer className="py-10 px-6 border-t border-white/5 bg-background-dark">
                    <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-3 mb-6">
                                <Image
                                    src="/images/logo-dark-final.png"
                                    alt="Linguaenlinea"
                                    width={140}
                                    height={35}
                                    className="h-7 w-auto object-contain"
                                />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">aprende aprendiendo</span>
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
