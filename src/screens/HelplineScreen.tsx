import { Clock, Globe, Phone, PhoneCall, Sprout, Users, Wheat } from 'lucide-react';
import { useLang } from '@/lib/lang';

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
      <div className="mb-6 pt-4">
        <p className="text-sm font-semibold text-forest-500">{t.helpFreeGovt}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-forest-900">{t.helpTitle}</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-forest-600">{t.helpSubtitle}</p>
      </div>

      <div className="mb-5 overflow-hidden rounded-2xl border border-forest-200 bg-gradient-to-br from-forest-700 to-forest-800 p-6 text-white shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-moss-200">{t.helpKCC}</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold">{t.helpFreeHelpline}</h2>
            <p className="mt-1 text-sm leading-5 text-forest-100">{t.helpMinistry}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <PhoneCall size={30} className="text-amber-300" />
          </div>
        </div>
        <a
          href={`tel:${kccNumber.replace(/-/g, '')}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 font-bold text-amber-950 transition hover:bg-amber-300 active:scale-[0.99]"
        >
          <Phone size={20} /> {t.helpCall} {kccNumber}
        </a>
        <p className="mt-3 text-center text-xs text-forest-100">{t.helpTollFree}</p>
      </div>

      <div className="card mb-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-moss-100 p-2 text-forest-700">
            <Users size={18} />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-forest-900">{t.helpWhatAsk}</h2>
            <p className="text-xs text-forest-500">{t.helpAdvisorsReady}</p>
          </div>
        </div>
        <div className="space-y-3">
          {topics.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600">
                <Icon size={18} />
              </div>
              <p className="text-sm leading-5 text-forest-800">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-moss-100 p-2 text-forest-700">
            <Globe size={18} />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-forest-900">{t.helpLocalLang}</h2>
            <p className="text-xs text-forest-500">{t.helpLocalLangDesc}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-forest-700">{t.helpLocalLangBody}</p>
      </div>

      <div className="mb-8 rounded-2xl border border-forest-200 bg-forest-50 p-4">
        <div className="flex gap-2 text-forest-700">
          <PhoneCall size={17} className="mt-0.5 shrink-0" />
          <p className="text-xs leading-5">{t.helpEscalatedNote}</p>
        </div>
      </div>
    </section>
  );
}
