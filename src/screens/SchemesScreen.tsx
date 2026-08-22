import { ArrowRight, BookOpen, Bookmark, ExternalLink, MapPin, Search, SlidersHorizontal, Sparkles, Sprout } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { cropName, crops } from '@/data/crops';
import { farmerCategories, schemeCategories, schemes, states, type FarmerCategory, type SchemeCategory, type SchemeDetail } from '@/data/schemes';
import type { CropId } from '@/data/types';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/lib/lang';
import { addBookmark, getRecommendedSchemes, listBookmarks, removeBookmark, type FarmerContext } from '@/lib/api';
import { SchemeDetailModal } from '@/components/SchemeDetailModal';

type CropFilter = 'all' | CropId;
type StateFilter = 'all' | string;
type CategoryFilter = 'all' | SchemeCategory;
type FarmerCatFilter = 'all' | FarmerCategory;

function categoryLabel(id: string): string {
  return schemeCategories.find((c) => c.id === id)?.label ?? id;
}

export function SchemesScreen() {
  const { profile, user } = useAuth();
  const { lang } = useLang();

  const [query, setQuery] = useState('');
  const [crop, setCrop] = useState<CropFilter>('all');
  const [state, setState] = useState<StateFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [farmerCat, setFarmerCat] = useState<FarmerCatFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState<string | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<SchemeDetail | null>(null);

  const activeSchemes = useMemo(() => schemes.filter((s) => s.isActive), []);

  useEffect(() => {
    if (!user) return;
    listBookmarks()
      .then((rows) => setBookmarks(new Set(rows.map((r) => r.scheme_id))))
      .catch(() => {});
  }, [user]);

  const filtered = useMemo(() => {
    return activeSchemes.filter((scheme) => {
      const matchesQuery = `${scheme.name} ${scheme.description} ${scheme.benefits}`.toLowerCase().includes(query.toLowerCase());
      const matchesCrop = crop === 'all' || scheme.eligibleCrops === 'all' || (scheme.eligibleCrops as CropId[]).includes(crop);
      const matchesState = state === 'all' || scheme.applicableStates.includes('All India') || scheme.applicableStates.includes(state);
      const matchesCategory = category === 'all' || scheme.category === category;
      const matchesFarmerCat = farmerCat === 'all' || scheme.eligibleFarmerCategories.includes('all') || scheme.eligibleFarmerCategories.includes(farmerCat);
      return matchesQuery && matchesCrop && matchesState && matchesCategory && matchesFarmerCat;
    });
  }, [activeSchemes, query, crop, state, category, farmerCat]);

  useEffect(() => {
    let count = 0;
    if (crop !== 'all') count++;
    if (state !== 'all') count++;
    if (category !== 'all') count++;
    if (farmerCat !== 'all') count++;
    setActiveFilters(count);
  }, [crop, state, category, farmerCat]);

  const recommended = useMemo(() => {
    if (!profile) return [];
    const ctx: FarmerContext = {
      state: profile.state,
      crop: null,
      farmSizeAcres: null,
      farmerCategory: null,
    };
    return getRecommendedSchemes(ctx).slice(0, 4);
  }, [profile]);

  const toggleBookmark = useCallback(async (schemeId: string) => {
    if (!user) return;
    setBookmarkLoading(schemeId);
    try {
      if (bookmarks.has(schemeId)) {
        await removeBookmark(schemeId);
        setBookmarks((prev) => { const next = new Set(prev); next.delete(schemeId); return next; });
      } else {
        await addBookmark(schemeId);
        setBookmarks((prev) => new Set(prev).add(schemeId));
      }
    } catch {
      // silently ignore — user sees no state change
    } finally {
      setBookmarkLoading(null);
    }
  }, [user, bookmarks]);

  function clearFilters() {
    setCrop('all');
    setState('all');
    setCategory('all');
    setFarmerCat('all');
  }

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="mb-6 pt-4">
        <p className="text-sm font-semibold text-forest-500">Support available for you</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-forest-900">Government schemes</h1>
        <p className="mt-2 text-sm leading-6 text-forest-600">Find benefits, insurance and support programmes for farmers.</p>
      </div>

      {recommended.length > 0 && (
        <div className="mb-6 rounded-2xl border border-forest-200 bg-gradient-to-br from-forest-700 to-forest-800 p-5 text-white shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-300" />
            <h2 className="font-display text-lg font-extrabold">Recommended for you</h2>
          </div>
          <p className="mt-1 text-xs text-forest-100">Based on your profile: {profile?.state ?? 'All India'}</p>
          <div className="mt-4 space-y-2">
            {recommended.map((scheme) => (
              <button key={scheme.id} onClick={() => setSelectedScheme(scheme)} className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-left hover:bg-white/15">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{scheme.name}</p>
                  <p className="mt-0.5 truncate text-xs text-forest-100">{categoryLabel(scheme.category)}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-amber-300" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-forest-400" size={19} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-11" placeholder="Search schemes..." />
        </div>
        <button onClick={() => setShowFilters((v) => !v)} className="mt-3 flex w-full items-center justify-between rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm font-bold text-forest-700">
          <span className="flex items-center gap-2"><SlidersHorizontal size={16} /> Filters {activeFilters > 0 && <span className="rounded-full bg-forest-600 px-2 py-0.5 text-xs text-white">{activeFilters}</span>}</span>
          {activeFilters > 0 && <button onClick={(e) => { e.stopPropagation(); clearFilters(); }} className="text-xs font-semibold text-forest-500 hover:text-forest-700">Clear all</button>}
        </button>
        {showFilters && (
          <div className="mt-3 space-y-3 animate-slide-up">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-forest-600">Crop</label>
              <select value={crop} onChange={(e) => setCrop(e.target.value as CropFilter)} className="select-field">
                <option value="all">All crops</option>
                {crops.map((c) => <option key={c.id} value={c.id}>{c.emoji} {cropName(c.id, lang)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-forest-600">State</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="select-field">
                <option value="all">All states</option>
                {states.filter((s) => s !== 'All India').map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-forest-600">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as CategoryFilter)} className="select-field">
                <option value="all">All categories</option>
                {schemeCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-forest-600">Farmer Category</label>
              <select value={farmerCat} onChange={(e) => setFarmerCat(e.target.value as FarmerCatFilter)} className="select-field">
                <option value="all">All farmer types</option>
                {farmerCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-forest-700">{filtered.length} schemes found</p>
        <span className="chip bg-moss-100 text-forest-700"><BookOpen size={15} /> Verified list</span>
      </div>

      <div className="space-y-3">
        {filtered.map((scheme) => (
          <article key={scheme.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <button onClick={() => setSelectedScheme(scheme)} className="flex flex-1 gap-3 text-left">
                <div className="rounded-xl bg-moss-100 p-2.5 text-forest-700"><Bookmark size={21} /></div>
                <div className="min-w-0">
                  <span className="chip bg-moss-50 px-2 py-0.5 text-[10px] text-forest-600">{categoryLabel(scheme.category)}</span>
                  <h2 className="mt-1.5 font-display text-lg font-extrabold leading-6 text-forest-900">{scheme.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-forest-500">{scheme.ministry}</p>
                </div>
              </button>
              <button
                onClick={() => toggleBookmark(scheme.id)}
                disabled={bookmarkLoading === scheme.id}
                className="shrink-0 rounded-lg p-2 text-forest-500 hover:bg-forest-50 disabled:opacity-50"
                aria-label={bookmarks.has(scheme.id) ? 'Remove bookmark' : 'Save scheme'}
              >
                <Bookmark size={18} fill={bookmarks.has(scheme.id) ? 'currentColor' : 'none'} className={bookmarks.has(scheme.id) ? 'text-forest-600' : ''} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-forest-700">{scheme.description}</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-forest-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400">Who can apply</p>
                <p className="mt-1 text-xs leading-5 text-forest-800">{scheme.eligibility}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Main benefit</p>
                <p className="mt-1 text-xs leading-5 text-amber-950">{scheme.benefits}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {scheme.applicableStates.slice(0, 3).map((s) => <span key={s} className="chip bg-white px-2 py-1 text-xs text-forest-600"><MapPin size={12} /> {s}</span>)}
              {scheme.applicableStates.length > 3 && <span className="chip bg-white px-2 py-1 text-xs text-forest-500">+{scheme.applicableStates.length - 3} more</span>}
              <span className="chip bg-white px-2 py-1 text-xs text-forest-500">Verified: {new Date(scheme.lastVerifiedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setSelectedScheme(scheme)} className="flex-1 rounded-xl border border-forest-200 bg-white py-2.5 text-sm font-bold text-forest-700 hover:bg-forest-50">View details</button>
              <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-amber-950 hover:bg-amber-500"><ExternalLink size={16} /> Visit</a>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="card py-10 text-center">
            <Sprout className="mx-auto text-forest-300" size={34} />
            <p className="mt-3 font-bold text-forest-800">No schemes match those filters</p>
            <p className="mt-1 text-sm text-forest-500">Try selecting all crops or states.</p>
            {activeFilters > 0 && <button onClick={clearFilters} className="mt-3 text-sm font-bold text-forest-600 underline">Clear all filters</button>}
          </div>
        )}
      </div>

      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          isBookmarked={bookmarks.has(selectedScheme.id)}
          onToggleBookmark={toggleBookmark}
          onClose={() => setSelectedScheme(null)}
        />
      )}
    </section>
  );
}
