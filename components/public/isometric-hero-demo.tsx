"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Share2, Instagram, Facebook } from "lucide-react";

const DEMO_SLIDES = [
    {
        id: 1,
        number: "01",
        title: "Learning",
        subtitle: "COLLECTION",
        description: "Expand your horizons with our curated online courses from top institutions worldwide.",
        image: "/demo/student.png",
        bgColor: "#a3b18a", // Sage Green
        accentColor: "#344e41",
    },
    {
        id: 2,
        number: "02",
        title: "Skills",
        subtitle: "DEVELOPMENT",
        description: "Master new technologies and professional skills to advance your career in the digital age.",
        image: "/demo/student.png", // Reusing same for demo
        bgColor: "#cb997e", // Terracotta
        accentColor: "#6b705c",
    }
];

export function IsometricHeroDemo() {
    const [index, setIndex] = useState(0);
    const slide = DEMO_SLIDES[index];

    const next = () => setIndex((prev) => (prev + 1) % DEMO_SLIDES.length);
    const prev = () => setIndex((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);

    return (
        <div
            className="relative w-full h-[600px] md:h-[700px] transition-colors duration-1000 overflow-hidden font-poppins tracking-tight text-white"
            style={{ backgroundColor: slide.bgColor }}
        >
            {/* Corner Navigation - Top Left Branding */}
            <div className="absolute top-8 left-8 z-20">
                <div className="text-3xl font-black text-white/90">t.</div>
            </div>

            {/* Corner Navigation - Top Right Menu */}
            <div className="absolute top-8 right-8 z-20">
                <button className="flex flex-col gap-1.5 p-2 group">
                    <div className="w-8 h-0.5 bg-white/90 group-hover:w-6 transition-all"></div>
                    <div className="w-8 h-0.5 bg-white/90 group-hover:w-10 transition-all"></div>
                    <div className="w-8 h-0.5 bg-white/90 group-hover:w-8 transition-all"></div>
                </button>
            </div>

            {/* Background Large Number (Layered Typography) */}
            <div
                key={`num-${slide.id}`}
                className="absolute top-1/2 left-1/2 -translate-x-[10%] -translate-y-[60%] text-[15rem] md:text-[25rem] font-black text-white/10 select-none animate-in fade-in zoom-in duration-1000 fill-mode-both"
            >
                {slide.number}
            </div>

            <div className="container mx-auto h-full px-8 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">

                    {/* Left Side: Content */}
                    <div className="relative z-10 max-w-xl">
                        <div key={`content-${slide.id}`} className="animate-in slide-in-from-left-8 fade-in duration-700 delay-300 fill-mode-both">
                            <h1
                                className="text-6xl md:text-8xl font-black leading-tight mb-2 tracking-tighter"
                                style={{ color: "hsl(218 92% 35%)" }} // Primary Blue
                            >
                                {slide.title}
                            </h1>
                            <h2
                                className="text-2xl md:text-3xl font-bold tracking-[0.3em] opacity-80 mb-6"
                                style={{ color: "hsl(218 92% 35%)" }} // Primary Blue
                            >
                                {slide.subtitle}
                            </h2>
                            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-md text-slate-700">
                                {slide.description}
                            </p>

                            <Button
                                asChild
                                className="bg-transparent border-b-2 rounded-none px-0 py-2 h-auto text-xl font-bold hover:bg-transparent hover:border-blue-800 transition-all uppercase tracking-widest group"
                                style={{
                                    borderColor: "hsl(218 92% 35%)",
                                    color: "hsl(218 92% 35%)"
                                }}
                            >
                                <Link href="#">
                                    Explore
                                    <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side: Isometric Illustration */}
                    <div className="relative h-[400px] md:h-[500px] flex items-center justify-center">
                        {/* The "Pedestal" or "Box" Effect */}
                        <div
                            key={`box-${slide.id}`}
                            className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-white/20 -rotate-12 translate-y-20 animate-in fade-in zoom-in duration-1000 fill-mode-both"
                            style={{
                                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                            }}
                        ></div>

                        {/* Sub-shapes for depth */}
                        <div className="absolute w-[280px] h-[280px] md:w-[420px] md:h-[420px] border border-white/30 -rotate-12 translate-y-16 pointer-events-none"></div>

                        {/* The Person (Cut-out effect) */}
                        <div
                            key={`img-${slide.id}`}
                            className="relative z-10 w-[350px] h-[350px] md:w-[500px] md:h-[500px] drop-shadow-2xl animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-500 fill-mode-both"
                        >
                            <Image
                                src={slide.image}
                                alt="Student Illustration"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows - Bottom Left */}
            <div className="absolute bottom-12 left-12 flex gap-4 z-20">
                <button
                    onClick={prev}
                    className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={next}
                    className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Vertical Info - Bottom Left */}
            <div className="absolute bottom-12 left-8 -translate-x-full -rotate-90 origin-right text-white/50 text-sm tracking-[0.5em] font-bold uppercase hidden md:block">
                2024 / ACMS
            </div>

            {/* Social Icons - Bottom Right */}
            <div className="absolute bottom-12 right-12 flex flex-col gap-6 z-20 text-white/70">
                <Link href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                <Link href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
                <Link href="#" className="hover:text-white transition-colors"><Share2 className="w-5 h-5" /></Link>
            </div>

            <style jsx>{`
        .track-tighter {
          letter-spacing: -0.05em;
        }
      `}</style>
        </div>
    );
}
