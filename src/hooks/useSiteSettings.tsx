import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id: string;
  site_title: string;
  tagline: string;
  meta_description: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string | null;
  working_hours: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  facebook_url: string;
  facebook_visible: boolean;
  instagram_url: string;
  instagram_visible: boolean;
  youtube_url: string;
  youtube_visible: boolean;
  tiktok_url: string;
  tiktok_visible: boolean;
  linkedin_url: string;
  linkedin_visible: boolean;
}

const DEFAULTS: SiteSettings = {
  id: "",
  site_title: "Correct Professional Consultants Ltd",
  tagline: "Professional, Excellence & Trust",
  meta_description: "",
  contact_email: "correctprofesionalconsultants@gmail.com",
  contact_phone: "+250 788 506 194",
  whatsapp_number: "+250788506194",
  working_hours: "Mon – Fri · 8:00 – 17:00 | Sat · 9:00 – 13:00",
  address_line1: "KN 48 Street, Nyarugenge",
  address_line2: "Yussa City Center (Makuza Plaza), Tower B, 8th Floor",
  city: "Kigali, Rwanda",
  facebook_url: "",
  facebook_visible: true,
  instagram_url: "",
  instagram_visible: true,
  youtube_url: "",
  youtube_visible: true,
  tiktok_url: "",
  tiktok_visible: true,
  linkedin_url: "",
  linkedin_visible: true,
};

interface Ctx {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<Ctx>({ settings: DEFAULTS, loading: true, refresh: async () => {} });

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (data) setSettings({ ...DEFAULTS, ...(data as any) });
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("site_settings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SettingsContext);
