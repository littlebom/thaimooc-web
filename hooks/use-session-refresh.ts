'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Auto-refresh session hook
 * ทำการ refresh session token อัตโนมัติทุก 20 นาที
 * เพื่อป้องกันไม่ให้ session หมดอายุขณะที่ admin กำลังใช้งาน
 */
export function useSessionRefresh() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // ✅ FIX: ไม่ต้อง refresh ถ้าอยู่ในหน้า login
    // ป้องกันไม่ให้เรียก refresh endpoint เมื่ออยู่ในหน้า login
    if (pathname === '/admin/login') {
      console.log('Skip session refresh on login page');
      return; // Early return - ไม่ทำอะไรเลยถ้าอยู่ในหน้า login
    }

    // ฟังก์ชัน refresh session
    const refreshSession = async () => {
      try {
        console.log('Refreshing session...');
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Session refresh failed:', response.statusText);
          // หาก refresh ไม่สำเร็จ ให้ redirect ไป login page
          if (response.status === 401) {
            console.warn('Session expired, redirecting to login...');
            window.location.href = '/admin/login';
          }
        } else {
          console.log('Session refreshed successfully');
        }
      } catch (error) {
        console.error('Session refresh error:', error);
      }
    };

    // Refresh ทันทีเมื่อ component mount (เพื่อ extend session)
    refreshSession();

    // ตั้ง interval ให้ refresh ทุก 20 นาที (1200000 ms)
    // ทำไม 20 นาที? เพราะ token มีอายุ 7 วัน แต่เราต้อง refresh บ่อยๆ
    // การ refresh ทุก 20 นาทีจะทำให้ session ไม่หมดอายุตราบใดที่ user ยังเปิดหน้าไว้
    intervalRef.current = setInterval(refreshSession, 20 * 60 * 1000);

    console.log('Session auto-refresh started (every 20 minutes)');

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        console.log('Session auto-refresh stopped');
        clearInterval(intervalRef.current);
      }
    };
  }, [pathname]);
}
