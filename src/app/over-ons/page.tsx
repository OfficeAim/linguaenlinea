"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, BookOpen, Mic, Users, ArrowLeft, Star, Zap } from "lucide-react";
import Image from "next/image";
import { DotPattern } from "@/components/ui/dot-pattern";

// ─── PARTICLE TEXT ENGINE (brand colors) ─────────────────────────
interface Vector2D { x: number; y: number }

class Particle {
    pos: Vector2D = { x: 0, y: 0 }
    vel: Vector2D = { x: 0, y: 0 }
    acc: Vector2D = { x: 0, y: 0 }
    target: Vector2D = { x: 0, y: 0 }
    closeEnoughTarget = 100
    maxSpeed = 1.0; maxForce = 0.1; isKilled = false
    startColor = { r: 0, g: 0, b: 0 }
    targetColor = { r: 0, g: 0, b: 0 }
    colorWeight = 0; colorBlendRate = 0.01

    move() {
        let prox = 1
        const dist = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y)
        if (dist < this.closeEnoughTarget) prox = dist / this.closeEnoughTarget
        const tt = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y }
        const tm = Math.hypot(tt.x, tt.y)
        if (tm > 0) { tt.x = tt.x / tm * this.maxSpeed * prox; tt.y = tt.y / tm * this.maxSpeed * prox }
        const st = { x: tt.x - this.vel.x, y: tt.y - this.vel.y }
        const sm = Math.hypot(st.x, st.y)
        if (sm > 0) { st.x = st.x / sm * this.maxForce; st.y = st.y / sm * this.maxForce }
        this.acc.x += st.x; this.acc.y += st.y
        this.vel.x += this.acc.x; this.vel.y += this.acc.y
        this.pos.x += this.vel.x; this.pos.y += this.vel.y
        this.acc.x = 0; this.acc.y = 0
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.colorWeight < 1.0) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
        const lerp = (a: number, b: number) => Math.round(a + (b - a) * this.colorWeight)
        ctx.fillStyle = `rgb(${lerp(this.startColor.r, this.targetColor.r)},${lerp(this.startColor.g, this.targetColor.g)},${lerp(this.startColor.b, this.targetColor.b)})`
        ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
    }

    kill(w: number, h: number) {
        if (!this.isKilled) {
            const dx = Math.random() * w - w / 2, dy = Math.random() * h - h / 2
            const m = Math.hypot(dx, dy)
            this.target.x = w / 2 + dx / m * ((w + h) / 2)
            this.target.y = h / 2 + dy / m * ((w + h) / 2)
            this.startColor = { r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight, g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight, b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight }
            this.targetColor = { r: 13, g: 13, b: 13 }
            this.colorWeight = 0; this.isKilled = true
        }
    }
}

// Coral + Gold palette — brand colors only
const PALETTE = [
    { r: 255, g: 107, b: 107 }, // #FF6B6B coral
    { r: 255, g: 184, b: 0 }, // #FFB800 gold
    { r: 255, g: 120, b: 80 }, // coral-orange
    { r: 255, g: 107, b: 107 }, // coral (dominant)
    { r: 255, g: 200, b: 60 }, // warm gold
]

const WORDS = ["SPAANS", "GRATIS", "LEREN", "aprende", "aprendiendo"]

