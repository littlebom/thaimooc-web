"use client";

import { useLanguage } from "@/lib/language-context";
import { CourseCardDarkTech } from "@/components/course-card-dark-tech";
import type { Course, Category, Institution } from "@/lib/types";

interface DemoBannerCardsDarkProps {
    courses: Course[];
    categories: Category[];
    institutions: Institution[];
}

export function DemoBannerCardsDark({ courses, categories, institutions }: DemoBannerCardsDarkProps) {
    const { language } = useLanguage();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {courses.map((course) => (
                <div key={course.id} className="h-full">
                    <CourseCardDarkTech
                        course={course}
                        language={language}
                        categories={categories}
                        institutions={institutions}
                        courseTypes={[]} // Pass empty if not needed, or update prop to include it
                    />
                </div>
            ))}
        </div>
    );
}
