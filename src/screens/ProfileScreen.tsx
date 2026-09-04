import { User, LogOut, MapPin, Phone, Pencil, Check, X, Globe, Sprout } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useHomeLang } from '@/data/i18n-home';
import { useLang } from '@/lib/lang';
import { languages, type Language } from '@/data/i18n';
import { crops, cropName } from '@/data/crops';
import type { Profile } from '@/lib/db-types';
import Card14 from '@/components/ui/card-14';

interface EditState {
  display_name: string;
  mobile: string;
  village: string;
  district: string;
  state: string;
  land_size_acres: string;
  crops: string[];
  preferred_language: string;
}

function toEditState(p: Profile | null): EditState {
  return {
    display_name: p?.display_name ?? '',
    mobile: p?.mobile ?? '',
    village: p?.village ?? '',
    district: p?.district ?? '',
    state: p?.state ?? '',
    land_size_acres: p?.land_size_acres != null ? String(p.land_size_acres) : '',
    crops: p?.crops ?? [],
    preferred_language: p?.preferred_language ?? 'en',
  };
}

export function ProfileScreen() {
  const ht = useHomeLang();
  const { lang } = useLang();
  const { profile, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editState, setEditState] = useState<EditState>(() => toEditState(profile));
  const [errors, setErrors] = useState<{ phone?: string; land?: string }>({});
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastError, setToastError] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!editing) setEditState(toEditState(profile));
  }, [profile, editing]);

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  function handleEdit() {
    setEditState(toEditState(profile));
    setErrors({});
    setEditing(true);
  }

  function handleCancel() {
    setEditState(toEditState(profile));
    setErrors({});
    setEditing(false);
  }

  function validate(): boolean {
    const next: { phone?: string; land?: string } = {};
    if (editState.mobile && !/^\d{10}$/.test(editState.mobile)) {
      next.phone = ht.profilePhoneError;
    }
    if (editState.land_size_acres) {
      const n = Number(editState.land_size_acres);
      if (isNaN(n) || n <= 0) {
        next.land = ht.profileLandError;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    const { error } = await updateProfile({
      display_name: editState.display_name || null,
      mobile: editState.mobile || null,
      village: editState.village || null,
      district: editState.district || null,
      state: editState.state || null,
      land_size_acres: editState.land_size_acres ? Number(editState.land_size_acres) : null,
      crops: editState.crops,
      preferred_language: editState.preferred_language,
    });
    setSaving(false);
    if (error) {
      setToastError(true);
      setShowToast(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => { setShowToast(false); setToastError(false); }, 3500);
      return;
    }
    setEditing(false);
    setToastError(false);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2500);
  }

  function toggleCrop(cropId: string) {
    setEditState((prev) => ({
      ...prev,
      crops: prev.crops.includes(cropId)
        ? prev.crops.filter((c) => c !== cropId)
        : [...prev.crops, cropId],
    }));
  }

  const locationParts = [profile?.village, profile?.district, profile?.state].filter(Boolean);
  const hasLocation = locationParts.length > 0;

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-8">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-forest-900">{ht.profileTitle}</h1>
      </div>

      {/* Profile Card */}
      <div className="mt-8 rounded-2xl border border-forest-100 bg-white p-5">
        {/* Header: Avatar + Name + Edit button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
              <User size={28} className="text-forest-600" />
            </div>
            <div>
              {editing ? (
                <input
                  value={editState.display_name}
                  onChange={(e) => setEditState((p) => ({ ...p, display_name: e.target.value }))}
                  placeholder={ht.profileName}
                  className="w-48 rounded-lg border border-forest-200 bg-white px-3 py-1.5 text-[16px] font-semibold text-forest-900 focus:border-forest-500 focus:outline-none"
                />
              ) : (
                <p className="text-[18px] font-bold text-forest-900">{profile?.display_name ?? 'Farmer'}</p>
              )}
            </div>
          </div>
          {!editing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 rounded-lg bg-green-800 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-green-900 transition-colors"
            >
              <Pencil size={14} /> {ht.profileEdit}
            </button>
          )}
        </div>

        {/* Personal Details section */}
        <div className="mt-6">
          <p className="section-label">{ht.profilePersonalDetails}</p>

          {!editing ? (
            <div className="mt-3 space-y-3.5">
              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-forest-400" />
                <span className="text-[14px] text-forest-700">
                  {profile?.mobile ? `+91 ${profile.mobile}` : '—'}
                </span>
              </div>
              {/* Location */}
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-forest-400" />
                <span className="text-[14px] text-forest-700">
                  {hasLocation ? locationParts.join(', ') : '—'}
                </span>
              </div>
              {/* Land size */}
              <div className="flex items-center gap-2.5">
                <Sprout size={16} className="shrink-0 text-forest-400" />
                <span className="text-[14px] text-forest-700">
                  {profile?.land_size_acres != null ? `${profile.land_size_acres} ${ht.profileAcres}` : '—'}
                </span>
              </div>
              {/* Primary crops */}
              <div className="flex items-start gap-2.5">
                <Sprout size={16} className="mt-0.5 shrink-0 text-forest-400" />
                <div className="flex flex-wrap gap-1.5">
                  {profile?.crops && profile.crops.length > 0 ? (
                    profile.crops.map((c) => (
                      <span key={c} className="rounded-full bg-forest-100 px-2.5 py-0.5 text-[12px] font-medium text-forest-700">
                        {cropName(c as Parameters<typeof cropName>[0], lang)}
                      </span>
                    ))
                  ) : (
                    <span className="text-[14px] text-forest-700">{ht.profileNoCrops}</span>
                  )}
                </div>
              </div>
              {/* Preferred language */}
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="shrink-0 text-forest-400" />
                <span className="text-[14px] text-forest-700">
                  {languages.find((l) => l.id === (profile?.preferred_language as Language || 'en'))?.label ?? 'English'}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              {/* Phone */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-forest-500">{ht.profilePhone}</label>
                <input
                  value={editState.mobile}
                  onChange={(e) => setEditState((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  placeholder="9876543210"
                  inputMode="numeric"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-[14px] text-forest-900 focus:outline-none ${errors.phone ? 'border-error-300 focus:border-error-400' : 'border-forest-200 focus:border-forest-500'}`}
                />
                {errors.phone && <p className="mt-1 text-[12px] text-error-600">{errors.phone}</p>}
              </div>
              {/* Village */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-forest-500">{ht.profileVillage}</label>
                <input
                  value={editState.village}
                  onChange={(e) => setEditState((p) => ({ ...p, village: e.target.value }))}
                  className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-[14px] text-forest-900 focus:border-forest-500 focus:outline-none"
                />
              </div>
              {/* District */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-forest-500">{ht.profileDistrict}</label>
                <input
                  value={editState.district}
                  onChange={(e) => setEditState((p) => ({ ...p, district: e.target.value }))}
                  className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-[14px] text-forest-900 focus:border-forest-500 focus:outline-none"
                />
              </div>
              {/* State */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-forest-500">{ht.profileState}</label>
                <input
                  value={editState.state}
                  onChange={(e) => setEditState((p) => ({ ...p, state: e.target.value }))}
                  className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-[14px] text-forest-900 focus:border-forest-500 focus:outline-none"
                />
              </div>
              {/* Land size */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-forest-500">{ht.profileLandSize} ({ht.profileAcres})</label>
                <input
                  value={editState.land_size_acres}
                  onChange={(e) => setEditState((p) => ({ ...p, land_size_acres: e.target.value }))}
                  placeholder="0"
                  inputMode="decimal"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-[14px] text-forest-900 focus:outline-none ${errors.land ? 'border-error-300 focus:border-error-400' : 'border-forest-200 focus:border-forest-500'}`}
                />
                {errors.land && <p className="mt-1 text-[12px] text-error-600">{errors.land}</p>}
              </div>
              {/* Primary crops */}
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-forest-500">{ht.profilePrimaryCrops}</label>
                <div className="flex flex-wrap gap-1.5">
                  {crops.map((c) => {
                    const selected = editState.crops.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleCrop(c.id)}
                        className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${selected ? 'bg-green-800 text-white' : 'bg-forest-50 text-forest-600 hover:bg-forest-100'}`}
                      >
                        {c.emoji} {cropName(c.id, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Preferred language */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-forest-500">{ht.profilePreferredLang}</label>
                <select
                  value={editState.preferred_language}
                  onChange={(e) => setEditState((p) => ({ ...p, preferred_language: e.target.value }))}
                  className="w-full rounded-lg border border-forest-200 bg-white px-3 py-2 text-[14px] text-forest-900 focus:border-forest-500 focus:outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>{l.label} ({l.nativeLabel})</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Edit mode action buttons */}
        {editing && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-green-900 disabled:opacity-60 transition-colors"
            >
              {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Check size={16} />}
              {ht.profileSave}
            </button>
            <button
              onClick={handleCancel}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-forest-200 bg-white px-4 py-2.5 text-[14px] font-semibold text-forest-600 hover:bg-forest-50 transition-colors"
            >
              <X size={16} /> {ht.profileCancel}
            </button>
          </div>
        )}
      </div>

      {/* Logout - outlined secondary style below the card */}
      <button
        onClick={signOut}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-error-200 bg-white px-4 py-2.5 text-sm font-semibold text-error-700 hover:bg-error-50 transition-colors"
      >
        <LogOut size={16} /> {ht.profileLogout}
      </button>

      {/* Feedback card - unchanged */}
      <div className="mt-8">
        <Card14 />
      </div>

      {/* Success toast */}
      {showToast && (
        <div className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 animate-fade-in rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${toastError ? 'bg-error-600' : 'bg-green-800'}`}>
          {toastError ? ht.profileSaveError : ht.profileUpdated}
        </div>
      )}
    </section>
  );
}
