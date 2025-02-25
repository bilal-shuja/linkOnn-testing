import api from "@/app/lib/auth/axios";

export async function getSiteSettings() {
    try {
        const res = await api.get(`/api/get_site_settings?flag=all_data`);
        return res.data.data;
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }
}
