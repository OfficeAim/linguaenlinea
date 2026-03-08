"use client";

import { useRef } from 'react';

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

const cardStyle: React.CSSProperties = {
    width: '400px',
    height: '400px',
    backgroundColor: '#0D0D0D',
    backgroundImage: 'linear-gradient(to bottom, #0D0D0D, #1a1a2e)',
    border: '2px solid #FFB800',
    borderRadius: '16px',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
};

const topBannerStyle: React.CSSProperties = {
    backgroundColor: '#FF6B6B',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
};

const middleStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    zIndex: 10
};

const avatarWrapperStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '2px solid #FFB800',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: '8px'
};

const avatarImgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const avatarPlaceholderStyle: React.CSSProperties = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '30px',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B'
};

const studentNameStyle: React.CSSProperties = {
    color: 'white',
    fontWeight: '600',
    fontSize: '18px',
    marginTop: '4px',
    textAlign: 'center',
    padding: '0 16px'
};

const scoreContainerStyle: React.CSSProperties = {
    margin: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const scoreStyle: React.CSSProperties = {
    fontSize: '60px',
    fontWeight: '900',
    color: '#FF6B6B',
    lineHeight: 1
};

const starsStyle: React.CSSProperties = {
    color: '#FFB800',
    fontSize: '18px',
    marginTop: '4px',
    letterSpacing: '0.1em'
};

const lessonInfoContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '8px',
    padding: '0 24px',
    width: '100%'
};

const lessonTitleStyle: React.CSSProperties = {
    color: '#e5e7eb',
    fontSize: '14px',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
    maxWidth: '340px'
};

const dateStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '12px',
    marginTop: '4px'
};

const bottomBannerStyle: React.CSSProperties = {
    backgroundColor: '#1a1a2e',
    borderTop: '1px solid rgba(255,184,0,0.3)',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    position: 'relative',
    zIndex: 10
};

const brandStyle: React.CSSProperties = {
    color: '#FF6B6B',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
};

const dotStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '12px'
};

const taglineStyle: React.CSSProperties = {
    color: '#9ca3af',
    fontSize: '12px',
    fontStyle: 'italic'
};

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
        const html2canvas = (await import('html2canvas')).default;

        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: '#0D0D0D', // Fixed dark theme background
                logging: false,
                ignoreElements: (el) => {
                    return false;
                }
            });

            const link = document.createElement('a');
            link.download = `linguaenlinea-les${lessonNumber}-${score}pct.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

        } catch (err) {
            console.error('Download error:', err);
        }
    };

    return (
        <div className="flex flex-col items-center mb-8">
            {/* The Shareable Card - 100% Inline Styles for html2canvas compatibility */}
            <div ref={cardRef} style={cardStyle}>
                {/* 1. TOP BANNER */}
                <div style={topBannerStyle}>
                    🏆 MILESTONE BEHAALD
                </div>

                {/* 2. MIDDLE SECTION */}
                <div style={middleStyle}>
                    {/* Avatar */}
                    {studentAvatar ? (
                        <div style={avatarWrapperStyle}>
                            <img
                                src={studentAvatar}
                                alt={studentName}
                                style={avatarImgStyle}
                                crossOrigin="anonymous"
                            />
                        </div>
                    ) : (
                        <div style={{ ...avatarWrapperStyle, backgroundColor: '#FF6B6B' }}>
                            <span style={avatarPlaceholderStyle}>
                                {studentName ? studentName.charAt(0).toUpperCase() : '?'}
                            </span>
                        </div>
                    )}

                    {/* Student Name */}
                    <div style={studentNameStyle}>
                        {studentName || 'Student'}
                    </div>

                    {/* Score display */}
                    <div style={scoreContainerStyle}>
                        <span style={scoreStyle}>
                            {score}%
                        </span>
                        <div style={starsStyle}>
                            {score === 100 ? '⭐⭐⭐' : score >= 70 ? '⭐⭐' : '⭐'}
                        </div>
                    </div>

                    {/* Lesson Info */}
                    <div style={lessonInfoContainerStyle}>
                        <div style={lessonTitleStyle}>
                            Les {lessonNumber}: {lessonTitle}
                        </div>
                        <div style={dateStyle}>
                            Behaald op {achievedDate}
                        </div>
                    </div>
                </div>

                {/* 3. BOTTOM BANNER */}
                <div style={bottomBannerStyle}>
                    <span style={brandStyle}>
                        <span style={{ fontSize: '16px' }}>🌐</span> linguaenlinea.eu
                    </span>
                    <span style={dotStyle}>•</span>
                    <span style={taglineStyle}>
                        aprende aprendiendo
                    </span>
                </div>
            </div>

            {/* ACTION BUTTONS (Tailwind is ok here because html2canvas only grabs cardRef) */}
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
