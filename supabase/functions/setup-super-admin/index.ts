import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPER_ADMIN_EMAIL = "correctprofessionalconsultants@gmail.com";
const SUPER_ADMIN_PASSWORD = "CPC2025";
const SUPER_ADMIN_NAME = "CPC Super Admin";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  try {
    // Ensure an organization exists
    let { data: orgs } = await admin.from("organizations").select("id").limit(1);
    let orgId = orgs?.[0]?.id;
    if (!orgId) {
      const { data: newOrg, error: orgErr } = await admin
        .from("organizations")
        .insert({ name: "Correct Professional Consultants Ltd", slug: "cpc" })
        .select("id")
        .single();
      if (orgErr) throw orgErr;
      orgId = newOrg.id;
    }

    // Check if user already exists
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existing = existingUsers.users.find(u => u.email === SUPER_ADMIN_EMAIL);

    let userId: string;
    if (existing) {
      userId = existing.id;
      await admin.auth.admin.updateUserById(userId, { password: SUPER_ADMIN_PASSWORD, email_confirm: true });
    } else {
      const { data: newUser, error } = await admin.auth.admin.createUser({
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: SUPER_ADMIN_NAME, organization_id: orgId },
      });
      if (error) throw error;
      userId = newUser.user.id;
    }

    // Ensure profile exists & has org
    const { data: prof } = await admin.from("profiles").select("id").eq("user_id", userId).maybeSingle();
    if (!prof) {
      await admin.from("profiles").insert({ user_id: userId, full_name: SUPER_ADMIN_NAME, organization_id: orgId });
    } else {
      await admin.from("profiles").update({ organization_id: orgId, full_name: SUPER_ADMIN_NAME }).eq("user_id", userId);
    }

    // Reset roles → super_admin + org_admin
    await admin.from("user_roles").delete().eq("user_id", userId);
    await admin.from("user_roles").insert([
      { user_id: userId, role: "super_admin", organization_id: orgId },
      { user_id: userId, role: "org_admin", organization_id: orgId },
    ]);

    return new Response(JSON.stringify({ success: true, user_id: userId, email: SUPER_ADMIN_EMAIL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
