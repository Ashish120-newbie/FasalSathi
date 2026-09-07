import {
  ArrowLeft, BadgeCheck, ChevronRight, MapPin, Phone, Store,
  Sprout, Package, X, Check, Loader2, AlertCircle, ShoppingCart, Plus,
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LocationSelector, type LocationSelection } from '@/components/LocationSelector';
import { getAllStates, getDistricts, detectStateFromLocation } from 'india-state-district';
import { useMarketplaceLang, type MarketplaceTranslationKey } from '@/data/i18n-marketplace';

// ── Types ──────────────────────────────────────────────────────

interface Dealer {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  address: string;
  district: string;
  state: string;
  lat: number | null;
  lng: number | null;
  categories: string[];
  verified: boolean;
}

interface DealerProduct {
  id: string;
  dealer_id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  in_stock: boolean;
}

type LocationMode = 'none' | 'gps' | 'manual';
type Role = 'buyer' | 'seller';

interface SavedLocation {
  mode: LocationMode;
  stateCode?: string;
  stateName?: string;
  district?: string;
  lat?: number;
  lng?: number;
}

// ── Constants ───────────────────────────────────────────────────

const STORAGE_KEY = 'fasalsathi_marketplace_location';

const CATEGORY_IDS = ['seeds', 'fertilizer', 'pesticide', 'equipment'] as const;
type CategoryId = (typeof CATEGORY_IDS)[number];

function categoryLabel(id: string, t: MarketplaceTranslationKey): string {
  switch (id) {
    case 'seeds': return t.catSeeds;
    case 'fertilizer': return t.catFertilizer;
    case 'pesticide': return t.catPesticide;
    case 'equipment': return t.catEquipment;
    default: return id;
  }
}

const CATEGORY_ICONS: Record<string, typeof Sprout> = {
  seeds: Sprout,
  fertilizer: Package,
  pesticide: Package,
  equipment: Package,
};

// ── Distance helper ─────────────────────────────────────────────

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── State code lookup ──────────────────────────────────────────

function stateNameToCode(name: string): string | undefined {
  return getAllStates().find((s) => s.name === name)?.code;
}

// ── Location persistence ──────────────────────────────────────

function loadSavedLocation(): SavedLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedLocation) : null;
  } catch {
    return null;
  }
}

function saveLocation(loc: SavedLocation): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // ignore
  }
}

// ── Component ──────────────────────────────────────────────────

interface MarketplaceScreenProps {
  highlightProduct?: string;
}

