import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, Trash2, Search, MessageSquare, Calendar } from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUSES = ["new", "in_progress", "responded", "resolved", "archived"];

const statusColor = (s: string) =>
  s === "new" ? "bg-accent/15 text-accent" :
  s === "in_progress" ? "bg-primary/15 text-primary" :
  s === "responded" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" :
  s === "resolved" ? "bg-green-500/15 text-green-600 dark:text-green-400" :
  "bg-muted text-muted-foreground";

const EnquiryManager = () => {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Enquiry[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const saveNotes = async (id: string, admin_notes: string) => {
    const { error } = await supabase.from("contact_messages").update({ admin_notes }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Notes saved");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setItems(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = items.filter(i => {
    if (filter !== "all" && i.status !== filter) return false;
    if (!q) return true;
    const t = q.toLowerCase();
    return i.name.toLowerCase().includes(t) || i.email.toLowerCase().includes(t) || i.message.toLowerCase().includes(t);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Enquiries</h2>
          <p className="text-sm text-muted-foreground">Messages submitted through the Contact page.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="pl-9 h-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              <MessageSquare className="mx-auto mb-2 opacity-40" size={32} />
              No enquiries yet.
            </div>
          ) : (
            <ul className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {filtered.map(e => (
                <li key={e.id}>
                  <button onClick={() => setSelected(e)}
                    className={`w-full text-left p-4 hover:bg-muted/40 transition-colors ${selected?.id === e.id ? "bg-muted/60" : ""}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground truncate">{e.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${statusColor(e.status)}`}>{e.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{e.email}</p>
                    <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">{e.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                      <Calendar size={10} /> {new Date(e.created_at).toLocaleString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selected.name}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1 hover:text-primary"><Mail size={12} /> {selected.email}</a>
                    {selected.phone && <a href={`tel:${selected.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone size={12} /> {selected.phone}</a>}
                  </div>
                  {selected.service && <p className="text-xs mt-1 text-muted-foreground">Service: <span className="text-foreground font-medium">{selected.service}</span></p>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove(selected.id)} className="text-destructive">
                  <Trash2 size={14} />
                </Button>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Message</p>
                <div className="bg-muted/40 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap">{selected.message}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Status</p>
                  <Select value={selected.status} onValueChange={v => updateStatus(selected.id, v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  <a href={`mailto:${selected.email}?subject=Re: Your enquiry to CPC`}>
                    <Button className="w-full" size="sm"><Mail size={14} className="mr-1.5" /> Reply by Email</Button>
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Internal Notes</p>
                <Textarea defaultValue={selected.admin_notes || ""} rows={4}
                  onBlur={e => e.target.value !== (selected.admin_notes || "") && saveNotes(selected.id, e.target.value)}
                  placeholder="Add notes for the team…" />
              </div>
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
              Select an enquiry to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryManager;
