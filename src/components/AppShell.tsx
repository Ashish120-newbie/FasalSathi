import { Bell, BookOpen, Calculator, ClipboardList, Home, Menu, PhoneCall, Sprout, X, Bot, Sparkles } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { ChatContext } from '@/data/types';
import { ChatAssistant } from '@/components/ChatAssistant';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLang } from '@/lib/lang';

export type View = 'home' | 'calculator' | 'schemes' | 'history' | 'helpline' | 'queue';

interface AppShellProps {
  activeView: View;
  onNavigate: (view: View) => void;
  children: ReactNode;
  pendingReviews: number;
  chatContext?: ChatContext;
  chatOpen: boolean;
  onOpenChat: (context?: ChatContext) => void;
  onCloseChat: () => void;
}

export function AppShell({ activeView, onNavigate, children, pendingReviews, chatContext, chatOpen, onOpenChat, onCloseChat }: AppShellProps) {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { view: View; label: string; Icon: typeof Home }[] = [
    { view: 'home', label: t.navScan, Icon: Home },
    { view: 'calculator', label: t.navFertilizer, Icon: Calculator },
    { view: 'schemes', label: t.navSchemes, Icon: BookOpen },
    { view: 'history', label: t.navHistory, Icon: ClipboardList },
    { view: 'helpline', label: t.navHelpline, Icon: PhoneCall },
  ];

  return (
    <div className="min-h-screen bg-forest-50">
      <header className="sticky top-0 z-30 border-b border-forest-100 bg-white/95 backdrop-blur safe-bottom">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <button className="flex items-center gap-2" onClick={() => onNavigate('home')} aria-label="Go to home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600 shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 3C7.5 6.5 4.5 10.5 4.5 14.5a7.5 7.5 0 0 0 15 0c0-4-3-8-7.5-11.5z" fill="#ffffff" fillOpacity="0.96" />
                <path d="M12 6.5v11.5" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M12 9.5c1.6 0 2.8 0.9 3.8 2.2" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                <path d="M12 9.5c-1.6 0-2.8 0.9-3.8 2.2" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="text-left leading-none"><div className="font-display text-lg font-extrabold text-forest-800">Fasal<span className="text-amber-500">Sathi</span></div><div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-400"><span className="block leading-tight">Fasal Ki Pehchan</span><span className="block leading-tight">Sahi Samadhan</span></div></div>
          </button>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <button className="relative rounded-full p-2.5 text-forest-600 hover:bg-forest-50" aria-label={t.commonNotifications}><Bell size={21} />{pendingReviews > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />}</button>
            <button className="rounded-full p-2.5 text-forest-600 hover:bg-forest-50 md:hidden" onClick={() => setMenuOpen(true)} aria-label={t.commonOpenMenu}><Menu size={22} /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl">{children}</main>

      {!chatOpen && (
        <button
          onClick={() => onOpenChat()}
          className="fab-bounce-in fixed bottom-[88px] right-4 z-30 flex items-center gap-2 rounded-full bg-forest-700 py-3.5 pl-3.5 pr-5 text-white shadow-lg shadow-forest-900/30 hover:bg-forest-800 active:scale-95 transition-all"
          aria-label={t.commonAskAI}
        >
          <span className="absolute inset-0 rounded-full bg-forest-500 fab-pulse-ring" />
          <span className="relative flex h-7 w-7 items-center justify-center">
            <Bot size={20} className="text-white" />
            <Sparkles size={11} className="absolute -right-1 -top-1 text-amber-300" fill="currentColor" />
          </span>
          <span className="relative font-display text-sm font-extrabold tracking-tight">{t.commonAskAI}</span>
        </button>
      )}

      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-forest-100 bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-[72px] max-w-3xl grid-cols-5 px-1">
          {navItems.map(({ view, label, Icon }) => <button key={view} onClick={() => onNavigate(view)} className={`relative flex flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold ${activeView === view ? 'text-forest-700' : 'text-forest-400'}`}><span className={`rounded-xl px-3 py-1 ${activeView === view ? 'bg-forest-100' : ''}`}><Icon size={21} strokeWidth={activeView === view ? 2.5 : 2} /></span><span>{label}</span></button>)}
        </div>
      </nav>

      {menuOpen && <div className="fixed inset-0 z-50 bg-forest-950/40 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)}><aside className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><span className="font-display text-xl font-extrabold text-forest-800">{t.commonMoreTools}</span><button className="rounded-full p-2 text-forest-600 hover:bg-forest-50" onClick={() => setMenuOpen(false)} aria-label={t.commonCloseMenu}><X size={22} /></button></div><div className="mt-8 space-y-2"><button onClick={() => { onNavigate('queue'); setMenuOpen(false); }} className="flex w-full items-center justify-between rounded-xl bg-amber-50 p-4 text-left font-semibold text-amber-900"><span className="flex items-center gap-3"><Sprout size={21} /> Officer review queue</span>{pendingReviews > 0 && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs">{pendingReviews}</span>}</button><div className="rounded-xl bg-forest-50 p-4 text-sm leading-6 text-forest-700"><p className="font-bold text-forest-800">{t.commonWorksOffline}</p><p className="mt-1">{t.commonWorksOfflineDesc}</p></div></div></aside></div>}

      <ChatAssistant open={chatOpen} onClose={onCloseChat} context={chatContext} />
    </div>
  );
}