export function MarketplaceScreen({ highlightProduct }: MarketplaceScreenProps) {
  const t = useMarketplaceLang();
  const [location, setLocation] = useState<SavedLocation | null>(() => loadSavedLocation());
  const [locationMode, setLocationMode] = useState<LocationMode>(location?.mode ?? 'none');
  const [requestingGps, setRequestingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [manualSelection, setManualSelection] = useState<LocationSelection | null>(null);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [role, setRole] = useState<Role>('buyer');
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loadingDealers, setLoadingDealers] = useState(false);
  const [dealerError, setDealerError] = useState('');
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [products, setProducts] = useState<DealerProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(false);

  // ── GPS location with reverse geocoding ────────────────────────

  const requestGps = useCallback(async () => {
    setRequestingGps(true);
    setGpsError('');
    setAutoDetecting(true);
    try {
      const result = await detectStateFromLocation({ enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
      const loc: SavedLocation = {
        mode: 'gps',
        stateCode: result.stateCode,
        stateName: result.state,
        district: result.district,
        lat: result.latitude,
        lng: result.longitude,
      };
      setLocation(loc);
      setLocationMode('gps');
      saveLocation(loc);
      setManualSelection({
        country: 'India',
        stateCode: result.stateCode,
        stateName: result.state,
        district: result.district ?? '',
      });
    } catch (err: unknown) {
      const geoErr = err as { code?: string; message?: string };
      if (geoErr?.code === 'PERMISSION_DENIED') {
        setGpsError(t.mpGpsDenied);
      } else if (geoErr?.code === 'NOT_SUPPORTED') {
        setGpsError(t.mpGpsNotSupported);
      } else {
        setGpsError(t.mpGpsFailed);
      }
    } finally {
      setRequestingGps(false);
      setAutoDetecting(false);
    }
  }, [t.mpGpsDenied, t.mpGpsNotSupported, t.mpGpsFailed]);

  // ── Manual location ──────────────────────────────────────────

  function submitManual() {
    if (!manualSelection || !manualSelection.stateCode || !manualSelection.district) return;
    const loc: SavedLocation = {
      mode: 'manual',
      stateCode: manualSelection.stateCode,
      stateName: manualSelection.stateName,
      district: manualSelection.district,
    };
    setLocation(loc);
    setLocationMode('manual');
    saveLocation(loc);
  }

  function changeLocation() {
    setLocation(null);
    setLocationMode('none');
    setManualSelection(null);
    setGpsError('');
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  // ── Fetch dealers ─────────────────────────────────────────────

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    async function fetchDealers() {
      setLoadingDealers(true);
      setDealerError('');
      try {
        const { data, error } = await supabase
          .from('dealers')
          .select('id, business_name, owner_name, phone, address, district, state, lat, lng, categories, verified')
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (!cancelled) setDealers((data as Dealer[]) ?? []);
      } catch {
        if (!cancelled) setDealerError(t.mpDealerError);
      } finally {
        if (!cancelled) setLoadingDealers(false);
      }
    }
    fetchDealers();
    return () => { cancelled = true; };
  }, [location, t.mpDealerError]);

  // ── Fetch products for selected dealer ───────────────────────

  useEffect(() => {
    if (!selectedDealer) return;
    let cancelled = false;
    async function fetchProducts() {
      setLoadingProducts(true);
      try {
        const { data, error } = await supabase
          .from('dealer_products')
          .select('id, dealer_id, name, category, price, unit, in_stock')
          .eq('dealer_id', selectedDealer!.id)
          .order('category', { ascending: true });
        if (error) throw error;
        if (!cancelled) setProducts((data as DealerProduct[]) ?? []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, [selectedDealer]);

  // ── Filter & sort dealers ────────────────────────────────────

  const sortedDealers = (() => {
    if (!location) return [];
    let filtered = dealers;

    // Filter by district first, then fall back to state
    if (location.district) {
      const districtMatches = dealers.filter((d) => d.district === location.district);
      if (districtMatches.length > 0) {
        filtered = districtMatches;
      } else {
        // No dealers in this district — show all in the same state
        filtered = dealers.filter((d) => d.state === location.stateName);
      }
    } else if (location.stateName) {
      filtered = dealers.filter((d) => d.state === location.stateName);
    }

    // If GPS mode with coordinates, sort by distance
    if (location.mode === 'gps' && location.lat != null && location.lng != null) {
      filtered = filtered
        .map((d) => ({
          dealer: d,
          dist: d.lat != null && d.lng != null
            ? haversineKm(location.lat!, location.lng!, d.lat, d.lng)
            : 9999,
        }))
        .sort((a, b) => a.dist - b.dist)
        .map((entry) => entry.dealer);
    }

    return filtered;
  })();

  // ── Render: Location permission gate ──────────────────────────

  if (locationMode === 'none') {
    return (
      <section className="screen-container animate-fade-in px-4">
        <div className="pt-6">
          <p className="text-sm font-medium text-forest-500">{t.mpConnectDealers}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-forest-900">{t.mpTitle}</h1>
          <p className="mt-1.5 text-sm leading-6 text-forest-500">
            {t.mpSubtitle}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-forest-900">{t.mpAllowLocation}</h2>
          <p className="mt-0.5 text-sm leading-5 text-forest-500">
            {t.mpLocationExplain}
          </p>
          <button
            onClick={requestGps}
            disabled={requestingGps}
            className="btn-primary mt-4 flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            {requestingGps ? (
              <><Loader2 size={19} className="animate-spin" /> {t.mpDetecting}</>
            ) : (
              <><MapPin size={19} /> {t.mpAutoDetect}</>
            )}
          </button>
          {gpsError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <p>{gpsError}</p>
            </div>
          )}
        </div>

        <div className="my-8 border-t border-forest-100" />

        <div>
          <h2 className="text-base font-bold text-forest-900">{t.mpOrSelect}</h2>
          <p className="mt-0.5 text-sm text-forest-500">{t.mpManualSubtitle}</p>
          <div className="mt-4">
            <LocationSelector
              value={manualSelection}
              onChange={setManualSelection}
              autoDetecting={autoDetecting}
            />
          </div>
          <button
            onClick={submitManual}
            disabled={!manualSelection?.stateCode || !manualSelection?.district}
            className="btn-secondary mt-4 flex w-full items-center justify-center gap-2 disabled:opacity-50"
          >
            <ChevronRight size={17} /> {t.mpContinue}
          </button>
        </div>
      </section>
    );
  }

  // ── Render: Main marketplace (location set) ────────────────────

  const locationLabel = location?.district
    ? `${location.district}, ${location.stateName ?? ''}`
    : location?.stateName ?? t.mpNearbyDealers;

  return (
    <section className="screen-container animate-fade-in px-4">
      <div className="pt-6">
        <p className="text-sm font-medium text-forest-500">{t.mpTitle}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-forest-900">{t.mpNearbyDealers}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm text-forest-500">
          <MapPin size={14} className="text-forest-400" />
          <span>{t.mpShowingNear} <span className="font-semibold text-forest-800">{locationLabel}</span></span>
          <button onClick={changeLocation} className="ml-1 text-sm font-semibold text-forest-600 underline hover:text-forest-700">
            {t.mpChange}
          </button>
        </div>
        {highlightProduct && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <ShoppingCart size={14} />
            <span>{t.mpLookingFor} <span className="font-bold">{highlightProduct}</span></span>
          </div>
        )}
      </div>

      {/* Role toggle */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <button
          onClick={() => { setRole('buyer'); setShowSellerForm(false); setSelectedDealer(null); }}
          className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
            role === 'buyer' ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-forest-200 bg-white text-forest-500 hover:bg-forest-50'
          }`}
        >
          <ShoppingCart size={17} /> {t.mpBuyer}
        </button>
        <button
          onClick={() => { setRole('seller'); setShowSellerForm(false); setSelectedDealer(null); }}
          className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
            role === 'seller' ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-forest-200 bg-white text-forest-500 hover:bg-forest-50'
          }`}
        >
          <Store size={17} /> {t.mpSeller}
        </button>
      </div>

      {/* Buyer flow */}
      {role === 'buyer' && !selectedDealer && (
        <>
          {loadingDealers ? (
            <div className="flex items-center justify-center py-12 text-forest-400">
              <Loader2 size={26} className="animate-spin" />
            </div>
          ) : dealerError ? (
            <div className="mt-6 flex flex-col items-center gap-2 py-10 text-center">
              <AlertCircle size={26} className="text-error-400" />
              <p className="text-sm font-semibold text-error-600">{dealerError}</p>
            </div>
          ) : sortedDealers.length === 0 ? (
            <div className="mt-6 py-10 text-center">
              <Store className="mx-auto text-forest-300" size={32} />
              <p className="mt-3 font-semibold text-forest-800">{t.mpNoDealers}</p>
              <p className="mt-1 text-sm text-forest-500">{t.mpNoDealersHint}</p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-forest-100">
              {sortedDealers.map((dealer) => {
                const distance = location?.mode === 'gps' && location.lat != null && location.lng != null && dealer.lat != null && dealer.lng != null
                  ? haversineKm(location.lat!, location.lng!, dealer.lat, dealer.lng)
                  : null;
                return (
                  <button
                    key={dealer.id}
                    onClick={() => setSelectedDealer(dealer)}
                    className="flex w-full items-start gap-3 py-4 text-left hover:bg-forest-50/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h2 className="truncate text-base font-bold text-forest-900">{dealer.business_name}</h2>
                        {dealer.verified && (
                          <BadgeCheck size={15} className="shrink-0 text-success-600" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-forest-500">{dealer.address}, {dealer.district}</p>
                      <p className="mt-1 text-xs text-forest-400">
                        {distance != null && <span className="font-medium text-forest-600">{distance < 1 ? t.mpLessThan1Km : `${distance.toFixed(1)} km`} {t.mpAway}</span>}
                        {distance != null && dealer.categories.length > 0 && ' · '}
                        {dealer.categories.map((cat) => categoryLabel(cat, t)).join(' · ')}
                      </p>
                    </div>
                    <ChevronRight size={17} className="mt-1 shrink-0 text-forest-300" />
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Buyer: dealer detail with products */}
      {role === 'buyer' && selectedDealer && (
        <DealerDetail
          dealer={selectedDealer}
          products={products}
          loading={loadingProducts}
          highlightProduct={highlightProduct}
          onBack={() => setSelectedDealer(null)}
        />
      )}

      {/* Seller flow */}
      {role === 'seller' && !showSellerForm && (
        <div className="mt-6 py-8 text-center">
          <Store className="mx-auto text-forest-300" size={36} />
          <p className="mt-4 font-semibold text-forest-800">{t.mpListBusiness}</p>
          <p className="mt-1 text-sm leading-5 text-forest-500">
            {t.mpListBusinessDesc}
          </p>
          <button
            onClick={() => setShowSellerForm(true)}
            className="btn-primary mt-5 flex w-full items-center justify-center gap-2"
          >
            <Plus size={17} /> {t.mpAddDealership}
          </button>
        </div>
      )}

      {role === 'seller' && showSellerForm && (
        <SellerForm onBack={() => setShowSellerForm(false)} />
      )}
    </section>
  );
}

// ── Dealer Detail sub-component ─────────────────────────────────

function DealerDetail({
  dealer, products, loading, highlightProduct, onBack,
}: {
  dealer: Dealer;
  products: DealerProduct[];
  loading: boolean;
  highlightProduct?: string;
  onBack: () => void;
}) {
  const t = useMarketplaceLang();

  const grouped = products.reduce<Record<string, DealerProduct[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 mt-1 flex items-center gap-2 text-sm font-bold text-forest-600 hover:text-forest-700 transition-colors"
      >
        <ArrowLeft size={18} /> {t.mpBackToDealers}
      </button>

      <div className="mt-6">
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-bold text-forest-900">{dealer.business_name}</h2>
          {dealer.verified && <BadgeCheck size={17} className="shrink-0 text-success-600" />}
        </div>
        <p className="mt-0.5 text-sm text-forest-500">{t.mpOwner} {dealer.owner_name}</p>
        <p className="mt-1 text-sm text-forest-600">{dealer.address}, {dealer.district}, {dealer.state}</p>
        <p className="mt-2 text-xs font-medium text-forest-400">
          {dealer.categories.map((cat) => categoryLabel(cat, t)).join(' · ')}
        </p>
        <a
          href={`tel:${dealer.phone}`}
          className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
        >
          <Phone size={17} /> {t.mpCall} {dealer.phone}
        </a>
      </div>

      <div className="my-8 border-t border-forest-100" />

      <h3 className="text-base font-bold text-forest-900">{t.mpProductsAvailable}</h3>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-forest-400">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="mt-4 py-8 text-center">
          <Package className="mx-auto text-forest-300" size={28} />
          <p className="mt-2 text-sm text-forest-500">{t.mpNoProducts}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {Object.entries(grouped).map(([cat, items]) => {
            const Icon = CATEGORY_ICONS[cat] ?? Package;
            return (
              <div key={cat}>
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={15} className="text-forest-500" />
                  <h4 className="text-sm font-semibold text-forest-700">{categoryLabel(cat, t)}</h4>
                </div>
                <div className="space-y-2">
                  {items.map((p) => {
                    const isHighlighted = highlightProduct &&
                      p.name.toLowerCase().includes(highlightProduct.toLowerCase());
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${isHighlighted ? 'border-amber-300 bg-amber-50' : 'border-forest-100 bg-white'}`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-forest-900">{p.name}</p>
                          <p className="mt-0.5 text-xs text-forest-500">
                            ₹{Number(p.price).toLocaleString('en-IN')} {p.unit}
                          </p>
                          {!p.in_stock && <span className="mt-1 inline-block text-xs font-semibold text-error-600">{t.mpOutOfStock}</span>}
                          {isHighlighted && <span className="ml-2 text-xs font-semibold text-amber-700">{t.mpRecommended}</span>}
                        </div>
                        <a
                          href={`tel:${dealer.phone}`}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-forest-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-forest-700 transition-colors"
                        >
                          <Phone size={14} /> {t.mpContact}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Seller Form sub-component ───────────────────────────────────

function SellerForm({ onBack }: { onBack: () => void }) {
  const t = useMarketplaceLang();
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [locationSelection, setLocationSelection] = useState<LocationSelection | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);
  const [productRows, setProductRows] = useState<{ name: string; price: string; unit: string; category: string }[]>(
    Array.from({ length: 3 }, () => ({ name: '', price: '', unit: '', category: 'seeds' }))
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function toggleCat(cat: string) {
    setCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }

  function updateRow(i: number, field: 'name' | 'price' | 'unit' | 'category', value: string) {
    setProductRows((prev) => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  }

  function addRow() {
    if (productRows.length >= 5) return;
    setProductRows((prev) => [...prev, { name: '', price: '', unit: '', category: 'seeds' }]);
  }

  async function handleSubmit() {
    setError('');
    if (!businessName || !ownerName || !phone || !address || !locationSelection?.stateCode || !locationSelection?.district || cats.length === 0) {
      setError(t.mpFormError);
      return;
    }
    setSaving(true);
    try {
      const { data: dealerData, error: dealerErr } = await supabase
        .from('dealers')
        .insert({
          business_name: businessName,
          owner_name: ownerName,
          phone,
          address,
          district: locationSelection.district,
          state: locationSelection.stateName,
          categories: cats,
          verified,
        })
        .select('id')
        .single();

      if (dealerErr) throw new Error(t.mpDealerSaveError);

      const validProducts = productRows.filter((r) => r.name && r.price);
      if (validProducts.length > 0) {
        const { error: prodErr } = await supabase.from('dealer_products').insert(
          validProducts.map((r) => ({
            dealer_id: (dealerData as { id: string }).id,
            name: r.name,
            category: r.category,
            price: Number(r.price),
            unit: r.unit || 'per unit',
            in_stock: true,
          }))
        );
        if (prodErr) throw new Error(t.mpProductSaveError);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.mpSubmitError);
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <div className="mt-6 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-success-100 text-success-700">
          <Check size={26} />
        </div>
        <p className="mt-4 text-lg font-bold text-forest-900">{t.mpDealershipListed}</p>
        <p className="mt-1 text-sm text-forest-500">{t.mpDealershipListedDesc}</p>
        <button onClick={onBack} className="btn-primary mt-5">{t.mpBackToMarketplace}</button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 mt-1 flex items-center gap-2 text-sm font-bold text-forest-600 hover:text-forest-700 transition-colors"
      >
        <ArrowLeft size={18} /> {t.mpBack}
      </button>

      <div className="mt-6">
        <h2 className="text-lg font-bold text-forest-900">{t.mpBusinessDetails}</h2>
        <label className="mt-4 mb-1.5 block text-sm font-semibold text-forest-800">{t.mpBusinessName}</label>
        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="input-field mb-4" placeholder={t.mpBusinessNamePlaceholder} />
        <label className="mb-1.5 block text-sm font-semibold text-forest-800">{t.mpOwnerName}</label>
        <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="input-field mb-4" placeholder={t.mpOwnerNamePlaceholder} />
        <label className="mb-1.5 block text-sm font-semibold text-forest-800">{t.mpPhoneLabel}</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field mb-4" placeholder={t.mpPhonePlaceholder} inputMode="tel" />
        <label className="mb-1.5 block text-sm font-semibold text-forest-800">{t.mpAddressLabel}</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="input-field mb-4" placeholder={t.mpAddressPlaceholder} />
      </div>

      <div className="my-8 border-t border-forest-100" />

      <div>
        <h2 className="text-base font-bold text-forest-900">{t.mpSelectLocation}</h2>
        <p className="mt-0.5 text-sm text-forest-500">{t.mpSelectLocationHint}</p>
        <div className="mt-4">
          <LocationSelector
            value={locationSelection}
            onChange={setLocationSelection}
          />
        </div>
      </div>

      <div className="my-8 border-t border-forest-100" />

      <div>
        <h2 className="text-base font-bold text-forest-900">{t.mpCategories}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              onClick={() => toggleCat(id)}
              className={`flex items-center gap-2 rounded-lg border py-2.5 px-3 text-sm font-medium transition-colors ${
                cats.includes(id) ? 'border-forest-500 bg-forest-50 text-forest-800' : 'border-forest-200 bg-white text-forest-500 hover:bg-forest-50'
              }`}
            >
              {cats.includes(id) && <Check size={14} />}
              {categoryLabel(id, t)}
            </button>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-forest-700">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="h-4 w-4 rounded border-forest-300" />
          {t.mpVerifiedLabel}
        </label>
      </div>

      <div className="my-8 border-t border-forest-100" />

      <div>
        <h2 className="text-base font-bold text-forest-900">{t.mpProductListings} ({productRows.length}/5)</h2>
        <div className="mt-3 space-y-3">
          {productRows.map((row, i) => (
            <div key={i} className="rounded-lg border border-forest-100 p-3">
              <input
                value={row.name}
                onChange={(e) => updateRow(i, 'name', e.target.value)}
                className="input-field mb-2"
                placeholder={t.mpProductName}
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  value={row.price}
                  onChange={(e) => updateRow(i, 'price', e.target.value)}
                  className="input-field"
                  placeholder={t.mpPrice}
                  inputMode="numeric"
                />
                <input
                  value={row.unit}
                  onChange={(e) => updateRow(i, 'unit', e.target.value)}
                  className="input-field"
                  placeholder={t.mpUnit}
                />
                <select
                  value={row.category}
                  onChange={(e) => updateRow(i, 'category', e.target.value)}
                  className="select-field"
                >
                  {CATEGORY_IDS.map((id) => (
                    <option key={id} value={id}>{categoryLabel(id, t)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        {productRows.length < 5 && (
          <button onClick={addRow} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-forest-200 py-2.5 text-sm font-semibold text-forest-600 hover:bg-forest-50 transition-colors">
            <Plus size={15} /> {t.mpAddProduct}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 p-3 text-sm text-error-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="btn-primary mt-6 flex w-full items-center justify-center gap-2 disabled:opacity-70"
      >
        {saving ? <><Loader2 size={19} className="animate-spin" /> {t.mpSaving}</> : <><Check size={17} /> {t.mpSubmit}</>}
      </button>
    </div>
  );
}
