import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Clock, XCircle, CalendarCheck, Mail, Phone, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  preferred_date: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const statusOptions = ["pending", "confirmed", "completed", "cancelled"];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  completed: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

const BookingManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notes, setNotes] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error("Failed to update");
    else { toast.success(`Booking ${status}`); fetchBookings(); }
  };

  const saveNotes = async () => {
    if (!selected) return;
    const { error } = await supabase.from("bookings").update({ admin_notes: notes }).eq("id", selected.id);
    if (error) toast.error("Failed to save notes");
    else { toast.success("Notes saved"); fetchBookings(); setSelected(null); }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); fetchBookings(); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <Clock className="text-amber-500 mb-1" size={18} />
          <p className="text-2xl font-bold text-foreground">{counts.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <CheckCircle2 className="text-emerald-500 mb-1" size={18} />
          <p className="text-2xl font-bold text-foreground">{counts.confirmed}</p>
          <p className="text-xs text-muted-foreground">Confirmed</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <CalendarCheck className="text-primary mb-1" size={18} />
          <p className="text-2xl font-bold text-foreground">{counts.completed}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <XCircle className="text-destructive mb-1" size={18} />
          <p className="text-2xl font-bold text-foreground">{counts.cancelled}</p>
          <p className="text-xs text-muted-foreground">Cancelled</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <h2 className="text-lg font-bold text-foreground">Consultation Bookings</h2>
        <div className="flex gap-1 flex-wrap">
          {(["all", ...statusOptions] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {s} ({counts[s as keyof typeof counts]})
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No bookings in this view.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs">Client</TableHead>
                <TableHead className="text-xs">Contact</TableHead>
                <TableHead className="text-xs">Service</TableHead>
                <TableHead className="text-xs">Preferred</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Received</TableHead>
                <TableHead className="text-xs w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} className="border-border">
                  <TableCell className="text-sm font-medium text-foreground">{b.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Mail size={11} />{b.email}</div>
                    {b.phone && <div className="flex items-center gap-1 mt-0.5"><Phone size={11} />{b.phone}</div>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.service || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                      <SelectTrigger className={`h-7 text-xs w-[120px] border ${statusStyle[b.status] || ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setSelected(b); setNotes(b.admin_notes || ""); }}>
                        <Eye size={13} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteBooking(b.id)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-muted-foreground">Email:</span> <a href={`mailto:${selected.email}`} className="text-primary">{selected.email}</a></div>
                {selected.phone && <div><span className="text-muted-foreground">Phone:</span> <a href={`tel:${selected.phone}`} className="text-primary">{selected.phone}</a></div>}
                {selected.service && <div className="col-span-2"><span className="text-muted-foreground">Service:</span> {selected.service}</div>}
                {selected.preferred_date && <div className="col-span-2"><span className="text-muted-foreground">Preferred date:</span> {new Date(selected.preferred_date).toLocaleDateString()}</div>}
              </div>

              {selected.message && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Message</p>
                  <p className="bg-muted/40 rounded-md p-3 text-foreground whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Internal notes</p>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Notes only visible to admins…" />
              </div>

              <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { updateStatus(selected.id, "confirmed"); setSelected(null); }}>
                    <CheckCircle2 size={14} className="mr-1" /> Confirm
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { updateStatus(selected.id, "cancelled"); setSelected(null); }}>
                    Cancel
                  </Button>
                </div>
                <Button size="sm" onClick={saveNotes}>Save notes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManager;
