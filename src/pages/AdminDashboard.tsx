import { fleetStats } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Truck, Route, Fuel, AlertTriangle, LayoutDashboard, Map, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LiveVehicleCount from '@/components/dashboard/LiveVehicleCount';
import ActiveTripsWidget from '@/components/dashboard/ActiveTripsWidget';
import FuelConsumptionChart from '@/components/dashboard/FuelConsumptionChart';
import DriverPerformanceWidget from '@/components/dashboard/DriverPerformanceWidget';
import MaintenanceAlertsWidget from '@/components/dashboard/MaintenanceAlertsWidget';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
        {/* Row 1: Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Vehicles', value: fleetStats.totalVehicles, icon: Truck, accent: 'text-primary' },
            { label: 'Active Trips', value: fleetStats.activeTrips, icon: Route, accent: 'text-status-active' },
            { label: 'Avg. Fuel Eff.', value: `${fleetStats.avgFuelEfficiency} MPG`, icon: Fuel, accent: 'text-status-maintenance' },
            { label: 'Alerts Today', value: fleetStats.alertsToday, icon: AlertTriangle, accent: 'text-status-emergency' },
          ].map((card, i) => (
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

        {/* Row 2: Live Vehicle Count + Active Trips */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <LiveVehicleCount />
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
            <ActiveTripsWidget />
          </motion.div>
        </div>

        {/* Row 3: Fuel Chart + Driver Performance */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} className="col-span-2">
            <FuelConsumptionChart />
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }}>
            <DriverPerformanceWidget />
          </motion.div>
        </div>

        {/* Row 4: Maintenance Alerts */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.4 }}>
          <MaintenanceAlertsWidget />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
