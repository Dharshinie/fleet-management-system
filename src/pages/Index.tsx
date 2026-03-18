import { useState } from 'react';
import { Link } from 'react-router-dom';
import FleetMap from '@/components/FleetMap';
import VehicleSidebar from '@/components/VehicleSidebar';
import StatusBar from '@/components/StatusBar';
import AlertsPanel from '@/components/AlertsPanel';
import DriverAnalytics from '@/components/DriverAnalytics';
import type { Vehicle } from '@/data/mockData';
import { Map, Users, Bell, Truck, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RightPanel = 'alerts' | 'drivers' | null;

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>('alerts');

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(prev => prev?.id === vehicle.id ? null : vehicle);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Sidebar - Vehicle Roster */}
      <div className="w-72 flex-shrink-0 glass-sidebar flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-semibold tracking-tight">FleetCommand</h1>
            </div>
            <Link
              to="/admin"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              title="Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
            <Link
              to="/super-admin"
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              title="Super Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono-data">FMS v2.4.0 — Live</p>
        </div>
        <VehicleSidebar
          selectedVehicleId={selectedVehicle?.id}
          onVehicleSelect={handleVehicleSelect}
        />
      </div>

      {/* Main Content - Map */}
      <div className="flex-1 relative flex flex-col">
        <div className="flex-1 relative">
          <FleetMap
            onVehicleSelect={handleVehicleSelect}
            selectedVehicleId={selectedVehicle?.id}
          />

          {/* Right panel toggle buttons */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1">
            <PanelToggle
              icon={Bell}
              active={rightPanel === 'alerts'}
              onClick={() => setRightPanel(p => p === 'alerts' ? null : 'alerts')}
              label="Alerts"
            />
            <PanelToggle
              icon={Users}
              active={rightPanel === 'drivers'}
              onClick={() => setRightPanel(p => p === 'drivers' ? null : 'drivers')}
              label="Drivers"
            />
          </div>

          {/* Right Panel Overlay */}
          <AnimatePresence>
            {rightPanel && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                className="absolute top-0 right-12 bottom-0 w-72 z-[999] glass-panel-strong"
              >
                {rightPanel === 'alerts' && <AlertsPanel />}
                {rightPanel === 'drivers' && <DriverAnalytics />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Status Bar */}
        <div className="p-3 z-[1000]">
          <StatusBar selectedVehicle={selectedVehicle} />
        </div>
      </div>
    </div>
  );
};

function PanelToggle({ icon: Icon, active, onClick, label }: { icon: typeof Map; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-all duration-200 ${
        active ? 'glass-panel glow-primary text-primary' : 'glass-frosted text-muted-foreground hover:text-foreground'
      }`}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default Index;
