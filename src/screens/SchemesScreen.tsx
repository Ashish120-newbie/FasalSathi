import { ArrowRight, BookOpen, Bookmark, ExternalLink, MapPin, Search, SlidersHorizontal, Sprout } from 'lucide-react';
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
      <div className="pt-8">
        <p className="text-[13px] font-medium text-forest-400">Support available for you</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-forest-900">Government schemes</h1>
        <p className="mt-2 text-[14px] leading-6 text-forest-400">Find benefits, insurance and support programmes for farmers.</p>
      </div>

      {recommended.length > 0 && (
        <>
          <div className="mt-8">
            <div className="flex items-center gap-2">
              <BookOpen size={17} className="text-forest-500" />
              <h2 className="text-[20px] font-semibold text-forest-900">Recommended for you</h2>
            </div>
            <p className="mt-0.5 text-xs text-forest-400">Based on your profile: {profile?.state ?? 'All India'}</p>
            <div className="mt-3 space-y-2">
              {recommended.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setSelectedScheme(scheme)}
                  className="flex w-full items-center justify-between rounded-lg border border-forest-100 bg-white px-4 py-3 text-left hover:border-forest-200 hover:bg-forest-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-forest-900">{scheme.name}</p>
                    <p className="mt-0.5 truncate text-xs text-forest-500">{categoryLabel(scheme.category)}</p>
                  </div>
                  <ArrowRight size={15} className="shrink-0 text-forest-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="my-8 border-t border-forest-100" />
        </>
      )}

      <div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-forest-400" size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" placeholder="Search schemes..." />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="mt-3 flex w-full items-center justify-between rounded-lg border border-forest-200 bg-forest-50 px-4 py-2.5 text-sm font-semibold text-forest-700 hover:bg-forest-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={15} /> Filters
            {activeFilters > 0 && <span className="rounded-md bg-forest-600 px-1.5 py-0.5 text-xs text-white">{activeFilters}</span>}
          </span>
          {activeFilters > 0 && <button onClick={(e) => { e.stopPropagation(); clearFilters(); }} className="text-xs font-medium text-forest-500 hover:text-forest-700">Clear all</button>}
        </button>
        {showFilters && (
          <div className="mt-3 space-y-3 animate-slide-up">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-forest-600">Crop</label>
              <select value={crop} onChange={(e) => setCrop(e.target.value as CropFilter)} className="select-field">
                <option value="all">All crops</option>
                {crops.map((c) => <option key={c.id} value={c.id}>{c.emoji} {cropName(c.id, lang)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-forest-600">State</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="select-field">
                <option value="all">All states</option>
                {states.filter((s) => s !== 'All India').map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-forest-600">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as CategoryFilter)} className="select-field">
                <option value="all">All categories</option>
                {schemeCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-forest-600">Farmer Category</label>
              <select value={farmerCat} onChange={(e) => setFarmerCat(e.target.value as FarmerCatFilter)} className="select-field">
                <option value="all">All farmer types</option>
                {farmerCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 mb-3 text-sm font-semibold text-forest-700">{filtered.length} schemes found</p>

      <div className="space-y-4">
        {filtered.map((scheme) => (
          <article key={scheme.id} className="border-b border-forest-100 pb-4">
            <div className="flex items-start justify-between gap-3">
              <button onClick={() => setSelectedScheme(scheme)} className="flex-1 text-left">
                <span className="text-xs font-medium text-forest-500">{categoryLabel(scheme.category)}</span>
                <h2 className="mt-1 text-[17px] font-semibold leading-6 text-forest-900">{scheme.name}</h2>
                <p className="mt-0.5 text-xs font-medium text-forest-500">{scheme.ministry}</p>
              </button>
              <button
                onClick={() => toggleBookmark(scheme.id)}
                disabled={bookmarkLoading === scheme.id}
                className="shrink-0 rounded-lg p-1.5 text-forest-400 hover:bg-forest-50 disabled:opacity-50 transition-colors"
                aria-label={bookmarks.has(scheme.id) ? 'Remove bookmark' : 'Save scheme'}
              >
                <Bookmark size={17} fill={bookmarks.has(scheme.id) ? 'currentColor' : 'none'} className={bookmarks.has(scheme.id) ? 'text-forest-600' : ''} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-forest-700">{scheme.description}</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-forest-50 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-forest-400">Who can apply</p>
                <p className="mt-1 text-xs leading-5 text-forest-800">{scheme.eligibility}</p>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">Main benefit</p>
                <p className="mt-1 text-xs leading-5 text-amber-950">{scheme.benefits}</p>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-forest-400">
              <span className="flex items-center gap-1"><MapPin size={11} /> {scheme.applicableStates.slice(0, 3).join(', ')}</span>
              {scheme.applicableStates.length > 3 && <span>+{scheme.applicableStates.length - 3} more</span>}
              <span>Verified: {new Date(scheme.lastVerifiedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setSelectedScheme(scheme)} className="flex-1 rounded-lg border border-forest-200 bg-white py-2 text-sm font-semibold text-forest-700 hover:bg-forest-50 transition-colors">View details</button>
              <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-500 transition-colors"><ExternalLink size={15} /> Visit</a>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Sprout className="mx-auto text-forest-300" size={32} />
            <p className="mt-3 font-semibold text-forest-800">No schemes match those filters</p>
            <p className="mt-1 text-sm text-forest-500">Try selecting all crops or states.</p>
            {activeFilters > 0 && <button onClick={clearFilters} className="mt-3 text-sm font-semibold text-forest-600 underline">Clear all filters</button>}
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
