"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";
import { getImageUrl } from "@/lib/utils";
import type { Category, Institution, CourseType, CourseWithRelations } from "@/lib/types";
import { getIconComponent } from "@/lib/icon-map";
import { Clock, PlayCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    course: CourseWithRelations;
    language: "th" | "en";
    institutions: Institution[];
    courseTypes?: CourseType[];
    categories?: Category[];
    primaryColor?: string | null;
}

export function CourseCard({
    course,
    language,
    institutions,
    courseTypes = [],
    categories = [],
    primaryColor,
}: CourseCardProps) {
    const institution = institutions.find(inst => inst.id === course.institutionId);

    // Handle both property names (standard JS vs DB casing)
    const courseCategories = course.courseCategories || course.course_categories || [];

    const categoryNames = courseCategories
        .map((cc) => {
            const category = categories.find(c => c.id === cc.categoryId);
            return category ? (language === "th" ? category.name : category.nameEn) : null;
        })
        .filter(Boolean)
        .join(", ");

    return (
        <Link href={`/courses/${(course as any).courseCode || course.id}`} className="group h-full block">
            <Card className="h-full flex flex-col bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden rounded-[20px] relative">

                {/* Image Area with Cinematic Aspect Ratio */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                    <SafeImage
                        src={getImageUrl(course.imageId)}
                        alt={language === "th" ? course.title : course.titleEn}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        fallbackType="course"
                    />

                    {/* Overlay Gradient for legibility at bottom (optional, kept subtle) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

                    {/* Premium Glassmorphic Badge - Level (Top Right) */}
                    <div className="absolute top-4 right-4 z-10">
                        <div className="backdrop-blur-xl bg-white/30 border border-white/40 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm tracking-wide">
                            {course.level}
                        </div>
                    </div>

                    {/* Premium Glassmorphic Badge - Duration (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 z-10">
                        <div className="backdrop-blur-xl bg-black/40 border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                                {course.durationHours} {language === "th" ? "ชม." : "Hrs"}
                            </span>
                        </div>
                    </div>
                </div>

                <CardHeader className="flex-grow pt-6 pb-2 px-6 space-y-3">
                    {/* Institution Name - Eyebrow Style */}
                    {institution && (
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest line-clamp-1">
                            {language === "th" ? institution.name : institution.nameEn}
                        </div>
                    )}

                    {/* Course Title - Magazine Style */}
                    <CardTitle
                        className="line-clamp-2 text-xl font-bold leading-tight group-hover:text-primary transition-colors text-slate-800"
                        style={primaryColor ? { color: undefined } : {}}
                    >
                        <span style={primaryColor ? { color: primaryColor } : {}} className={cn(!primaryColor && "group-hover:text-primary")}>
                            {language === "th" ? course.title : course.titleEn}
                        </span>
                    </CardTitle>

                    {/* Categories (Subtle) */}
                    {categoryNames && (
                        <p className="text-xs text-slate-400 line-clamp-1 font-medium">
                            {categoryNames}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="px-6 pb-6 mt-auto">
                    {/* Divider with Metadata */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                        {/* Lessons Count (Mockup/Placeholder) */}
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <PlayCircle className="w-4 h-4" />
                            <span>
                                {Math.floor(Math.random() * 20) + 10} {language === "th" ? "บทเรียน" : "Lessons"}
                            </span>
                        </div>

                        {/* Call to Action */}
                        <div
                            className="flex items-center gap-1 text-xs font-bold transition-all group-hover:gap-2"
                            style={{ color: primaryColor || 'var(--primary)' }}
                        >
                            <span>{language === "th" ? "เริ่มเรียน" : "Start Learning"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

interface CourseCardProps {
    course: CourseWithRelations;
    language: "th" | "en";
    institutions: Institution[];
    courseTypes?: CourseType[];
    categories?: Category[];
    primaryColor?: string | null;
}

export function CourseCard({
    course,
    language,
    institutions,
    courseTypes = [],
    categories = [],
    primaryColor,
}: CourseCardProps) {
    const institution = institutions.find(inst => inst.id === course.institutionId);

    // Handle both property names (standard JS vs DB casing) if needed, 
    // or assume consistently populated by data-service
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
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col bg-white border-slate-200">
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
                                                className="text-white backdrop-blur-sm rounded-full p-2 flex items-center justify-center"
                                                style={{ backgroundColor: primaryColor || 'var(--primary)' }}
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
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {language === "th" ? institution.name : institution.nameEn}
                        </p>
                    )}
                    {categoryNames && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {categoryNames}
                        </p>
                    )}
                </CardHeader>
                <CardContent className="mt-auto">
                    <div className="flex items-center justify-between text-xs">
                        <Badge variant="default" className="rounded-[5px]">{course.level}</Badge>
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
