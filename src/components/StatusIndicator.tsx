import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { AlertTriangle, Circle, Wrench } from 'lucide-react';
import { statusAnimationUrls } from '@/lib/uiPlaceholders';
import type { VehicleStatus } from '@/data/mockData';

const fallbackIconByStatus = {
  active: Circle,
  maintenance: Wrench,
  emergency: AlertTriangle,
  idle: Circle,
} as const;

const animationUrlByStatus: Partial<Record<VehicleStatus, string>> = {
  active: statusAnimationUrls.active,
  maintenance: statusAnimationUrls.maintenance,
};

export default function StatusIndicator({ status, className = 'h-5 w-5' }: { status: VehicleStatus; className?: string }) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const animationUrl = animationUrlByStatus[status];

    if (!animationUrl) {
      setAnimationData(null);
      return;
    }

    let active = true;

    fetch(animationUrl)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setAnimationData(data);
        }
      })
      .catch(() => {
        if (active) {
          setAnimationData(null);
        }
      });

    return () => {
      active = false;
    };
  }, [status]);

  if (animationData) {
    return <Lottie animationData={animationData} loop={true} className={className} />;
  }

  const FallbackIcon = fallbackIconByStatus[status];
  return <FallbackIcon className={className} />;
}
