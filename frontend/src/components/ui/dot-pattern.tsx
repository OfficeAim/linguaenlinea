"use client"
import { cn } from "@/lib/utils"

export function DotPattern({ className }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="#FF6B6B" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
        </div>
    )
}
