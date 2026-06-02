import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // Verify caller is super_admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  
  const token = authHeader.replace("Bearer ", "");
  const { data: { user: caller } } = await admin.auth.getUser(token);
  if (!caller) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const { data: callerRoles } = await admin.from("user_roles").select("role").eq("user_id", caller.id);
  const isSuperAdmin = callerRoles?.some(r => r.role === "super_admin");
  if (!isSuperAdmin) return new Response(JSON.stringify({ error: "Only super admins can manage users" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const body = await req.json();
  const { action } = body;

  try {
    if (action === "list") {
      // List all users with roles
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
      
      return new Response(JSON.stringify({ users: result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add_admin") {
      const { email, password, full_name, role } = body;
      const allowedRoles = ["org_admin", "project_manager", "producer", "editor"];
      if (!allowedRoles.includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid role. Super admin cannot be assigned this way." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Get caller's org
      const { data: callerProfile } = await admin.from("profiles").select("organization_id").eq("user_id", caller.id).single();
      const orgId = callerProfile?.organization_id;

      // Check if user exists
      const { data: existingUsers } = await admin.auth.admin.listUsers();
      const existing = existingUsers.users.find(u => u.email === email);
      
      let userId: string;
      if (existing) {
        userId = existing.id;
      } else {
        if (!password || typeof password !== "string" || password.length < 12) {
          return new Response(
            JSON.stringify({ error: "A strong password (min 12 chars) is required when creating a new admin." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name, organization_id: orgId },
        });
        if (createErr) throw createErr;
        userId = newUser.user.id;
      }

      // Remove existing role if any, then add new one
      await admin.from("user_roles").delete().eq("user_id", userId).neq("role", "super_admin");
      await admin.from("user_roles").insert({ user_id: userId, role, organization_id: orgId });

      // Update profile
      if (full_name) {
        await admin.from("profiles").update({ full_name, organization_id: orgId }).eq("user_id", userId);
      }

      return new Response(JSON.stringify({ success: true, user_id: userId }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "remove_role") {
      const { user_id, role } = body;
      if (role === "super_admin") {
        return new Response(JSON.stringify({ error: "Cannot remove super_admin role" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      await admin.from("user_roles").delete().eq("user_id", user_id).eq("role", role);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update_role") {
      const { user_id, new_role } = body;
      const allowedRoles = ["org_admin", "project_manager", "producer", "editor", "client", "viewer"];
      if (!allowedRoles.includes(new_role)) {
        return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      // Remove non-super_admin roles and set new one
      const { data: callerProfile } = await admin.from("profiles").select("organization_id").eq("user_id", caller.id).single();
      await admin.from("user_roles").delete().eq("user_id", user_id).neq("role", "super_admin");
      await admin.from("user_roles").insert({ user_id: user_id, role: new_role, organization_id: callerProfile?.organization_id });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
