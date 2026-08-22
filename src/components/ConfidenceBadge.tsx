import { AlertCircle, CheckCircle2, CircleHelp } from 'lucide-react';
import type { ConfidenceLevel } from '@/data/types';

const config: Record<ConfidenceLevel, { label: string; classes: string; Icon: typeof CheckCircle2 }> = {
  high: { label: 'High confidence', classes: 'bg-success-100 text-success-800 border-success-200', Icon: CheckCircle2 },
  medium: { label: 'Medium confidence', classes: 'bg-warning-100 text-warning-800 border-warning-200', Icon: AlertCircle },
  low: { label: 'Needs expert review', classes: 'bg-error-100 text-error-800 border-error-200', Icon: CircleHelp },
};

export function ConfidenceBadge({ level, confidence }: { level: ConfidenceLevel; confidence: number }) {
  const { label, classes, Icon } = config[level];
  return (
    <span className={`chip border ${classes}`}>
      <Icon size={16} strokeWidth={2.5} />
      {label} · {confidence}%
    </span>
  );
}
