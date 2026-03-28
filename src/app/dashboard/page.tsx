"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-brand-coral animate-spin"></div>
        </div>
    )
});

export default function DashboardPage() {
    return (
        <Suspense fallback={null}>
            <Dashboard />
        </Suspense>
    );
}
