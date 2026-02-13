import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, HelpCircle, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { query } from "@/lib/data";

// Fetch guides from database
async function getGuides() {
  try {
    const guides = await query(
      `SELECT id, title, category, view_count, created_at, updated_at
       FROM guides
       WHERE is_active = TRUE
       ORDER BY category, title ASC`
    );
    return guides;
  } catch (error) {
    console.error("Error fetching guides:", error);
    return [];
  }
}

// Get unique categories
function getCategories(guides: any[]) {
  const categories = [...new Set(guides.map((g) => g.category || "ทั่วไป"))];
  return categories.sort();
}

export default async function SupportPage() {
  const guides = await getGuides();
  const categories = getCategories(guides);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ศูนย์ช่วยเหลือและสนับสนุน
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              ค้นหาคำตอบและคู่มือการใช้งานระบบ Thai MOOC
            </p>
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาคำถาม เช่น วิธีการลงทะเบียนเรียน, รีเซ็ตรหัสผ่าน..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 -mt-8">
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
                <CardDescription>
                  ขอความช่วยเหลือเมื่อพบปัญหาในการใช้งาน
                </CardDescription>
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
                <CardDescription>
                  ตรวจสอบสถานะคำขอความช่วยเหลือของคุณ
                </CardDescription>
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
                <CardDescription>
                  ช่องทางการติดต่อและสอบถามข้อมูลเพิ่มเติม
                </CardDescription>
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
            <h2 className="text-3xl font-bold text-gray-900">
              คู่มือการใช้งาน
            </h2>
          </div>

          {guides.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  ยังไม่มีคู่มือการใช้งาน
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  กำลังเตรียมเนื้อหาให้คุณ โปรดกลับมาตรวจสอบในภายหลัง
                </p>
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
            <p className="text-gray-600 mb-8">
              ทีมงานของเรายินดีให้ความช่วยเหลือ
            </p>
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
