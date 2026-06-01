import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LogOut, Building2, CalendarCheck, FileText, Users, Clock,
  CheckCircle2, XCircle, TrendingUp, Mail, Phone, MessageSquare,
  Settings as SettingsIcon, Award, Menu, X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BlogManager from "@/components/admin/BlogManager";
import BookingManager from "@/components/admin/BookingManager";
import UserManager from "@/components/admin/UserManager";
import EnquiryManager from "@/components/admin/EnquiryManager";
import TrustedIndustriesManager from "@/components/admin/TrustedIndustriesManager";
import SettingsManager from "@/components/admin/SettingsManager";

type Tab = "overview" | "bookings" | "enquiries" | "industries" | "blog" | "users" | "settings";

const AdminDashboard = () => {
  const { user, profile, signOut, roles } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stats, setStats] = useState({
    pending: 0, confirmed: 0, completed: 0, cancelled: 0,
    thisMonth: 0, total: 0, posts: 0, enquiriesNew: 0, industries: 0,
    recent: [] as any[], recentEnquiries: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const [bookingsRes, postsRes, enquiriesRes, industriesRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("trusted_industries").select("id", { count: "exact", head: true }),
    ]);
    const bookings = bookingsRes.data || [];
    const enquiries = enquiriesRes.data || [];
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
      enquiriesNew: enquiries.filter((e: any) => e.status === "new").length,
      industries: industriesRes.count || 0,
      recent: bookings.slice(0, 5),
      recentEnquiries: enquiries.slice(0, 5),
    });
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, [tab]);

  const metrics = [
    { icon: MessageSquare, label: "New Enquiries", value: stats.enquiriesNew, color: "text-accent", bg: "bg-accent/10" },
    { icon: Clock, label: "Pending Bookings", value: stats.pending, color: "text-primary", bg: "bg-primary/10" },
    { icon: CheckCircle2, label: "Confirmed", value: stats.confirmed, color: "text-primary", bg: "bg-primary/10" },
    { icon: CheckCircle2, label: "Completed", value: stats.completed, color: "text-success", bg: "bg-success/10" },
    { icon: Award, label: "Industries", value: stats.industries, color: "text-primary", bg: "bg-primary/10" },
    { icon: FileText, label: "Blog Posts", value: stats.posts, color: "text-accent", bg: "bg-accent/10" },
  ];

  const statusColor = (s: string) =>
    s === "pending" || s === "new" ? "bg-accent/15 text-accent" :
    s === "confirmed" || s === "in_progress" ? "bg-primary/15 text-primary" :
    s === "completed" || s === "resolved" ? "bg-success/15 text-success" :
    "bg-muted text-muted-foreground";

  const tabs: { id: Tab; label: string; icon: any; superOnly?: boolean }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "enquiries", label: "Enquiries", icon: MessageSquare },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "industries", label: "Trusted Industries", icon: Award },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "users", label: "Team", icon: Users, superOnly: true },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-heading text-base sm:text-lg font-extrabold text-foreground shrink-0">
              CPC<span className="text-accent">.</span>
            </span>
            <span className="text-muted-foreground/30 text-xs hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-sm">
              <Building2 size={14} />
              <span>Consultancy Admin</span>
            </div>
            <span className="sm:hidden text-[10px] text-muted-foreground truncate">Admin</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="text-[9px] sm:text-xs text-accent border border-accent/30 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
              {roles[0]?.replace("_", " ").toUpperCase()}
            </span>
            <span className="text-muted-foreground text-sm hidden lg:block max-w-[200px] truncate">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
              <LogOut size={16} />
            </Button>
            <button
              onClick={() => setMobileNavOpen(v => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNavOpen}
              className="md:hidden p-2 -mr-1 rounded-lg hover:bg-muted text-foreground transition-colors"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="max-w-[1400px] mx-auto px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground px-2 mb-2">Navigate</p>
                <nav className="flex flex-col gap-1">
                  {tabs.filter(t => !t.superOnly || roles.includes("super_admin")).map((t) => {
                    const active = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { setTab(t.id); setMobileNavOpen(false); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${active ? "bg-accent/10 text-accent" : "text-foreground/80 hover:bg-muted"}`}
                      >
                        <t.icon size={16} className={active ? "text-accent" : "text-muted-foreground"} />
                        <span className="flex-1">{t.label}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                      </button>
                    );
                  })}
                </nav>
                <div className="border-t border-border mt-3 pt-3 px-2 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{profile?.full_name || "Admin"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground shrink-0">
                    <LogOut size={14} className="mr-1.5" /> Sign out
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 md:mb-8 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage enquiries, bookings, content, and your brand from one place.</p>
          </div>
          <span className="md:hidden shrink-0 mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full whitespace-nowrap">
            {tabs.find(t => t.id === tab)?.label}
          </span>
        </div>

        {/* Desktop tab strip */}
        <div className="hidden md:flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
          {tabs.filter(t => !t.superOnly || roles.includes("super_admin")).map((t) => (
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
              <div className="bg-card border border-border rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground">Recent Enquiries</h2>
                  <button onClick={() => setTab("enquiries")} className="text-xs text-primary hover:underline">View all →</button>
                </div>
                {loading ? <div className="text-center text-muted-foreground py-8">Loading…</div> :
                  stats.recentEnquiries.length === 0 ? <div className="text-center text-muted-foreground py-8 text-sm">No enquiries yet.</div> :
                  <div className="space-y-2">
                    {stats.recentEnquiries.map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground text-sm truncate">{b.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{b.email}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase ${statusColor(b.status)}`}>{b.status}</span>
                      </div>
                    ))}
                  </div>}
              </div>

              <div className="bg-card border border-border rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground">Recent Bookings</h2>
                  <button onClick={() => setTab("bookings")} className="text-xs text-primary hover:underline">View all →</button>
                </div>
                {loading ? <div className="text-center text-muted-foreground py-8">Loading…</div> :
                  stats.recent.length === 0 ? <div className="text-center text-muted-foreground py-8 text-sm">No bookings yet.</div> :
                  <div className="space-y-2">
                    {stats.recent.map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground text-sm truncate">{b.name}</p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5">
                            <Mail size={11} /> {b.email}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium uppercase ${statusColor(b.status)}`}>{b.status}</span>
                      </div>
                    ))}
                  </div>}
              </div>

              <div className="bg-gradient-to-br from-primary to-[hsl(var(--brand-blue-mid))] rounded-xl p-6 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-white/70 mb-3">Quick Actions</p>
                <h3 className="text-xl font-extrabold mb-4 leading-snug">Run your consultancy from one place.</h3>
                <div className="space-y-2">
                  <button onClick={() => setTab("enquiries")} className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between">
                    Review enquiries <MessageSquare size={14} />
                  </button>
                  <button onClick={() => setTab("industries")} className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between">
                    Manage trusted industries <Award size={14} />
                  </button>
                  <button onClick={() => setTab("blog")} className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between">
                    Publish a new article <FileText size={14} />
                  </button>
                  <button onClick={() => setTab("settings")} className="w-full text-left bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between">
                    Update site settings <SettingsIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "enquiries" && <EnquiryManager />}
        {tab === "bookings" && <BookingManager />}
        {tab === "industries" && <TrustedIndustriesManager />}
        {tab === "blog" && <BlogManager />}
        {tab === "users" && roles.includes("super_admin") && <UserManager />}
        {tab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
