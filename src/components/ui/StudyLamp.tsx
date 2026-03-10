"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * StudyLamp Component - Official Study Assistant
 * Positioned in the Dashboard Sidebar.
 * Role: Study Mode Toggle.
 */
export default function StudyLamp() {
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [isWinking, setIsWinking] = useState(false);

    // Periodic wink animation to feel "alive"
    useEffect(() => {
        const winkInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setIsWinking(true);
                setTimeout(() => setIsWinking(false), 200);
            }
        }, 3000);
        return () => clearInterval(winkInterval);
    }, []);

    // TODO: Stitch will connect this state to Supabase user preferences later.
    const toggleStudyMode = () => setIsStudyMode(!isStudyMode);

    return (
        <div
            className="flex flex-col items-center justify-center py-4 cursor-pointer group relative"
            onClick={toggleStudyMode}
        >
            {/* Glow Effect */}
            <AnimatePresence>
                {isStudyMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.6, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 bg-[#D4AF37] rounded-full blur-[30px] z-0"
                    />
                )}
            </AnimatePresence>

            {/* Floating Assistant Unit */}
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
            >
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 80 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Base */}
                    <rect x="25" y="85" width="30" height="10" rx="5" fill="#2D2D44" />
                    <rect x="37" y="60" width="6" height="30" fill="#2D2D44" />

                    {/* Lamp Head Container */}
                    <motion.g
                        animate={isStudyMode ? { rotate: [0, 1, -1, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        {/* Lamp Shade */}
                        <path
                            d="M10 50C10 33.4315 23.4315 20 40 20C56.5685 20 70 33.4315 70 50H10Z"
                            fill={isStudyMode ? "#D4AF37" : "#3F3F5F"}
                            className="transition-colors duration-500"
                        />

                        {/* Face */}
                        <circle cx="30" cy="38" r="3" fill="white" />
                        <motion.ellipse
                            cx="50"
                            cy="38"
                            rx="3"
                            ry={isWinking ? 0.5 : 3}
                            fill="white"
                        />
                        <path
                            d="M37 45C37 45 38.5 47 40 47C41.5 47 43 45 43 45"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </motion.g>

                    {/* Lightbulb */}
                    <circle
                        cx="40"
                        cy="52"
                        r="8"
                        fill={isStudyMode ? "#FFD700" : "#2A2A3A"}
                        className="transition-colors duration-500"
                    />
                </svg>

                {/* State Indicator */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded whitespace-nowrap border border-white/10 flex items-center gap-1 shadow-xl">
                    {isStudyMode ? "STUDY MODE: ON ✨" : "IDLE MODE 💤"}
                </div>
            </motion.div>
        </div>
    );
}
