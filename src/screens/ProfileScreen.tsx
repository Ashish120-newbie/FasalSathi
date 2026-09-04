import { User, LogOut, MapPin, Phone } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useHomeLang } from '@/data/i18n-home';
import Card14 from '@/components/ui/card-14';
export function ProfileScreen() {
  const ht = useHomeLang();
  const { profile, signOut } = useAuth();

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-8">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-forest-900">{ht.profileTitle}</h1>
      </div>

      <div className="mt-8 rounded-2xl border border-forest-100 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
            <User size={28} className="text-forest-600" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-forest-900">{profile?.display_name ?? 'Farmer'}</p>
            {profile?.mobile && (
              <p className="mt-0.5 flex items-center gap-1 text-[14px] text-forest-400">
                <Phone size={13} /> +91 {profile.mobile}
              </p>
            )}
          </div>
        </div>
        {(profile?.state || profile?.district) && (
          <div className="mt-4 flex items-center gap-2 text-[14px] text-forest-600">
            <MapPin size={16} className="text-forest-400" />
            {profile.district ? `${profile.district}, ` : ''}{profile.state ?? ''}
          </div>
        )}
      </div>

      <button
        onClick={signOut}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-error-200 bg-error-50 px-4 py-2.5 text-sm font-semibold text-error-700 hover:bg-error-100 transition-colors"
      >
        <LogOut size={16} /> {ht.profileLogout}
      </button>
      <div className="mt-8">
  <Card14 />
</div>
    </section>
  );
}
