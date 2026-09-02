import { useMemo, useState } from 'react';
import { Globe, MapPin, ChevronDown } from 'lucide-react';
import { getAllStates, getDistricts } from 'india-state-district';

export interface LocationSelection {
  country: string;
  stateCode: string;
  stateName: string;
  district: string;
}

interface LocationSelectorProps {
  value: Partial<LocationSelection> | null;
  onChange: (selection: LocationSelection | null) => void;
  autoDetecting?: boolean;
}

const COUNTRY = 'India';

export function LocationSelector({ value, onChange, autoDetecting }: LocationSelectorProps) {
  const states = useMemo(() => getAllStates().sort((a, b) => a.name.localeCompare(b.name)), []);
  const [selectedStateCode, setSelectedStateCode] = useState(value?.stateCode ?? '');
  const [selectedDistrict, setSelectedDistrict] = useState(value?.district ?? '');

  const districts = useMemo(() => {
    if (!selectedStateCode) return [];
    return getDistricts(selectedStateCode).sort((a, b) => a.localeCompare(b));
  }, [selectedStateCode]);

  function handleStateChange(code: string) {
    setSelectedStateCode(code);
    setSelectedDistrict('');
    if (!code) {
      onChange(null);
      return;
    }
    const state = states.find((s) => s.code === code);
    onChange({
      country: COUNTRY,
      stateCode: code,
      stateName: state?.name ?? '',
      district: '',
    });
  }

  function handleDistrictChange(district: string) {
    setSelectedDistrict(district);
    const state = states.find((s) => s.code === selectedStateCode);
    if (district && selectedStateCode) {
      onChange({
        country: COUNTRY,
        stateCode: selectedStateCode,
        stateName: state?.name ?? '',
        district,
      });
    }
  }

  return (
    <div className="space-y-4">
      {/* Country (hardcoded India) */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-forest-800">
          <Globe size={15} className="text-forest-500" /> Country
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-forest-200 bg-forest-50 px-4 py-2.5 text-sm font-medium text-forest-800">
          <span className="text-lg leading-none">🇮🇳</span> {COUNTRY}
        </div>
      </div>

      {/* State */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-forest-800">
          <MapPin size={15} className="text-forest-500" /> State / Union Territory
        </label>
        <div className="relative">
          <select
            value={selectedStateCode}
            onChange={(e) => handleStateChange(e.target.value)}
            className="select-field"
            disabled={autoDetecting}
          >
            <option value="">{autoDetecting ? 'Detecting...' : 'Select state...'}</option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* District */}
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-forest-800">
          <ChevronDown size={15} className="text-forest-500" /> District
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="select-field"
          disabled={!selectedStateCode || autoDetecting}
        >
          <option value="">{selectedStateCode ? 'Select district...' : 'Select state first'}</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
