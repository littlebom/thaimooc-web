"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { WebAppSettings } from './types';

interface SettingsContextType {
    settings: WebAppSettings | null;
    loading: boolean;
    error: Error | null;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Simple global cache for settings to handle multiple provider instances if they exist
let globalSettingsCache: WebAppSettings | null = null;
let globalFetchPromise: Promise<WebAppSettings> | null = null;

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<WebAppSettings | null>(globalSettingsCache);
    const [loading, setLoading] = useState(!globalSettingsCache);
    const [error, setError] = useState<Error | null>(null);

    const fetchSettings = async () => {
        // If a fetch is already in progress, reuse it
        if (globalFetchPromise) {
            try {
                const data = await globalFetchPromise;
                setSettings(data);
                return;
            } catch (err) {
                // Fall through to retry if the global fetch failed
            }
        }

        try {
            setLoading(true);
            globalFetchPromise = fetch('/api/settings').then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch settings');
                return res.json();
            });

            const data = await globalFetchPromise;
            globalSettingsCache = data;
            setSettings(data);
            setError(null);
        } catch (err) {
            console.error('[SettingsContext] Fetch error:', err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
            globalFetchPromise = null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!globalSettingsCache) {
            fetchSettings();
        }
    }, []);

    const refreshSettings = async () => {
        globalSettingsCache = null;
        globalFetchPromise = null;
        await fetchSettings();
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, error, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
