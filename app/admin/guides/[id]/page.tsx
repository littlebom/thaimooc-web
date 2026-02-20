import { notFound } from "next/navigation";
import { GuideForm } from "@/components/admin/guide-form";
import { query } from "@/lib/mysql-direct";
export const dynamic = "force-dynamic";

async function getGuide(id: string) {
  try {
    const guides = await query("SELECT * FROM guides WHERE id = ?", [id]);
    return guides.length > 0 ? (guides[0] as any) : null;
  } catch {
    return null;
  }
}

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

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [guide, categories] = await Promise.all([getGuide(id), getCategories()]);
  if (!guide) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">แก้ไขคู่มือ</h1>
      <GuideForm guide={guide} isEdit={true} existingCategories={categories} />
    </div>
  );
}
