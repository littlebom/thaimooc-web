"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Guide {
  id?: string;
  title: string;
  content: string;
  category: string;
  keywords: string;
  is_active: boolean;
}

interface GuideFormProps {
  guide?: Guide;
  isEdit?: boolean;
  existingCategories?: string[];
}

export function GuideForm({ guide, isEdit = false, existingCategories = [] }: GuideFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const [formData, setFormData] = useState<Guide>({
    title: guide?.title || "",
    content: guide?.content || "",
    category: guide?.category || "",
    keywords: guide?.keywords || "",
    is_active: guide?.is_active !== undefined ? guide.is_active : true,
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("error", "กรุณากรอกหัวข้อคู่มือ");
      return;
    }
    if (!formData.content.trim() || formData.content === "<p></p>") {
      showToast("error", "กรุณากรอกเนื้อหาคู่มือ");
      return;
    }
    setLoading(true);

    try {
      const url = isEdit ? `/api/guides/${guide?.id}` : "/api/guides";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast("success", isEdit ? "แก้ไขคู่มือสำเร็จ" : "เพิ่มคู่มือสำเร็จ");
        setTimeout(() => {
          router.push("/admin/guides");
          router.refresh();
        }, 1000);
      } else {
        const data = await res.json();
        showToast("error", data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("error", "ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = existingCategories.filter(
    (c) => c.toLowerCase().includes(formData.category.toLowerCase()) && c !== formData.category
  );

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "แก้ไขคู่มือ" : "เพิ่มคู่มือใหม่"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                หัวข้อ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="เช่น วิธีการสมัครเรียนคอร์ส"
                maxLength={500}
              />
            </div>

            {/* Category with autocomplete */}
            <div className="space-y-2 relative">
              <Label htmlFor="category">หมวดหมู่</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setShowCategorySuggestions(true);
                }}
                onFocus={() => setShowCategorySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
                placeholder="เช่น การลงทะเบียน, การประเมินผล"
                autoComplete="off"
              />
              {showCategorySuggestions && filteredCategories.length > 0 && (
                <div className="absolute z-20 left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-0"
                      onMouseDown={() => {
                        setFormData({ ...formData, category: cat });
                        setShowCategorySuggestions(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              {existingCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {existingCategories.slice(0, 8).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                        formData.category === cat
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">คำค้นหา (คั่นด้วยเครื่องหมายจุลภาค)</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="เช่น สมัครเรียน,ลงทะเบียน,registration"
              />
              <p className="text-xs text-muted-foreground">
                คำค้นหาจะช่วยให้ Chatbot หาคำตอบได้ง่ายขึ้น
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                เนื้อหา <span className="text-red-500">*</span>
              </Label>
              <TiptapEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
              <p className="text-xs text-muted-foreground">
                ใช้ Rich Text Editor สำหรับจัดรูปแบบข้อความ
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">เปิดใช้งาน</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มคู่มือ"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/guides")}
              >
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
