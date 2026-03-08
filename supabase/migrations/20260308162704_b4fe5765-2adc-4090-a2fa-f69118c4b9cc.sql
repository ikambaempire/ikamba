
-- FRESH START: Clear all existing data
DELETE FROM public.assets;
DELETE FROM public.revisions;
DELETE FROM public.project_status_logs;
DELETE FROM public.projects;
DELETE FROM public.profiles;
DELETE FROM public.user_roles;
DELETE FROM public.clients;

-- ============================================
-- CREATE ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger (ignore if exists)
DO $$ BEGIN
  CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- ADD organization_id TO EXISTING TABLES
-- ============================================
DO $$ BEGIN
  ALTER TABLE public.clients ADD COLUMN organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.user_roles ADD COLUMN organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.user_org_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(_user_id uuid, _org_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND role = _role
  )
$$;

-- ============================================
-- RLS POLICIES FOR ORGANIZATIONS
-- ============================================
DROP POLICY IF EXISTS "Members can view own org" ON public.organizations;
DROP POLICY IF EXISTS "Platform owners can manage all orgs" ON public.organizations;
DROP POLICY IF EXISTS "Org admins can update own org" ON public.organizations;

CREATE POLICY "Members can view own org"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (id = public.user_org_id(auth.uid()));

CREATE POLICY "Platform owners can manage all orgs"
  ON public.organizations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'platform_owner'));

CREATE POLICY "Org admins can update own org"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (public.has_org_role(auth.uid(), id, 'org_admin'));

-- ============================================
-- CLIENTS RLS
-- ============================================
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Clients can view own record" ON public.clients;
DROP POLICY IF EXISTS "Internal staff can view clients" ON public.clients;

CREATE POLICY "Org members can view org clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (organization_id = public.user_org_id(auth.uid()));

CREATE POLICY "Org admins and PMs can manage clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (
    organization_id = public.user_org_id(auth.uid())
    AND (
      public.has_org_role(auth.uid(), organization_id, 'org_admin')
      OR public.has_org_role(auth.uid(), organization_id, 'project_manager')
    )
  );

-- ============================================
-- PROFILES RLS
-- ============================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Org members can view org profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (organization_id = public.user_org_id(auth.uid()));

-- ============================================
-- PROJECTS RLS
-- ============================================
DROP POLICY IF EXISTS "Admins and PMs can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Internal staff can view projects" ON public.projects;

CREATE POLICY "Org staff can view projects"
  ON public.projects FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = projects.client_id
        AND c.organization_id = public.user_org_id(auth.uid())
    )
  );

CREATE POLICY "Org admins and PMs can manage projects"
  ON public.projects FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = projects.client_id
        AND c.organization_id = public.user_org_id(auth.uid())
        AND (
          public.has_org_role(auth.uid(), c.organization_id, 'org_admin')
          OR public.has_org_role(auth.uid(), c.organization_id, 'project_manager')
        )
    )
  );

CREATE POLICY "Clients can view own projects"
  ON public.projects FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.client_id = projects.client_id
    )
  );

-- ============================================
-- USER_ROLES RLS
-- ============================================
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Org admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (
    organization_id = public.user_org_id(auth.uid())
    AND public.has_org_role(auth.uid(), organization_id, 'org_admin')
  );

-- ============================================
-- ASSETS RLS
-- ============================================
DROP POLICY IF EXISTS "Clients can view own assets" ON public.assets;
DROP POLICY IF EXISTS "Internal staff can manage assets" ON public.assets;
DROP POLICY IF EXISTS "Internal staff can view assets" ON public.assets;

CREATE POLICY "Org staff can view assets"
  ON public.assets FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE p.id = assets.project_id
        AND c.organization_id = public.user_org_id(auth.uid())
    )
  );

CREATE POLICY "Org staff can manage assets"
  ON public.assets FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE p.id = assets.project_id
        AND c.organization_id = public.user_org_id(auth.uid())
        AND (
          public.has_org_role(auth.uid(), c.organization_id, 'org_admin')
          OR public.has_org_role(auth.uid(), c.organization_id, 'project_manager')
          OR public.has_org_role(auth.uid(), c.organization_id, 'producer')
        )
    )
  );

CREATE POLICY "Clients can view own assets"
  ON public.assets FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.profiles pr ON pr.client_id = p.client_id
      WHERE p.id = assets.project_id AND pr.user_id = auth.uid()
    )
  );

-- ============================================
-- REVISIONS RLS
-- ============================================
DROP POLICY IF EXISTS "Clients can view own revisions" ON public.revisions;
DROP POLICY IF EXISTS "Internal staff can manage revisions" ON public.revisions;
DROP POLICY IF EXISTS "Internal staff can view revisions" ON public.revisions;

CREATE POLICY "Org staff can view revisions"
  ON public.revisions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE p.id = revisions.project_id
        AND c.organization_id = public.user_org_id(auth.uid())
    )
  );

CREATE POLICY "Org staff can manage revisions"
  ON public.revisions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE p.id = revisions.project_id
        AND c.organization_id = public.user_org_id(auth.uid())
        AND (
          public.has_org_role(auth.uid(), c.organization_id, 'org_admin')
          OR public.has_org_role(auth.uid(), c.organization_id, 'project_manager')
          OR public.has_org_role(auth.uid(), c.organization_id, 'producer')
        )
    )
  );

CREATE POLICY "Clients can view own revisions"
  ON public.revisions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.profiles pr ON pr.client_id = p.client_id
      WHERE p.id = revisions.project_id AND pr.user_id = auth.uid()
    )
  );

-- ============================================
-- PROJECT_STATUS_LOGS RLS
-- ============================================
DROP POLICY IF EXISTS "Internal staff can manage status logs" ON public.project_status_logs;
DROP POLICY IF EXISTS "Internal staff can view status logs" ON public.project_status_logs;

CREATE POLICY "Org staff can view status logs"
  ON public.project_status_logs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE p.id = project_status_logs.project_id
        AND c.organization_id = public.user_org_id(auth.uid())
    )
  );

CREATE POLICY "Org admins and PMs can manage status logs"
  ON public.project_status_logs FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.clients c ON c.id = p.client_id
      WHERE p.id = project_status_logs.project_id
        AND c.organization_id = public.user_org_id(auth.uid())
        AND (
          public.has_org_role(auth.uid(), c.organization_id, 'org_admin')
          OR public.has_org_role(auth.uid(), c.organization_id, 'project_manager')
        )
    )
  );

-- ============================================
-- UPDATE handle_new_user TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, organization_id)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    (NEW.raw_user_meta_data ->> 'organization_id')::uuid
  );
  RETURN NEW;
END;
$$;
