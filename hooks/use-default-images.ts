import { useSettings } from '@/lib/settings-context';

export function useDefaultImages() {
    const { settings, loading } = useSettings();

    const defaultImages = {
        defaultCourseThumbnail: settings?.defaultCourseThumbnail || null,
        defaultInstitutionLogo: settings?.defaultInstitutionLogo || null,
        defaultNewsImage: settings?.defaultNewsImage || null,
    };

    return { defaultImages, loading };
}
