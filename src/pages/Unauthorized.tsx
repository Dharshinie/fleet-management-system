import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  const roleUrls: Record<string, string> = {
    'super-admin': '/super-admin',
    'admin': '/admin',
    'driver': '/driver',
  };

  const dashboardUrl = user ? roleUrls[user.role] : '/';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-white p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      </div>

      <Card className="w-full max-w-md border-0 shadow-xl relative z-10">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this resource. Your role as <span className="font-semibold">{user?.role.replace('-', ' ').toUpperCase()}</span> doesn't allow access here.
          </p>

          <div className="space-y-3">
            <Link to={dashboardUrl} className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Home className="mr-2 h-4 w-4" />
                Go to Your Dashboard
              </Button>
            </Link>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
