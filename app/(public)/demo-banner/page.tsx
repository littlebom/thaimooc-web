import { AIParticleHeroDemo } from "@/components/public/ai-particle-hero-demo";
import { DemoBannerCards } from "@/components/demo-banner-cards";
import { DemoBannerCardsDark } from "@/components/demo-banner-cards-dark";
import { getCourses, getCategories, getInstitutions, getCourseTypes } from "@/lib/data";
import { DemoFilterWrapper } from "./demo-filter-wrapper";

export const dynamic = "force-dynamic";

export default async function DemoBannerPage() {
    // Fetch real data
    const [courses, categories, institutions, courseTypes] = await Promise.all([
        getCourses(),
        getCategories(),
        getInstitutions(),
        getCourseTypes()
    ]);

    // Limit to first 8 courses for demo
    const demoCourses = courses.slice(0, 8);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* 1. AI Particle Hero Demo */}
            <div className="relative z-20">
                <AIParticleHeroDemo />
            </div>

            {/* Course Grid - Light Tech Theme */}
            <div className="mt-8 container mx-auto z-10 relative pb-16">
                <div className="flex items-center gap-4 mb-6 px-4">
                    <div className="h-8 w-1 bg-[#0AD7AC] rounded-full shadow-[0_0_10px_rgba(10,215,172,0.8)]" />
                    <h2 className="text-2xl font-bold text-[#0f172a] tracking-wide">
                        Light Tech Theme <span className="text-[#0AD7AC] font-light">|</span> Course Cards
                    </h2>
                </div>

                <DemoBannerCards
                    courses={demoCourses}
                    categories={categories}
                    institutions={institutions}
                />
            </div>

            {/* Course Grid - Dark Tech Theme */}
            <div className="py-16 bg-[#0c1c3b] relative overflow-hidden font-poppins text-white">
                {/* High-Fidelity Ambient Mesh Glows (Matches Banner) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Blue Glow Top-Left */}
                    <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle,rgba(29,130,183,0.18)_0%,transparent_70%)]"></div>
                    {/* Orange/Red Glow Bottom-Left */}
                    <div className="absolute bottom-[-15%] left-[5%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(247,86,24,0.12)_0%,transparent_70%)]"></div>
                    {/* Peach/Orange Glow Center-Right */}
                    <div className="absolute top-[10%] right-[-15%] w-[90%] h-[90%] bg-[radial-gradient(circle,rgba(252,180,120,0.1)_0%,transparent_70%)]"></div>
                </div>

                <div className="container mx-auto z-10 relative">
                    <div className="flex items-center gap-4 mb-8 px-4">
                        <div className="h-8 w-1 bg-[#0AD7AC] rounded-full shadow-[0_0_15px_rgba(10,215,172,1)]" />
                        <h2 className="text-2xl font-bold text-slate-100 tracking-wide">
                            Dark Tech Theme <span className="text-[#0AD7AC] font-light">|</span> Course Cards
                        </h2>
                    </div>

                    <DemoBannerCardsDark
                        courses={demoCourses}
                        categories={categories}
                        institutions={institutions}
                    // courseTypes logic is handled inside finding relations, but good to pass if needed for future
                    />
                </div>
            </div>

            {/* Search Filter UI Demo */}
            <div className="py-16 bg-slate-50 relative">
                <div className="container mx-auto px-4 z-10 relative">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-8 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-wide">
                            UI Component Demo <span className="text-slate-400 font-light">|</span> Search & Filter Card
                        </h2>
                    </div>

                    <DemoFilterWrapper
                        categories={categories}
                        institutions={institutions}
                        courseTypes={courseTypes}
                    />
                </div>
            </div>
        </div >
    );
}
