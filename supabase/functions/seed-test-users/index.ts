import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const results: string[] = []

  // 1. Create admin user
  const { data: adminUser, error: adminErr } = await admin.auth.admin.createUser({
    email: 'admin@ikamba.test',
    password: 'Admin@Ikamba2026',
    email_confirm: true,
    user_metadata: { full_name: 'Super Admin' }
  })
  if (adminErr && !adminErr.message.includes('already been registered')) {
    results.push(`Admin error: ${adminErr.message}`)
  } else {
    const adminId = adminUser?.user?.id
    if (adminId) {
      await admin.from('user_roles').upsert({ user_id: adminId, role: 'super_admin' }, { onConflict: 'user_id,role' })
      results.push(`Admin created: admin@ikamba.test`)
    } else {
      results.push('Admin user already exists')
    }
  }

  // 2. Create client org
  const { data: existingClient } = await admin.from('clients').select('id').eq('name', 'Acme Corp').single()
  let clientId = existingClient?.id
  if (!clientId) {
    const { data: newClient } = await admin.from('clients').insert({
      name: 'Acme Corp',
      industry: 'Financial Services',
      contact_person: 'Jane Client',
      contact_email: 'client@acme.test'
    }).select('id').single()
    clientId = newClient?.id
    results.push(`Client org created: Acme Corp`)
  }

  // 3. Create client user
  const { data: clientUser, error: clientErr } = await admin.auth.admin.createUser({
    email: 'client@ikamba.test',
    password: 'Client@Ikamba2026',
    email_confirm: true,
    user_metadata: { full_name: 'Jane Client' }
  })
  if (clientErr && !clientErr.message.includes('already been registered')) {
    results.push(`Client error: ${clientErr.message}`)
  } else {
    const clientUserId = clientUser?.user?.id
    if (clientUserId) {
      await admin.from('user_roles').upsert({ user_id: clientUserId, role: 'client' }, { onConflict: 'user_id,role' })
      if (clientId) {
        await admin.from('profiles').update({ client_id: clientId }).eq('user_id', clientUserId)
      }
      results.push(`Client user created: client@ikamba.test`)
    } else {
      results.push('Client user already exists')
    }
  }

  // 4. Create sample projects
  if (clientId) {
    const { data: existingProj } = await admin.from('projects').select('id').eq('name', 'Annual Report 2026').single()
    if (!existingProj) {
      await admin.from('projects').insert([
        {
          name: 'Annual Report 2026',
          client_id: clientId,
          project_type: 'Corporate Video',
          objective: 'Produce the annual report video for stakeholder presentation',
          target_audience: 'Board members, investors, staff',
          status: 'production',
          priority: 'high',
          deadline: '2026-04-15',
          key_message: 'Growth and stability',
        },
        {
          name: 'Social Media Campaign Q2',
          client_id: clientId,
          project_type: 'Social Content',
          objective: 'Create social media content series for Q2 campaign',
          target_audience: 'General public, youth demographic',
          status: 'brief_received',
          priority: 'medium',
          deadline: '2026-05-01',
        },
        {
          name: 'Brand Guidelines Update',
          client_id: clientId,
          project_type: 'Brand Identity',
          objective: 'Refresh brand guidelines document',
          status: 'client_review',
          priority: 'low',
          deadline: '2026-03-20',
          revision_count: 3,
        },
      ])
      results.push('Sample projects created')
    }
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
