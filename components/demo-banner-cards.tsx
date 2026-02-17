"use client";

import { useLanguage } from "@/lib/language-context";
import { CourseCardLightTech } from "@/components/course-card-light-tech";
import type { Course, Category, Institution } from "@/lib/types";

interface DemoBannerCardsProps {
    courses: Course[];
    categories: Category[];
    institutions: Institution[];
}

export function DemoBannerCards({ courses, categories, institutions }: DemoBannerCardsProps) {
    const { language } = useLanguage();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {courses.map((course) => (
                <div key={course.id} className="h-full">
                    <CourseCardLightTech
                        course={course}
                        language={language}
                        categories={categories}
                        institutions={institutions}
                    />
                </div>
            ))}
        </div>
    );
}
