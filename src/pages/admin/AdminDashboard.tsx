import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BarChart3, Clock, AlertTriangle, CheckCircle2, LogOut, Layers, Users, TrendingUp,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];
type ProjectStatus = Database["public"]["Enums"]["project_status"];
type PriorityLevel = Database["public"]["Enums"]["priority_level"];

const statusLabels: Record<ProjectStatus, string> = {
  brief_received: "Brief Received",
  strategy_alignment: "Strategy",
  production: "Production",
  editing: "Editing",
  client_review: "Client Review",
  final_delivery: "Final Delivery",
  archive: "Archived",
};

const allStatuses: ProjectStatus[] = [
  "brief_received", "strategy_alignment", "production", "editing", "client_review", "final_delivery", "archive",
];

const priorityColors: Record<PriorityLevel, string> = {
  low: "bg-gray-500/20 text-gray-300",
  medium: "bg-blue-500/20 text-blue-300",
  high: "bg-orange-500/20 text-orange-300",
  urgent: "bg-red-500/20 text-red-300",
};

const AdminDashboard = () => {
  const { user, profile, signOut, roles } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [projRes, clientRes] = await Promise.all([
      supabase.from("projects").select("*").order("updated_at", { ascending: false }),
      supabase.from("clients").select("*"),
    ]);
    if (projRes.data) setProjects(projRes.data);
    if (clientRes.data) setClients(clientRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getClientName = (clientId: string) => clients.find((c) => c.id === clientId)?.name || "—";

  const getDaysInStage = (stageEnteredAt: string) => {
    const days = Math.floor((Date.now() - new Date(stageEnteredAt).getTime()) / 86400000);
    return days;
  };

  const getDeadlineRisk = (deadline: string | null, status: ProjectStatus) => {
    if (!deadline || ["final_delivery", "archive"].includes(status)) return "green";
    const daysLeft = Math.floor((new Date(deadline).getTime() - Date.now()) / 86400000);
    if (daysLeft < 0) return "red";
    if (daysLeft <= 3) return "orange";
    return "green";
  };

  const active = projects.filter((p) => !["archive", "final_delivery"].includes(p.status));
  const inReview = projects.filter((p) => p.status === "client_review");
  const overdue = projects.filter((p) => p.deadline && new Date(p.deadline) < new Date() && !["final_delivery", "archive"].includes(p.status));
  const deliveredThisMonth = projects.filter((p) => {
    if (p.status !== "final_delivery") return false;
    const now = new Date();
    const updated = new Date(p.updated_at);
    return updated.getMonth() === now.getMonth() && updated.getFullYear() === now.getFullYear();
  });
  const avgRevisions = projects.length > 0
    ? (projects.reduce((s, p) => s + p.revision_count, 0) / projects.length).toFixed(1)
    : "0";

  const updateProjectStatus = async (projectId: string, newStatus: ProjectStatus) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    await supabase.from("project_status_logs").insert({
      project_id: projectId,
      old_status: project.status,
      new_status: newStatus,
      changed_by: user?.id,
    });
    await supabase.from("projects").update({ status: newStatus, stage_entered_at: new Date().toISOString() }).eq("id", projectId);
    fetchData();
  };

  const updatePriority = async (projectId: string, priority: PriorityLevel) => {
    await supabase.from("projects").update({ priority }).eq("id", projectId);
    fetchData();
  };

  const metrics = [
    { icon: Layers, label: "Active Projects", value: active.length, color: "text-blue-400" },
    { icon: Clock, label: "In Review", value: inReview.length, color: "text-cyan-400" },
    { icon: AlertTriangle, label: "Overdue", value: overdue.length, color: "text-red-400" },
    { icon: CheckCircle2, label: "Delivered This Month", value: deliveredThisMonth.length, color: "text-emerald-400" },
    { icon: TrendingUp, label: "Avg Revisions", value: avgRevisions, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-navy">
      {/* Top bar */}
      <header className="border-b border-primary-foreground/10 bg-navy-light/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-extrabold text-primary-foreground">
              IKAMBA<span className="text-accent">.</span>
            </span>
            <span className="text-primary-foreground/30 text-xs">|</span>
            <span className="text-primary-foreground/50 text-sm">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-accent border border-accent/30 px-2 py-0.5 rounded-full">
              {roles[0]?.replace("_", " ").toUpperCase()}
            </span>
            <span className="text-primary-foreground/50 text-sm hidden sm:block">
              {profile?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-primary-foreground/40 hover:text-primary-foreground hover:bg-primary-foreground/5">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-foreground">Global Overview</h1>
          <p className="text-primary-foreground/40 text-sm mt-1">Operational status across all projects</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {metrics.map((m, i) => (
            <div key={i} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-5">
              <m.icon className={`${m.color} mb-2`} size={20} />
              <p className="text-2xl font-bold text-primary-foreground">{loading ? "—" : m.value}</p>
              <p className="text-xs text-primary-foreground/40 mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Master Project Table */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-primary-foreground">Master Project Table</h2>
          <span className="text-primary-foreground/30 text-sm">{projects.length} projects</span>
        </div>

        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-primary-foreground/30">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-primary-foreground/10 hover:bg-transparent">
                  <TableHead className="text-primary-foreground/40 text-xs">Client</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Project</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Type</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Status</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Priority</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Deadline</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Days in Stage</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Revisions</TableHead>
                  <TableHead className="text-primary-foreground/40 text-xs">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => {
                  const risk = getDeadlineRisk(p.deadline, p.status);
                  const days = getDaysInStage(p.stage_entered_at);
                  return (
                    <TableRow key={p.id} className="border-primary-foreground/5 hover:bg-primary-foreground/5 cursor-pointer" onClick={() => navigate(`/project/${p.id}`)}>
                      <TableCell className="text-primary-foreground/60 text-sm">{getClientName(p.client_id)}</TableCell>
                      <TableCell className="text-primary-foreground font-medium text-sm">{p.name}</TableCell>
                      <TableCell className="text-primary-foreground/60 text-xs">{p.project_type || "—"}</TableCell>
                      <TableCell>
                        <Select value={p.status} onValueChange={(v) => updateProjectStatus(p.id, v as ProjectStatus)}>
                          <SelectTrigger className="h-7 text-xs bg-transparent border-primary-foreground/10 text-primary-foreground w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allStatuses.map((s) => (
                              <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={p.priority} onValueChange={(v) => updatePriority(p.id, v as PriorityLevel)}>
                          <SelectTrigger className={`h-7 text-xs border-0 w-[90px] ${priorityColors[p.priority]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(["low", "medium", "high", "urgent"] as PriorityLevel[]).map((pr) => (
                              <SelectItem key={pr} value={pr}>{pr.charAt(0).toUpperCase() + pr.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${risk === "red" ? "text-red-400 font-semibold" : risk === "orange" ? "text-orange-400" : "text-primary-foreground/60"}`}>
                          {p.deadline ? new Date(p.deadline).toLocaleDateString() : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${days > 7 ? "text-orange-400" : "text-primary-foreground/60"}`}>
                          {days}d
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${p.revision_count > 2 ? "text-orange-400 font-semibold" : "text-primary-foreground/60"}`}>
                          {p.revision_count}
                        </span>
                      </TableCell>
                      <TableCell className="text-primary-foreground/40 text-xs">
                        {new Date(p.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
