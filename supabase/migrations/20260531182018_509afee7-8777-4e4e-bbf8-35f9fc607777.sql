
-- ENQUIRIES (contact form messages)
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiries" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view enquiries" ON public.contact_messages
  FOR SELECT TO authenticated USING (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'project_manager'::app_role) OR
    has_role(auth.uid(), 'platform_owner'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );
CREATE POLICY "Admins can update enquiries" ON public.contact_messages
  FOR UPDATE TO authenticated USING (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'project_manager'::app_role) OR
    has_role(auth.uid(), 'platform_owner'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );
CREATE POLICY "Admins can delete enquiries" ON public.contact_messages
  FOR DELETE TO authenticated USING (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TRUSTED INDUSTRIES
CREATE TABLE public.trusted_industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trusted_industries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.trusted_industries TO authenticated;
GRANT ALL ON public.trusted_industries TO service_role;
ALTER TABLE public.trusted_industries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active industries" ON public.trusted_industries
  FOR SELECT TO anon, authenticated USING (active = true OR
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );
CREATE POLICY "Admins can insert industries" ON public.trusted_industries
  FOR INSERT TO authenticated WITH CHECK (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );
CREATE POLICY "Admins can update industries" ON public.trusted_industries
  FOR UPDATE TO authenticated USING (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );
CREATE POLICY "Admins can delete industries" ON public.trusted_industries
  FOR DELETE TO authenticated USING (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE TRIGGER update_trusted_industries_updated_at
  BEFORE UPDATE ON public.trusted_industries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for industry logos (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('industry-logos', 'industry-logos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read industry logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'industry-logos');
CREATE POLICY "Admins can upload industry logos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'industry-logos' AND (
      has_role(auth.uid(), 'org_admin'::app_role) OR
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  );
CREATE POLICY "Admins can update industry logos" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'industry-logos' AND (
      has_role(auth.uid(), 'org_admin'::app_role) OR
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  );
CREATE POLICY "Admins can delete industry logos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'industry-logos' AND (
      has_role(auth.uid(), 'org_admin'::app_role) OR
      has_role(auth.uid(), 'super_admin'::app_role)
    )
  );

-- SITE SETTINGS (single row)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  -- Brand & SEO
  site_title text NOT NULL DEFAULT 'Correct Professional Consultants Ltd',
  tagline text NOT NULL DEFAULT 'Professional, Excellence & Trust',
  meta_description text NOT NULL DEFAULT 'CPC Ltd delivers professional consulting in taxation, accounting, business registration, digital marketing, and training for businesses and individuals in Rwanda.',
  -- Contact details
  contact_email text NOT NULL DEFAULT 'correctprofesionalconsultants@gmail.com',
  contact_phone text NOT NULL DEFAULT '+250 788 506 194',
  whatsapp_number text DEFAULT '+250788506194',
  working_hours text DEFAULT 'Mon – Fri · 8:00 – 17:00 | Sat · 9:00 – 13:00',
  address_line1 text DEFAULT 'KN 48 Street, Nyarugenge',
  address_line2 text DEFAULT 'Yussa City Center (Makuza Plaza), Tower B, 8th Floor',
  city text DEFAULT 'Kigali, Rwanda',
  -- Social links
  facebook_url text DEFAULT '',
  facebook_visible boolean NOT NULL DEFAULT true,
  instagram_url text DEFAULT '',
  instagram_visible boolean NOT NULL DEFAULT true,
  youtube_url text DEFAULT '',
  youtube_visible boolean NOT NULL DEFAULT true,
  tiktok_url text DEFAULT '',
  tiktok_visible boolean NOT NULL DEFAULT true,
  linkedin_url text DEFAULT '',
  linkedin_visible boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (
    has_role(auth.uid(), 'org_admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the one settings row
INSERT INTO public.site_settings (singleton) VALUES (true) ON CONFLICT DO NOTHING;
