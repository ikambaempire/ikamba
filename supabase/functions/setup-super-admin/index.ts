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

  try {
    // Get existing org
    const { data: orgs } = await admin.from("organizations").select("id").limit(1);
    const orgId = orgs?.[0]?.id;

    // Check if user already exists
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existing = existingUsers.users.find(u => u.email === "ikambaempireltd@gmail.com");

    let userId: string;
    if (existing) {
      userId = existing.id;
      // Update password
      await admin.auth.admin.updateUserById(userId, { password: "EMPIRE@IKAMBA2025", email_confirm: true });
    } else {
      const { data: newUser, error } = await admin.auth.admin.createUser({
        email: "ikambaempireltd@gmail.com",
        password: "EMPIRE@IKAMBA2025",
        email_confirm: true,
        user_metadata: { full_name: "Ikamba Empire Admin", organization_id: orgId },
      });
      if (error) throw error;
      userId = newUser.user.id;
    }

    // Ensure profile has org
    await admin.from("profiles").update({ organization_id: orgId, full_name: "Ikamba Empire Admin" }).eq("user_id", userId);

    // Remove old roles, add super_admin + org_admin
    await admin.from("user_roles").delete().eq("user_id", userId);
    await admin.from("user_roles").insert([
      { user_id: userId, role: "super_admin", organization_id: orgId },
      { user_id: userId, role: "org_admin", organization_id: orgId },
    ]);

    return new Response(JSON.stringify({ success: true, user_id: userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
