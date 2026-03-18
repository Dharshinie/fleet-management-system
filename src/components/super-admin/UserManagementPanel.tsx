import { useState } from 'react';
import { drivers } from '@/data/mockData';
import type { UserRole } from '@/data/mockData';
import { UserPlus, Trash2, Edit, Shield, Users, Truck as TruckIcon } from 'lucide-react';
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

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

const initialUsers: ManagedUser[] = [
  { id: 'U-001', name: 'Admin One', email: 'admin1@fleet.io', role: 'admin', status: 'active' },
  ...drivers.map(d => ({
    id: d.id,
    name: d.name,
    email: `${d.name.toLowerCase().replace(' ', '.')}@fleet.io`,
    role: d.role,
    status: 'active' as const,
  })),
];

const roleBadgeClass: Record<UserRole, string> = {
  super_admin: 'bg-primary/20 text-primary border-primary/30',
  admin: 'bg-status-maintenance/20 text-status-maintenance border-status-maintenance/30',
  driver: 'bg-status-active/20 text-status-active border-status-active/30',
};

const roleIcon: Record<UserRole, typeof Shield> = {
  super_admin: Shield,
  admin: Users,
  driver: TruckIcon,
};

export default function UserManagementPanel() {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('driver');

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAdd = () => {
    if (!newName || !newEmail) return;
    const user: ManagedUser = {
      id: `U-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'active',
    };
    setUsers(prev => [...prev, user]);
    setNewName('');
    setNewEmail('');
    setNewRole('driver');
  };

  const handleDelete = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  return (
    <div className="glass-panel rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps mb-1">User Management</p>
          <h3 className="text-lg font-semibold tracking-tight">Admins & Drivers</h3>
        </div>

        <Dialog>
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
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="John Doe" className="mt-1 bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="john@fleet.io" className="mt-1 bg-secondary border-border" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Role</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                  <SelectTrigger className="mt-1 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button size="sm" onClick={handleAdd}>Create User</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs bg-secondary border-border text-sm"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-36 bg-secondary border-border text-sm">
            <SelectValue placeholder="Filter role" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Table */}
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
            {filtered.map(user => {
              const RoleIcon = roleIcon[user.role];
              return (
                <tr key={user.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium">{user.name}</td>
                  <td className="py-2.5 px-3 font-mono-data text-xs text-muted-foreground">{user.email}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="outline" className={`gap-1 text-[10px] ${roleBadgeClass[user.role]}`}>
                      <RoleIcon className="w-3 h-3" />
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`status-dot inline-block cursor-pointer ${user.status === 'active' ? 'status-active' : 'status-idle'}`}
                      title={`Click to ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-status-emergency" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No users found.</p>
        )}
      </div>
    </div>
  );
}
