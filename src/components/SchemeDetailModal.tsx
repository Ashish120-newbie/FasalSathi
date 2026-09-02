import { Bookmark, CheckCircle2, ExternalLink, FileText, ListChecks, MapPin, Sprout, UserCircle, X } from 'lucide-react';
import { cropById, cropName } from '@/data/crops';
import { farmerCategories, schemeCategories, type SchemeDetail } from '@/data/schemes';
import { useLang } from '@/lib/lang';

interface SchemeDetailModalProps {
  scheme: SchemeDetail;
  isBookmarked: boolean;
  onToggleBookmark: (schemeId: string) => void;
  onClose: () => void;
}

function categoryLabel(id: string): string {
  return schemeCategories.find((c) => c.id === id)?.label ?? id;
}

function farmerCategoryLabel(id: string): string {
  return farmerCategories.find((c) => c.id === id)?.label ?? id;
}

export function SchemeDetailModal({ scheme, isBookmarked, onToggleBookmark, onClose }: SchemeDetailModalProps) {
  const { lang } = useLang();

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-forest-950/40 sm:items-center sm:justify-center" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white p-5 sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-forest-500">{categoryLabel(scheme.category)}</span>
            <h2 className="mt-1 text-xl font-extrabold leading-6 text-forest-900">{scheme.name}</h2>
            <p className="mt-1 text-xs font-semibold text-forest-500">{scheme.ministry}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-forest-500 hover:bg-forest-50 transition-colors" aria-label="Close details">
            <X size={21} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-forest-700">{scheme.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {scheme.applicableStates.map((s) => <span key={s} className="chip bg-forest-50 text-forest-600"><MapPin size={12} /> {s}</span>)}
          {scheme.eligibleCrops === 'all'
            ? <span className="chip bg-forest-50 text-forest-600"><Sprout size={12} /> All Crops</span>
            : (scheme.eligibleCrops as string[]).map((c) => <span key={c} className="chip bg-forest-50 text-forest-600">{cropById(c as never).emoji} {cropName(c as never, lang)}</span>)}
        </div>

        <div className="mt-5 rounded-lg bg-amber-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Benefits</p>
          <p className="mt-1 text-sm leading-6 text-amber-950">{scheme.benefits}</p>
        </div>

        <div className="mt-4 rounded-lg bg-forest-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400">Eligibility</p>
          <p className="mt-1 text-sm leading-6 text-forest-800">{scheme.eligibility}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-forest-100 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-forest-400"><UserCircle size={14} /> Farmer Categories</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {scheme.eligibleFarmerCategories.map((fc) => <span key={fc} className="chip bg-moss-50 text-forest-700">{farmerCategoryLabel(fc)}</span>)}
            </div>
          </div>
          <div className="rounded-lg border border-forest-100 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-forest-400"><Sprout size={14} /> Farm Size Criteria</p>
            <p className="mt-2 text-sm leading-5 text-forest-800">{scheme.farmSizeCriteria ?? 'No specific size requirement'}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-forest-100 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-forest-400"><FileText size={14} /> Required Documents</p>
          <ul className="mt-2 space-y-1.5">
            {scheme.requiredDocuments.map((doc) => <li key={doc} className="flex gap-2 text-sm leading-5 text-forest-800"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-400" /> {doc}</li>)}
          </ul>
        </div>

        <div className="mt-4 rounded-lg border border-forest-100 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-forest-400"><ListChecks size={14} /> Application Process</p>
          <ol className="mt-2 space-y-2">
            {scheme.applicationProcess.map((step, i) => <li key={step} className="flex gap-3 text-sm leading-5 text-forest-800"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-forest-100 text-xs font-extrabold text-forest-700">{i + 1}</span> {step}</li>)}
          </ol>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-forest-50 p-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-forest-400">Source & Verification</p>
            <p className="mt-1 text-xs font-semibold text-forest-700">{scheme.sourceName}</p>
            <p className="mt-0.5 text-xs text-forest-500">Last verified: {new Date(scheme.lastVerifiedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          {scheme.isActive
            ? <span className="chip bg-success-100 text-success-800"><CheckCircle2 size={13} /> Active</span>
            : <span className="chip bg-error-100 text-error-800">Inactive</span>}
        </div>

        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          Please verify eligibility and current details on the official government website.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onToggleBookmark(scheme.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold transition-colors ${isBookmarked ? 'bg-forest-600 text-white hover:bg-forest-700' : 'border border-forest-200 bg-white text-forest-700 hover:bg-forest-50'}`}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            {isBookmarked ? 'Saved' : 'Save scheme'}
          </button>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3.5 text-sm font-bold text-amber-950 hover:bg-amber-500 transition-colors"
          >
            <ExternalLink size={18} /> Official website
          </a>
        </div>
      </div>
    </div>
  );
}
