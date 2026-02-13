import { notFound } from "next/navigation";
import db from "@/lib/mysql-direct";
import { Institution, CourseWithRelations, Category, CourseType, News } from "@/lib/types";
import InstitutionHomeClient from "./page-client";
import { getCategories, getCourseTypes } from "@/lib/data-service";

async function getInstitution(id: string): Promise<Institution | null> {
    try {
        const result = await db.query("SELECT * FROM institutions WHERE id = ?", [id]);
        const rows = result as any[];
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        return null;
    }
}

async function getInstitutionCourses(institutionId: string, sort: 'newest' | 'popular' = 'newest'): Promise<CourseWithRelations[]> {
    try {
        let orderBy = "createdAt DESC";
        if (sort === 'popular') {
            orderBy = "enrollCount DESC"; // Assuming enrollCount exists, otherwise fallback to createdAt
        }

        const courses = await db.query(
            `SELECT DISTINCT c.* 
             FROM courses c 
             LEFT JOIN institution_guest_courses igc ON c.id = igc.courseId 
             WHERE (c.institutionId = ? OR igc.institutionId = ?) 
             AND c.isActive = 1 
             ORDER BY c.${orderBy} 
             LIMIT 4`,
            [institutionId, institutionId]
        );
        return courses as CourseWithRelations[];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

async function getInstitutionNews(institutionId: string): Promise<News[]> {
    try {
        const news = await db.query(
            "SELECT * FROM news WHERE institutionId = ? ORDER BY createdAt DESC LIMIT 4",
            [institutionId]
        );
        return news as News[];
    } catch (error) {
        return [];
    }
}

export default async function InstitutionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const institution = await getInstitution(id);

    if (!institution) {
        notFound();
    }

    const [newCourses, popularCourses, news, categories, courseTypes, banners] = await Promise.all([
        getInstitutionCourses(institution.id, 'newest'),
        getInstitutionCourses(institution.id, 'popular'),
        getInstitutionNews(institution.id),
        getCategories(),
        getCourseTypes(),
        db.query("SELECT * FROM banners WHERE institutionId = ? AND isActive = 1 ORDER BY `order` ASC", [institution.id]) as Promise<any[]>
    ]);

    // Fetch relations for courses manually (same fix as in courses page) to ensure filtering/display works
    const enrichCourses = async (rawCourses: any[]) => {
        if (!rawCourses.length) return [];
        const courseIds = rawCourses.map(c => c.id);
        const placeholders = courseIds.map(() => '?').join(',');
        const [cats, types] = await Promise.all([
            db.query(`SELECT * FROM course_categories WHERE courseId IN (${placeholders})`, courseIds) as Promise<any[]>,
            db.query(`SELECT * FROM course_course_types WHERE courseId IN (${placeholders})`, courseIds) as Promise<any[]>
        ]);
        return rawCourses.map(c => ({
            ...c,
            courseCategories: cats.filter(cc => cc.courseId === c.id),
            courseCourseTypes: types.filter(ct => ct.courseId === c.id)
        }));
    };

    const enrichedNewCourses = await enrichCourses(newCourses);
    const enrichedPopularCourses = await enrichCourses(popularCourses);

    return (
        <InstitutionHomeClient
            institution={institution}
            newCourses={enrichedNewCourses}
            popularCourses={enrichedPopularCourses}
            news={news}
            categories={categories || []}
            courseTypes={courseTypes || []}
            banners={banners || []}
        />
    );
}
