import { useEffect, useRef, useState } from 'react';
import type { Language } from '@/data/i18n';

interface CacheEntry {
  translations: string[];
  timestamp: number;
}

const CACHE_PREFIX = 'fasalsathi_tr_';
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

function loadCache(key: string): string[] | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) return null;
    return entry.translations;
  } catch {
    return null;
  }
}

function saveCache(key: string, translations: string[]): void {
  try {
    const entry: CacheEntry = { translations, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — skip caching
  }
}

function makeCacheKey(texts: string[], lang: string): string {
  const combined = texts.join('\u0001');
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash + combined.charCodeAt(i)) | 0;
  }
  return `${lang}_${hash}`;
}

export function useBatchTranslation(
  texts: string[],
  lang: Language,
  enabled: boolean = true,
): string[] {
  const [translated, setTranslated] = useState<string[]>(texts);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!enabled || lang === 'en' || texts.length === 0) {
      setTranslated(texts);
      return;
    }

    const alreadyTranslated = texts.every((t) => {
      if (!t) return true;
      const ascii = (t.match(/[a-zA-Z]/g) ?? []).length;
      const total = t.replace(/[\s\d\p{P}]/gu, '').length;
      return total === 0 || ascii / total < 0.3;
    });

    if (alreadyTranslated) {
      setTranslated(texts);
      return;
    }

    const cacheKey = makeCacheKey(texts, lang);
    const cached = loadCache(cacheKey);
    if (cached && cached.length === texts.length) {
      setTranslated(cached);
      return;
    }

    let cancelled = false;
    const currentRequestId = ++requestIdRef.current;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      setTranslated(texts);
      return;
    }

    fetch(`${supabaseUrl}/functions/v1/ai-translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify({ texts, targetLang: lang }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Translation failed: ${res.status}`);
        return res.json();
      })
      .then((data: { translations?: string[] }) => {
        if (cancelled || currentRequestId !== requestIdRef.current) return;
        const result = data.translations ?? [];
        if (result.length === texts.length) {
          saveCache(cacheKey, result);
          setTranslated(result);
        } else {
          setTranslated(texts);
        }
      })
      .catch(() => {
        if (cancelled || currentRequestId !== requestIdRef.current) return;
        setTranslated(texts);
      });

    return () => {
      cancelled = true;
    };
  }, [texts, lang, enabled]);

  return translated;
}

export function useTranslatedRecord<T extends Record<string, string[]>>(
  record: T,
  lang: Language,
  enabled: boolean = true,
): T {
  const allTexts = useMemo_flat(record, lang, enabled);
  const translated = useBatchTranslation(allTexts, lang, enabled);

  return useMemo_rebuild(record, translated);
}

function useMemo_flat<T extends Record<string, string[]>>(
  record: T,
  _lang: Language,
  _enabled: boolean,
): string[] {
  const keys = Object.keys(record);
  const texts: string[] = [];
  for (const key of keys) {
    for (const text of record[key]) {
      texts.push(text);
    }
  }
  return texts;
}

function useMemo_rebuild<T extends Record<string, string[]>>(
  record: T,
  translated: string[],
): T {
  const keys = Object.keys(record);
  const result: Record<string, string[]> = {};
  let idx = 0;
  for (const key of keys) {
    const arr: string[] = [];
    for (let i = 0; i < record[key].length; i++) {
      arr.push(translated[idx] ?? record[key][i]);
      idx++;
    }
    result[key] = arr;
  }
  return result as T;
}
