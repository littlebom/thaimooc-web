"use client";

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, HelpCircle, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Guide {
  id: string;
  title: string;
  category: string;
  view_count: number;
  updated_at: string;
}

function SupportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ active: "true", limit: "200" });
      if (q) params.set("search", q);
      const res = await fetch(`/api/guides?${params}`);
      const data = await res.json();
      setGuides(data.success ? data.data : []);
    } catch {
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
    fetchGuides(q);
  }, [searchParams, fetchGuides]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    router.push(`/support${params.toString() ? `?${params}` : ""}`);
  };

  const categories = [...new Set(guides.map((g) => g.category || "ทั่วไป"))].sort();
  const currentQ = searchParams.get("q");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-[#0c1c3b] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle,rgba(29,130,183,0.18)_0%,transparent_70%)]" />
          <div className="absolute bottom-[-15%] left-[5%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(247,86,24,0.12)_0%,transparent_70%)]" />
          <div className="absolute top-[10%] right-[-15%] w-[90%] h-[90%] bg-[radial-gradient(circle,rgba(252,180,120,0.1)_0%,transparent_70%)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 border border-white/20">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ศูนย์ช่วยเหลือและสนับสนุน
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              ค้นหาคำตอบและคู่มือการใช้งานระบบ Thai MOOC
            </p>
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาคำถาม เช่น วิธีการลงทะเบียนเรียน, รีเซ็ตรหัสผ่าน..."
                className="w-full pl-12 pr-28 py-4 rounded-lg text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/95"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                ค้นหา
              </button>
            </form>
            {currentQ && (
              <p className="mt-3 text-sm text-slate-400">
                ผลการค้นหา &ldquo;{currentQ}&rdquo; — พบ {guides.length} รายการ
                <button
                  onClick={() => { setSearchQuery(""); router.push("/support"); }}
                  className="ml-2 underline hover:text-white"
                >
                  ล้างการค้นหา
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Link href="/support/ticket">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">แจ้งปัญหา</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>ขอความช่วยเหลือเมื่อพบปัญหาในการใช้งาน</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/support/track">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">ติดตามสถานะ</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>ตรวจสอบสถานะคำขอความช่วยเหลือของคุณ</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/contact">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">ติดต่อเรา</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>ช่องทางการติดต่อและสอบถามข้อมูลเพิ่มเติม</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Guides Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-900">คู่มือการใช้งาน</h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>
          ) : guides.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                {currentQ ? (
                  <>
                    <p className="text-gray-500 text-lg">
                      ไม่พบคู่มือที่ตรงกับ &ldquo;{currentQ}&rdquo;
                    </p>
                    <button
                      onClick={() => { setSearchQuery(""); router.push("/support"); }}
                      className="mt-3 text-primary underline text-sm"
                    >
                      ดูคู่มือทั้งหมด
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-lg">ยังไม่มีคู่มือการใช้งาน</p>
                    <p className="text-gray-400 text-sm mt-2">
                      กำลังเตรียมเนื้อหาให้คุณ โปรดกลับมาตรวจสอบในภายหลัง
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryGuides = guides.filter(
                  (g) => (g.category || "ทั่วไป") === category
                );
                return (
                  <div key={category}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-primary rounded"></div>
                      {category}
                      <span className="text-sm text-gray-500 font-normal">
                        ({categoryGuides.length} คู่มือ)
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryGuides.map((guide) => (
                        <Link key={guide.id} href={`/support/guides/${guide.id}`}>
                          <Card className="hover:shadow-md transition-all hover:border-primary cursor-pointer h-full">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-start gap-2">
                                <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span className="flex-1">{guide.title}</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Search className="w-3 h-3" />
                                  เข้าชม {guide.view_count || 0} ครั้ง
                                </span>
                                <span>
                                  อัพเดท {new Date(guide.updated_at).toLocaleDateString("th-TH")}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ยังหาคำตอบที่ต้องการไม่พบใช่หรือไม่?
            </h2>
            <p className="text-gray-600 mb-8">ทีมงานของเรายินดีให้ความช่วยเหลือ</p>
            <div className="flex gap-4 justify-center">
              <Link href="/support/ticket">
                <Button size="lg" className="gap-2">
                  <MessageSquare className="w-5 h-5" />
                  แจ้งปัญหา
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <HelpCircle className="w-5 h-5" />
                  ติดต่อเรา
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">กำลังโหลด...</div>}>
      <SupportContent />
    </Suspense>
  );
}
