"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Category, Institution, CourseType, CourseWithRelations } from "@/lib/types";
import { Search } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { getIconComponent } from "@/lib/icon-map";
import { Pagination } from "@/components/pagination";

interface MicrositeCoursesClientProps {
    initialCourses: CourseWithRelations[];
    categories: Category[];
    institution: Institution;
    courseTypes: CourseType[];
}

function MicrositeCoursesContent({
    initialCourses,
    categories,
    institution,
    courseTypes,
}: MicrositeCoursesClientProps) {
    const { language, t } = useLanguage();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    // Use initial data passed from server (already filtered by institution)
    const [allCourses] = useState<CourseWithRelations[]>(initialCourses);
    const [filteredCourses, setFilteredCourses] = useState<CourseWithRelations[]>(initialCourses);

    const [searchQuery, setSearchQuery] = useState(searchParam || "");
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
    const [selectedCourseType, setSelectedCourseType] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 30;

    // Update filters when URL params change
    useEffect(() => {
        setSelectedCategory(categoryParam || "");
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [categoryParam, searchParam]);

    useEffect(() => {
        let filtered = [...allCourses];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (course) =>
                    course.title.toLowerCase().includes(query) ||
                    course.titleEn.toLowerCase().includes(query) ||
                    course.description.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(
                (course) => {
                    const categories = course.courseCategories || course.course_categories || [];
                    return categories.some((cc) => cc.categoryId === selectedCategory);
                }
            );
        }

        // Filter by course type
        if (selectedCourseType) {
            filtered = filtered.filter(
                (course) => {
                    const types = course.courseCourseTypes || course.course_course_types || [];
                    return types.some((ct) => ct.courseTypeId === selectedCourseType);
                }
            );
        }

        setFilteredCourses(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchQuery, selectedCategory, selectedCourseType, allCourses]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    {language === "th" ? "รายวิชาทั้งหมด" : "All Courses"}
                </h1>
                <p className="text-slate-500">
                    {language === "th" ? institution.name : institution.nameEn}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("ค้นหาและกรองรายวิชา", "Search & Filter")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Search */}
                            <div>
                                <Label htmlFor="search">
                                    {t("ค้นหาชื่อรายวิชา", "Search Course Title")}
                                </Label>
                                <div className="relative mt-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder={t("ค้นหา...", "Search...")}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <Label>
                                    {t("หมวดหมู่", "Category")}
                                </Label>
                                <div className="mt-2 space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory("")}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === ""
                                            ? "font-medium shadow-sm"
                                            : "hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                        style={selectedCategory === "" ? {
                                            backgroundColor: institution.primaryColor || 'var(--primary)',
                                            color: '#ffffff'
                                        } : undefined}
                                    >
                                        {t("ทั้งหมด", "All")}
                                    </button>
                                    {categories?.map((cat) => {
                                        const IconComponent = getIconComponent(cat.icon);
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === cat.id
                                                    ? "font-medium shadow-sm"
                                                    : "hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                style={selectedCategory === cat.id ? {
                                                    backgroundColor: institution.primaryColor || 'var(--primary)',
                                                    color: '#ffffff'
                                                } : undefined}
                                            >
                                                <IconComponent className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">
                                                    {language === "th" ? cat.name : cat.nameEn}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* NO Institution Filter Here (Specific for Microsite) */}

                            {/* Course Type Filter */}
                            <div>
                                <Label>
                                    {t("ประเภทรายวิชา", "Course Type")}
                                </Label>
                                <div className="mt-2 space-y-1">
                                    <button
                                        onClick={() => setSelectedCourseType("")}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${selectedCourseType === ""
                                            ? "font-medium shadow-sm"
                                            : "hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                        style={selectedCourseType === "" ? {
                                            backgroundColor: institution.primaryColor || 'var(--primary)',
                                            color: '#ffffff'
                                        } : undefined}
                                    >
                                        {t("ทั้งหมด", "All")}
                                    </button>
                                    {courseTypes?.map((type) => {
                                        const IconComponent = getIconComponent(type.icon || "BookOpen");
                                        return (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedCourseType(type.id)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${selectedCourseType === type.id
                                                    ? "font-medium shadow-sm"
                                                    : "hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                style={selectedCourseType === type.id ? {
                                                    backgroundColor: institution.primaryColor || 'var(--primary)',
                                                    color: '#ffffff'
                                                } : undefined}
                                            >
                                                <IconComponent className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">
                                                    {language === "th" ? type.name : type.nameEn}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(searchQuery || selectedCategory || selectedCourseType) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("");
                                        setSelectedCourseType("");
                                    }}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {t("ล้างตัวกรอง", "Clear Filters")}
                                </button>
                            )}
                        </CardContent>
                    </Card>
                </aside>

                {/* Course Grid */}
                <div className="lg:col-span-3">
                    <div className="mb-4 text-sm text-muted-foreground">
                        {filteredCourses.length > 0 ? t(
                            `แสดง ${startIndex + 1}-${Math.min(endIndex, filteredCourses.length)} จาก ${filteredCourses.length} คอร์ส`,
                            `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCourses.length)} of ${filteredCourses.length} courses`
                        ) : t(
                            `แสดง 0 คอร์ส`,
                            `Showing 0 courses`
                        )}
                    </div>

                    {filteredCourses.length === 0 ? (
                        <Card className="p-12 text-center">
                            <p className="text-lg text-muted-foreground">
                                {t(
                                    "ไม่พบคอร์สที่ตรงกับเงื่อนไขการค้นหา",
                                    "No courses found matching your criteria"
                                )}
                            </p>
                        </Card>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {paginatedCourses?.map((course) => (
                                    <Link key={course.id} href={`/courses/${(course as any).courseCode || course.id}`}>
                                        <Card className="hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                                            <div className="relative h-48">
                                                <SafeImage
                                                    src={getImageUrl(course.imageId)}
                                                    alt={language === "th" ? course.title : course.titleEn}
                                                    fill
                                                    className="object-cover rounded-t-lg"
                                                    fallbackType="course"
                                                />
                                                {/* Course Type Icons */}
                                                {(() => {
                                                    const types = course.courseCourseTypes || course.course_course_types || [];
                                                    if (types.length > 0 && courseTypes.length > 0) {
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
                                                                            style={{ backgroundColor: institution.primaryColor || 'var(--primary)' }}
                                                                            title={item!.name}
                                                                        >
                                                                            <Icon className="h-4 w-4" />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                            <CardHeader className="flex-grow">
                                                <CardTitle className="line-clamp-2 text-base">
                                                    {language === "th" ? course.title : course.titleEn}
                                                </CardTitle>
                                                {/* Hide institution name in card if redundant, but user might want it */}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {language === "th" ? institution.name : institution.nameEn}
                                                </p>
                                                {(() => {
                                                    const courseCategories = course.courseCategories || course.course_categories || [];
                                                    const categoryNames = courseCategories
                                                        .map((cc) => {
                                                            const category = categories.find(c => c.id === cc.categoryId);
                                                            return category ? (language === "th" ? category.name : category.nameEn) : null;
                                                        })
                                                        .filter(Boolean)
                                                        .join(", ");

                                                    if (!categoryNames) return null;

                                                    return (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {categoryNames}
                                                        </p>
                                                    );
                                                })()}
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
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                translations={{
                                    previous: t("ก่อนหน้า", "Previous"),
                                    next: t("ถัดไป", "Next"),
                                    pageOf: (current, total) => t(`หน้า ${current} จาก ${total}`, `Page ${current} of ${total}`)
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MicrositeCoursesClient(props: MicrositeCoursesClientProps) {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <MicrositeCoursesContent {...props} />
        </Suspense>
    );
}
