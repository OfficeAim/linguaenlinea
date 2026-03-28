"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudyLamp from './ui/StudyLamp';

interface JorgeTourProps {
    onComplete?: () => void;
    forceStart?: boolean;
}

const TOUR_STEPS = [
    {
        id: 1,
        text: "¡Hola! Ik ben Jorge 👋 Ik help je vandaag met je eerste stappen in Linguaenlinea. Laten we beginnen!",
        targetId: null // Centered
    },
    {
        id: 2,
        text: "Hier zie je jouw lessen. Begin met de introductie en ontgrendel de volgende uitdagingen!",
        targetId: "lessons-container"
    },
    {
        id: 3,
        text: "Elke les volgt onze methode: Begrijpen, Verkennen, Oefenen, Communiceren en een Quiz. Volg de stappen in volgorde!",
        targetId: "ppp-container"
    },
    {
        id: 4,
        text: "In de lessen vind je de Hulpkaart aan de rechterkant. Dit is jouw beste vriend tijdens de oefeningen!",
        targetId: "hulpkaart-container"
    }
];

export default function JorgeTour({ onComplete, forceStart = false }: JorgeTourProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [jorgePos, setJorgePos] = useState({ x: 0, y: 0 });
    
    const highlightedElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Hydration safeguard for Vercel/SSR
        const seen = typeof window !== 'undefined' ? localStorage.getItem('jorge_tour_seen') : 'true';
        if (!seen || forceStart) {
            setIsVisible(true);
        }
    }, [forceStart]);

    // Handle Highlighting and Positioning
    useEffect(() => {
        if (!isVisible) return;

        // Cleanup previous highlight
        if (highlightedElementRef.current) {
            highlightedElementRef.current.style.zIndex = "";
            highlightedElementRef.current.style.position = "";
            highlightedElementRef.current.style.pointerEvents = "";
        }

        const step = TOUR_STEPS[currentStep];
        
        if (step.targetId) {
            const el = document.getElementById(step.targetId);
            if (el) {
                const rect = el.getBoundingClientRect();
                
                // Highlight logic
                el.style.position = "relative";
                el.style.zIndex = "210";
                el.style.pointerEvents = "none";
                highlightedElementRef.current = el;

                // Fix 3 — Step 4 (hulpkaart-container) special case:
                // The right panel starts at ~right: 320px from the viewport edge.
                // If we placed Jorge at rect.left + rect.width/2 it would land INSIDE
                // the panel, covering widgets. Instead, anchor him to the center of the
                // main content area (viewport width minus right panel width).
                const RIGHT_PANEL_WIDTH = 320;
                const isRightPanel = step.targetId === 'hulpkaart-container';

                const rawX = rect.left + rect.width / 2;
                const safeX = isRightPanel
                    ? Math.max(rect.left - 220, 200)
                    : rawX;
                const y = isRightPanel
                    ? rect.top + 150
                    : rect.top + rect.height / 2;
                setJorgePos({ x: safeX, y });
            }
        } else {
            // Step 1 — center screen
            setJorgePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
            highlightedElementRef.current = null;
        }

        return () => {
            if (highlightedElementRef.current) {
                highlightedElementRef.current.style.zIndex = "";
                highlightedElementRef.current.style.position = "";
                highlightedElementRef.current.style.pointerEvents = "";
            }
        };
    }, [currentStep, isVisible]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('jorge_tour_seen', 'true');
        if (onComplete) onComplete();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[200]">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
                onClick={handleNext}
            />
            
            {/* Moving Jorge */}
            <motion.div 
                className="absolute pointer-events-none z-[220]"
                animate={{ 
                    x: jorgePos.x - 80, // Offset to center Jorge (width 160)
                    y: jorgePos.y - 80  // Offset to center Jorge (height 160)
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="relative pointer-events-auto">
                    <StudyLamp 
                        isJorgeMode={true} 
                        speechBubble={TOUR_STEPS[currentStep].text}
                        onSpeechClick={handleNext}
                    />
                    
                    {/* Progress Indicator */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {TOUR_STEPS.map((_, i) => (
                            <div 
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? 'bg-[#f4a261]' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Close Cross */}
            <button 
                onClick={handleComplete}
                className="absolute top-8 right-8 text-white/40 hover:text-white pointer-events-auto p-2 transition-colors"
                style={{ zIndex: 300 }}
            >
                <span className="text-xs font-black uppercase tracking-widest bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10">Sla tour over ×</span>
            </button>
        </div>
    );
}
