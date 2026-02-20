import { GuideForm } from "@/components/admin/guide-form";
import { query } from "@/lib/mysql-direct";
export const dynamic = "force-dynamic";

async function getCategories(): Promise<string[]> {
  try {
    const guides = await query(
      "SELECT DISTINCT category FROM guides WHERE category IS NOT NULL AND category != '' ORDER BY category",
      []
    ) as any[];
    return guides.map((g: any) => g.category).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function NewGuidePage() {
  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">เพิ่มคู่มือใหม่</h1>
      <GuideForm existingCategories={categories} />
    </div>
  );
}
