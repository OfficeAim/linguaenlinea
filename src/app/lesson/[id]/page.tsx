"use client";

import { use } from 'react';
import dynamic from 'next/dynamic';

const LessonView = dynamic(() => import('@/components/LessonView'), { ssr: false });

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <LessonView id={id} />;
}
