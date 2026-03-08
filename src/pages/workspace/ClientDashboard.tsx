import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FolderOpen, BarChart3, FileText, Clock, CheckCircle2, LogOut, Plus, Layers,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectStatus = Database["public"]["Enums"]["project_status"];

const statusLabels: Record<ProjectStatus, string> = {
  brief_received: "Brief Received",
  strategy_alignment: "Strategy Alignment",
  production: "Production",
  editing: "Editing",
  client_review: "Client Review",
  final_delivery: "Final Delivery",
  archive: "Archived",
};

const statusColors: Record<ProjectStatus, string> = {
  brief_received: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  strategy_alignment: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  production: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  editing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  client_review: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  final_delivery: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  archive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const ClientDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: proj } = await supabase.from("projects").select("*").order("updated_at", { ascending: false });
      if (proj) setProjects(proj);

      const { count } = await supabase.from("assets").select("*", { count: "exact", head: true });
      setAssets(count ?? 0);
      setLoading(false);
    };
    fetchData();
  }, []);

  const active = projects.filter((p) => !["archive", "final_delivery"].includes(p.status));
  const inReview = projects.filter((p) => p.status === "client_review");
  const completed = projects.filter((p) => ["final_delivery", "archive"].includes(p.status));

  const metrics = [
    { icon: Layers, label: "Total Projects", value: projects.length },
    { icon: BarChart3, label: "Active", value: active.length },
    { icon: Clock, label: "In Review", value: inReview.length },
    { icon: CheckCircle2, label: "Completed", value: completed.length },
    { icon: FolderOpen, label: "Assets Delivered", value: assets },
  ];

  return (
    <div className="min-h-screen bg-navy">
      {/* Top bar */}
      <header className="border-b border-primary-foreground/10 bg-navy-light/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-extrabold text-primary-foreground">
              IKAMBA<span className="text-accent">.</span>
            </span>
            <span className="text-primary-foreground/30 text-xs">|</span>
            <span className="text-primary-foreground/50 text-sm">Client Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/50 text-sm hidden sm:block">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground/40 hover:text-primary-foreground hover:bg-primary-foreground/5">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-foreground">
            Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="text-primary-foreground/40 text-sm mt-1">Your project overview and workspace</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {metrics.map((m, i) => (
            <div key={i} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-5">
              <m.icon className="text-accent mb-2" size={20} />
              <p className="text-2xl font-bold text-primary-foreground">{loading ? "—" : m.value}</p>
              <p className="text-xs text-primary-foreground/40 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-primary-foreground">Projects</h2>
          <Link to="/workspace/new-brief">
            <Button variant="hero" size="sm">
              <Plus size={14} className="mr-1" /> Submit Brief
            </Button>
          </Link>
        </div>

        {/* Projects Table */}
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-primary-foreground/30">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto mb-3 text-primary-foreground/20" size={32} />
              <p className="text-primary-foreground/40 text-sm">No projects yet. Submit your first brief to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-primary-foreground/10 hover:bg-transparent">
                  <TableHead className="text-primary-foreground/40">Project</TableHead>
                  <TableHead className="text-primary-foreground/40">Type</TableHead>
                  <TableHead className="text-primary-foreground/40">Status</TableHead>
                  <TableHead className="text-primary-foreground/40">Deadline</TableHead>
                  <TableHead className="text-primary-foreground/40">Revisions</TableHead>
                  <TableHead className="text-primary-foreground/40">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id} className="border-primary-foreground/5 hover:bg-primary-foreground/5 cursor-pointer" onClick={() => navigate(`/project/${p.id}`)}>
                    <TableCell className="text-primary-foreground font-medium">{p.name}</TableCell>
                    <TableCell className="text-primary-foreground/60 text-sm">{p.project_type || "—"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full border ${statusColors[p.status]}`}>
                        {statusLabels[p.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-primary-foreground/60 text-sm">
                      {p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-primary-foreground/60 text-sm">{p.revision_count}</TableCell>
                    <TableCell className="text-primary-foreground/40 text-xs">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
