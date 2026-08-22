import type { ScanRecord } from './types';

const STORAGE_KEY = 'fasalsathi-scans';

export function loadScans(): ScanRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as ScanRecord[] : [];
  } catch {
    return [];
  }
}

export function saveScans(scans: ScanRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
}

export function addScan(scan: ScanRecord): ScanRecord[] {
  const scans = [scan, ...loadScans()];
  saveScans(scans);
  return scans;
}

export function updateScan(id: string, changes: Partial<ScanRecord>): ScanRecord[] {
  const scans = loadScans().map((scan) => scan.id === id ? { ...scan, ...changes } : scan);
  saveScans(scans);
  return scans;
}

export function seedScans(): ScanRecord[] {
  const existing = loadScans();
  if (existing.length > 0) return existing;
  const seeds: ScanRecord[] = [
    { id: 'seed-1', imageDataUrl: '', cropId: 'wheat', growthStage: 'vegetative', result: { diseaseId: 'wheat-yellow-rust', diseaseName: 'Yellow Rust', confidence: 86, level: 'high', affectedRegion: { x: 28, y: 24, width: 44, height: 48 }, source: 'ai' as const }, createdAt: Date.now() - 86400000 * 2, escalated: false },
    { id: 'seed-2', imageDataUrl: '', cropId: 'tomato', growthStage: 'flowering', result: { diseaseId: 'tomato-early-blight', diseaseName: 'Early Blight', confidence: 68, level: 'medium', affectedRegion: { x: 30, y: 28, width: 42, height: 48 }, source: 'ai' as const }, createdAt: Date.now() - 86400000 * 6, escalated: false },
    { id: 'seed-3', imageDataUrl: '', cropId: 'rice', growthStage: 'vegetative', result: { diseaseId: 'rice-blast', diseaseName: 'Rice Blast', confidence: 31, level: 'low', affectedRegion: { x: 36, y: 30, width: 34, height: 42 }, source: 'ai' as const }, createdAt: Date.now() - 86400000 * 10, escalated: true, officerReview: { status: 'pending', officerName: 'Awaiting review' } },
  ];
  saveScans(seeds);
  return seeds;
}
