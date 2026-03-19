import { useMemo, useState } from 'react';
import { type UserRole } from '@/contexts/AuthContext';
import { firebaseSetValue, isFirebaseConfigured } from '@/firebase';
import { useManagedUsers } from '@/hooks/useManagedUsers';
import { buildDriverFromManagedUser } from '@/lib/driverDefaults';
import { fallbackManagedUsers, type ManagedUser } from '@/lib/managedUsers';
import { UserPlus, Trash2, Shield, Users, Truck as TruckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

const roleBadgeClass: Record<UserRole, string> = {
  'super-admin': 'bg-primary/20 text-primary border-primary/30',
  admin: 'bg-status-maintenance/20 text-status-maintenance border-status-maintenance/30',
  driver: 'bg-status-active/20 text-status-active border-status-active/30',
};

const roleIcon: Record<UserRole, typeof Shield> = {
  'super-admin': Shield,
  admin: Users,
  driver: TruckIcon,
};

export default function UserManagementPanel() {
  const { users: remoteUsers, loading } = useManagedUsers();
  const [localUsers, setLocalUsers] = useState<ManagedUser[]>(fallbackManagedUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('driver');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const users = useMemo(() => {
    return isFirebaseConfigured ? remoteUsers : localUsers;
  }, [localUsers, remoteUsers]);

  const filtered = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setNewName('');
    setNewEmail('');
    setNewRole('driver');
  };

  const handleAdd = async () => {
    if (!newName || !newEmail) {
      return;
    }

    const user: ManagedUser = {
      id: `U-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      status: 'active',
      createdAt: Date.now(),
    };

    setIsSaving(true);

    try {
      if (isFirebaseConfigured) {
        await firebaseSetValue(`managedUsers/${user.id}`, {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        });

        if (user.role === 'driver') {
          await firebaseSetValue(`drivers/${user.id}`, buildDriverFromManagedUser(user));
        }
      } else {
        setLocalUsers((prev) => [user, ...prev]);
      }

      resetForm();
      setDialogOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isFirebaseConfigured) {
      await Promise.all([
        firebaseSetValue(`managedUsers/${id}`, null),
        firebaseSetValue(`drivers/${id}`, null),
      ]);
      return;
    }

    setLocalUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleToggleStatus = async (user: ManagedUser) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';

    if (isFirebaseConfigured) {
      await firebaseSetValue(`managedUsers/${user.id}`, {
        name: user.name,
        email: user.email,
        role: user.role,
        status: nextStatus,
        createdAt: user.createdAt ?? Date.now(),
      });
      return;
    }

    setLocalUsers((prev) =>
      prev.map((currentUser) =>
        currentUser.id === user.id ? { ...currentUser, status: nextStatus } : currentUser
      )
    );
  };

  return (
    <div className="glass-panel rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps mb-1">User Management</p>
          <h3 className="text-lg font-semibold tracking-tight">Admins & Drivers</h3>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500">
              <UserPlus className="w-3.5 h-3.5" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="john@fleet.io"
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Role</Label>
                <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                  <SelectTrigger className="mt-1 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" onClick={handleAdd} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-secondary border-border text-sm"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40 bg-secondary border-border text-sm">
            <SelectValue placeholder="Filter role" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super-admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 px-3 font-medium text-xs">User</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Email</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Role</th>
              <th className="text-left py-2 px-3 font-medium text-xs">Status</th>
              <th className="text-right py-2 px-3 font-medium text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const RoleIcon = roleIcon[user.role];

              return (
                <tr key={user.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{user.name}</td>
                  <td className="py-2.5 px-3 font-mono-data text-xs text-muted-foreground">{user.email}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="outline" className={`gap-1 text-[10px] ${roleBadgeClass[user.role]}`}>
                      <RoleIcon className="w-3 h-3" />
                      {user.role.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`status-dot inline-block cursor-pointer ${user.status === 'active' ? 'status-active' : 'status-idle'}`}
                      title={`Click to ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-status-emergency"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No users found.</p>
        )}
        {loading && isFirebaseConfigured && (
          <p className="text-center text-muted-foreground text-sm py-8">Loading users...</p>
        )}
      </div>
    </div>
  );
}
