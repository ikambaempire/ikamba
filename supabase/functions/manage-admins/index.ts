import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Unauthorized" }, 401);

  const token = authHeader.replace("Bearer ", "");
  const { data: { user: caller } } = await admin.auth.getUser(token);
  if (!caller) return json({ error: "Invalid token" }, 401);

  const { data: callerRoles } = await admin.from("user_roles").select("role").eq("user_id", caller.id);
  const isSuperAdmin = callerRoles?.some(r => r.role === "super_admin");
  const isOrgAdmin = callerRoles?.some(r => r.role === "org_admin");
  if (!isSuperAdmin && !isOrgAdmin) return json({ error: "Only admins can manage users" }, 403);

  const body = await req.json();
  const { action } = body;
  const ALLOWED_ROLES = ["org_admin", "project_manager"];

  try {
    if (action === "list") {
      const { data: users } = await admin.auth.admin.listUsers();
      const { data: roles } = await admin.from("user_roles").select("*");
      const { data: profiles } = await admin.from("profiles").select("user_id, full_name");
      const result = users.users.map(u => ({
        id: u.id,
        email: u.email,
        full_name: profiles?.find(p => p.user_id === u.id)?.full_name || u.user_metadata?.full_name || "",
        roles: roles?.filter(r => r.user_id === u.id).map(r => r.role) || [],
        created_at: u.created_at,
      }));
      return json({ users: result });
    }

    if (action === "add_admin") {
      const { email, password, full_name, role } = body;
      if (!ALLOWED_ROLES.includes(role)) return json({ error: "Invalid role" }, 400);

      const { data: callerProfile } = await admin.from("profiles").select("organization_id").eq("user_id", caller.id).single();
      const orgId = callerProfile?.organization_id;

      const { data: existingUsers } = await admin.auth.admin.listUsers();
      const existing = existingUsers.users.find(u => u.email === email);

      let userId: string;
      if (existing) {
        userId = existing.id;
      } else {
        const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
          email,
          password: password || "Temp@12345",
          email_confirm: true,
          user_metadata: { full_name, organization_id: orgId },
        });
        if (createErr) throw createErr;
        userId = newUser.user.id;
      }

      await admin.from("user_roles").delete().eq("user_id", userId).neq("role", "super_admin");
      await admin.from("user_roles").insert({ user_id: userId, role, organization_id: orgId });

      if (full_name) {
        await admin.from("profiles").update({ full_name, organization_id: orgId }).eq("user_id", userId);
      }
      return json({ success: true, user_id: userId });
    }

    if (action === "update_role") {
      const { user_id, new_role } = body;
      if (!ALLOWED_ROLES.includes(new_role)) return json({ error: "Invalid role" }, 400);
      const { data: targetRoles } = await admin.from("user_roles").select("role").eq("user_id", user_id);
      if (targetRoles?.some(r => r.role === "super_admin")) return json({ error: "Cannot change the Owner role" }, 400);
      const { data: callerProfile } = await admin.from("profiles").select("organization_id").eq("user_id", caller.id).single();
      await admin.from("user_roles").delete().eq("user_id", user_id).neq("role", "super_admin");
      await admin.from("user_roles").insert({ user_id, role: new_role, organization_id: callerProfile?.organization_id });
      return json({ success: true });
    }

    if (action === "delete_user") {
      const { user_id } = body;
      if (user_id === caller.id) return json({ error: "You cannot delete your own account" }, 400);
      const { data: targetRoles } = await admin.from("user_roles").select("role").eq("user_id", user_id);
      if (targetRoles?.some(r => r.role === "super_admin")) return json({ error: "Cannot delete the Owner account" }, 400);
      await admin.from("user_roles").delete().eq("user_id", user_id);
      await admin.from("profiles").delete().eq("user_id", user_id);
      const { error: delErr } = await admin.auth.admin.deleteUser(user_id);
      if (delErr) throw delErr;
      return json({ success: true });
    }

    if (action === "remove_role") {
      const { user_id, role } = body;
      if (role === "super_admin") return json({ error: "Cannot remove Owner role" }, 400);
      await admin.from("user_roles").delete().eq("user_id", user_id).eq("role", role);
      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err: any) {
    return json({ error: err.message }, 500);
  }
});
