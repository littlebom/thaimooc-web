"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";
import { getImageUrl } from "@/lib/utils";
import { getIconComponent } from "@/lib/icon-map";
import { useSettings } from "@/lib/settings-context";
import type { Category, Institution, CourseType, CourseWithRelations } from "@/lib/types";
import { Clock, GraduationCap, PlayCircle, ArrowRight, Signal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    course: CourseWithRelations;
    language: "th" | "en";
    institutions: Institution[];
    courseTypes?: CourseType[];
    categories?: Category[];
}

export function CourseCardLightTech({
    course,
    language,
    institutions,
    courseTypes = [],
    categories = [],
}: CourseCardProps) {
    const { settings } = useSettings();
    const primaryColor = settings?.primaryColor || "#0AD7AC";
    const institution = institutions.find(inst => inst.id === course.institutionId);

    // Handle category data from various shapes (relation object or flat array)
    const courseCategories = course.courseCategories || course.course_categories || [];
    let derivedCategoryIds: string[] = [];

    if (courseCategories.length > 0) {
        derivedCategoryIds = courseCategories.map(cc => cc.categoryId);
    } else if (course.categoryIds && course.categoryIds.length > 0) {
        derivedCategoryIds = course.categoryIds;
    }

    const categoryNames = derivedCategoryIds
        .map((catId) => {
            const category = categories.find(c => c.id === catId);
            return category ? (language === "th" ? category.name : category.nameEn) : null;
        })
        .filter(Boolean)
        .join(", ");

    // Handle Course Types (Multiple)
    const courseTypeRelations = course.courseCourseTypes || course.course_course_types || [];
    let targetCourseTypeIds: string[] = [];

    if (courseTypeRelations.length > 0) {
        targetCourseTypeIds = courseTypeRelations.map(r => r.courseTypeId);
    } else if (course.courseTypeIds && course.courseTypeIds.length > 0) {
        targetCourseTypeIds = course.courseTypeIds;
    }

    const displayCourseTypes = targetCourseTypeIds
        .map(id => courseTypes.find(t => t.id === id))
        .filter((t): t is CourseType => !!t)
        .slice(0, 3);

    return (
        <Link href={`/courses/${(course as any).courseCode || course.id}`} className="group h-full block">
            {/* 
                Light Tech Theme:
                - Background: Pale Blue Gradient (#f0f9ff to #e0f2fe)
                - Border: Subtle Tech Blue
                - Shadow: Soft + Colored Glow on Hover
            */}
            <Card className="font-sans h-full flex flex-col bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-blue-100/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(14,165,233,0.3)] hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden rounded-[5px] relative ring-1 ring-white/60">

                {/* Tech Decoration: Subtle Grid/Particles Background (CSS Pattern) */}


                {/* Image Area - Full Width */}
                <div className="relative aspect-video overflow-hidden border-b border-blue-50/50 flex-shrink-0">
                    <div className="absolute inset-0 bg-slate-200/50 animate-pulse" />

                    {/* Course Type Badges (Top-Right) */}
                    {displayCourseTypes.length > 0 && (
                        <div className="absolute top-3 right-3 z-20 flex gap-1.5 pointer-events-none">
                            {displayCourseTypes.map((type) => {
                                if (!type?.icon) return null;
                                const IconComponent = getIconComponent(type.icon);
                                const typeName = language === "th" ? type.name : type.nameEn;
                                return (
                                    <div
                                        key={type.id}
                                        title={typeName || ""}
                                        className="pointer-events-auto p-2 rounded-full backdrop-blur-md shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                                        style={{
                                            backgroundColor: primaryColor,
                                            color: '#ffffff',
                                            boxShadow: `0 2px 10px -2px rgba(0,0,0,0.3)`
                                        }}
                                    >
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <SafeImage
                        src={getImageUrl(course.imageId)}
                        alt={language === "th" ? course.title : course.titleEn}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        fallbackType="course"
                    />
                </div>

                <CardHeader className="flex flex-col flex-grow pt-4 pb-2 px-6 space-y-2 relative z-10">
                    {/* Institution Name - Tech Eyebrow */}
                    {institution && (
                        <div className="flex items-center gap-2">
                            <div className="h-px w-4 bg-orange-400/80" /> {/* Accent Line */}
                            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest line-clamp-1">
                                {language === "th" ? institution.name : institution.nameEn}
                            </div>
                        </div>
                    )}

                    {/* Course Title - Deep Navy Typography */}
                    <CardTitle className="line-clamp-2 text-base font-medium leading-snug text-[#0f172a] group-hover:text-[#089678] transition-colors">
                        {language === "th" ? course.title : course.titleEn}
                    </CardTitle>

                    {/* Categories (Tech Tag Style) */}
                    {categoryNames && (
                        <div className="flex flex-wrap gap-1 pt-1 mt-auto">
                            <span className="text-[10px] font-medium text-[#089678] bg-[rgba(10,215,172,0.1)] px-2 py-0.5 rounded-md border border-[rgba(10,215,172,0.2)]">
                                {categoryNames.split(',')[0]} {/* Show primary category only for cleaner look */}
                            </span>
                        </div>
                    )}
                </CardHeader>

                {/* Footer - Glassmorphic Overlay */}
                <CardContent className="p-0 mt-auto relative z-10">
                    <div className="mx-2 mb-2 rounded-[16px] bg-white/40 backdrop-blur-md border border-white/50 p-4 transition-colors group-hover:bg-white/60">
                        <div className="flex items-center justify-between">
                            {/* Level Indicator (Left) */}
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                <Signal className="w-4 h-4 text-[#0AD7AC]" />
                                <span>{course.level}</span>
                            </div>

                            {/* Duration (Right - Replaces Enter Course) */}
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span>
                                    {course.durationHours} {language === "th" ? "ชม." : "Hrs"}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
