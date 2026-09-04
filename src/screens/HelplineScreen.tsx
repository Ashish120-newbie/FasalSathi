import { Clock, Phone, PhoneCall, Sprout, Users, Wheat } from 'lucide-react';
import { useLang } from '@/lib/lang';
import Card14 from '@/components/ui/card-14';
export function HelplineScreen() {
  const { t } = useLang();
  const kccNumber = '1800-180-1551';
  const topics = [
    { icon: Sprout, label: t.helpCropDiseases },
    { icon: Wheat, label: t.helpFertilizer },
    { icon: Clock, label: t.helpWeather },
    { icon: Users, label: t.helpAnimal },
  ];

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-8">
        <p className="text-[13px] font-medium text-forest-400">{t.helpFreeGovt}</p>
        <h1 className="heading-display mt-1 text-[28px] font-bold leading-tight tracking-tight text-forest-900">{t.helpTitle}</h1>
        <p className="mt-2 max-w-md text-[14px] leading-6 text-forest-400">{t.helpSubtitle}</p>
      </div>

      <div className="mt-8">
        <p className="section-label">{t.helpKCC}</p>
        <h2 className="mt-1 text-[20px] font-semibold text-forest-900">{t.helpFreeHelpline}</h2>
        <p className="mt-0.5 text-[13px] leading-5 text-forest-400">{t.helpMinistry}</p>
        <a
          href={`tel:${kccNumber.replace(/-/g, '')}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-base font-semibold text-amber-950 hover:bg-amber-500 transition-colors"
        >
          <Phone size={19} /> {t.helpCall} {kccNumber}
        </a>
        <p className="mt-2 text-center text-xs text-forest-400">{t.helpTollFree}</p>
      </div>

      <div className="my-8 border-t border-forest-100" />

      <div>
        <h2 className="text-[20px] font-semibold text-forest-900">{t.helpWhatAsk}</h2>
        <p className="mt-0.5 text-[13px] text-forest-400">{t.helpAdvisorsReady}</p>
        <div className="mt-4 space-y-3">
          {topics.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={17} className="shrink-0 text-forest-500" />
              <p className="text-sm leading-5 text-forest-800">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-8 border-t border-forest-100" />

      <div>
        <h2 className="text-[20px] font-semibold text-forest-900">{t.helpLocalLang}</h2>
        <p className="mt-0.5 text-[13px] text-forest-400">{t.helpLocalLangDesc}</p>
        <p className="mt-3 text-[14px] leading-6 text-forest-700">{t.helpLocalLangBody}</p>
      </div>

      <div className="mt-8 flex gap-2 rounded-lg border border-forest-100 bg-forest-50 px-3 py-2.5 text-xs leading-5 text-forest-600">
        <PhoneCall size={15} className="mt-0.5 shrink-0 text-forest-400" />
        <p>{t.helpEscalatedNote}</p>
      </div>
            <div className="mt-8">
        <Card14 />
      </div>
    </section>
  );
}
