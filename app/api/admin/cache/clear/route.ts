import { NextRequest, NextResponse } from "next/server";
import { redisCache } from "@/lib/redis-cache";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        // Auth Check
        const session = await getSession();
        if (!session || (session.role !== 'super_admin' && session.role !== 'admin')) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Clear all server-side memory cache
        await redisCache.clearAll();

        console.log(`[Cache] System cache cleared by user: ${session.email}`);

        return NextResponse.json({
            success: true,
            message: "Cache cleared successfully",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Cache] Error clearing cache:', error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to clear cache",
            },
            { status: 500 }
        );
    }
}
