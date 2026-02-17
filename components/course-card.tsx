"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";
import { getImageUrl } from "@/lib/utils";
import type { Category, Institution, CourseType, CourseWithRelations } from "@/lib/types";
import { getIconComponent } from "@/lib/icon-map";

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
