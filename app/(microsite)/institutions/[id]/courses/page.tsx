import { notFound } from "next/navigation";
import db from "@/lib/mysql-direct";
import { Institution, CourseWithRelations, Category, CourseType } from "@/lib/types";
import { CourseCard } from "@/components/course-card";
import { getCategories, getCourseTypes } from "@/lib/data-service";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MicrositeCoursesClient from "./page-client";

async function getInstitution(id: string): Promise<Institution | null> {
    try {
        const result = await db.query("SELECT * FROM institutions WHERE id = ?", [id]);
        const rows = result as any[];
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        return null;
    }
}

async function getAllInstitutionCourses(institutionId: string): Promise<CourseWithRelations[]> {
    try {
        const courses = await db.query(
            "SELECT * FROM courses WHERE institutionId = ? AND isActive = 1 ORDER BY createdAt DESC",
            [institutionId]
        ) as any[];

        if (!courses.length) return [];

        const courseIds = courses.map(c => c.id);
        const placeholders = courseIds.map(() => '?').join(',');

        // Parallel fetch for relations
        const [courseCategories, courseTypes] = await Promise.all([
            db.query(
                `SELECT * FROM course_categories WHERE courseId IN (${placeholders})`,
                courseIds
            ) as Promise<any[]>,
            db.query(
                `SELECT * FROM course_course_types WHERE courseId IN (${placeholders})`,
                courseIds
            ) as Promise<any[]>
        ]);

        // Map relations back to courses
        return courses.map(course => ({
            ...course,
            courseCategories: courseCategories.filter(cc => cc.courseId === course.id),
            courseCourseTypes: courseTypes.filter(ct => ct.courseId === course.id)
        })) as CourseWithRelations[];

    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

export default async function InstitutionCoursesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const institution = await getInstitution(id);

    if (!institution) {
        notFound();
    }

    const [courses, categories, courseTypes] = await Promise.all([
        getAllInstitutionCourses(institution.id),
        getCategories(),
        getCourseTypes()
    ]);

    // Sort categories and course types
    const sortedCategories = [...(categories || [])].sort((a, b) => {
        const nameA = a.name || a.nameEn || '';
        const nameB = b.name || b.nameEn || '';
        return nameA.localeCompare(nameB, 'th');
    });

    const sortedCourseTypes = [...(courseTypes || [])].sort((a, b) => {
        const nameA = a.name || a.nameEn || '';
        const nameB = b.name || b.nameEn || '';
        return nameA.localeCompare(nameB, 'th');
    });

    return (
        <MicrositeCoursesClient
            initialCourses={JSON.parse(JSON.stringify(courses))}
            categories={JSON.parse(JSON.stringify(sortedCategories))}
            institution={JSON.parse(JSON.stringify(institution))}
            courseTypes={JSON.parse(JSON.stringify(sortedCourseTypes))}
        />
    );
}
