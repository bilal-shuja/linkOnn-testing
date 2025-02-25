'use client'; 

import { createContext, useContext, useEffect, useState } from 'react';
import api from "@/app/lib/auth/axios";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await api.get(`/api/get_site_settings?flag=all_data`);
                setSettings(res.data.data);
            } catch (error) {
                console.error("Error fetching site settings:", error);
            }
        }
        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}
 