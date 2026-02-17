"use client";

import React, { useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';

/**
 * Converts Hex color to HSL components (space-separated)
 * for compatibility with Tailwind's hsl(var(--variable)) format.
 */
function hexToHsl(hex: string): string {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse r, g, b
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Convert to degrees and percentages
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useSettings();

    useEffect(() => {
        if (!settings) return;

        const root = document.documentElement;

        // Apply Primary Color
        if (settings.primaryColor) {
            try {
                const hslValue = hexToHsl(settings.primaryColor);
                root.style.setProperty('--primary', hslValue);
                console.log('[ThemeProvider] Applied primary color:', settings.primaryColor, hslValue);
            } catch (e) {
                console.error('[ThemeProvider] Failed to parse primary color:', settings.primaryColor);
            }
        }

        // Apply Secondary Color
        if (settings.secondaryColor) {
            try {
                const hslValue = hexToHsl(settings.secondaryColor);
                root.style.setProperty('--secondary', hslValue);
            } catch (e) {
                console.error('[ThemeProvider] Failed to parse secondary color:', settings.secondaryColor);
            }
        }
    }, [settings]);

    return <>{children}</>;
}
