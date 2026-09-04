import { Bell, Home, Menu, Sprout, Store, BookOpen, ClipboardList, User, X, Bot, LogOut } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { ChatContext } from '@/data/types';
import { ChatAssistant } from '@/components/ChatAssistant';
import { LanguageSelector } from '@/components/LanguageSelector';
import { NotificationPanel } from '@/components/NotificationPanel';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { useHomeLang } from '@/data/i18n-home';

export type View = 'home' | 'calculator' | 'schemes' | 'history' | 'helpline' | 'queue' | 'marketplace' | 'pesticide-calc' | 'cost-calc' | 'crops' | 'cultivation-tips' | 'pests-diseases' | 'pests-disease-alert' | 'profile';

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
  const ht = useHomeLang();
  const { profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems: { view: View; label: string; Icon: typeof Home }[] = [
    { view: 'home', label: ht.navHome, Icon: Home },
    { view: 'marketplace', label: ht.navMandi, Icon: Store },
    { view: 'schemes', label: t.navSchemes, Icon: BookOpen },
    { view: 'history', label: t.navHistory, Icon: ClipboardList },
    { view: 'profile', label: ht.navProfile, Icon: User },
  ];

  return (
    <div className="min-h-screen relative">
     
      <div className="relative z-10">
      <header className="sticky top-0 z-30 border-b border-forest-100 bg-white safe-bottom">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <button className="flex items-center gap-2" onClick={() => onNavigate('home')} aria-label="Go to home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600">
              <Sprout size={18} className="text-white" />
            </div>
            <div className="text-left leading-none">
              <div className="text-[15px] font-bold tracking-tight text-forest-800">Fasal<span className="text-amber-600">Sathi</span></div>
              <div className="mt-0.5 text-[10px] font-medium text-forest-500">{t.appTagline}</div>
            </div>
          </button>
          <div className="flex items-center gap-0.5">
            <LanguageSelector />
            <button className="relative rounded-lg p-2 text-forest-600 hover:bg-forest-50" aria-label={t.commonNotifications} onClick={() => setNotifOpen(true)}>
              <Bell size={18} />
              {pendingReviews > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />}
            </button>
            <button className="rounded-lg p-2 text-forest-600 hover:bg-forest-50 md:hidden" onClick={() => setMenuOpen(true)} aria-label={t.commonOpenMenu}>
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl">{children}</main>

      {!chatOpen && (
        <button
          onClick={() => onOpenChat()}
          className="fixed bottom-[80px] right-4 z-30 flex items-center gap-1.5 rounded-lg bg-forest-700 px-3 py-1.5 text-white hover:bg-forest-800 transition-colors"
          aria-label={t.commonAskAI}
        >
          <Bot size={15} className="text-white" />
          <span className="text-xs font-semibold">{t.commonAskAI}</span>
        </button>
      )}

      <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-forest-100 bg-white">
        <div className="mx-auto grid h-14 max-w-2xl grid-cols-5 px-0.5">
          {navItems.map(({ view, label, Icon }) => (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${activeView === view ? 'text-forest-700' : 'text-forest-400'}`}
            >
              <Icon size={18} strokeWidth={activeView === view ? 2.25 : 1.75} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/40 md:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white p-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-forest-800">{t.commonMoreTools}</span>
              <button className="rounded-lg p-2 text-forest-600 hover:bg-forest-50" onClick={() => setMenuOpen(false)} aria-label={t.commonCloseMenu}>
                <X size={20} />
              </button>
            </div>
            <div className="mt-8 space-y-2">
              <button
                onClick={() => { onNavigate('queue'); setMenuOpen(false); }}
                className="flex w-full items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
              >
                <span className="flex items-center gap-3"><Sprout size={18} /> Officer review queue</span>
                {pendingReviews > 0 && <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs">{pendingReviews}</span>}
              </button>
              <div className="rounded-lg bg-forest-50 px-4 py-3 text-sm leading-6 text-forest-700">
                <p className="font-bold text-forest-800">{t.commonWorksOffline}</p>
                <p className="mt-1">{t.commonWorksOfflineDesc}</p>
              </div>
              {profile && (
                <div className="rounded-lg border border-forest-100 px-4 py-3">
                  <p className="text-sm font-semibold text-forest-800">{profile.display_name ?? 'Farmer'}</p>
                  {profile.mobile && <p className="mt-0.5 text-xs text-forest-400">+91 {profile.mobile}</p>}
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-error-200 bg-error-50 px-4 py-2 text-sm font-semibold text-error-700 hover:bg-error-100 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      <ChatAssistant open={chatOpen} onClose={onCloseChat} context={chatContext} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      </div>
    </div>
  );
}
