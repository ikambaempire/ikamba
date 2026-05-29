import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LogOut, Building2, CalendarCheck, FileText, Users, Clock,
  CheckCircle2, XCircle, TrendingUp, Mail, Phone,
} from "lucide-react";
import BlogManager from "@/components/admin/BlogManager";
import BookingManager from "@/components/admin/BookingManager";
import UserManager from "@/components/admin/UserManager";

type Tab = "overview" | "bookings" | "blog" | "users";

const AdminDashboard = () => {
  const { user, profile, signOut, roles } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState({
    pending: 0, confirmed: 0, completed: 0, cancelled: 0,
    thisMonth: 0, total: 0, posts: 0, recent: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const [bookingsRes, postsRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    ]);
    const bookings = bookingsRes.data || [];
    const now = new Date();
    setStats({
      pending: bookings.filter((b: any) => b.status === "pending").length,
      confirmed: bookings.filter((b: any) => b.status === "confirmed").length,
      completed: bookings.filter((b: any) => b.status === "completed").length,
      cancelled: bookings.filter((b: any) => b.status === "cancelled").length,
      thisMonth: bookings.filter((b: any) => {
        const d = new Date(b.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      total: bookings.length,
      posts: postsRes.count || 0,
      recent: bookings.slice(0, 5),
    });
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const metrics = [
    { icon: Clock, label: "Pending Bookings", value: stats.pending, color: "text-accent", bg: "bg-accent/10" },
    { icon: CheckCircle2, label: "Confirmed", value: stats.confirmed, color: "text-primary", bg: "bg-primary/10" },
    { icon: CheckCircle2, label: "Completed", value: stats.completed, color: "text-success", bg: "bg-success/10" },
    { icon: XCircle, label: "Cancelled", value: stats.cancelled, color: "text-destructive", bg: "bg-destructive/10" },
    { icon: TrendingUp, label: "This Month", value: stats.thisMonth, color: "text-primary", bg: "bg-primary/10" },
    { icon: FileText, label: "Blog Posts", value: stats.posts, color: "text-accent", bg: "bg-accent/10" },
  ];

  const statusColor = (s: string) =>
    s === "pending" ? "bg-accent/15 text-accent-foreground" :
    s === "confirmed" ? "bg-primary/15 text-primary" :
    s === "completed" ? "bg-success/15 text-success" :
    "bg-muted text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-extrabold text-foreground">
              CPC<span className="text-accent">.</span>
            </span>
            <span className="text-muted-foreground/30 text-xs hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-sm">
              <Building2 size={14} />
              <span>Consultancy Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs text-accent border border-accent/30 px-2 py-0.5 rounded-full">
              {roles[0]?.replace("_", " ").toUpperCase()}
            </span>
            <span className="text-muted-foreground text-sm hidden md:block max-w-[200px] truncate">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage bookings, publish insights, and oversee your team.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
          {([
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "bookings", label: "Bookings", icon: CalendarCheck },
            { id: "blog", label: "Blog", icon: FileText },
            ...(roles.includes("super_admin") ? [{ id: "users", label: "Team", icon: Users }] : []),
          ] as { id: Tab; label: string; icon: any }[]).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${tab === t.id ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {metrics.map((m, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center mb-2.5`}>
                    <m.icon className={m.color} size={18} />
                  </div>
                  <p className="text-2xl font-extrabold text-foreground">{loading ? "—" : m.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground">Recent Bookings</h2>
                  <button onClick={() => setTab("bookings")} className="text-xs text-primary hover:underline">View all →</button>
                </div>
                {loading ? (
                  <div className="text-center text-muted-foreground py-8">Loading...</div>
                ) : stats.recent.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 text-sm">No bookings yet.</div>
                ) : (
                  <div className="space-y-2">
                    {stats.recent.map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground text-sm truncate">{b.name}</p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5">
                            <Mail size={11} /> {b.email}
                            {b.phone && <><Phone size={11} className="ml-1" /> {b.phone}</>}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wide ${statusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-primary to-[hsl(var(--brand-blue-mid))] rounded-xl p-6 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-white/70 mb-3">Quick Actions</p>
                <h3 className="text-xl font-extrabold mb-4 leading-snug">Run your consultancy from one place.</h3>
                <div className="space-y-2">
                  <button onClick={() => setTab("bookings")} className="w-full text-left bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between">
                    Manage bookings <CalendarCheck size={14} />
                  </button>
                  <button onClick={() => setTab("blog")} className="w-full text-left bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between">
                    Publish a new article <FileText size={14} />
                  </button>
                  {roles.includes("super_admin") && (
                    <button onClick={() => setTab("users")} className="w-full text-left bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between">
                      Manage team & admins <Users size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "bookings" && <BookingManager />}
        {tab === "blog" && <BlogManager />}
        {tab === "users" && roles.includes("super_admin") && <UserManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
