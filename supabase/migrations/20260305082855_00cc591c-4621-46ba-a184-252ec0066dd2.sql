
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'project_manager', 'producer', 'editor', 'client', 'viewer');

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_person TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Project status enum
CREATE TYPE public.project_status AS ENUM (
  'brief_received', 'strategy_alignment', 'production', 'editing',
  'client_review', 'final_delivery', 'archive'
);

-- Priority enum
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  project_type TEXT,
  status project_status NOT NULL DEFAULT 'brief_received',
  priority priority_level NOT NULL DEFAULT 'medium',
  deadline DATE,
  revision_count INT NOT NULL DEFAULT 0,
  assigned_producer UUID REFERENCES auth.users(id),
  assigned_editor UUID REFERENCES auth.users(id),
  objective TEXT,
  target_audience TEXT,
  key_message TEXT,
  distribution_plan TEXT,
  budget_range TEXT,
  approval_contact TEXT,
  contact_email TEXT,
  stage_entered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  version TEXT DEFAULT 'draft',
  campaign TEXT,
  year INT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Project status logs
CREATE TABLE public.project_status_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  old_status project_status,
  new_status project_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_status_logs ENABLE ROW LEVEL SECURITY;

-- Revisions table
CREATE TABLE public.revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  revision_number INT NOT NULL,
  feedback TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;

-- Triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Clients
CREATE POLICY "Internal staff can view clients" ON public.clients FOR SELECT USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'project_manager') OR
  public.has_role(auth.uid(), 'producer') OR
  public.has_role(auth.uid(), 'editor')
);
CREATE POLICY "Clients can view own record" ON public.clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.client_id = clients.id)
);
CREATE POLICY "Admins can manage clients" ON public.clients FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Projects
CREATE POLICY "Internal staff can view projects" ON public.projects FOR SELECT USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'project_manager') OR
  public.has_role(auth.uid(), 'producer') OR
  public.has_role(auth.uid(), 'editor')
);
CREATE POLICY "Clients can view own projects" ON public.projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.client_id = projects.client_id)
);
CREATE POLICY "Admins and PMs can manage projects" ON public.projects FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'project_manager')
);

-- Assets
CREATE POLICY "Internal staff can view assets" ON public.assets FOR SELECT USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'project_manager') OR
  public.has_role(auth.uid(), 'producer') OR
  public.has_role(auth.uid(), 'editor')
);
CREATE POLICY "Clients can view own assets" ON public.assets FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.profiles pr ON pr.client_id = p.client_id
    WHERE p.id = assets.project_id AND pr.user_id = auth.uid()
  )
);
CREATE POLICY "Internal staff can manage assets" ON public.assets FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'project_manager') OR
  public.has_role(auth.uid(), 'producer')
);

-- Status logs
CREATE POLICY "Internal staff can view status logs" ON public.project_status_logs FOR SELECT USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'project_manager') OR
  public.has_role(auth.uid(), 'producer') OR
  public.has_role(auth.uid(), 'editor')
);
CREATE POLICY "Internal staff can manage status logs" ON public.project_status_logs FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'project_manager')
);

-- Revisions
CREATE POLICY "Internal staff can view revisions" ON public.revisions FOR SELECT USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'project_manager') OR
  public.has_role(auth.uid(), 'producer') OR
  public.has_role(auth.uid(), 'editor')
);
CREATE POLICY "Clients can view own revisions" ON public.revisions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.profiles pr ON pr.client_id = p.client_id
    WHERE p.id = revisions.project_id AND pr.user_id = auth.uid()
  )
);
CREATE POLICY "Internal staff can manage revisions" ON public.revisions FOR ALL USING (
  public.has_role(auth.uid(), 'super_admin') OR
  public.has_role(auth.uid(), 'project_manager') OR
  public.has_role(auth.uid(), 'producer')
);

-- Storage bucket for project assets
INSERT INTO storage.buckets (id, name, public) VALUES ('project-assets', 'project-assets', false);

CREATE POLICY "Internal staff can upload assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'project-assets' AND (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'project_manager') OR
    public.has_role(auth.uid(), 'producer')
  )
);
CREATE POLICY "Authenticated users can view project assets" ON storage.objects FOR SELECT USING (
  bucket_id = 'project-assets' AND auth.role() = 'authenticated'
);
