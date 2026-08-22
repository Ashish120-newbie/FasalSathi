import { Globe, Check } from 'lucide-react';
import { useState } from 'react';
import { languages, type Language } from '@/data/i18n';
import { useLang } from '@/lib/lang';

export function LanguageSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.id === lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full p-2.5 text-forest-600 hover:bg-forest-50"
        aria-label="Select language"
      >
        <Globe size={20} />
        <span className="text-xs font-bold">{current?.nativeLabel ?? 'EN'}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-forest-100 bg-white py-1 shadow-xl">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLang(l.id as Language); setOpen(false); }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-forest-50 ${lang === l.id ? 'font-bold text-forest-700' : 'text-forest-600'}`}
              >
                <span>{l.nativeLabel}</span>
                {lang === l.id && <Check size={16} className="text-forest-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
