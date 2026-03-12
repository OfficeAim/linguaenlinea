"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Onboarding from '@/components/Onboarding';
import GeneratingCourse from '@/components/GeneratingCourse';
import PhoneticIntro from '@/components/PhoneticIntro';

export default function OnboardingPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'onboarding' | 'phonetic' | 'generating'>('onboarding');
    const [studentName, setStudentName] = useState("Student");

    const handleOnboardingComplete = () => {
        const savedName = localStorage.getItem('student_name') || "Student";
        const savedLevel = localStorage.getItem('student_level') || "zero";
        
        setStudentName(savedName);
        
        if (savedLevel === 'zero' || savedLevel === 'beginner') {
            setStatus('phonetic');
        } else {
            setStatus('generating');
        }
    };

    const handlePhoneticComplete = () => {
        setStatus('generating');
    };

    const handleAnimationComplete = () => {
        window.location.href = '/dashboard';
    };

    if (status === 'generating') {
        return <GeneratingCourse studentName={studentName} onComplete={handleAnimationComplete} />;
    }

    if (status === 'phonetic') {
        return <PhoneticIntro onComplete={handlePhoneticComplete} />;
    }

    return (
        <main>
            <Onboarding onComplete={handleOnboardingComplete} />
        </main>
    );
}