function ParticleHero() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef<number>(undefined)
    const particles = useRef<Particle[]>([])
    const frame = useRef(0)
    const wordIdx = useRef(0)
    const colorIdx = useRef(0)

    const spawn = (canvas: HTMLCanvasElement) => {
        const p = new Particle()
        const mag = (canvas.width + canvas.height) / 2
        const dx = Math.random() * canvas.width - canvas.width / 2
        const dy = Math.random() * canvas.height - canvas.height / 2
        const m = Math.hypot(dx, dy)
        p.pos.x = canvas.width / 2 + dx / m * mag
        p.pos.y = canvas.height / 2 + dy / m * mag
        p.maxSpeed = Math.random() * 6 + 4
        p.maxForce = p.maxSpeed * 0.05
        p.colorBlendRate = Math.random() * 0.025 + 0.003
        return p
    }

    const nextWord = (word: string, canvas: HTMLCanvasElement) => {
        const off = document.createElement("canvas")
        off.width = canvas.width; off.height = canvas.height
        const ctx2 = off.getContext("2d")!
        const fontSize = word.length > 8 ? 68 : word.length > 5 ? 88 : 108
        ctx2.fillStyle = "white"
        ctx2.font = `900 ${fontSize}px Arial`
        ctx2.textAlign = "center"; ctx2.textBaseline = "middle"
        ctx2.fillText(word, canvas.width / 2, canvas.height / 2)

        const { data: px } = ctx2.getImageData(0, 0, canvas.width, canvas.height)
        colorIdx.current = (colorIdx.current + 1) % PALETTE.length
        const color = PALETTE[colorIdx.current]

        const ps = particles.current
        let pi = 0
        const coords: number[] = []
        for (let i = 0; i < px.length; i += 6 * 4) coords.push(i)
        for (let i = coords.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[coords[i], coords[j]] = [coords[j], coords[i]] }

        for (const idx of coords) {
            if (px[idx + 3] > 0) {
                const x = (idx / 4) % canvas.width, y = Math.floor(idx / 4 / canvas.width)
                let p: Particle
                if (pi < ps.length) { p = ps[pi]; p.isKilled = false; pi++ } else { p = spawn(canvas); ps.push(p) }
                p.startColor = { r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight, g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight, b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight }
                p.targetColor = color; p.colorWeight = 0
                p.target.x = x; p.target.y = y
            }
        }
        for (let i = pi; i < ps.length; i++) ps[i].kill(canvas.width, canvas.height)
    }

    const animate = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")!
        const ps = particles.current
        ctx.fillStyle = "rgba(13,13,13,0.15)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (let i = ps.length - 1; i >= 0; i--) {
            ps[i].move(); ps[i].draw(ctx)
            if (ps[i].isKilled && (ps[i].pos.x < 0 || ps[i].pos.x > canvas.width || ps[i].pos.y < 0 || ps[i].pos.y > canvas.height)) ps.splice(i, 1)
        }
        frame.current++
        if (frame.current % 210 === 0) { wordIdx.current = (wordIdx.current + 1) % WORDS.length; nextWord(WORDS[wordIdx.current], canvas) }
        animRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = 900; canvas.height = 260
        nextWord(WORDS[0], canvas)
        animate()
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
    }, [])

    return <canvas ref={canvasRef} className="w-full max-w-3xl" style={{ height: "260px" }} />
}

// ─── PAYPAL ──────────────────────────────────────────────────────
const PAYPAL_EMAIL = "rodyf81@yahoo.es"
const PAYPAL_DONATE_URL = `https://www.paypal.com/donate?business=${PAYPAL_EMAIL}&currency_code=EUR&item_name=Linguaenlinea+koffie`

