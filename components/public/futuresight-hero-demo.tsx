"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export function FutureSightHeroDemo() {
    const [index, setIndex] = useState(0);

    const slides = [
        {
            id: 1,
            tagline: "ENVISIONING THE FUTURE",
            title: "Crafting Tomorrow's Digital Narratives",
            description: "Empower your educational journey with flexible, high-quality courses designed for the modern world.",
            images: [
                "/demo/student.png",
                "/demo/cluster1.png",
                "/demo/cluster2.png",
            ],
            colors: {
                glow1: "rgba(255, 107, 107, 0.4)", // Coral
                glow2: "rgba(78, 205, 196, 0.4)", // Mint
                glow3: "rgba(255, 230, 109, 0.4)", // Yellow
            }
        }
    ];

    const slide = slides[index];

    return (
        <div className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-white font-poppins text-slate-900 border-y border-slate-100">

            {/* Mesh Gradient Background Elements */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute top-[-10%] right-[-10%] w-[60%] h-[70%] rounded-full blur-[120px] mix-blend-multiply opacity-30 animate-pulse transition-colors duration-1000"
                    style={{ backgroundColor: slide.colors.glow1 }}
                ></div>
                <div
                    className="absolute bottom-[-20%] left-[10%] w-[50%] h-[60%] rounded-full blur-[100px] mix-blend-multiply opacity-20 animate-pulse delay-700 transition-colors duration-1000"
                    style={{ backgroundColor: slide.colors.glow2 }}
                ></div>
                <div
                    className="absolute top-[20%] left-[-5%] w-[40%] h-[50%] rounded-full blur-[140px] mix-blend-multiply opacity-25 animate-pulse delay-1000 transition-colors duration-1000"
                    style={{ backgroundColor: slide.colors.glow3 }}
                ></div>
            </div>

            {/* Decorative Polygon Wave (SVG) */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-10 pointer-events-none z-0">
                <svg viewBox="0 0 1440 320" className="w-full h-full preserve-aspect-none">
                    <path
                        fill="currentColor"
                        d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>

            <div className="container mx-auto h-full px-8 relative z-10 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">

                    {/* Left: Content */}
                    <div className="max-w-xl animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                        <span
                            className="inline-block text-xs md:text-sm font-bold tracking-[0.4em] mb-6 uppercase"
                            style={{ color: "hsl(218 92% 35%)", opacity: 0.6 }}
                        >
                            {slide.tagline}
                        </span>
                        <h1
                            className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight"
                            style={{ color: "hsl(218 92% 35%)" }}
                        >
                            {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium opacity-80">
                            {slide.description}
                        </p>

                        <button
                            className="relative group overflow-hidden text-white rounded-xl px-10 py-5 font-bold transition-all hover:pr-14 hover:shadow-[0_20px_40px_rgba(9,62,168,0.2)] active:scale-95"
                            style={{ backgroundColor: "hsl(218 92% 35%)" }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Explore Solutions
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                            {/* Dynamic Glow Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-pink-400 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity blur-md"></div>
                        </button>
                    </div>

                    {/* Right: Floating Cluster */}
                    <div className="relative h-[400px] md:h-[600px] animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 fill-mode-both">

                        {/* Main Central Image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] aspect-[4/3] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl z-20 animate-float transition-all hover:scale-[1.02]">
                            <Image
                                src={slide.images[1]}
                                alt="Main Demo"
                                fill
                                className="object-contain bg-slate-50"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[40px] md:rounded-[60px]"></div>
                        </div>

                        {/* Floating Top Right */}
                        <div className="absolute top-[10%] right-[10%] w-32 md:w-48 aspect-square rounded-[30px] md:rounded-[45px] overflow-hidden shadow-xl z-21 animate-float-slow delay-500 hover:z-30 transition-transform">
                            <Image
                                src={slide.images[0]}
                                alt="Cluster 1"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-transparent"></div>
                        </div>

                        {/* Floating Bottom Right */}
                        <div className="absolute bottom-[10%] right-[5%] w-28 md:w-40 aspect-square rounded-[25px] md:rounded-[40px] overflow-hidden shadow-lg z-22 animate-float delay-1000 hover:z-30 transition-transform">
                            <Image
                                src={slide.images[2]}
                                alt="Cluster 2"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-bl from-teal-500/20 to-transparent"></div>
                        </div>

                        {/* Floating Background Glows */}
                        <div className="absolute top-[20%] right-[30%] w-64 h-64 bg-pink-400/20 rounded-full blur-[80px] pointer-events-none -z-10"></div>
                        <div className="absolute bottom-[30%] right-[10%] w-48 h-48 bg-teal-400/20 rounded-full blur-[60px] pointer-events-none -z-10"></div>
                    </div>
                </div>
            </div>

            {/* Slide Counter - Bottom Left */}
            <div className="absolute bottom-12 left-12 flex items-center gap-6 font-bold z-20">
                <span className="text-xl">01</span>
                <div className="w-12 h-[2px] bg-slate-900/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-slate-900"></div>
                </div>
                <span className="text-slate-400">03</span>
            </div>

            {/* Navigation - Bottom Right */}
            <div className="absolute bottom-12 right-12 flex items-center gap-4 z-20">
                <button className="p-3 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-3 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-900" />
                </button>
            </div>

            <style jsx>{`
        .preserve-aspect-none {
          preserveAspectRatio: none;
        }
        
        @keyframes float {
          0% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-20px); }
          100% { transform: translate(-50%, -50%) translateY(0px); }
        }

        @keyframes float-simple {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-simple 8s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
