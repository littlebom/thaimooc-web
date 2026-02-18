"use client";

import { useLanguage } from "@/lib/language-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category, Institution, CourseType } from "@/lib/types";
import { Search } from "lucide-react";
import { getIconComponent } from "@/lib/icon-map";

interface CourseSearchFilterCardProps {
    categories: Category[];
    institutions: Institution[];
    courseTypes: CourseType[];
    searchQuery: string;
    selectedCategory: string;
    selectedInstitution: string;
    selectedCourseType: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onInstitutionChange: (value: string) => void;
    onCourseTypeChange: (value: string) => void;
    onClearFilters: () => void;
}

export function CourseSearchFilterCard({
    categories,
    institutions,
    courseTypes,
    searchQuery,
    selectedCategory,
    selectedInstitution,
    selectedCourseType,
    onSearchChange,
    onCategoryChange,
    onInstitutionChange,
    onCourseTypeChange,
    onClearFilters,
}: CourseSearchFilterCardProps) {
    const { language, t } = useLanguage();

    return (
        <div className="p-6 space-y-6 rounded-[5px] bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border border-blue-100/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] ring-1 ring-white/60">
            <h2 className="text-xl font-semibold text-[#0f172a]">
                {t("ค้นหาและกรองรายวิชา", "Search & Filter")}
            </h2>

            {/* Search */}
            <div className="space-y-2">
                <Label htmlFor="search-filter" className="text-sm font-medium text-slate-700">
                    {t("ค้นหาชื่อรายวิชา", "Search Course Title")}
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        id="search-filter"
                        placeholder={t("ค้นหา...", "Search...")}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-white/60 border-blue-100 focus:bg-white focus:ring-blue-200 transition-colors"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                    {t("หมวดหมู่", "Category")}
                </Label>
                <div className="space-y-1 pr-1">
                    <button
                        onClick={() => onCategoryChange("")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${selectedCategory === ""
                            ? "bg-primary text-primary-foreground shadow-sm font-medium"
                            : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                            }`}
                    >
                        <span className="truncate">{t("ทั้งหมด", "All")}</span>
                    </button>
                    {categories?.map((cat) => {
                        const IconComponent = getIconComponent(cat.icon);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryChange(cat.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground shadow-sm font-medium"
                                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                                    }`}
                            >
                                <IconComponent className={`w-4 h-4 flex-shrink-0 ${selectedCategory === cat.id ? "text-primary-foreground" : "text-slate-400 group-hover:text-slate-500"}`} />
                                <span className="truncate">
                                    {language === "th" ? cat.name : cat.nameEn}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Institution Filter */}
            <div className="space-y-2">
                <Label htmlFor="institution-filter" className="text-sm font-medium text-slate-700">
                    {t("สถาบันการศึกษา", "Institution")}
                </Label>
                <Select
                    value={selectedInstitution || "all"}
                    onValueChange={(value) => onInstitutionChange(value === "all" ? "" : value)}
                >
                    <SelectTrigger id="institution-filter" className="bg-white/60 border-blue-100 focus:ring-blue-200 focus:ring-2">
                        <SelectValue placeholder={t("ทั้งหมด", "All")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("ทั้งหมด", "All")}</SelectItem>
                        {institutions?.map((inst) => (
                            <SelectItem key={inst.id} value={inst.id}>
                                {language === "th" ? inst.name : inst.nameEn}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Course Type Filter */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                    {t("ประเภทรายวิชา", "Course Type")}
                </Label>
                <div className="space-y-1 pr-1">
                    <button
                        onClick={() => onCourseTypeChange("")}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${selectedCourseType === ""
                            ? "bg-primary text-primary-foreground shadow-sm font-medium"
                            : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                            }`}
                    >
                        <span className="truncate">{t("ทั้งหมด", "All")}</span>
                    </button>
                    {courseTypes?.map((type) => {
                        const IconComponent = getIconComponent(type.icon || "BookOpen");
                        return (
                            <button
                                key={type.id}
                                onClick={() => onCourseTypeChange(type.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${selectedCourseType === type.id
                                    ? "bg-primary text-primary-foreground shadow-sm font-medium"
                                    : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                                    }`}
                            >
                                <IconComponent className={`w-4 h-4 flex-shrink-0 ${selectedCourseType === type.id ? "text-primary-foreground" : "text-slate-400 group-hover:text-slate-500"}`} />
                                <span className="truncate">
                                    {language === "th" ? type.name : type.nameEn}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedInstitution || selectedCourseType) && (
                <button
                    onClick={onClearFilters}
                    className="w-full py-2 text-sm text-slate-500 hover:text-primary hover:bg-white/60 rounded-lg transition-colors dashed-border border-blue-200"
                >
                    {t("ล้างตัวกรอง", "Clear Filters")}
                </button>
            )}
        </div>
    );
}
