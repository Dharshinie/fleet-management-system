import { motion } from 'framer-motion';
import { Users, Shield, Palette, LayoutDashboard, Map, DollarSign, Server, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SystemOverviewWidgets from '@/components/super-admin/SystemOverviewWidgets';
import UserManagementPanel from '@/components/super-admin/UserManagementPanel';
import SystemCustomization from '@/components/super-admin/SystemCustomization';
import FinancialOverview from '@/components/super-admin/FinancialOverview';
import InfrastructureManagement from '@/components/super-admin/InfrastructureManagement';
import ZonalControl from '@/components/super-admin/ZonalControl';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
        {/* Row 1: System Overview KPIs */}
        <motion.div {...fadeUp}>
          <SystemOverviewWidgets />
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Link
            to="/fleet"
            className="glass-panel glass-shine rounded-lg p-5 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <p className="label-caps">Live Monitoring</p>
              <h3 className="text-lg font-semibold tracking-tight">Open Live Map View</h3>
              <p className="text-xs text-muted-foreground">
                Monitor live fleet positions, alerts, and driver activity in one place.
              </p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <Map className="w-5 h-5 text-primary" />
            </div>
          </Link>

          <div className="glass-panel glass-shine rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="label-caps">System Control</p>
                <h3 className="text-lg font-semibold tracking-tight">Oversee Operations</h3>
                <p className="text-xs text-muted-foreground">
                  Review user access, finance, infrastructure, and zones from the tabs below.
                </p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="divider-glow" />

        {/* Tabs: Management & Customization */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="glass-frosted border border-border p-1">
              <TabsTrigger value="users" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5">
                <Users className="w-3.5 h-3.5" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Finance
              </TabsTrigger>
              <TabsTrigger value="infra" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Infrastructure
              </TabsTrigger>
              <TabsTrigger value="zones" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Zonal Control
              </TabsTrigger>
              <TabsTrigger value="customize" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                System Customization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UserManagementPanel />
            </TabsContent>

            <TabsContent value="financial">
              <FinancialOverview />
            </TabsContent>

            <TabsContent value="infra">
              <InfrastructureManagement />
            </TabsContent>

            <TabsContent value="zones">
              <ZonalControl />
            </TabsContent>

            <TabsContent value="customize">
              <SystemCustomization />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
