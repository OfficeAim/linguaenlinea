'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

export function AudioWavePlayer({ src, label }: { src: string; label?: string }) {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    const bars = Array.from({ length: 20 }, (_, i) => i);
    const heights = [3, 5, 8, 12, 16, 20, 16, 12, 8, 5, 8, 12, 20, 16, 8, 12, 16, 8, 5, 3];

    return (
        <div className="flex flex-col items-center gap-4">
            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setPlaying(false)}
            />

            {/* Wave bars */}
            <div className="flex items-center gap-1 h-12">
                {bars.map((i) => (
                    <motion.div
                        key={i}
                        className="w-1 rounded-full"
                        style={{
                            background: playing
                                ? `linear-gradient(to top, #FF6B6B, #FFB800)`
                                : '#ffffff20'
                        }}
                        animate={playing ? {
                            height: [
                                `${heights[i]}px`,
                                `${heights[(i + 3) % 20] * 2}px`,
                                `${heights[i]}px`
                            ]
                        } : { height: `${heights[i]}px` }}
                        transition={{
                            duration: 0.6 + (i * 0.05),
                            repeat: playing ? Infinity : 0,
                            ease: 'easeInOut',
                            delay: i * 0.03
                        }}
                    />
                ))}
            </div>

            {/* Play button */}
            <button
                onClick={toggle}
                className="flex items-center gap-3 bg-[#FF6B6B] hover:bg-[#ff5252] 
          text-white px-6 py-3 rounded-full font-bold text-sm 
          transition-all hover:scale-105 active:scale-95
          shadow-lg shadow-[#FF6B6B]/30"
            >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {label || 'Luister fragment'}
            </button>
        </div>
    );
}
