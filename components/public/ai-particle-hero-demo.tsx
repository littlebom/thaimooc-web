"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award, Building2, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Input } from "@/components/ui/input";

interface StatsData {
    courses: number;
    externalLearners: number;
    certificates: number;
    institutions: number;
}

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
    const [stats, setStats] = useState<StatsData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { t } = useLanguage();

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/public/stats");
                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        }
        fetchStats();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
        }
    };

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
            className="relative w-full h-[600px] lg:h-[760px] bg-[#0c1c3b] overflow-hidden font-poppins text-white"
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

            <div className="container mx-auto h-full px-8 relative z-20 flex flex-col pt-20 landscape:pt-12 md:pt-0 md:flex-row md:items-center">
                <div className="max-w-4xl md:-translate-y-12">
                    <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
                        <span className="inline-block text-xs md:text-sm font-bold tracking-[0.5em] mb-10 uppercase text-blue-400">
                            Thailand Cyber University Project
                        </span>

                        <h1 className="text-4xl md:text-[90px] font-semibold leading-[0.95] mb-6 landscape:mb-4 md:mb-12 tracking-tighter">
                            <span className="relative inline-block">
                                THAI-MOOC
                                <div className="absolute bottom-[-8px] left-0 w-full h-[15%] bg-gradient-to-r from-orange-500 to-pink-500 -z-10 opacity-60 blur-[1px]"></div>
                            </span> <br />
                            <span className="tracking-[0.03em]">Ecosystem</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-400 mb-6 landscape:mb-6 md:mb-14 leading-relaxed max-w-xl font-medium opacity-80">
                            Thailand&apos;s largest hub for online courses. Discover classes easily—answering every need for your lifelong learning journey.
                        </p>

                        <div className="max-w-2xl">
                            <form onSubmit={handleSearch} className="flex gap-4 p-1.5 rounded-[5px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <div className="flex-1 relative">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder={t(
                                            "ค้นหารายวิชาที่น่าสนใจ...",
                                            "Search for interesting courses..."
                                        )}
                                        className="h-12 pl-12 pr-4 text-base bg-transparent border-none text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-12 px-8 rounded-[5px] bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-lg"
                                >
                                    {t("ค้นหา", "Search")}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glassmorphic Stats Cards - Hidden on Mobile */}
            <div className="hidden lg:block absolute bottom-0 left-0 w-full z-30 px-8 pb-8">
                <div className="container mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Course Card */}
                    <div className="flex items-center gap-4 p-5 rounded-[5px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300">
                        <div className="p-3 rounded-[5px] bg-blue-500/20 text-blue-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold leading-none mb-1">
                                <AnimatedCounter end={stats?.courses || 0} />
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Courses</div>
                        </div>
                    </div>

                    {/* Learners Card */}
                    <div className="flex items-center gap-4 p-5 rounded-[5px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300">
                        <div className="p-3 rounded-[5px] bg-indigo-500/20 text-indigo-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold leading-none mb-1">
                                <AnimatedCounter end={stats?.externalLearners || 0} />
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Learners</div>
                        </div>
                    </div>

                    {/* Certificates Card */}
                    <div className="flex items-center gap-4 p-5 rounded-[5px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300">
                        <div className="p-3 rounded-[5px] bg-yellow-500/20 text-yellow-500">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold leading-none mb-1">
                                <AnimatedCounter end={stats?.certificates || 0} />
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Certificates</div>
                        </div>
                    </div>

                    {/* Institutions Card */}
                    <div className="flex items-center gap-4 p-5 rounded-[5px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white/10 transition-all duration-300">
                        <div className="p-3 rounded-[5px] bg-orange-500/20 text-orange-400">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold leading-none mb-1">
                                <AnimatedCounter end={stats?.institutions || 0} />
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Institutions</div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Floating Decorative Label */}
            <div className="absolute top-1/2 right-12 -translate-y-1/2 [writing-mode:vertical-lr] text-xs font-bold tracking-[0.5em] whitespace-nowrap uppercase text-white/10 z-20">
                Thailand Massive Open Online Course
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
