import { fleetStats } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Truck, Route, Fuel, AlertTriangle, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LiveVehicleCount from '@/components/dashboard/LiveVehicleCount';
import ActiveTripsWidget from '@/components/dashboard/ActiveTripsWidget';
import FuelConsumptionChart from '@/components/dashboard/FuelConsumptionChart';
import DriverPerformanceWidget from '@/components/dashboard/DriverPerformanceWidget';
import MaintenanceAlertsWidget from '@/components/dashboard/MaintenanceAlertsWidget';
import DocumentExpiryWidget from '@/components/dashboard/DocumentExpiryWidget';
import VehicleManagementPanel from '@/components/admin/VehicleManagementPanel';
import { useVehicles } from '@/hooks/useVehicles';
import { useManagedUsers } from '@/hooks/useManagedUsers';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { vehicles } = useVehicles();
  const { users } = useManagedUsers();

  const summaryCards = [
    { label: 'Total Vehicles', value: vehicles.length, icon: Truck, accent: 'text-primary' },
    { label: 'Drivers', value: users.filter((entry) => entry.role === 'driver').length, icon: Route, accent: 'text-status-active' },
    {
      label: 'Avg. Fuel',
      value: `${vehicles.length ? Math.round(vehicles.reduce((sum, vehicle) => sum + vehicle.fuelLevel, 0) / vehicles.length) : 0}%`,
      icon: Fuel,
      accent: 'text-status-maintenance',
    },
    { label: 'Alerts Today', value: fleetStats.alertsToday, icon: AlertTriangle, accent: 'text-status-emergency' },
  ];

  const scrollToVehicleManagement = () => {
    document.getElementById('vehicle-management')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="glass-panel glass-shine rounded-lg p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="label-caps">{card.label}</span>
                <div className="p-1.5 rounded-md bg-accent/50">
                  <card.icon className={`w-4 h-4 ${card.accent}`} />
                </div>
              </div>
              <p className="font-mono-data text-3xl font-semibold">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="divider-glow" />

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.18 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/fleet" className="glass-panel glass-shine rounded-lg p-5 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div>
              <p className="label-caps">Live Monitoring</p>
              <h3 className="text-lg font-semibold tracking-tight">Open Live Map</h3>
              <p className="text-xs text-muted-foreground">See real-time location and status of your fleet.</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
              <Map className="w-5 h-5 text-primary" />
            </div>
          </Link>

          <div className="glass-panel glass-shine rounded-lg p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="label-caps">Fleet Operations</p>
                <h3 className="text-lg font-semibold tracking-tight">Manage Vehicle Profiles</h3>
                <p className="text-xs text-muted-foreground">Open the saved vehicle records and review their details.</p>
              </div>
              <button type="button" onClick={scrollToVehicleManagement} className="text-xs font-semibold text-primary hover:underline">
                Go to management
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <LiveVehicleCount />
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
            <ActiveTripsWidget />
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} className="col-span-2">
            <FuelConsumptionChart />
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }}>
            <DriverPerformanceWidget />
          </motion.div>
        </div>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.4 }}>
          <MaintenanceAlertsWidget />
        </motion.div>

        <div id="vehicle-management" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.45 }} className="lg:col-span-2">
            <VehicleManagementPanel />
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.5 }}>
            <DocumentExpiryWidget />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
