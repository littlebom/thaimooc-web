import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GuidesList } from "@/components/admin/guides-list";

async function getGuides() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/guides?active=true`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching guides:", error);
    return [];
  }
}

export default async function AdminGuidesPage() {
  const guides = await getGuides();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">คู่มือและคำถามที่พบบ่อย</h1>
        <Link href="/admin/guides/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มคู่มือใหม่
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>รายการคู่มือทั้งหมด ({guides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <GuidesList initialGuides={guides} />
        </CardContent>
      </Card>
    </div>
  );
}
