'use client'
import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))
interface SplineSceneProps {
    scene: string
    className?: string
}
export function SplineScene({ scene, className }: SplineSceneProps) {
    return (
        <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#FF6B6B] rounded-full animate-spin border-t-transparent" />
            </div>
        }>
            <Spline scene={scene} className={className} />
        </Suspense>
    )
}
