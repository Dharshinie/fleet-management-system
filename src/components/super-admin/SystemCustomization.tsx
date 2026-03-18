import { useState } from 'react';
import { Palette, Type, Image, Monitor } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface StatusColors {
  active: string;
  maintenance: string;
  emergency: string;
  idle: string;
}

interface BrandingConfig {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  darkMode: boolean;
}

export default function SystemCustomization() {
  const [statusColors, setStatusColors] = useState<StatusColors>({
    active: '#22c55e',
    maintenance: '#f59e0b',
    emergency: '#ef4444',
    idle: '#6b7280',
  });

  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: 'FleetCommand',
    logoUrl: '',
    primaryColor: '#14b8a6',
    darkMode: true,
  });

  const handleSave = () => {
    toast({ title: 'Settings saved', description: 'Customization changes have been applied.' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Status Colors */}
       <div className="glass-panel glass-shine rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-4 h-4 text-primary" />
          <p className="label-caps">Vehicle Status Colors</p>
        </div>
        <p className="text-sm text-muted-foreground">Customize the colors used to represent vehicle statuses across the platform.</p>

        <div className="grid grid-cols-2 gap-4 pt-2">
          {(Object.keys(statusColors) as (keyof StatusColors)[]).map(key => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={statusColors[key]}
                onChange={e => setStatusColors(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent"
              />
              <div>
                <Label className="text-xs font-semibold capitalize">{key}</Label>
                <p className="font-mono-data text-[10px] text-muted-foreground">{statusColors[key]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="pt-3 border-t border-border">
          <p className="label-caps mb-2">Preview</p>
          <div className="flex gap-3">
            {(Object.entries(statusColors) as [keyof StatusColors, string][]).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }} />
                <span className="text-[10px] text-muted-foreground capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branding / White-Label */}
      <div className="glass-panel glass-shine rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Monitor className="w-4 h-4 text-primary" />
          <p className="label-caps">Branding & White Label</p>
        </div>
        <p className="text-sm text-muted-foreground">Customize the platform identity for your organization.</p>

        <div className="space-y-3 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Company Name</Label>
            <Input
              value={branding.companyName}
              onChange={e => setBranding(prev => ({ ...prev, companyName: e.target.value }))}
              className="mt-1 bg-secondary border-border"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Logo URL</Label>
            <Input
              value={branding.logoUrl}
              onChange={e => setBranding(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder="https://yourcompany.com/logo.svg"
              className="mt-1 bg-secondary border-border"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Primary Brand Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={e => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent"
                />
                <span className="font-mono-data text-xs text-muted-foreground">{branding.primaryColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <Label className="text-xs font-semibold">Dark Mode Default</Label>
              <p className="text-[10px] text-muted-foreground">Set the default theme for all users</p>
            </div>
            <Switch
              checked={branding.darkMode}
              onCheckedChange={v => setBranding(prev => ({ ...prev, darkMode: v }))}
            />
          </div>
        </div>

        {/* Brand Preview */}
        <div className="pt-3 border-t border-border">
          <p className="label-caps mb-2">Preview</p>
          <div className="flex items-center gap-3 p-3 rounded-md bg-secondary">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-6 h-6 rounded" />
            ) : (
              <div className="w-6 h-6 rounded" style={{ backgroundColor: branding.primaryColor }} />
            )}
            <span className="font-semibold text-sm">{branding.companyName || 'FleetCommand'}</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="lg:col-span-2 flex justify-end">
        <Button onClick={handleSave} className="gap-1.5 p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500">
          Save Customization
        </Button>
      </div>
    </div>
  );
}
