import React from "react";

interface AcrylicGlassProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
    radius?: string;
}

export function AcrylicGlass({
    children,
    className = "",
    radius = "rounded-3xl",
    ...props
}: AcrylicGlassProps) {
    return (
        <div
            className={`relative overflow-hidden bg-white/[0.03] border border-white/[0.08] backdrop-blur-[20px] backdrop-saturate-[1.4] shadow-[0_4px_24px_rgba(0,0,0,0.15)] ${radius} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}