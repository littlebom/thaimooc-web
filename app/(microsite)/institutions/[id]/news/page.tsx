import { getNews } from "@/lib/data-service";
import NewsPageClient from "@/app/(public)/news/page-client";

export const dynamic = 'force-dynamic';

export default async function InstitutionNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const news = await getNews(undefined, id);

    return (
        <NewsPageClient
            news={news}
            basePath={`/institutions/${id}/news`}
        />
    );
}
