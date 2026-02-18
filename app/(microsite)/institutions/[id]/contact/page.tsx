import { notFound } from "next/navigation";
import db from "@/lib/mysql-direct";
import { Institution } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, Facebook, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

async function getInstitution(id: string): Promise<Institution | null> {
    try {
        const result = await db.query("SELECT * FROM institutions WHERE id = ?", [id]);
        const rows = result as any[];
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        return null;
    }
}

export default async function InstitutionContactPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const institution = await getInstitution(id);

    if (!institution) {
        notFound();
    }

    const socialLinks = institution.socialLinks as any || {};

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                    <Card className="h-full border-none shadow-lg">
                        <CardContent className="p-8 space-y-6">
                            <h2 className="text-xl font-semibold text-primary">Get in Touch</h2>

                            <div className="space-y-4">
                                {institution.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="bg-slate-100 p-3 rounded-full">
                                            <MapPin className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Address</p>
                                            <p className="text-slate-600">{institution.address}</p>
                                        </div>
                                    </div>
                                )}

                                {institution.phoneNumber && (
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-3 rounded-full">
                                            <Phone className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Phone</p>
                                            <a href={`tel:${institution.phoneNumber}`} className="text-slate-600 hover:text-primary transition-colors">
                                                {institution.phoneNumber}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {institution.email && (
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-3 rounded-full">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Email</p>
                                            <a href={`mailto:${institution.email}`} className="text-slate-600 hover:text-primary transition-colors">
                                                {institution.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-primary">Social Media</h2>
                                <div className="flex gap-4">
                                    {socialLinks.facebook && (
                                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-50 p-3 rounded-full hover:bg-blue-100 transition-colors">
                                            <Facebook className="w-6 h-6 text-blue-600" />
                                        </a>
                                    )}
                                    {socialLinks.line && (
                                        <a href={socialLinks.line} target="_blank" rel="noopener noreferrer" className="bg-green-50 p-3 rounded-full hover:bg-green-100 transition-colors">
                                            <MessageCircle className="w-6 h-6 text-green-600" />
                                        </a>
                                    )}
                                    {institution.website && (
                                        <a href={institution.website} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-3 rounded-full hover:bg-slate-100 transition-colors">
                                            <Globe className="w-6 h-6 text-slate-600" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Section */}
                <div className="h-full min-h-[300px] rounded-lg overflow-hidden">
                    {institution.mapUrl ? (
                        <iframe
                            src={institution.mapUrl}
                            width="100%"
                            height="100%"
                            style={{ minHeight: "300px", border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`แผนที่ ${institution.name}`}
                        />
                    ) : institution.address ? (
                        <div className="h-full min-h-[300px] bg-slate-50 border rounded-lg flex flex-col items-center justify-center gap-4 p-8 text-center">
                            <div className="bg-slate-100 p-4 rounded-full">
                                <MapPin className="w-10 h-10 text-slate-400" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700 mb-1">ที่อยู่</p>
                                <p className="text-slate-500 text-sm">{institution.address}</p>
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(institution.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                                style={{ backgroundColor: institution.primaryColor || "#3b82f6" }}
                            >
                                <MapPin className="w-4 h-4" />
                                ดูบน Google Maps
                            </a>
                        </div>
                    ) : (
                        <Card className="h-full border-none shadow-lg">
                            <CardContent className="h-full min-h-[300px] flex items-center justify-center p-8">
                                <div className="text-center text-slate-400">
                                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">ยังไม่มีข้อมูลที่อยู่</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
