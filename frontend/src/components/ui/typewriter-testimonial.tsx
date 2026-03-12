'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Testimonial = {
    avatar?: string;
    image?: string;
    text: string;
    name: string;
    role: string;
};

type ComponentProps = {
    testimonials: Testimonial[];
};

export const TypewriterTestimonial: React.FC<ComponentProps> = ({ testimonials }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [typedText, setTypedText] = useState('');
    const typewriterRef = useRef<NodeJS.Timeout | null>(null);

    const startTypewriter = useCallback((text: string) => {
        if (typewriterRef.current) clearTimeout(typewriterRef.current);
        setTypedText('');
        let i = 0;
        const type = () => {
            if (i <= text.length) {
                setTypedText(text.slice(0, i));
                i++;
                typewriterRef.current = setTimeout(type, 40);
            }
        };
        type();
    }, []);

    const stopTypewriter = useCallback(() => {
        if (typewriterRef.current) clearTimeout(typewriterRef.current);
        setTypedText('');
    }, []);

    useEffect(() => () => stopTypewriter(), [stopTypewriter]);

    return (
        <div className="flex justify-center items-center gap-8 flex-wrap">
            {testimonials.map((t, index) => (
                <motion.div
                    key={index}
                    className="relative flex flex-col items-center cursor-pointer"
                    onMouseEnter={() => { setHoveredIndex(index); startTypewriter(t.text); }}
                    onMouseLeave={() => { setHoveredIndex(null); stopTypewriter(); }}
                    whileHover={{ scale: 1.1 }}
                >
                    {t.image ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 transition-all duration-300 border-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/30">
                            <Image
                                src={t.image}
                                alt={t.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 transition-all duration-300 ${hoveredIndex === index ? 'border-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/30' : 'border-white/20'} bg-white/10`}>
                            {t.avatar}
                        </div>
                    )}
                    <p className="mt-2 text-sm text-slate-400 font-bold">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                    <AnimatePresence>
                        {hoveredIndex === index && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                className="absolute bottom-24 bg-[#1a1a2e] border border-[#FF6B6B]/30 text-white text-sm px-4 py-3 rounded-2xl shadow-2xl w-64 z-50"
                            >
                                <div className="min-h-16 text-slate-300 leading-relaxed">
                                    {typedText}<span className="animate-pulse text-[#FF6B6B]">|</span>
                                </div>
                                <p className="mt-2 text-right font-bold text-[#FF6B6B] text-xs">{t.name}</p>
                                <p className="text-right text-slate-500 text-xs">{t.role}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
};
