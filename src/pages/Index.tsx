import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FleetMap from '@/components/FleetMap';
import VehicleSidebar from '@/components/VehicleSidebar';
import StatusBar from '@/components/StatusBar';
import AlertsPanel from '@/components/AlertsPanel';
import DriverAnalytics from '@/components/DriverAnalytics';
import { useVehicles } from '@/hooks/useVehicles';
import { useFleetSimulation } from '@/hooks/useFleetSimulation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Map, Users, Bell, Truck, LayoutDashboard, PanelsTopLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RightPanel = 'alerts' | 'drivers' | null;

const Index = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>('alerts');
  const isMobile = useIsMobile();
  const { vehicles, loading } = useVehicles();
  const { simulatedVehicles, geofenceAlerts, testZones } = useFleetSimulation(vehicles, !loading);

  const selectedVehicle = useMemo(
    () => simulatedVehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [selectedVehicleId, simulatedVehicles]
  );

  const handleVehicleSelect = (vehicle: (typeof simulatedVehicles)[number]) => {
    setSelectedVehicleId((currentId) => (currentId === vehicle.id ? null : vehicle.id));
  };

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-background md:h-screen md:w-screen">
      <div className="flex min-h-[100dvh] flex-col md:h-full md:flex-row md:overflow-hidden">
        <div className="glass-header border-b border-border px-4 py-3 md:hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-green-500 p-2">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold tracking-tight">FleetCommand</h1>
                <p className="font-mono-data text-[10px] text-muted-foreground">FMS v2.4.0 - Simulated Live</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/admin"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
              <Link
                to="/super-admin"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                title="Super Admin Dashboard"
              >
                <PanelsTopLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden w-72 flex-shrink-0 glass-sidebar md:flex md:flex-col">
          <div className="border-b border-border p-4">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-green-500 p-2">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-lg font-semibold tracking-tight">FleetCommand</h1>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/admin"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
                <Link
                  to="/super-admin"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  title="Super Admin Dashboard"
                >
                  <PanelsTopLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <p className="font-mono-data text-[10px] text-muted-foreground">FMS v2.4.0 - Simulated Live</p>
          </div>
          <VehicleSidebar
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={handleVehicleSelect}
            vehicles={simulatedVehicles}
            loading={loading}
          />
        </div>

        <div className="flex flex-1 flex-col md:relative">
          <div className="relative min-h-[42dvh] flex-1 md:min-h-0">
            <FleetMap
              vehicles={simulatedVehicles}
              zones={testZones as any}
              onVehicleSelect={handleVehicleSelect}
              selectedVehicleId={selectedVehicleId}
            />

            <div className="absolute right-3 top-3 z-[1000] flex gap-1 md:right-4 md:top-4 md:flex-col">
              <PanelToggle
                icon={Bell}
                active={rightPanel === 'alerts'}
                onClick={() => setRightPanel((panel) => (panel === 'alerts' ? null : 'alerts'))}
                label="Alerts"
              />
              <PanelToggle
                icon={Users}
                active={rightPanel === 'drivers'}
                onClick={() => setRightPanel((panel) => (panel === 'drivers' ? null : 'drivers'))}
                label="Drivers"
              />
            </div>

            <AnimatePresence>
              {!isMobile && rightPanel && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
                  className="absolute bottom-0 right-12 top-0 z-[999] w-72 glass-panel-strong"
                >
                  {rightPanel === 'alerts' && (
                    <AlertsPanel alerts={geofenceAlerts} vehicles={simulatedVehicles} />
                  )}
                  {rightPanel === 'drivers' && <DriverAnalytics />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="z-[1000] p-3">
            <StatusBar
              selectedVehicle={selectedVehicle}
              vehicles={simulatedVehicles}
              alertsCount={geofenceAlerts.length}
            />
          </div>

          <div className="px-3 pb-3 md:hidden">
            <div className="glass-panel rounded-lg">
              <VehicleSidebar
                selectedVehicleId={selectedVehicleId}
                onVehicleSelect={handleVehicleSelect}
                vehicles={simulatedVehicles}
                loading={loading}
              />
            </div>
          </div>

          {isMobile && rightPanel && (
            <div className="px-3 pb-4 md:hidden">
              <div className="glass-panel rounded-lg">
                {rightPanel === 'alerts' && (
                  <AlertsPanel alerts={geofenceAlerts} vehicles={simulatedVehicles} />
                )}
                {rightPanel === 'drivers' && <DriverAnalytics />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function PanelToggle({ icon: Icon, active, onClick, label }: { icon: typeof Map; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md p-2 transition-all duration-200 ${
        active ? 'glass-panel glow-primary text-primary' : 'glass-frosted text-muted-foreground hover:text-foreground'
      }`}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default Index;
