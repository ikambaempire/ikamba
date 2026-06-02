
-- 1. Project-assets bucket: replace permissive policies with org-scoped ones
DROP POLICY IF EXISTS "Authenticated users can view project assets" ON storage.objects;
DROP POLICY IF EXISTS "Internal staff can upload assets" ON storage.objects;

-- Org-scoped SELECT: only members of the asset's owning org may read
CREATE POLICY "Org members can view project assets"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'project-assets'
  AND EXISTS (
    SELECT 1
    FROM public.assets a
    JOIN public.projects p ON p.id = a.project_id
    JOIN public.clients c  ON c.id = p.client_id
    WHERE a.file_url LIKE '%' || storage.objects.name || '%'
      AND c.organization_id = public.user_org_id(auth.uid())
  )
);

-- Org staff INSERT into their own org's namespace (path prefix = org_id/...)
CREATE POLICY "Org staff can upload project assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-assets'
  AND (storage.foldername(name))[1] = public.user_org_id(auth.uid())::text
  AND (
    public.has_org_role(auth.uid(), public.user_org_id(auth.uid()), 'org_admin'::public.app_role)
    OR public.has_org_role(auth.uid(), public.user_org_id(auth.uid()), 'project_manager'::public.app_role)
    OR public.has_org_role(auth.uid(), public.user_org_id(auth.uid()), 'producer'::public.app_role)
  )
);

CREATE POLICY "Org staff can update own org project assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'project-assets'
  AND (storage.foldername(name))[1] = public.user_org_id(auth.uid())::text
  AND (
    public.has_org_role(auth.uid(), public.user_org_id(auth.uid()), 'org_admin'::public.app_role)
    OR public.has_org_role(auth.uid(), public.user_org_id(auth.uid()), 'project_manager'::public.app_role)
  )
);

CREATE POLICY "Org staff can delete own org project assets"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'project-assets'
  AND (storage.foldername(name))[1] = public.user_org_id(auth.uid())::text
  AND (
    public.has_org_role(auth.uid(), public.user_org_id(auth.uid()), 'org_admin'::public.app_role)
    OR public.has_org_role(auth.uid(), public.user_org_id(auth.uid()), 'project_manager'::public.app_role)
  )
);

-- 2. user_roles: prevent privilege escalation
DROP POLICY IF EXISTS "Org admins can manage roles" ON public.user_roles;

CREATE POLICY "Org admins can view org roles"
ON public.user_roles FOR SELECT TO authenticated
USING (organization_id = public.user_org_id(auth.uid())
       AND public.has_org_role(auth.uid(), organization_id, 'org_admin'::public.app_role));

CREATE POLICY "Org admins can insert org-scoped non-elevated roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (
  organization_id = public.user_org_id(auth.uid())
  AND public.has_org_role(auth.uid(), organization_id, 'org_admin'::public.app_role)
  AND role NOT IN ('platform_owner'::public.app_role, 'super_admin'::public.app_role)
);

CREATE POLICY "Org admins can update org-scoped non-elevated roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (
  organization_id = public.user_org_id(auth.uid())
  AND public.has_org_role(auth.uid(), organization_id, 'org_admin'::public.app_role)
  AND role NOT IN ('platform_owner'::public.app_role, 'super_admin'::public.app_role)
)
WITH CHECK (
  organization_id = public.user_org_id(auth.uid())
  AND public.has_org_role(auth.uid(), organization_id, 'org_admin'::public.app_role)
  AND role NOT IN ('platform_owner'::public.app_role, 'super_admin'::public.app_role)
);

CREATE POLICY "Org admins can delete org-scoped non-elevated roles"
ON public.user_roles FOR DELETE TO authenticated
USING (
  organization_id = public.user_org_id(auth.uid())
  AND public.has_org_role(auth.uid(), organization_id, 'org_admin'::public.app_role)
  AND role NOT IN ('platform_owner'::public.app_role, 'super_admin'::public.app_role)
);

-- 3. Revoke direct EXECUTE on SECURITY DEFINER helpers from public clients.
-- These are used inside RLS policies and continue to work there because policy
-- evaluation runs with the policy owner's privileges, not the caller's.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role)              FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, uuid, public.app_role)    FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.user_org_id(uuid)                            FROM PUBLIC, anon, authenticated;
