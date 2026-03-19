import { drivers } from '@/data/mockData';
import type { UserRole } from '@/contexts/AuthContext';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt?: number;
}

export const fallbackManagedUsers: ManagedUser[] = [
  { id: 'U-001', name: 'Admin One', email: 'admin1@fleet.io', role: 'admin', status: 'active', createdAt: Date.now() - 10000 },
  { id: 'U-000', name: 'Super Admin', email: 'super@fleet.io', role: 'super-admin', status: 'active', createdAt: Date.now() - 20000 },
  ...drivers.map((driver, index) => ({
    id: driver.id,
    name: driver.name,
    email: `${driver.name.toLowerCase().replace(/\s+/g, '.')}@fleet.io`,
    role: 'driver' as const,
    status: 'active' as const,
    createdAt: Date.now() - (index + 3) * 1000,
  })),
];

export const normalizeManagedUserRole = (role?: string): UserRole => {
  if (role === 'super_admin') {
    return 'super-admin';
  }

  if (role === 'super-admin' || role === 'admin' || role === 'driver') {
    return role;
  }

  return 'driver';
};

export const mapStoredUsers = (data: Record<string, Partial<ManagedUser>>): ManagedUser[] => {
  return Object.entries(data).map(([key, value]) => ({
    id: key,
    name: value.name ?? 'User',
    email: value.email ?? '',
    role: normalizeManagedUserRole(value.role),
    status: value.status === 'inactive' ? 'inactive' : 'active',
    createdAt: value.createdAt,
  }));
};
