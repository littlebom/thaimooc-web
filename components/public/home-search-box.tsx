"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function HomeSearchBox() {
    const router = useRouter();
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto relative z-10">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={t(
                                "ค้นหารายวิชาที่น่าสนใจ...",
                                "Search for interesting courses..."
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
                        style={{ borderRadius: '.2rem' }}
                    >
                        {t("ค้นหา", "Search")}
                    </Button>
                </form>
            </div>
        </div>
    );
}
