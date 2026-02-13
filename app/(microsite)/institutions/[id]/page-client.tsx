"use client";

import { Institution, CourseWithRelations, Category, CourseType, News } from "@/lib/types";
import { CourseCard } from "@/components/course-card";
import { useLanguage } from "@/lib/language-context";
import { SafeImage } from "@/components/safe-image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, SquarePlus, ArrowUpSquare, Search } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIconComponent } from "@/lib/icon-map";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Banner } from "@/lib/types";
import { BannerDisplay } from "@/components/public/banner-display";

interface InstitutionHomeClientProps {
    institution: Institution;
    newCourses: CourseWithRelations[];
    popularCourses: CourseWithRelations[];
    news: News[];
    categories: Category[];
    courseTypes: CourseType[];
    banners: Banner[];
}

export default function InstitutionHomeClient({
    institution,
    newCourses,
    popularCourses,
    news,
    categories,
    courseTypes,
    banners
}: InstitutionHomeClientProps) {
    const { language, t } = useLanguage();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/institutions/${institution.id}/courses?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="flex flex-col gap-0 pb-12 w-full">
            {/* Banner Section (Hero) */}
            {/* Banner Section (Hero) */}
            {banners && banners.length > 0 ? (
                <BannerDisplay banners={banners} language={language} />
            ) : (
                <section className="relative w-full h-[300px] md:h-[400px] bg-slate-900">
                    {institution.bannerUrl ? (
                        <SafeImage
                            src={institution.bannerUrl.startsWith("http") || institution.bannerUrl.startsWith("/") ? institution.bannerUrl : `/uploads/${institution.bannerUrl}`}
                            alt={institution.name}
                            fill
                            priority
                            className="object-cover opacity-80"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-50" />
                    )}

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="container px-4 text-center text-white space-y-6">
                            <div className="relative w-24 h-24 mx-auto bg-white rounded-xl p-2 shadow-lg mb-6">
                                {institution.logoUrl ? (
                                    <SafeImage
                                        src={institution.logoUrl.startsWith("http") || institution.logoUrl.startsWith("/") ? institution.logoUrl : `/uploads/${institution.logoUrl}`}
                                        alt={institution.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                ) : null}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold">
                                {language === 'th' ? institution.name : institution.nameEn}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto">
                                {institution.description || t("เรียนรู้ออนไลน์ได้ทุกที่ ทุกเวลา", "Learn online anywhere, anytime")}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Description Section */}
            {institution.description && (
                <section className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto text-center space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800">{t("เกี่ยวกับเรา", "About Us")}</h2>
                        <p className="text-slate-600 leading-relaxed font-light text-lg">
                            {institution.description}
                        </p>
                    </div>
                </section>
            )}

            {/* Search Box & Categories */}
            <section className="container mx-auto px-4 py-12">
                {/* Search Box */}
                <div className="w-full max-w-4xl mx-auto relative z-10 mb-12">
                    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder={t(
                                        "ค้นหารายวิชาภายในสถาบัน...",
                                        "Search for courses in this institution..."
                                    )}
                                    className="pl-10 h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="h-12 px-8 text-lg font-medium bg-primary hover:bg-primary/90"
                                style={{ borderRadius: '.2rem', backgroundColor: institution.primaryColor || undefined }}
                            >
                                {t("ค้นหา", "Search")}
                            </Button>
                        </form>
                    </div>
                </div>

                <h2 className="text-[1.2rem] font-bold mb-8 text-center md:text-left">
                    {t("หมวดหมู่รายวิชา", "Browse by Category")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => {
                        const IconComponent = getIconComponent(category.icon);
                        return (
                            <Link key={category.id} href={`/institutions/${institution.id}/courses?category=${category.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full group">
                                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors" style={{ color: institution.primaryColor || undefined }}>
                                            <IconComponent className="w-8 h-8" strokeWidth={1.5} style={{ color: institution.primaryColor || undefined }} />
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
                        <SquarePlus className="h-6 w-6 text-primary" style={{ color: institution.primaryColor || undefined }} />
                        <h2 className="text-[1.2rem] font-bold">
                            {t("รายวิชาใหม่", "New Courses")}
                        </h2>
                    </div>
                    <Button asChild variant="outline" style={{ borderRadius: '5px' }}>
                        <Link href={`/institutions/${institution.id}/courses`}>
                            {t("ดูทั้งหมด", "View All")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                {newCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                language={language}
                                institutions={[institution]}
                                categories={categories}
                                courseTypes={courseTypes}
                                primaryColor={institution.primaryColor}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">{t("ยังไม่มีรายวิชา", "No courses available")}</p>
                    </div>
                )}
            </section>

            {/* Popular Courses */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <ArrowUpSquare className="h-6 w-6 text-primary" style={{ color: institution.primaryColor || undefined }} />
                        <h2 className="text-[1.2rem] font-bold">
                            {t("รายวิชาได้รับความนิยมสูงสุด", "Popular Courses")}
                        </h2>
                    </div>
                    <Button asChild variant="outline" style={{ borderRadius: '5px' }}>
                        <Link href={`/institutions/${institution.id}/courses`}>
                            {t("ดูทั้งหมด", "View All")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                {popularCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                language={language}
                                institutions={[institution]}
                                categories={categories}
                                courseTypes={courseTypes}
                                primaryColor={institution.primaryColor}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <p className="text-muted-foreground">{t("ยังไม่มีรายวิชา", "No courses available")}</p>
                    </div>
                )}
            </section>

            {/* Institution News */}
            {news.length > 0 && (
                <section className="container mx-auto px-4 py-12 bg-gray-50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[1.2rem] font-bold">
                                {t("ข่าวประชาสัมพันธ์", "News & Activities")}
                            </h2>
                        </div>
                        <Button asChild variant="outline" style={{ borderRadius: '5px' }}>
                            <Link href={`/institutions/${institution.id}/news`}>
                                {t("ดูทั้งหมด", "View All")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {news.map((item) => (
                            <Link key={item.id} href={`/news/${item.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-none shadow-md">
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
            )}
        </div>
    );
}
