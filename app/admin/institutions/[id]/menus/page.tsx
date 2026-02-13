import db from "@/lib/mysql-direct";
import { Institution } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// We will implement the actual client component for menu building later
import { MenuBuilder } from "@/components/admin/menu-builder";

// Mock implementation until real DB call works fully with new schema
async function getInstitution(id: string): Promise<Institution | null> {
    try {
        const rows = await db.query(
            `SELECT
            i.*,
            i.bannerUrl,
            i.primaryColor,
            i.secondaryColor,
            i.address,
            i.phoneNumber,
            i.email,
            i.socialLinks,
            i.metaTitle,
            i.metaDescription
           FROM institutions i WHERE i.id = ?`,
            [id]
        );
        const institutions = rows as Institution[];
        if (institutions.length === 0) return null;
        return institutions[0];
    } catch (error) {
        console.error("Error fetching institution:", error);
        return null;
    }
}

export default async function InstitutionMenusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const institution = await getInstitution(id);

    if (!institution) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/institutions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Menu Builder</h1>
                    <p className="text-muted-foreground">
                        Manage contact navigation menus for {institution.name}
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <MenuBuilder institutionId={institution.id} />
            </div>
        </div>
    );
}
