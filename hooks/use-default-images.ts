import { useState, useEffect } from 'react';

interface DefaultImages {
    defaultCourseThumbnail: string | null;
    defaultInstitutionLogo: string | null;
    defaultNewsImage: string | null;
}

// Simple cache to prevent multiple API calls
let cachedData: DefaultImages | null = null;
let fetchPromise: Promise<DefaultImages> | null = null;

export function useDefaultImages() {
    const [defaultImages, setDefaultImages] = useState<DefaultImages>(cachedData || {
        defaultCourseThumbnail: null,
        defaultInstitutionLogo: null,
        defaultNewsImage: null,
    });
    const [loading, setLoading] = useState(!cachedData);

    useEffect(() => {
        async function fetchDefaultImages() {
            // If we have cached data, we're good (already set in initial state)
            if (cachedData) {
                setLoading(false);
                return;
            }

            // If a fetch is already in progress, reuse it
            if (!fetchPromise) {
                fetchPromise = fetch('/api/settings')
                    .then(async (res) => {
                        if (!res.ok) throw new Error('Failed to fetch settings');
                        const data = await res.json();
                        return {
                            defaultCourseThumbnail: data.defaultCourseThumbnail || null,
                            defaultInstitutionLogo: data.defaultInstitutionLogo || null,
                            defaultNewsImage: data.defaultNewsImage || null,
                        };
                    });
            }

            try {
                const data = await fetchPromise;
                cachedData = data;
                setDefaultImages(data);
            } catch (error) {
                console.error('Failed to fetch default images:', error);
                // Reset promise on error so we can try again later
                fetchPromise = null;
            } finally {
                setLoading(false);
            }
        }

        fetchDefaultImages();
    }, []);

    return { defaultImages, loading };
}
