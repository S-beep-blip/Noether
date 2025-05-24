// components/ui/Skeleton.tsx
import React from "react";

interface SkeletonProps {
  className?: string;
}

export const SkeletonText = ({ className = "" }: SkeletonProps) => {
  return (
    <div 
      className={`relative overflow-hidden bg-amber-100/30 rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/70 to-transparent animate-[wave_1.5s_infinite]"></div>
    </div>
  );
};

export const SkeletonImage = ({ className = "" }: SkeletonProps) => {
  return (
    <div 
      className={`relative overflow-hidden bg-amber-100/30 rounded-lg ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/70 to-transparent animate-[wave_1.5s_infinite]"></div>
    </div>
  );
};