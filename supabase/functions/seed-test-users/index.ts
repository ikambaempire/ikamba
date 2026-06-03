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
    // 1. Create organization
    const { data: org, error: orgErr } = await admin.from("organizations").insert({
      name: "Ikamba Empire",
      slug: "ikamba-empire",
    }).select().single();
    if (orgErr) throw orgErr;

    // 2. Create clients
    const { data: clients, error: clErr } = await admin.from("clients").insert([
      { name: "MTN Rwanda", industry: "Telecommunications", contact_person: "Jean Bosco", contact_email: "jb@mtn.rw", organization_id: org.id },
      { name: "UNICEF Rwanda", industry: "International Development", contact_person: "Alice Uwimana", contact_email: "alice@unicef.org", organization_id: org.id },
      { name: "MINEDUC", industry: "Government", contact_person: "Patrick Nshimiye", contact_email: "patrick@mineduc.gov.rw", organization_id: org.id },
    ]).select();
    if (clErr) throw clErr;

    // 3. Create admin user
    const { data: adminUser, error: adminErr } = await admin.auth.admin.createUser({
      email: "admin@ikamba.test",
      password: "Admin@Ikamba2026",
      email_confirm: true,
      user_metadata: { full_name: "System Admin", organization_id: org.id },
    });
    if (adminErr) throw adminErr;

    await admin.from("user_roles").insert({ user_id: adminUser.user.id, role: "org_admin", organization_id: org.id });

    // 4. Create client user (linked to MTN)
    const { data: clientUser, error: clientErr } = await admin.auth.admin.createUser({
      email: "client@ikamba.test",
      password: "Client@Ikamba2026",
      email_confirm: true,
      user_metadata: { full_name: "MTN Client User", organization_id: org.id },
    });
    if (clientErr) throw clientErr;

    await admin.from("profiles").update({ client_id: clients![0].id }).eq("user_id", clientUser.user.id);
    await admin.from("user_roles").insert({ user_id: clientUser.user.id, role: "client", organization_id: org.id });

    // 5. Create project manager
    const { data: pmUser, error: pmErr } = await admin.auth.admin.createUser({
      email: "pm@ikamba.test",
      password: "PM@Ikamba2026",
      email_confirm: true,
      user_metadata: { full_name: "Project Manager", organization_id: org.id },
    });
    if (pmErr) throw pmErr;
    await admin.from("user_roles").insert({ user_id: pmUser.user.id, role: "project_manager", organization_id: org.id });

    // 6. Create sample projects
    const now = new Date();
    const projects = [
      { name: "Annual Report 2026", project_type: "Corporate Video", client_id: clients![0].id, status: "production", priority: "high", deadline: new Date(now.getTime() + 5 * 86400000).toISOString().split("T")[0], revision_count: 1 },
      { name: "Brand Campaign Q2", project_type: "Social Content", client_id: clients![0].id, status: "client_review", priority: "urgent", deadline: new Date(now.getTime() + 2 * 86400000).toISOString().split("T")[0], revision_count: 3 },
      { name: "Child Protection Campaign", project_type: "Documentary", client_id: clients![1].id, status: "editing", priority: "medium", deadline: new Date(now.getTime() + 14 * 86400000).toISOString().split("T")[0], revision_count: 0 },
      { name: "Education Reform Video", project_type: "Corporate Film", client_id: clients![2].id, status: "brief_received", priority: "low", deadline: new Date(now.getTime() + 30 * 86400000).toISOString().split("T")[0], revision_count: 0 },
      { name: "MTN 5G Launch", project_type: "Event Coverage", client_id: clients![0].id, status: "final_delivery", priority: "high", revision_count: 2 },
    ];

    const { data: projData, error: projErr } = await admin.from("projects").insert(projects).select();
    if (projErr) throw projErr;

    // 7. Sample revisions
    const reviewProject = projData!.find((p: any) => p.status === "client_review");
    if (reviewProject) {
      await admin.from("revisions").insert([
        { project_id: reviewProject.id, revision_number: 1, feedback: "Colors need to align with brand guidelines.", submitted_by: clientUser.user.id },
        { project_id: reviewProject.id, revision_number: 2, feedback: "Music needs to be more upbeat. Logo placement adjusted.", submitted_by: clientUser.user.id },
        { project_id: reviewProject.id, revision_number: 3, feedback: "Final cut looks good. Minor text correction needed.", submitted_by: clientUser.user.id },
      ]);
    }

    // 8. Sample status logs
    const productionProject = projData!.find((p: any) => p.status === "production");
    if (productionProject) {
      await admin.from("project_status_logs").insert([
        { project_id: productionProject.id, old_status: null, new_status: "brief_received", changed_by: adminUser.user.id },
        { project_id: productionProject.id, old_status: "brief_received", new_status: "strategy_alignment", changed_by: adminUser.user.id, notes: "Strategy call completed with client." },
        { project_id: productionProject.id, old_status: "strategy_alignment", new_status: "production", changed_by: pmUser.user.id, notes: "Production crew assigned. Shooting scheduled." },
      ]);
    }

    return new Response(JSON.stringify({ success: true, org: org.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
