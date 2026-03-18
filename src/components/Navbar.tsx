import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Shield, Users, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleConfig = {
    'super-admin': { label: 'Super Admin', icon: Shield, color: 'p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500' },
    'admin': { label: 'Admin', icon: Users, color: 'p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500' },
    'driver': { label: 'Driver', icon: Zap, color: 'p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500' },
  };

  const config = roleConfig[user?.role || 'driver'];
  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left - Branding */}
        <div className="flex items-center gap-3">
          <div className="font-semibold text-gray-900">FleetCommand</div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
            <config.icon className="w-3 h-3" />
            {config.label}
          </div>
        </div>

        {/* Right - User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full h-10 w-10 p-0 p-2 rounded-lg bg-gradient-to-br">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={`${config.color} text-white font-semibold`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-600">{user?.email}</div>
              <div className="text-xs text-gray-500 mt-1">{config.label}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-xs text-gray-600">
              <User className="mr-2 h-4 w-4" />
              Profile (Coming soon)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
