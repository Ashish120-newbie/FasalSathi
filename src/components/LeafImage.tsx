import { ScanLine } from 'lucide-react';
import type { AffectedRegion } from '@/data/types';

interface LeafImageProps {
  src?: string;
  region?: AffectedRegion;
  affectedArea?: string;
  compact?: boolean;
}

export function LeafImage({ src, region, affectedArea, compact = false }: LeafImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-moss-100 ${compact ? 'h-32' : 'h-64'}`}>
      {src ? (
        <img src={src} alt="Uploaded crop" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ScanLine size={compact ? 28 : 48} className="text-forest-300" />
        </div>
      )}
      {region && (
        <div
          className="absolute rounded-md border-2 border-amber-400 bg-amber-200/20"
          style={{ left: `${region.x}%`, top: `${region.y}%`, width: `${region.width}%`, height: `${region.height}%` }}
        >
          <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-amber-400 px-1.5 py-0.5 text-xs font-bold text-amber-950">
            <ScanLine size={10} className="inline" /> Affected area
          </span>
        </div>
      )}
      {affectedArea && !region && (
        <span className="absolute bottom-2 left-2 whitespace-nowrap rounded bg-amber-400 px-2 py-1 text-xs font-bold text-amber-950">
          <ScanLine size={10} className="inline" /> {affectedArea}
        </span>
      )}
      {!src && <span className="absolute bottom-2 left-2 rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700">Sample preview</span>}
    </div>
  );
}
