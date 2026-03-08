"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Onboarding from '@/components/Onboarding';
import GeneratingCourse from '@/components/GeneratingCourse';

export default function OnboardingPage() {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [studentName, setStudentName] = useState("Student");

    const handleComplete = () => {
        // Get student name from localStorage where it was just saved in Onboarding.tsx
        const savedName = localStorage.getItem('student_name') || "Student";
        setStudentName(savedName);
        setIsGenerating(true);
    };

    const handleAnimationComplete = () => {
        router.push('/dashboard');
    };

    if (isGenerating) {
        return <GeneratingCourse studentName={studentName} onComplete={handleAnimationComplete} />;
    }

    return (
        <main>
            <Onboarding onComplete={handleComplete} />
        </main>
    );
}
