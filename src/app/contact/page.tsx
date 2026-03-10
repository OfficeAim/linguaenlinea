"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Mail, Facebook, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

export default function ContactPage() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {
                setStatus("success");
            } else {
                throw new Error(result.error || "Er is iets misgegaan.");
            }
        } catch (err) {
            setStatus("error");
            setErrorMessage((err as Error).message);
        }
    };

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

                <main className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-start">
                    {/* INFO COLUMN */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Neem <span className="text-primary">contact</span> op
                        </h1>
                        <p className="text-slate-400 text-lg mb-12 max-w-md">
                            Heb je vragen over de lessen, een technisch probleem of wil je samenwerken? Ik hoor graag van je!
                        </p>

                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Email</h4>
                                    <a href="mailto:rodyf81@yahoo.es" className="text-slate-400 hover:text-primary transition-colors">
                                        rodyf81@yahoo.es
                                    </a>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                                <div className="w-12 h-12 bg-[#1877F2]/10 rounded-xl flex items-center justify-center text-[#1877F2]">
                                    <Facebook className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Community</h4>
                                    <a href="https://www.facebook.com/linguaenlinea" target="_blank" className="text-slate-400 hover:text-[#1877F2] transition-colors">
                                        Ga naar de Facebook groep →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* FORM COLUMN */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-500/10 border border-green-500/20 p-12 rounded-3xl text-center">
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                                    <h2 className="text-2xl font-bold text-white mb-4">Bericht verzonden!</h2>
                                    <p className="text-slate-400 mb-8">Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.</p>
                                    <button onClick={() => setStatus("idle")} className="text-primary font-bold hover:underline">
                                        Stuur nog een bericht
                                    </button>
                                </motion.div>
                            ) : (
                                <form key="form" onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2.5rem] space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Naam</label>
                                            <input required name="name" type="text" placeholder="Jouw naam" className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Email</label>
                                            <input required name="email" type="email" placeholder="naam@voorbeeld.nl" className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Onderwerp</label>
                                        <div className="relative">
                                            <select required name="subject" className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all appearance-none text-white outline-none">
                                                <option value="Vraag over de lessen">Vraag over de lessen</option>
                                                <option value="Technisch probleem">Technisch probleem</option>
                                                <option value="Samenwerking">Samenwerking</option>
                                                <option value="Andere">Andere</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Bericht</label>
                                        <textarea required name="message" rows={5} placeholder="Hoe kan ik je helpen?" className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-white outline-none"></textarea>
                                    </div>

                                    {status === "error" && (
                                        <div className="flex items-center gap-3 text-red-500 bg-red-500/10 p-4 rounded-xl text-sm">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            {typeof errorMessage === 'string' ? errorMessage : 'Er is iets misgegaan. Probeer het opnieuw.'}
                                        </div>
                                    )}

                                    <button type="submit" disabled={status === "loading"} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                                        {status === "loading" ? "Verzenden..." : (
                                            <>Verstuur bericht <Send className="w-5 h-5" /></>
                                        )}
                                    </button>
                                </form>
                            )}
                        </AnimatePresence>
                    </motion.div>
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
