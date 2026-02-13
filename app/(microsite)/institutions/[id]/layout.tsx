import { notFound } from "next/navigation";
import db from "@/lib/mysql-direct";
import { Institution, Menu, MenuItem } from "@/lib/types";
import { MicrositeHeader } from "@/components/microsite/header";
import { MicrositeFooter } from "@/components/microsite/footer";
import { Metadata, ResolvingMetadata } from "next";

// Helper to fetch institution data
async function getInstitution(id: string): Promise<Institution | null> {
    try {
        const result = await db.query(
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
        const rows = result as any[];
        if (rows.length === 0) return null;
        return rows[0] as Institution;
    } catch (error) {
        console.error("Error fetching institution:", error);
        return null;
    }
}

// Helper to fetch menus
async function getMenus(institutionId: string) {
    try {
        const menusResult = await db.query(
            "SELECT * FROM menus WHERE institutionId = ?",
            [institutionId]
        );
        const menus = menusResult as any[];

        const headerMenu = menus.find(m => m.position === 'header');
        const footerMenu = menus.find(m => m.position === 'footer');

        let headerItems: MenuItem[] = [];
        let footerItems: MenuItem[] = [];

        if (headerMenu) {
            const items = await db.query(
                "SELECT * FROM menu_items WHERE menuId = ? ORDER BY `order` ASC",
                [headerMenu.id]
            );
            headerItems = items as any[];
        }

        if (footerMenu) {
            const items = await db.query(
                "SELECT * FROM menu_items WHERE menuId = ? ORDER BY `order` ASC",
                [footerMenu.id]
            );
            footerItems = items as any[];
        }

        return { headerItems, footerItems };
    } catch (error) {
        console.error("Error fetching menus:", error);
        return { headerItems: [], footerItems: [] };
    }
}


// Dynamic Metadata
export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const institution = await getInstitution(id);

    if (!institution) {
        return {
            title: 'Institution Not Found',
        };
    }

    return {
        title: institution.metaTitle || institution.name,
        description: institution.metaDescription || `Courses offered by ${institution.nameEn}`,
        openGraph: {
            title: institution.metaTitle || institution.name,
            description: institution.metaDescription || `Courses offered by ${institution.nameEn}`,
            images: institution.bannerUrl ? [institution.bannerUrl] : [],
        }
    };
}

export default async function MicrositeLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    let institution;
    try {
        const { id } = await params;
        institution = await getInstitution(id);
    } catch (e) {
        return <div className="p-10 text-red-500">Error loading institution: {(e as any).message}</div>
    }

    if (!institution) {
        // Debugging: return 404 details instead of generic notFound()
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-600">Institution Not Found (Debug)</h1>
                    <p className="text-slate-600">ID: {(await params).id}</p>
                    <p className="text-slate-500 text-sm">Please check the URL or database.</p>
                </div>
            </div>
        );
    }

    // Check if microsite is enabled (Institution Admin can toggle this)
    // If you are admin, you might want to see it anyway. 
    // For now, we enforce it strictly.
    if (!institution.micrositeEnabled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-slate-900">System Maintenance</h1>
                    <p className="text-slate-600">The microsite for {institution.name} is currently under maintenance or disabled.</p>
                </div>
            </div>
        );
    }

    const { headerItems: dbHeaderItems, footerItems: dbFooterItems } = await getMenus(institution.id);

    let headerItems = dbHeaderItems;
    let menuItems = dbHeaderItems; // Alias for passed prop if needed, though variable name reuse is cleaner

    // Default Menus Logic
    if (headerItems.length === 0) {
        // Note: The Header component automatically prepends /institutions/[id] to relative URLs
        headerItems = [
            { id: 'def-1', label: 'หน้าหลัก', labelEn: 'Home', url: `/`, order: 1, target: '_self', menuId: 'default', createdAt: new Date(), updatedAt: new Date() },
            { id: 'def-2', label: 'รายวิชาทั้งหมด', labelEn: 'All Courses', url: `/courses`, order: 2, target: '_self', menuId: 'default', createdAt: new Date(), updatedAt: new Date() },
            { id: 'def-3', label: 'ข่าวประชาสัมพันธ์', labelEn: 'News', url: `/news`, order: 3, target: '_self', menuId: 'default', createdAt: new Date(), updatedAt: new Date() },
            { id: 'def-4', label: 'ติดต่อเรา', labelEn: 'Contact', url: `/contact`, order: 4, target: '_self', menuId: 'default', createdAt: new Date(), updatedAt: new Date() },
        ];
    }

    // Reuse header items for footer if footer is empty (standard fallback)
    const footerItems = dbFooterItems.length > 0 ? dbFooterItems : headerItems;

    // Default CSS variables for branding colors
    const style = {
        '--primary': institution.primaryColor || '#1e40af', // Default fallback
        '--secondary': institution.secondaryColor || '#f59e0b',
    } as React.CSSProperties;

    return (
        <div className="min-h-screen flex flex-col bg-white" style={style}>
            <MicrositeHeader institution={institution} menuItems={headerItems} />
            <main className="flex-1">
                {children}
            </main>
            <MicrositeFooter institution={institution} menuItems={footerItems} />
        </div>
    );
}
