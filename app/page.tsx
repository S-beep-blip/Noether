"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { SkeletonText, SkeletonImage } from "@/components/ui/Skeleton";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      <Navbar />
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-20 py-12 relative">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-start gap-8 relative z-10">
          {/* Text Content */}
          <div className="w-full lg:w-[60%] text-left">
            {isLoading ? (
              <>
                <SkeletonText className="h-14 sm:h-16 w-4/5 mb-8" />
                <SkeletonText className="h-5 w-full mb-3" />
                <SkeletonText className="h-5 w-full mb-3" />
                <SkeletonText className="h-5 w-full mb-3" />
                <SkeletonText className="h-5 w-4/5 mb-12" />
                <SkeletonText className="h-12 w-48 rounded-lg" />
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-5xl font-bold text-black mb-8 hero-regular select-none">
                  <span className="text-[#ffbd59]">Read</span>y
                  <span className="text-black">, Set, Understand.</span>
                </h1>
                <p className="text-lg text-gray-700 mb-12 max-w-[600px] select-none">
                  <span className="text-black text-3xl">a</span><span className="text-[#ffbd59] text-3xl">doox</span> is An AI-powered tool that helps users eliminate the boundaries of interruptions while searching for any meaning. The best part is that it provides context-aware meanings, allowing you to understand exactly what you are reading with ease. Simply hover over or select any word or sentence you want, and instantly receive a context-aware meaning response.
                </p>
                <Link
                  href="/adoox"
                  className="inline-block bg-black text-white text-lg font-semibold px-8 py-3 rounded-lg hover:bg-[#ffbd59] active:scale-95 transition-all duration-150 ease-in-out hero-regular relative overflow-hidden select-none"
                >
                  Try adoox
                </Link>
              </>
            )}
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-[40%]">
            <div className="relative w-full aspect-square">
              {isLoading ? (
                <SkeletonImage className="w-full h-full" />
              ) : (
                <Image
                  src="/Insearch.svg"
                  alt="Learning Environment"
                  fill
                  className="object-contain"
                  priority
                  onLoad={() => setIsLoading(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {!isLoading && (
              <Image
                src="/Organizing.svg"
                alt="Background"
                fill
                className="object-contain opacity-10"
                priority
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}