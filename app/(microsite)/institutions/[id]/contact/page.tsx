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

                {/* Optional: Map or additional info */}
                <div className="h-full min-h-[300px] bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    {/* Placeholder for Map */}
                    <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Map Preview</p>
                        <p className="text-xs max-w-xs mx-auto mt-2">(Interactive map integration requires API Key)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
