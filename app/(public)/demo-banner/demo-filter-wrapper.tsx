"use client";

import { useState } from "react";
import { CourseSearchFilterCard } from "@/components/course-search-filter-card";
import type { Category, Institution, CourseType } from "@/lib/types";

interface DemoFilterWrapperProps {
    categories: Category[];
    institutions: Institution[];
    courseTypes: CourseType[];
}

export function DemoFilterWrapper({
    categories,
    institutions,
    courseTypes,
}: DemoFilterWrapperProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [selectedCourseType, setSelectedCourseType] = useState("");

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedInstitution("");
        setSelectedCourseType("");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <CourseSearchFilterCard
                    categories={categories}
                    institutions={institutions}
                    courseTypes={courseTypes}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    selectedInstitution={selectedInstitution}
                    selectedCourseType={selectedCourseType}
                    onSearchChange={setSearchQuery}
                    onCategoryChange={setSelectedCategory}
                    onInstitutionChange={setSelectedInstitution}
                    onCourseTypeChange={setSelectedCourseType}
                    onClearFilters={handleClearFilters}
                />
            </aside>
            <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Filter State Preview</h3>
                    <pre className="text-left bg-slate-50 p-4 rounded-lg text-sm text-slate-700 overflow-auto max-w-md mx-auto">
                        {JSON.stringify({
                            searchQuery,
                            selectedCategory,
                            selectedInstitution,
                            selectedCourseType
                        }, null, 2)}
                    </pre>
                    <p className="text-slate-500 text-sm">
                        This area demonstrates that the filter card is interactive and updating state correctly.
                    </p>
                </div>
            </div>
        </div>
    );
}
