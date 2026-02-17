"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Particle {
    x: number;
    y: number;
    z: number;
    size: number;
    color: string;
    shape: 'circle' | 'square';
    vx: number;
    vy: number;
    vz: number;
    originX: number;
    originY: number;
    originZ: number;
}

export function AIParticleHeroDemo() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: 0, y: 0, active: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas || !containerRef.current) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let width = containerRef.current.offsetWidth;
        let height = containerRef.current.offsetHeight;

        const init = () => {
            width = containerRef.current!.offsetWidth;
            height = containerRef.current!.offsetHeight;
            canvasRef.current!.width = width;
            canvasRef.current!.height = height;

            particles = [];
            const particleCount = 450; // Optimized for performance while maintaining density
            const sphereRadius = Math.min(width, height) * 0.42;

            for (let i = 0; i < particleCount; i++) {
                const phi = Math.acos(-1 + (2 * i) / particleCount);
                const theta = Math.sqrt(particleCount * Math.PI) * phi;

                const ox = sphereRadius * Math.cos(theta) * Math.sin(phi);
                const oy = sphereRadius * Math.sin(theta) * Math.sin(phi);
                const oz = sphereRadius * Math.cos(phi);

                // Original Color Distribution (Pink/Orange Zone vs Cyan/White Zone)
                let color = "#ffffff";
                if (ox < 0 && oy < 0) color = "#ff2d55"; // Vibrant Pink
                else if (ox < 0 && oy > 0) color = "#ff9500"; // Vibrant Orange
                else if (ox > 0 && oy < 0) color = "#5ac8fa"; // Azure Blue
                else if (oz > 0) color = "#ffffff"; // White highlights
                else color = "#5856d6"; // Deep Purple

                particles.push({
                    x: ox, y: oy, z: oz,
                    originX: ox, originY: oy, originZ: oz,
                    vx: 0, vy: 0, vz: 0,
                    size: Math.random() * 2 + 0.8,
                    shape: Math.random() > 0.6 ? 'square' : 'circle',
                    color,
                });
            }
        };

        const rotateX = (p: Particle, angle: number) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const y = p.y * cos - p.z * sin;
            const z = p.y * sin + p.z * cos;
            p.y = y;
            p.z = z;
            const oy = p.originY * cos - p.originZ * sin;
            const oz = p.originY * sin + p.originZ * cos;
            p.originY = oy;
            p.originZ = oz;
        };

        const rotateY = (p: Particle, angle: number) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = p.x * cos + p.z * sin;
            const z = -p.x * sin + p.z * cos;
            p.x = x;
            p.z = z;
            const ox = p.originX * cos + p.originZ * sin;
            const oz = -p.originX * sin + p.originZ * cos;
            p.originX = ox;
            p.originZ = oz;
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const centerX = width * 0.72;
            const centerY = height * 0.5;

            // Still sort for depth, but it's cheaper without ctx.filter
            particles.sort((a, b) => b.z - a.z);

            particles.forEach(p => {
                rotateY(p, 0.002);
                rotateX(p, 0.0008);

                if (mouse.current.active) {
                    const dx = (mouse.current.x - centerX) - p.x;
                    const dy = (mouse.current.y - centerY) - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 320) {
                        const force = (320 - dist) / 320;
                        p.vx += dx * force * 0.015;
                        p.vy += dy * force * 0.015;
                    }
                }

                p.vx += (p.originX - p.x) * 0.015;
                p.vy += (p.originY - p.y) * 0.015;
                p.vz += (p.originZ - p.z) * 0.015;

                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;
                p.vx *= 0.88;
                p.vy *= 0.88;
                p.vz *= 0.88;

                const focalLength = 600;
                const scale = focalLength / (focalLength + p.z);
                const px = p.x * scale + centerX;
                const py = p.y * scale + centerY;

                if (p.z > -focalLength) {
                    ctx.save();

                    // No ctx.filter (blur) for maximum performance
                    ctx.fillStyle = p.color;
                    // Use scale and alpha for depth effect
                    ctx.globalAlpha = Math.max(0.1, scale * 0.85);

                    if (p.shape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        const s = p.size * scale * 1.4;
                        ctx.fillRect(px - s / 2, py - s / 2, s, s);
                    }

                    ctx.restore();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        init();
        render();

        window.addEventListener("resize", init);
        return () => {
            window.removeEventListener("resize", init);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouse.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true
        };
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => mouse.current.active = false}
            className="relative w-full h-[550px] md:h-[750px] bg-[#0c1c3b] overflow-hidden font-poppins text-white"
        >
            {/* High-Fidelity Ambient Mesh Glows (Identified from original) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Blue Glow Top-Left */}
                <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle,rgba(29,130,183,0.18)_0%,transparent_70%)]"></div>

                {/* Orange/Red Glow Bottom-Left */}
                <div className="absolute bottom-[-15%] left-[5%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(247,86,24,0.12)_0%,transparent_70%)]"></div>

                {/* Peach/Orange Glow Center-Right */}
                <div className="absolute top-[10%] right-[-15%] w-[90%] h-[90%] bg-[radial-gradient(circle,rgba(252,180,120,0.1)_0%,transparent_70%)]"></div>
            </div>

            <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

            <div className="container mx-auto h-full px-8 relative z-20 flex items-center">
                <div className="max-w-4xl -translate-y-12">
                    <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
                        <span className="inline-block text-xs md:text-sm font-bold tracking-[0.5em] mb-10 uppercase text-blue-400">
                            Thailand Cyber University Project
                        </span>

                        <h1 className="text-6xl md:text-[90px] font-semibold leading-[0.95] mb-12 tracking-tighter">
                            <span className="relative inline-block">
                                THAI-MOOC
                                <div className="absolute bottom-4 left-0 w-full h-[15%] bg-gradient-to-r from-orange-500 to-pink-500 -z-10 opacity-60 blur-[1px]"></div>
                            </span> <br />
                            <span className="tracking-[0.03em]">Ecosystem</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 mb-14 leading-relaxed max-w-xl font-medium opacity-80">
                            Thailand&apos;s largest hub for online courses. Discover classes easily—answering every need for your lifelong learning journey.
                        </p>

                        <div className="flex flex-wrap gap-8 items-center">
                            <Button
                                size="lg"
                                className="h-16 px-12 rounded-full text-lg font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.15)] active:scale-95"
                            >
                                Get Started Now
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>

                            <Link href="#" className="group flex items-center gap-3 text-lg font-bold text-white hover:text-blue-400 transition-colors">
                                Explore Architecture
                                <div className="w-8 h-px bg-white/20 group-hover:bg-blue-400 transition-colors"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>



            {/* Floating Decorative Label */}
            <div className="absolute top-1/2 right-12 -translate-y-1/2 [writing-mode:vertical-lr] text-xs font-bold tracking-[1em] uppercase text-white/10 z-20">
                Revolutionary Learning Engine
            </div>

            <style jsx>{`
              @keyframes gradient-x {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .animate-gradient-x {
                background-size: 200% 200%;
                animation: gradient-x 15s ease infinite;
              }
            `}</style>
        </div>
    );
}
