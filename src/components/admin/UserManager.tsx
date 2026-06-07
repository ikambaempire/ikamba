import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { UserPlus, Shield, Trash2, UserX } from "lucide-react";

interface ManagedUser {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
  created_at: string;
}

const roleLabels: Record<string, string> = {
  super_admin: "Owner",
  org_admin: "Admin",
  project_manager: "Manager",
};

const assignableRoles = ["org_admin", "project_manager"];

const UserManager = () => {
  const { roles } = useAuth();
  const canManage = roles.includes("super_admin") || roles.includes("org_admin");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("project_manager");
  const [adding, setAdding] = useState(false);

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("manage-admins", { body });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const fetchUsers = async () => {
    try {
      const data = await call({ action: "list" });
      setUsers(data.users || []);
    } catch (err: any) {
      toast.error("Failed to load users: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => { if (canManage) fetchUsers(); else setLoading(false); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setAdding(true);
    try {
      await call({
        action: "add_admin",
        email: newEmail,
        password: newPassword || undefined,
        full_name: newName,
        role: newRole,
      });
      toast.success(`${newEmail} added as ${roleLabels[newRole]}`);
      setNewEmail(""); setNewName(""); setNewPassword("");
      setShowAdd(false);
      fetchUsers();
    } catch (err: any) { toast.error(err.message); }
    setAdding(false);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await call({ action: "update_role", user_id: userId, new_role: newRole });
      toast.success("Role updated");
      fetchUsers();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Permanently delete ${email}? This removes their account and access.`)) return;
    try {
      await call({ action: "delete_user", user_id: userId });
      toast.success("User deleted");
      fetchUsers();
    } catch (err: any) { toast.error(err.message); }
  };

  if (!canManage) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <Shield className="mx-auto mb-3 text-muted-foreground/50" size={40} />
        <p className="font-medium">Access Restricted</p>
        <p className="text-sm mt-1">Only admins can manage the team.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Team Management</h2>
          <p className="text-sm text-muted-foreground">Add team members, change their role, or remove access.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "outline" : "default"} size="sm">
          <UserPlus size={14} className="mr-1" />
          {showAdd ? "Cancel" : "Add User"}
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-muted/30 border border-border rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email *</label>
              <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="user@example.com" required type="email" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Temporary Password</label>
              <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" type="password" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role</label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {assignableRoles.map(r => (
                    <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground mt-1">
                Manager: can publish blog posts. Admin: full dashboard access.
              </p>
            </div>
          </div>
          <Button type="submit" disabled={adding} size="sm">
            {adding ? "Adding..." : "Add User"}
          </Button>
        </form>
      )}

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading users...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground text-xs">Name</TableHead>
                <TableHead className="text-muted-foreground text-xs">Email</TableHead>
                <TableHead className="text-muted-foreground text-xs">Role</TableHead>
                <TableHead className="text-muted-foreground text-xs">Joined</TableHead>
                <TableHead className="text-muted-foreground text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => {
                const isOwner = u.roles.includes("super_admin");
                const primaryRole = u.roles.find(r => r !== "super_admin") || "project_manager";
                return (
                  <TableRow key={u.id} className="border-border">
                    <TableCell className="text-sm font-medium text-foreground">{u.full_name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      {isOwner ? (
                        <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-semibold">Owner</span>
                      ) : (
                        <Select value={primaryRole} onValueChange={v => handleUpdateRole(u.id, v)}>
                          <SelectTrigger className="h-7 text-xs w-[140px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {assignableRoles.map(r => (
                              <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {!isOwner && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id, u.email)}
                          className="text-destructive hover:text-destructive h-7" title="Delete user">
                          <UserX size={14} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UserManager;
