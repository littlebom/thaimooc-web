"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Category, News, Banner, Institution, CourseType, CourseWithRelations } from "@/lib/types";
import { ArrowRight, SquarePlus, ArrowUpSquare, BookOpen, Users, Award, Building2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { getIconComponent } from "@/lib/icon-map";
import { BannerDisplay } from "@/components/public/banner-display";
import { PopupModal } from "@/components/public/popup-modal";
import { HomeSearchBox } from "@/components/public/home-search-box";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AIParticleHeroDemo } from "@/components/public/ai-particle-hero-demo";
import { CourseCardLightTech } from "@/components/course-card-light-tech";
import { CourseCardDarkTech } from "@/components/course-card-dark-tech";

interface HomePageClientProps {
    categories: Category[];
    newCourses: CourseWithRelations[];
    popularCourses: CourseWithRelations[];
    news: News[];
    banners: Banner[];
    institutions: Institution[];
    courseTypes: CourseType[];
}

interface StatsData {
    courses: number;
    externalLearners: number;
    certificates: number;
    institutions: number;
}

export default function HomePageClient({
    categories,
    newCourses,
    popularCourses,
    news,
    banners,
    institutions,
    courseTypes,
}: HomePageClientProps) {
    const { language, t } = useLanguage();
    const [currentBanner, setCurrentBanner] = useState(0);
    const [stats, setStats] = useState<StatsData | null>(null);

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

    return (
        <div className="min-h-screen">
            {/* Popup Modal */}
            <PopupModal language={language} />

            {/* Hero Carousel replaced with AI Particle Hero */}
            <AIParticleHeroDemo />

            {/* Browse by Category */}
            <section className="relative w-full py-16 bg-[#f8fafc]">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'控制\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-8 w-1 bg-primary rounded-full" />
                        <h2 className="text-[1.2rem] font-bold text-slate-900">
                            {t("หมวดหมู่รายวิชา", "Browse by Category")}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category, index) => {
                            const IconComponent = getIconComponent(category.icon);
                            // Define distinct gradients for variety (12 distinct sets)
                            const gradients = [
                                "from-blue-500/20 to-cyan-500/10 text-blue-600",
                                "from-indigo-500/20 to-purple-500/10 text-indigo-600",
                                "from-emerald-500/20 to-teal-500/10 text-emerald-600",
                                "from-orange-500/20 to-yellow-500/10 text-orange-600",
                                "from-pink-500/20 to-rose-500/10 text-pink-600",
                                "from-violet-500/20 to-fuchsia-500/10 text-violet-600",
                                "from-amber-500/20 to-yellow-400/10 text-amber-600",
                                "from-lime-500/20 to-green-500/10 text-lime-600",
                                "from-sky-500/20 to-blue-400/10 text-sky-600",
                                "from-red-500/20 to-orange-400/10 text-red-600",
                                "from-purple-500/20 to-pink-500/10 text-purple-600",
                                "from-slate-500/20 to-slate-800/10 text-slate-700",
                            ];
                            const currentGradient = gradients[index % gradients.length];

                            return (
                                <Link key={category.id} href={`/courses?category=${category.id}`} className="group h-full">
                                    <Card className="h-full bg-white/60 backdrop-blur-md border border-white/20 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:-translate-y-2 group-hover:border-primary/20 transition-all duration-300 overflow-hidden relative">
                                        {/* Subtle Glow Background */}
                                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                                        <CardContent className="flex flex-col items-center justify-center p-8 text-center relative z-10">
                                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentGradient.split(' ').slice(0, 2).join(' ')} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                                <IconComponent className={`w-8 h-8 ${currentGradient.split(' ')[2]}`} strokeWidth={1.5} />
                                            </div>
                                            <h3 className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                                                {language === "th" ? category.name : category.nameEn}
                                            </h3>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>



            {/* New Arrivals (Light Tech Theme Background) */}
            <section className="relative w-full py-16 overflow-hidden border-y border-slate-100/50">
                {/* Background Gradient & Pattern */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white z-0" />
                <div
                    className="absolute inset-0 opacity-[0.4] z-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-1 bg-[#0AD7AC] rounded-full shadow-[0_0_10px_rgba(10,215,172,0.8)]" />
                            <h2 className="text-[1.2rem] font-bold text-[#0f172a] tracking-wide">
                                {t("รายวิชามาใหม่", "New Arrivals")}
                            </h2>
                        </div>
                        <Button asChild variant="default" style={{ borderRadius: '5px', backgroundColor: '#224188' }}>
                            <Link href="/courses">
                                {t("ดูทั้งหมด", "View All")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newCourses.map((course) => (
                            <div key={course.id} className="h-full">
                                <CourseCardLightTech
                                    course={course}
                                    language={language}
                                    institutions={institutions}
                                    courseTypes={courseTypes}
                                    categories={categories}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Courses (Dark Tech Theme) */}
            <section className="py-16 bg-[#0c1c3b] relative overflow-hidden font-poppins text-white">
                {/* High-Fidelity Ambient Mesh Glows */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle,rgba(29,130,183,0.18)_0%,transparent_70%)]"></div>
                    <div className="absolute bottom-[-15%] left-[5%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(247,86,24,0.12)_0%,transparent_70%)]"></div>
                    <div className="absolute top-[10%] right-[-15%] w-[90%] h-[90%] bg-[radial-gradient(circle,rgba(252,180,120,0.1)_0%,transparent_70%)]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <ArrowUpSquare className="h-6 w-6 text-[#0AD7AC]" />
                            <h2 className="text-[1.2rem] font-bold text-slate-100">
                                {t("รายวิชาได้รับความนิยมสูงสุด", "Popular Courses")}
                            </h2>
                        </div>
                        <Button asChild variant="default" style={{ borderRadius: '5px', backgroundColor: '#224188' }}>
                            <Link href="/courses">
                                {t("ดูทั้งหมด", "View All")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularCourses.map((course) => (
                            <div key={course.id} className="h-full">
                                <CourseCardDarkTech
                                    course={course}
                                    language={language}
                                    institutions={institutions}
                                    courseTypes={courseTypes}
                                    categories={categories}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* News & Announcements */}
            <section className="container mx-auto px-4 py-12 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[1.2rem] font-bold">
                        {t("ข่าวประชาสัมพันธ์", "News & Announcements")}
                    </h2>
                    <Button asChild variant="default" style={{ borderRadius: '5px', backgroundColor: '#224188' }}>
                        <Link href="/news">
                            {t("ดูทั้งหมด", "View All")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {news.map((item) => (
                        <Link key={item.id} href={`/news/${item.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                                <div className="relative h-40">
                                    <SafeImage
                                        src={getImageUrl(item.imageId)}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        fallbackType="news"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 text-base">{item.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString(
                                            language === "th" ? "th-TH" : "en-US"
                                        )}
                                    </p>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

function CourseCard({
    course,
    language,
    institutions,
    courseTypes = [],
    categories = [],
}: {
    course: CourseWithRelations;
    language: "th" | "en";
    institutions: Institution[];
    courseTypes?: CourseType[];
    categories?: Category[];
}) {
    const institution = institutions.find(inst => inst.id === course.institutionId);
    const courseCategories = course.courseCategories || course.course_categories || [];
    const categoryNames = courseCategories
        .map((cc) => {
            const category = categories.find(c => c.id === cc.categoryId);
            return category ? (language === "th" ? category.name : category.nameEn) : null;
        })
        .filter(Boolean)
        .join(", ");

    return (
        <Link href={`/courses/${(course as any).courseCode || course.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-40">
                    <SafeImage
                        src={getImageUrl(course.imageId)}
                        alt={language === "th" ? course.title : course.titleEn}
                        fill
                        className="object-cover rounded-t-lg"
                        fallbackType="course"
                    />
                    {/* Course Type Icons */}
                    {(course.courseCourseTypes || course.course_course_types) &&
                        (course.courseCourseTypes || course.course_course_types)!.length > 0 &&
                        courseTypes.length > 0 && (() => {
                            const types = course.courseCourseTypes || course.course_course_types || [];
                            const courseTypesToShow = types.slice(0, 3);
                            const icons = courseTypesToShow.map((ct) => {
                                const courseType = courseTypes.find(t => t.id === ct.courseTypeId);
                                if (!courseType || !courseType.icon) return null;
                                const IconComponent = getIconComponent(courseType.icon);
                                return { IconComponent, name: language === "th" ? courseType.name : courseType.nameEn };
                            }).filter(Boolean);

                            if (icons.length === 0) return null;

                            return (
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {icons.map((item, index) => {
                                        const Icon = item!.IconComponent;
                                        return (
                                            <div
                                                key={index}
                                                className="bg-primary/90 text-white backdrop-blur-sm rounded-full p-2 flex items-center justify-center"
                                                title={item!.name}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                </div>
                <CardHeader className="flex-grow">
                    <CardTitle className="line-clamp-2 text-base">
                        {language === "th" ? course.title : course.titleEn}
                    </CardTitle>
                    {institution && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {language === "th" ? institution.name : institution.nameEn}
                        </p>
                    )}
                    {categoryNames && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {categoryNames}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="mt-auto">
                    <div className="flex items-center justify-between text-xs">
                        <Badge variant="secondary">{course.level}</Badge>
                        <span className="text-muted-foreground">
                            {course.durationHours}{" "}
                            {language === "th" ? "ชั่วโมง" : "hours"}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
