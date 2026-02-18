import { notFound } from "next/navigation";
import db from "@/lib/mysql-direct";
import type { News } from "@/lib/types";
import InstitutionNewsDetailClient from "./page-client";

async function getNews(newsId: string): Promise<News | null> {
    try {
        const result = await db.query("SELECT * FROM news WHERE id = ?", [newsId]);
        const rows = result as any[];
        if (!rows.length) return null;
        const row = rows[0];
        return {
            ...row,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
        };
    } catch {
        return null;
    }
}

export default async function InstitutionNewsDetailPage({
    params,
}: {
    params: Promise<{ id: string; newsId: string }>;
}) {
    const { id, newsId } = await params;
    const news = await getNews(newsId);

    if (!news) {
        notFound();
    }

    return <InstitutionNewsDetailClient news={news} institutionId={id} />;
}
