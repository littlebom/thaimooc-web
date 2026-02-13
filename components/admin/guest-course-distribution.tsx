"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Save } from "lucide-react";
import type { Institution } from "@/lib/types";

interface GuestCourseDistributionProps {
    courseId: string;
    institutions: Institution[];
    ownerInstitutionId: string | null;
}

export function GuestCourseDistribution({ courseId, institutions, ownerInstitutionId }: GuestCourseDistributionProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [guestInstitutionIds, setGuestInstitutionIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchGuests() {
            try {
                const res = await fetch(`/api/courses/${courseId}/guest-institutions`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setGuestInstitutionIds(data.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch guest institutions", error);
            } finally {
                setLoading(false);
            }
        }
        if (courseId) {
            fetchGuests();
        }
    }, [courseId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/courses/${courseId}/guest-institutions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ institutionIds: guestInstitutionIds }),
            });

            if (res.ok) {
                alert("บันทึกข้อมูลเรียบร้อยแล้ว");
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึก");
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("เกิดข้อผิดพลาด");
        } finally {
            setSaving(false);
        }
    };

    const toggleInstitution = (instId: string) => {
        setGuestInstitutionIds(prev =>
            prev.includes(instId)
                ? prev.filter(id => id !== instId)
                : [...prev, instId]
        );
    };

    const filteredInstitutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add to Microsite (Guest Course)</CardTitle>
                <CardDescription>
                    เลือกสถาบันที่ต้องการให้นำรายวิชานี้ไปแสดงผล (Microsite) เพิ่มเติม
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="ค้นหาสถาบัน..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="border rounded-lg max-h-[400px] overflow-y-auto p-4 bg-gray-50 space-y-2">
                    {filteredInstitutions.map((inst) => {
                        const isOwner = inst.id === ownerInstitutionId;
                        const isChecked = guestInstitutionIds.includes(inst.id);

                        if (isOwner) return null; // Don't show owner in guest list (implicit)

                        return (
                            <div key={inst.id} className={`flex items-center justify-between p-3 rounded-md bg-white border ${isChecked ? "border-primary/50 bg-primary/5" : "border-gray-100"}`}>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id={`inst-${inst.id}`}
                                        checked={isChecked}
                                        onCheckedChange={() => toggleInstitution(inst.id)}
                                    />
                                    <div className="grid gap-0.5">
                                        <Label htmlFor={`inst-${inst.id}`} className="font-medium cursor-pointer">
                                            {inst.name}
                                        </Label>
                                        <span className="text-xs text-gray-500">{inst.nameEn}</span>
                                    </div>
                                </div>
                                {isChecked && <Badge variant="secondary" className="text-xs">Selected</Badge>}
                            </div>
                        )
                    })}

                    {filteredInstitutions.length === 0 && (
                        <p className="text-center text-gray-500 py-4">ไม่พบสถาบันที่ค้นหา</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
