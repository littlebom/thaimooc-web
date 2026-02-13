"use client";

import Link from "next/link";
import { Institution, MenuItem } from "@/lib/types";
import { Mail, Phone, MapPin } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { useLanguage } from "@/lib/language-context";

interface MicrositeFooterProps {
    institution: Institution;
    menuItems: MenuItem[];
}

export function MicrositeFooter({ institution, menuItems }: MicrositeFooterProps) {
    const socialLinks = institution.socialLinks as any || {};
    const { language, t } = useLanguage();

    return (
        <footer className="bg-slate-900 text-slate-200 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand / Logo */}
                    <div className="space-y-4">
                        {institution.logoUrl && (
                            <div className="relative h-16 w-16 bg-white rounded-lg p-1">
                                <SafeImage
                                    src={institution.logoUrl.startsWith("http") || institution.logoUrl.startsWith("/") ? institution.logoUrl : `/uploads/${institution.logoUrl}`}
                                    alt={institution.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {language === "th" ? institution.name : (institution.nameEn || institution.name)}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
                                {language === "th"
                                    ? (institution.description || institution.descriptionEn)
                                    : (institution.descriptionEn || institution.description)
                                }
                            </p>
                        </div>
                    </div>

                    {/* Quick Links (Footer Menu) */}
                    <div>
                        <h4 className="text-md font-semibold text-white mb-4">{t("เมนูลัด", "Quick Links")}</h4>
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.url.startsWith("http") ? item.url : `/institutions/${institution.id}${item.url}`}
                                        target={item.target}
                                        className="text-sm hover:text-white transition-colors"
                                    >
                                        {language === "th" ? item.label : (item.labelEn || item.label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-md font-semibold text-white mb-4">{t("ติดต่อเรา", "Contact Us")}</h4>
                        <div className="space-y-3 text-sm">
                            {(institution.address || institution.addressEn) && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                                    <span>
                                        {language === "th"
                                            ? (institution.address || institution.addressEn)
                                            : (institution.addressEn || institution.address)
                                        }
                                    </span>
                                </div>
                            )}
                            {institution.phoneNumber && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                                    <a href={`tel:${institution.phoneNumber}`} className="hover:text-white">{institution.phoneNumber}</a>
                                </div>
                            )}
                            {institution.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                                    <a href={`mailto:${institution.email}`} className="hover:text-white">{institution.email}</a>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} {institution.name}. All rights reserved. Powered by ThaiMOOC.
                </div>
            </div>
        </footer>
    );
}
