export interface WeatherForecastDay {
  label: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

export interface WeatherResult {
  location: string;
  temp: number;
  condition: string;
  windDescription: string;
  forecast: WeatherForecastDay[];
}

export interface WeatherError {
  error: true;
  message: string;
}

type WeatherResponse = WeatherResult | WeatherError;

const WEATHER_API_BASE = 'https://api.weatherapi.com/v1/forecast.json';

function describeWind(windKph: number, windDir: string): string {
  let strength: string;
  if (windKph < 5) strength = 'Calm';
  else if (windKph < 15) strength = 'Light breeze';
  else if (windKph < 30) strength = 'Moderate wind';
  else strength = 'Strong wind';

  const dir = windDir.toLowerCase();
  if (strength === 'Calm') return 'Calm';
  return `${strength} from ${dir}`;
}

function computeDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function tryApiKey(apiKey: string, lat: number, lon: number): Promise<Response> {
  const url = `${WEATHER_API_BASE}?key=${apiKey}&q=${lat},${lon}&days=3&aqi=no&alerts=no`;
  const maskedUrl = url.replace(apiKey, '***');
  console.log('[Weather] Request URL:', maskedUrl);
  return fetchWithTimeout(url, 10000);
}

function parseWeatherResponse(data: any): WeatherResult {
  const forecastDays = data.forecast?.forecastday ?? [];
  return {
    location: data.location?.name ?? 'Unknown',
    temp: Math.round(data.current?.temp_c ?? 0),
    condition: data.current?.condition?.text ?? '',
    windDescription: describeWind(data.current?.wind_kph ?? 0, data.current?.wind_dir ?? ''),
    forecast: forecastDays.map((day: any, index: number) => ({
      label: computeDayLabel(day.date, index),
      maxTemp: Math.round(day.day?.maxtemp_c ?? 0),
      minTemp: Math.round(day.day?.mintemp_c ?? 0),
      condition: day.day?.condition?.text ?? '',
    })),
  };
}

export async function getWeatherByLocation(lat: number, lon: number): Promise<WeatherResponse> {
  const primaryKey = import.meta.env.VITE_WEATHER;
  const defaultKey = import.meta.env.VITE_DEFAULT;

  if (!primaryKey && !defaultKey) {
    return { error: true, message: 'Unable to fetch weather, showing last known data' };
  }

  const keysToTry: string[] = [];
  if (primaryKey) keysToTry.push(primaryKey);
  if (defaultKey && defaultKey !== primaryKey) keysToTry.push(defaultKey);

  for (const key of keysToTry) {
    try {
      const response = await tryApiKey(key, lat, lon);
      if (response.ok) {
        const data = await response.json();
        return parseWeatherResponse(data);
      }
      const errorBody = await response.text().catch(() => '');
      console.error(`[Weather] HTTP ${response.status} — Response body:`, errorBody);
      if (response.status === 429 || (response.status >= 400 && response.status < 600)) {
        continue;
      }
    } catch (err) {
      console.error('[Weather] Fetch failed:', err);
      continue;
    }
  }

  return { error: true, message: 'Unable to fetch weather, showing last known data' };
}

export function getUserLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 18.5204, lon: 73.8567 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
      () => resolve({ lat: 18.5204, lon: 73.8567 }),
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
}
