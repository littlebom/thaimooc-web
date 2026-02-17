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
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-[1.2rem] font-bold mb-8 mt-8">
                    {t("หมวดหมู่รายวิชา", "Browse by Category")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => {
                        const IconComponent = getIconComponent(category.icon);
                        return (
                            <Link key={category.id} href={`/courses?category=${category.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full group">
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                            <IconComponent className="w-8 h-8 text-primary" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-semibold text-sm">
                                            {language === "th" ? category.name : category.nameEn}
                                        </h3>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* New Courses */}
            <section className="container mx-auto px-4 py-12 bg-gray-50">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <SquarePlus className="h-6 w-6 text-primary" />
                        <h2 className="text-[1.2rem] font-bold">
                            {t("รายวิชาใหม่", "New Courses")}
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
                        <CourseCard key={course.id} course={course} language={language} institutions={institutions} courseTypes={courseTypes} categories={categories} />
                    ))}
                </div>
            </section>

            {/* Popular Courses */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <ArrowUpSquare className="h-6 w-6 text-primary" />
                        <h2 className="text-[1.2rem] font-bold">
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
                        <CourseCard key={course.id} course={course} language={language} institutions={institutions} courseTypes={courseTypes} categories={categories} />
                    ))}
                </div>
            </section>

            {/* News & Announcements */}
            <section className="container mx-auto px-4 py-12 bg-gray-50">
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
