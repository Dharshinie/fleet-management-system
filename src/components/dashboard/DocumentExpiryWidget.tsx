import { useMemo } from 'react';
import { useVehicles } from '@/hooks/useVehicles';
import { Calendar, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';

const today = new Date('2026-03-16');

function buildDocumentExpiryData(vehicles: typeof import('@/data/mockData').vehicles) {
  return vehicles
    .map((v) => {
      const base = new Date(v.lastService);
      const insuranceExpiry = addDays(base, 120 + (parseInt(v.id.replace(/\D/g, ''), 10) % 30));
      const registrationExpiry = addDays(base, 90 + (parseInt(v.id.replace(/\D/g, ''), 10) % 45));

      const insuranceDaysLeft = differenceInDays(insuranceExpiry, today);
      const registrationDaysLeft = differenceInDays(registrationExpiry, today);

      const urgency: 'critical' | 'warning' | 'ok' =
        insuranceDaysLeft <= 7 || registrationDaysLeft <= 7
          ? 'critical'
          : insuranceDaysLeft <= 30 || registrationDaysLeft <= 30
          ? 'warning'
          : 'ok';

      return {
        ...v,
        insuranceExpiry,
        registrationExpiry,
        insuranceDaysLeft,
        registrationDaysLeft,
        urgency,
      };
    })
    .sort((a, b) => {
      const order = { critical: 0, warning: 1, ok: 2 };
      return order[a.urgency] - order[b.urgency];
    });
}

const urgencyConfig = {
  critical: { icon: AlertTriangle, dotClass: 'status-emergency', label: 'Expiring Soon' },
  warning: { icon: Calendar, dotClass: 'status-maintenance', label: 'Due Soon' },
  ok: { icon: CheckCircle, dotClass: 'status-active', label: 'OK' },
};

export default function DocumentExpiryWidget() {
  const { vehicles, loading } = useVehicles();
  const documentExpiryData = useMemo(() => buildDocumentExpiryData(vehicles), [vehicles]);

  const criticalCount = documentExpiryData.filter((v) => v.urgency === 'critical').length;
  const warningCount = documentExpiryData.filter((v) => v.urgency === 'warning').length;

  return (
    <div className="glass-panel glass-shine rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="label-caps mb-1">Document Expiries</p>
          <h3 className="text-lg font-semibold tracking-tight">
            {loading ? 'Loading…' : `${criticalCount + warningCount} Vehicle${criticalCount + warningCount !== 1 ? 's' : ''} Need Attention`}
          </h3>
        </div>
        <FileText className="w-5 h-5 text-status-maintenance" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left label-caps py-2 pr-4">Vehicle</th>
              <th className="text-left label-caps py-2 pr-4">Status</th>
              <th className="text-left label-caps py-2 pr-4">Insurance</th>
              <th className="text-left label-caps py-2 pr-4">Registration</th>
            </tr>
          </thead>
          <tbody>
            {documentExpiryData.map((v) => {
              const config = urgencyConfig[v.urgency];
              return (
                <tr key={v.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{v.id}</span>
                      <span className="font-mono-data text-muted-foreground">{v.plate}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{v.make} {v.model}</p>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`status-dot ${config.dotClass}`} />
                      <span>{config.label}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="font-mono-data">{format(v.insuranceExpiry, 'MMM dd, yyyy')}</span>
                    <p className={`text-[10px] font-mono-data ${v.insuranceDaysLeft <= 7 ? 'text-status-emergency' : 'text-muted-foreground'}`}>
                      {v.insuranceDaysLeft}d left
                    </p>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="font-mono-data">{format(v.registrationExpiry, 'MMM dd, yyyy')}</span>
                    <p className={`text-[10px] font-mono-data ${v.registrationDaysLeft <= 7 ? 'text-status-emergency' : 'text-muted-foreground'}`}>
                      {v.registrationDaysLeft}d left
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
