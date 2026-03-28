"use client";

export const dynamic = 'force-dynamic';

import { use } from 'react';
import nextDynamic from 'next/dynamic';

const LessonView = nextDynamic(() => import('@/components/LessonView'), { ssr: false });

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <LessonView id={id} />;
}
