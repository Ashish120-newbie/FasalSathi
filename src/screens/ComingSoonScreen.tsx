import { Clock } from 'lucide-react';
import { useHomeLang } from '@/data/i18n-home';

interface ComingSoonScreenProps {
  title: string;
}

export function ComingSoonScreen({ title }: ComingSoonScreenProps) {
  const ht = useHomeLang();

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-8">
        <h1 className="heading-display text-[28px] font-bold leading-tight tracking-tight text-forest-900">{title}</h1>
      </div>
      <div className="mt-12 flex flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-100">
          <Clock size={36} className="text-forest-600" />
        </div>
        <p className="mt-6 text-[18px] font-semibold text-forest-900">{ht.comingSoon}</p>
        <p className="mt-2 max-w-xs text-[14px] leading-6 text-forest-400">{ht.comingSoonDesc}</p>
      </div>
    </section>
  );
}
