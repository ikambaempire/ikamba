import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings, SiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Facebook, Instagram, Youtube, Linkedin, Music2, KeyRound, Mail } from "lucide-react";

type Section = "brand" | "contact" | "social" | "credentials";

const SettingsManager = () => {
  const { settings, refresh } = useSiteSettings();
  const { user, roles } = useAuth();
  const isSuper = roles.includes("super_admin");
  const [section, setSection] = useState<Section>("brand");
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const upd = (k: keyof SiteSettings, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload: any = { ...form };
    delete payload.id;
    const { error } = await supabase.from("site_settings").update(payload).eq("id", settings.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved – live on the public site");
    refresh();
  };

  // Credentials
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credSaving, setCredSaving] = useState(false);

  useEffect(() => { setNewEmail(user?.email || ""); }, [user]);

  const updateEmail = async () => {
    if (!newEmail || newEmail === user?.email) return;
    setCredSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setCredSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Email update requested. Check the inbox to confirm.");
  };

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setCredSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setCredSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setNewPassword(""); setConfirmPassword("");
  };

  const tabs = [
    { id: "brand" as const, label: "Brand & SEO" },
    { id: "contact" as const, label: "Contact Details" },
    { id: "social" as const, label: "Social Links" },
    { id: "credentials" as const, label: "Credentials" },
  ];

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">{children}</label>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Brand, contact details, social links, and credentials. Changes apply across the public site instantly.</p>
      </div>

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${section === t.id ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {section === "brand" && (
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-4 max-w-3xl">
          <div>
            <Label>Site Title</Label>
            <Input value={form.site_title} onChange={e => upd("site_title", e.target.value)} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={form.tagline} onChange={e => upd("tagline", e.target.value)} />
          </div>
          <div>
            <Label>Meta Description (for SEO, max ~160 chars)</Label>
            <Textarea value={form.meta_description} onChange={e => upd("meta_description", e.target.value)} rows={3} maxLength={300} />
            <p className="text-[10px] text-muted-foreground mt-1">{form.meta_description.length} / 160 recommended</p>
          </div>
          <Button onClick={save} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save size={14} className="mr-1.5" /> {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}

      {section === "contact" && (
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.contact_email} onChange={e => upd("contact_email", e.target.value)} />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input value={form.contact_phone} onChange={e => upd("contact_phone", e.target.value)} />
            </div>
            <div>
              <Label>WhatsApp Number</Label>
              <Input value={form.whatsapp_number || ""} onChange={e => upd("whatsapp_number", e.target.value)} placeholder="+250…" />
            </div>
            <div>
              <Label>Working Hours</Label>
              <Input value={form.working_hours || ""} onChange={e => upd("working_hours", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Address Line 1</Label>
              <Input value={form.address_line1 || ""} onChange={e => upd("address_line1", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Address Line 2</Label>
              <Input value={form.address_line2 || ""} onChange={e => upd("address_line2", e.target.value)} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city || ""} onChange={e => upd("city", e.target.value)} />
            </div>
          </div>
          <Button onClick={save} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save size={14} className="mr-1.5" /> {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}

      {section === "social" && (
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-4 max-w-3xl">
          {([
            { k: "facebook", label: "Facebook", icon: Facebook },
            { k: "instagram", label: "Instagram", icon: Instagram },
            { k: "youtube", label: "YouTube", icon: Youtube },
            { k: "tiktok", label: "TikTok", icon: Music2 },
            { k: "linkedin", label: "LinkedIn", icon: Linkedin },
          ] as const).map(({ k, label, icon: Icon }) => {
            const urlKey = `${k}_url` as keyof SiteSettings;
            const visKey = `${k}_visible` as keyof SiteSettings;
            return (
              <div key={k} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                <Icon size={18} className="text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
                  <Input value={(form[urlKey] as string) || ""} onChange={e => upd(urlKey, e.target.value)} placeholder={`https://${k}.com/...`} className="h-9" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Switch checked={form[visKey] as boolean} onCheckedChange={v => upd(visKey, v)} />
                  <span className="text-[10px] text-muted-foreground">{form[visKey] ? "Visible" : "Hidden"}</span>
                </div>
              </div>
            );
          })}
          <Button onClick={save} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Save size={14} className="mr-1.5" /> {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}

      {section === "credentials" && (
        <div className="space-y-5 max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Mail size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground">Change Email</h3>
            </div>
            <p className="text-xs text-muted-foreground">A confirmation link will be sent to the new email address.</p>
            <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            <Button onClick={updateEmail} disabled={credSaving || newEmail === user?.email} size="sm">
              {credSaving ? "Updating…" : "Update email"}
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <KeyRound size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground">Change Password</h3>
            </div>
            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 8 characters)" />
            <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
            <Button onClick={updatePassword} disabled={credSaving || !newPassword} size="sm">
              {credSaving ? "Updating…" : "Update password"}
            </Button>
          </div>

          {!isSuper && (
            <p className="text-xs text-muted-foreground italic">Note: changing your credentials only affects your own account.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsManager;