// ─── PAGE ────────────────────────────────────────────────────────
export default function OverOnsPage() {
    const router = useRouter()

    const pillars = [
        { icon: BookOpen, title: "Zelfstudie", nl: "Zelf studeren, dan nog eens studeren, en daarna nog meer. Discipline is belangrijker dan geld — maar leuk materiaal maakt discipline overbodig.", color: "text-[#FF6B6B]", bg: "bg-[#FF6B6B]/10", border: "border-[#FF6B6B]/20" },
        { icon: Mic, title: "Oefening", nl: "Oefen met vrienden, familie en klasgenoten. Kijk Spaanse series. Luister naar podcasts. Spreek Spaans wanneer je maar kunt.", color: "text-[#FFB800]", bg: "bg-[#FFB800]/10", border: "border-[#FFB800]/20" },
        { icon: Users, title: "Community", nl: "Een goede leraar en een actieve gemeenschap versnellen het leerproces enorm en voorkomen dat je fouten aanleert die je later moeilijk kunt corrigeren.", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    ]

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-slate-100 antialiased overflow-x-hidden relative">
            <DotPattern />
            <div className="relative z-10">
                {/* NAV */}
                <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0D0D0D]/80 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
                        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                            <ArrowLeft className="w-4 h-4" /> Terug
                        </button>
                        <div className="flex items-center gap-3">
                            <Image
                                src="/images/logo-linguaenlinea-final.png"
                                alt="Linguaenlinea"
                                width={200}
                                height={50}
                                className="h-24 w-auto object-contain"
                            />
                        </div>
                    </div>
                </nav>

                {/* 1 — PARTICLE HERO */}
                <section className="relative flex flex-col items-center pt-14 pb-2 px-6 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#FF6B6B]/5 rounded-full blur-3xl" />
                    </div>
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="relative z-10 inline-flex items-center px-4 py-1.5 rounded-full border border-[#FF6B6B]/50 bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-bold tracking-wide uppercase mb-4">
                        <Star className="w-3 h-3 mr-2" /> Over Ons
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative z-10 w-full flex justify-center">
                        <ParticleHero />
                    </motion.div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.9 }}
                        className="relative z-10 text-slate-500 text-sm text-center mt-1 mb-2">
                        Een leraar met een missie. Een platform gebouwd met liefde voor talen.
                    </motion.p>
                </section>


                {/* 3 — MISSIE */}
                <section className="py-20 px-6 max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Mijn missie</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Spaans leren hoeft niet duur of moeilijk te zijn — als de materialen goed gestructureerd en op een leuke manier worden gepresenteerd.</p>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {pillars.map((pillar, i) => (
                            <motion.div key={pillar.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                                className={`p-8 rounded-3xl ${pillar.bg} border ${pillar.border} hover:scale-105 transition-transform`}>
                                <div className={`w-12 h-12 rounded-2xl ${pillar.bg} border ${pillar.border} flex items-center justify-center mb-5`}>
                                    <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${pillar.color}`}>{pillar.title}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{pillar.nl}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4 — VERHAAL */}
                <section className="py-8 px-6 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="bg-[#1a1a2e] border border-white/10 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#FF6B6B] to-[#FFB800] rounded-l-3xl" />
                        <div className="pl-4">
                            <div className="flex items-center gap-3 mb-8">
                                <Image src="/images/Perfil Rody linkedin.jpg" alt="Rody Figueroa" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h4 className="text-white font-semibold">Rody Figueroa</h4>
                                    <p className="text-white/50 text-xs">Oprichter · Born at Da Vinci College · Now for the world 🌎</p>
                                </div>
                            </div>
                            <div className="space-y-5 text-slate-300 leading-relaxed">
                                <p>Hoewel mijn moedertaal Spaans is, ben ik gepassioneerd door talen. Aan de universiteit leerde ik Engels en Frans. Nadat ik naar Nederland verhuisde, leerde ik Nederlands volledig op eigen kracht — vandaar mijn motto: <span className="text-[#FF6B6B] font-bold italic">"aprende aprendiendo"</span>.</p>
                                <p>Na mijn studie begon ik Engels als vreemde taal te onderwijzen en deed een postdoctorale opleiding in Spaans als vreemde taal. Zo realiseerde ik me dat een taal leren geen gemakkelijke taak is zonder een methode die alle benodigde vaardigheden ontwikkelt.</p>
                                <p>In 2022 begon ik als Spaans- en Engelsleraar op een middelbare school in Nederland (Da Vinci College). Terwijl ik geschikt materiaal probeerde te ontwikkelen voor het niveau van mijn leerlingen, ontstond het idee van Linguaenlinea.</p>
                                <p className="text-white font-medium">Ik heb mijn beroep als leraar achter me gelaten om me volledig te wijden aan de ontwikkeling van dit platform — omdat ik geloof dat elke leerling, waar ook ter wereld, toegang verdient tot kwalitatief hoogwaardig Spaans onderwijs.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 5 — DONATIE */}
                <section className="py-20 px-6 max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-12 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B6B] to-[#FFB800]" />
                        <Heart className="w-12 h-12 text-[#FF6B6B] mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Buy me a coffee</h2>
                        <p className="text-white/70 mb-8 max-w-xl mx-auto leading-relaxed">
                            I create all content for free and dedicate most of my free time to this project.
                            If you appreciate it, a small donation is always more than welcome!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href={PAYPAL_DONATE_URL} target="_blank" rel="noopener noreferrer"
                                className="bg-[#0070BA] hover:bg-[#005ea6] text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 group">
                                Donate via PayPal
                            </a>
                        </div>
                        <p className="mt-8 text-white/40 text-sm flex items-center justify-center gap-2">
                            <Users className="w-4 h-4" />
                            For teachers, parents and everyone who supports this project.
                        </p>
                        <p className="mt-2 text-white/30 text-xs italic">
                            Every contribution helps keep this platform free for all students.
                        </p>
                    </motion.div>
                </section>

                {/* FOOTER */}
                <footer className="py-10 px-6 border-t border-white/5 bg-background-dark">
                    <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-3 mb-6">
                                <Image
                                    src="/images/logo-linguaenlinea-final.png"
                                    alt="Linguaenlinea"
                                    width={180}
                                    height={45}
                                    className="h-20 w-auto object-contain"
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
