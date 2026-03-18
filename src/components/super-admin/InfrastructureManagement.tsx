import { useState } from 'react';
import { Server, ShieldCheck, Zap, CloudRain, Eye, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Integration {
  id: string;
  name: string;
  enabled: boolean;
  status: 'Online' | 'Degraded' | 'Offline';
  description: string;
}

const initialIntegrations: Integration[] = [
  { id: 'api-1', name: 'GPS Tracking API', enabled: true, status: 'Online', description: 'Real-time tracking service for vehicles.' },
  { id: 'api-2', name: 'Payment Gateway', enabled: false, status: 'Offline', description: 'Process subscriptions and invoices automatically.' },
  { id: 'api-3', name: 'SMS Alerts', enabled: true, status: 'Degraded', description: 'Send notifications to drivers for route updates.' },
  { id: 'api-4', name: 'Analytics Stream', enabled: true, status: 'Online', description: 'Event streaming for dashboard metrics.' },
];

export default function InfrastructureManagement() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [search, setSearch] = useState('');

  const filtered = integrations.filter((integration) =>
    integration.name.toLowerCase().includes(search.toLowerCase()) ||
    integration.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
      )
    );
  };

  return (
    <div className="glass-panel rounded-lg p-5 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label-caps">Infrastructure</p>
          <h3 className="text-lg font-semibold tracking-tight">API Integrations & Security</h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 bg-secondary/80 px-3 py-2 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Security Protocols</div>
              <div className="text-sm font-semibold">2FA & IP Whitelisting</div>
            </div>
          </div>
          <Button variant="secondary" className="gap-2">
            <Zap className="w-4 h-4" />
            Deploy config
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-inner p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Active Integrations</span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {integrations.filter((i) => i.enabled).length} enabled
            </Badge>
          </div>
          <div className="space-y-3">
            {filtered.map((integration) => (
              <div key={integration.id} className="glass-panel glass-frosted rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{integration.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          integration.status === 'Online'
                            ? 'bg-status-active/20 text-status-active border-status-active/30'
                            : integration.status === 'Degraded'
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-status-emergency/20 text-status-emergency border-status-emergency/30'
                        }`}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{integration.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button size="sm" variant={integration.enabled ? 'secondary' : 'outline'} onClick={() => toggleIntegration(integration.id)}>
                      {integration.enabled ? 'Disable' : 'Enable'}
                    </Button>
                    <span className="text-[10px] text-muted-foreground">{integration.enabled ? 'Running' : 'Paused'}</span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground">No integrations found.</p>}
          </div>
        </div>

        <div className="glass-inner p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Security Protocols</span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {integrations.filter((i) => i.enabled).length} enabled
            </Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Require 2‑Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Adds an extra verification step for all admin logins.</p>
              </div>
              <Button size="sm" variant="outline">
                {Math.random() > 0.5 ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">IP Whitelisting</p>
                <p className="text-xs text-muted-foreground">Restrict access to approved networks.</p>
              </div>
              <Button size="sm" variant="outline">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Audit Logging</p>
                <p className="text-xs text-muted-foreground">Track changes and access events.</p>
              </div>
              <Button size="sm" variant="outline">
                View logs
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Search integrations</p>
            <Input
              placeholder="Find integration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-2 bg-secondary border-border text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
