'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) setVisible(true)
    }, [])

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setVisible(false)
    }

    const decline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-[#1a1a2e] border border-[#D4AF37]/30 
        rounded-2xl p-5 shadow-2xl shadow-black/50
        flex flex-col md:flex-row items-start md:items-center gap-4">

                {/* Logo */}
                <div className="shrink-0">
                    <Image
                        src="/images/logo-dark-final.png"
                        alt="Linguaenlinea"
                        width={48}
                        height={48}
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Text */}
                <div className="flex-1">
                    <p className="text-white font-bold text-sm mb-1">
                        🍪 Wij gebruiken cookies
                    </p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        We gebruiken cookies om je leerervaring te personaliseren
                        en je voortgang op te slaan. Je gegevens worden nooit
                        verkocht. Lees meer in onze{' '}
                        <a href="/privacy" className="text-[#D4AF37] hover:underline">
                            privacyverklaring
                        </a>.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 shrink-0">
                    <button
                        onClick={decline}
                        className="px-4 py-2 text-xs text-slate-400 
              hover:text-white border border-white/10 
              hover:border-white/30 rounded-xl transition-all"
                    >
                        Weigeren
                    </button>
                    <button
                        onClick={accept}
                        className="px-4 py-2 text-xs font-bold text-black
              bg-[#D4AF37] hover:bg-[#FFB800] 
              rounded-xl transition-all hover:scale-105"
                    >
                        Accepteren ✓
                    </button>
                </div>
            </div>
        </div>
    )
}
