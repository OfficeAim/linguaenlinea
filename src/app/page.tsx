"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

const Onboarding = dynamic(() => import('@/components/Onboarding'), { ssr: false });
const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });

export default function Home() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  return (
    <main>
      {!isOnboardingComplete ? (
        <Onboarding onComplete={() => setIsOnboardingComplete(true)} />
      ) : (
        <Dashboard />
      )}
    </main>
  );
}
