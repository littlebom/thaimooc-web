"use client";

import Link from "next/link";
import { Institution, Menu, MenuItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { SafeImage } from "@/components/safe-image";

import { useLanguage } from "@/lib/language-context";
import { Globe, Blocks } from "lucide-react";

interface MicrositeHeaderProps {
    institution: Institution;
    menuItems: MenuItem[];
}

export function MicrositeHeader({ institution, menuItems }: MicrositeHeaderProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    // If no logo, use name
    const Logo = () => (
        <Link href={`/institutions/${institution.id}`}>
            {institution.logoUrl ? (
                <div className="relative h-12 w-12 md:h-16 md:w-16">
                    <SafeImage
                        src={institution.logoUrl.startsWith("http") || institution.logoUrl.startsWith("/") ? institution.logoUrl : `/uploads/${institution.logoUrl}`}
                        alt={institution.name}
                        fill
                        className="object-contain"
                    />
                </div>
            ) : (
                <span className="text-xl font-bold">{institution.abbreviation || institution.name}</span>
            )}
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        <Logo />
                        <div className="hidden md:block">
                            <h1 className="text-lg font-semibold leading-tight text-slate-900">{institution.name}</h1>
                            <p className="text-sm text-slate-500">{institution.nameEn}</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <nav className="flex items-center gap-6">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url.startsWith("http") ? item.url : `/institutions/${institution.id}${item.url}`}
                                    target={item.target}
                                    className={cn(
                                        "text-[1rem] font-medium transition-colors hover:text-primary",
                                        // Simple active check - can be improved
                                        pathname === `/institutions/${institution.id}${item.url}` || (item.url === '/' && pathname === `/institutions/${institution.id}`)
                                            ? "text-primary font-bold"
                                            : "text-slate-600"
                                    )}
                                    style={{
                                        color: (pathname === `/institutions/${institution.id}${item.url}` || (item.url === '/' && pathname === `/institutions/${institution.id}`))
                                            ? (institution.primaryColor || undefined)
                                            : undefined
                                    }}
                                >
                                    {language === "th" ? item.label : (item.labelEn || item.label)}
                                </Link>
                            ))}
                        </nav>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 border-l pl-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLanguage(language === "th" ? "en" : "th")}
                                className="flex items-center gap-2"
                                style={{ borderRadius: '5px' }}
                            >
                                <Globe className="h-4 w-4" />
                                <span className="hidden sm:inline">{language === "th" ? "EN" : "TH"}</span>
                            </Button>

                            <Button
                                asChild
                                variant="default"
                                size="sm"
                                className="hidden sm:flex items-center gap-2"
                                style={{
                                    borderRadius: '5px',
                                    backgroundColor: institution.primaryColor || undefined
                                }}
                            >
                                <Link href="https://learn.thaimooc.ac.th/dashboard" target="_blank" rel="noopener noreferrer">
                                    <Blocks className="h-4 w-4" />
                                    {t("เข้าห้องเรียน", "My Classroom")}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <MenuIcon />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-white p-4 space-y-4">
                    <div className="mb-4">
                        <h1 className="text-lg font-semibold leading-tight text-slate-900">{institution.name}</h1>
                        <p className="text-sm text-slate-500">{institution.nameEn}</p>
                    </div>
                    <nav className="flex flex-col space-y-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.url.startsWith("http") ? item.url : `/institutions/${institution.id}${item.url}`}
                                target={item.target}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "text-base font-medium p-2 rounded-md hover:bg-slate-50",
                                    pathname === `/institutions/${institution.id}${item.url}`
                                        ? "bg-slate-50 text-primary font-bold"
                                        : "text-slate-600"
                                )}
                                style={{
                                    color: (pathname === `/institutions/${institution.id}${item.url}` || (item.url === '/' && pathname === `/institutions/${institution.id}`))
                                        ? (institution.primaryColor || undefined)
                                        : undefined
                                }}
                            >
                                {language === "th" ? item.label : (item.labelEn || item.label)}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="border-t pt-4 space-y-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setLanguage(language === "th" ? "en" : "th");
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-2"
                            style={{ borderRadius: '5px' }}
                        >
                            <Globe className="h-4 w-4" />
                            {t("เปลี่ยนเป็นภาษาอังกฤษ", "Switch to Thai")}
                        </Button>
                        <Button
                            asChild
                            variant="default"
                            size="sm"
                            className="w-full flex items-center justify-center gap-2"
                            style={{
                                borderRadius: '5px',
                                backgroundColor: institution.primaryColor || undefined
                            }}
                        >
                            <Link href="https://learn.thaimooc.ac.th/dashboard" target="_blank" rel="noopener noreferrer">
                                <Blocks className="h-4 w-4" />
                                {t("เข้าห้องเรียน", "My Classroom")}
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
