"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "./landing/page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("onboarding_complete");
    if (onboardingComplete === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return <LandingPage />;
}
