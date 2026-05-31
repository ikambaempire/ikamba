import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Plus, Upload, ImageIcon, GripVertical } from "lucide-react";

interface Industry {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  active: boolean;
  sort_order: number;
}

const TrustedIndustriesManager = () => {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("trusted_industries").select("*").order("sort_order").order("created_at");
    if (error) toast.error(error.message);
    setItems((data as Industry[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !file) { toast.error("Name and logo are required"); return; }
    setAdding(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("industry-logos").upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("industry-logos").getPublicUrl(path);

      const { error } = await supabase.from("trusted_industries").insert({
        name, logo_url: publicUrl, website_url: website || null,
        sort_order: items.length,
      });
      if (error) throw error;
      toast.success(`${name} added`);
      setName(""); setWebsite(""); setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
    setAdding(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from("trusted_industries").update({ active }).eq("id", id);
    if (error) return toast.error(error.message);
    setItems(prev => prev.map(i => i.id === id ? { ...i, active } : i));
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this industry?")) return;
    const { error } = await supabase.from("trusted_industries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex(i => i.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= items.length) return;
    const a = items[idx], b = items[swap];
    const newItems = [...items];
    newItems[idx] = { ...b, sort_order: idx };
    newItems[swap] = { ...a, sort_order: swap };
    setItems(newItems);
    await Promise.all([
      supabase.from("trusted_industries").update({ sort_order: swap }).eq("id", a.id),
      supabase.from("trusted_industries").update({ sort_order: idx }).eq("id", b.id),
    ]);
  };

  const activeCount = items.filter(i => i.active).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Trusted Industries</h2>
        <p className="text-sm text-muted-foreground">
          Logos appear above the hero section. {activeCount > 5 ? "Showing as marquee (>5 active)." : "Showing as static grid (≤5 active)."} If none are active, the section is hidden.
        </p>
      </div>

      <form onSubmit={handleAdd} className="bg-muted/30 border border-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Industry name *</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Acme Corp" required />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Website (optional)</label>
          <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://…" type="url" />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Logo *</label>
          <Input ref={fileInput} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
        </div>
        <Button type="submit" disabled={adding} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus size={14} className="mr-1" /> {adding ? "Adding…" : "Add Industry"}
        </Button>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            <ImageIcon className="mx-auto mb-2 opacity-40" size={32} />
            No industries added yet. The trusted bar is hidden on the public site.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((i, idx) => (
              <li key={i.id} className="flex items-center gap-4 p-3 hover:bg-muted/30">
                <div className="flex flex-col">
                  <button onClick={() => move(i.id, -1)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▲</button>
                  <GripVertical size={12} className="text-muted-foreground/40" />
                  <button onClick={() => move(i.id, 1)} disabled={idx === items.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▼</button>
                </div>
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-border shrink-0 p-2">
                  <img src={i.logo_url} alt={i.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{i.name}</p>
                  {i.website_url && <a href={i.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">{i.website_url}</a>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground hidden sm:inline">{i.active ? "Visible" : "Hidden"}</span>
                  <Switch checked={i.active} onCheckedChange={v => toggleActive(i.id, v)} />
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove(i.id)} className="text-destructive">
                  <Trash2 size={14} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TrustedIndustriesManager;
