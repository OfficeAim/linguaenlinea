"use client";

import { useRef } from 'react';
import html2canvas from 'html2canvas';

interface AchievementCardProps {
    studentName: string;
    studentAvatar: string;
    score: number;
    lessonTitle: string;
    lessonNumber: string;
    achievedDate: string;
    facebookShareUrl: string;
    onShareFacebook: () => void;
}

export default function AchievementCard({
    studentName,
    studentAvatar,
    score,
    lessonTitle,
    lessonNumber,
    achievedDate,
    facebookShareUrl,
    onShareFacebook
}: AchievementCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                backgroundColor: '#151515', // Matched dark theme background
                scale: 2 // Higher resolution
            });
            const link = document.createElement('a');
            link.download = `linguaenlinea-les${lessonNumber}-${score}pct.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to generate image:', error);
        }
    };

    return (
        <div className="flex flex-col items-center mb-8">
            {/* The Shareable Card */}
            <div
                ref={cardRef}
                className="w-[400px] h-[400px] flex flex-col justify-between bg-gradient-to-b from-[#0D0D0D] to-[#1a1a2e] border-2 border-[#FFB800] rounded-2xl overflow-hidden shadow-2xl relative"
            >
                {/* 1. TOP BANNER */}
                <div className="bg-brand-coral h-12 flex items-center justify-center">
                    <span className="text-white font-bold text-sm tracking-widest uppercase">
                        🏆 MILESTONE BEHAALD
                    </span>
                </div>

                {/* 2. MIDDLE SECTION */}
                <div className="flex flex-col items-center py-6 flex-1 justify-center z-10 relative">
                    {/* Avatar */}
                    {studentAvatar ? (
                        <div className="w-20 h-20 rounded-full border-2 border-[#FFB800] overflow-hidden mb-2 bg-brand-charcoal">
                            <img
                                src={studentAvatar}
                                alt={studentName}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-full border-2 border-[#FFB800] bg-brand-coral flex items-center justify-center mb-2">
                            <span className="text-white font-bold text-3xl">
                                {studentName ? studentName.charAt(0).toUpperCase() : '?'}
                            </span>
                        </div>
                    )}

                    {/* Student Name */}
                    <div className="text-white font-semibold text-lg mt-1 text-center px-4">
                        {studentName || 'Student'}
                    </div>

                    {/* Score display */}
                    <div className="my-4 flex flex-col items-center">
                        <span className="text-brand-coral text-6xl font-black drop-shadow-md">
                            {score}%
                        </span>
                        <div className="text-[#FFB800] text-lg mt-1 tracking-widest">
                            {score === 100 ? '⭐⭐⭐' : score >= 70 ? '⭐⭐' : '⭐'}
                        </div>
                    </div>

                    {/* Lesson Info */}
                    <div className="text-center mt-2 px-6">
                        <p className="text-gray-200 text-sm font-medium truncate w-full max-w-[340px]">
                            Les {lessonNumber}: {lessonTitle}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            Behaald op {achievedDate}
                        </p>
                    </div>
                </div>

                {/* 3. BOTTOM BANNER */}
                <div className="bg-[#1a1a2e] border-t border-[#FFB800]/30 h-14 flex items-center justify-center gap-2 relative z-10">
                    <span className="text-brand-coral text-sm font-semibold tracking-wide flex items-center gap-1.5">
                        <span className="text-base">🌐</span> linguaenlinea.eu
                    </span>
                    <span className="text-gray-500 text-xs mt-0.5">•</span>
                    <span className="text-gray-400 text-xs italic mt-0.5">
                        aprende aprendiendo
                    </span>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col items-center w-[400px] mt-5">
                <div className="flex flex-row items-center justify-center gap-3 w-full">
                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#2a2a3e] hover:bg-[#3a3a4e] text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg active:scale-95"
                    >
                        <span className="text-lg">⬇️</span> Download kaart
                    </button>

                    {/* Facebook Share Button */}
                    <a
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onShareFacebook}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1464d8] text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg active:scale-95"
                    >
                        <span className="text-lg">📘</span> Deel op Facebook
                    </a>
                </div>
                <p className="text-gray-500 text-xs text-center mt-2">
                    💡 Tip: Download je kaart eerst, dan kun je hem toevoegen aan je post!
                </p>
            </div>

            {/* Example Post Preview */}
            <div className="bg-[#2a2a3e] p-4 rounded-xl text-left text-xs text-gray-400 mt-4 w-[400px] border border-gray-700 shadow-inner">
                <p className="font-semibold text-[#FFB800] mb-2 flex items-center gap-1.5 text-sm">
                    <span>✏️</span> Voorbeeld post:
                </p>
                <p className="italic text-gray-300 text-sm leading-relaxed relative pl-3 m-0 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-gray-600">
                    &quot;🏆 Ik heb Les {lessonNumber} voltooid met {score}%! Me llamo..., soy de... y aprendo español. #linguaenlinea&quot;
                </p>
            </div>
        </div>
    );
}
