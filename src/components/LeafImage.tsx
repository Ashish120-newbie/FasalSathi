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
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-moss-100 via-moss-200 to-forest-300 ${compact ? 'h-32' : 'h-64'}`}>
      {src ? (
        <img src={src} alt="Uploaded crop" className="h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 opacity-80">
          <div className="absolute left-[28%] top-[15%] h-[90%] w-[46%] -rotate-[17deg] rounded-[80%_20%_80%_20%] bg-gradient-to-br from-forest-500 via-moss-500 to-moss-700 shadow-xl" />
          <div className="absolute left-[48%] top-[18%] h-[80%] w-1 rotate-[-17deg] rounded-full bg-forest-800/50" />
          <div className="absolute left-[37%] top-[38%] h-10 w-12 rotate-[-16deg] rounded-full bg-amber-400/70 blur-[2px]" />
          <div className="absolute left-[55%] top-[55%] h-8 w-10 rotate-[-18deg] rounded-full bg-amber-500/60 blur-[2px]" />
        </div>
      )}
      {region && (
        <div
          className="absolute rounded-xl border-2 border-amber-300 bg-amber-200/20 shadow-[0_0_0_999px_rgba(13,28,19,0.18)]"
          style={{ left: `${region.x}%`, top: `${region.y}%`, width: `${region.width}%`, height: `${region.height}%` }}
        >
          <span className="absolute -top-7 left-0 flex items-center gap-1 whitespace-nowrap rounded-md bg-amber-400 px-2 py-1 text-xs font-bold text-amber-950">
            <ScanLine size={12} /> Affected area
          </span>
        </div>
      )}
      {affectedArea && !region && (
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 whitespace-nowrap rounded-md bg-amber-400 px-2.5 py-1.5 text-xs font-bold text-amber-950 shadow-md">
          <ScanLine size={12} /> {affectedArea}
        </span>
      )}
      {!src && <span className="absolute bottom-3 left-3 rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-800">Sample preview</span>}
    </div>
  );
}
