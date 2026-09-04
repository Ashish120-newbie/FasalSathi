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

const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const COMPASS_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function degToCompass(deg: number): string {
  const index = Math.round(deg / 45) % 8;
  return COMPASS_DIRS[index];
}

function describeWind(windKph: number, compassDir: string): string {
  let strength: string;
  if (windKph < 5) strength = 'Calm';
  else if (windKph < 15) strength = 'Light breeze';
  else if (windKph < 30) strength = 'Moderate wind';
  else strength = 'Strong wind';

  const dir = compassDir.toLowerCase();
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

interface ForecastEntry {
  dt_txt: string;
  main: { temp: number; temp_max: number; temp_min: number };
  weather: { main: string; description: string }[];
}

function groupForecastByDate(list: ForecastEntry[]): Map<string, ForecastEntry[]> {
  const byDate = new Map<string, ForecastEntry[]>();
  for (const entry of list) {
    const date = entry.dt_txt.split(' ')[0];
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push(entry);
  }
  return byDate;
}

function buildForecast(list: ForecastEntry[]): WeatherForecastDay[] {
  const byDate = groupForecastByDate(list);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const sortedDates = Array.from(byDate.keys())
    .filter((d) => d >= todayStr)
    .sort();

  const result: WeatherForecastDay[] = [];

  for (let i = 0; i < Math.min(3, sortedDates.length); i++) {
    const date = sortedDates[i];
    const entries = byDate.get(date)!;

    let minTemp = Infinity;
    let maxTemp = -Infinity;
    for (const e of entries) {
      if (e.main.temp_min < minTemp) minTemp = e.main.temp_min;
      if (e.main.temp_max > maxTemp) maxTemp = e.main.temp_max;
    }

    let representative = entries[0];
    let minDiff = Infinity;
    for (const e of entries) {
      const hour = parseInt(e.dt_txt.split(' ')[1].split(':')[0], 10);
      const diff = Math.abs(hour - 12);
      if (diff < minDiff) {
        minDiff = diff;
        representative = e;
      }
    }

    const condition = representative.weather[0]?.description ??
      representative.weather[0]?.main ?? '';

    result.push({
      label: computeDayLabel(date, i),
      maxTemp: Math.round(maxTemp),
      minTemp: Math.round(minTemp),
      condition,
    });
  }

  return result;
}

async function tryApiKey(
  apiKey: string,
  lat: number,
  lon: number
): Promise<WeatherResult> {
  const currentUrl = `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const maskedCurrent = currentUrl.replace(apiKey, '***');
  const maskedForecast = forecastUrl.replace(apiKey, '***');
  console.log('[Weather] Current request URL:', maskedCurrent);
  console.log('[Weather] Forecast request URL:', maskedForecast);

  const currentResponse = await fetchWithTimeout(currentUrl, 10000);
  if (!currentResponse.ok) {
    const errorBody = await currentResponse.text().catch(() => '');
    console.error(`[Weather] Current HTTP ${currentResponse.status} — Response body:`, errorBody);
    throw new Error(`Current weather HTTP ${currentResponse.status}`);
  }

  const currentData = await currentResponse.json();

  const forecastResponse = await fetchWithTimeout(forecastUrl, 10000);
  if (!forecastResponse.ok) {
    const errorBody = await forecastResponse.text().catch(() => '');
    console.error(`[Weather] Forecast HTTP ${forecastResponse.status} — Response body:`, errorBody);
    throw new Error(`Forecast HTTP ${forecastResponse.status}`);
  }

  const forecastData = await forecastResponse.json();

  const windKph = (currentData.wind?.speed ?? 0) * 3.6;
  const compassDir = degToCompass(currentData.wind?.deg ?? 0);

  return {
    location: currentData.name ?? 'Unknown',
    temp: Math.round(currentData.main?.temp ?? 0),
    condition: currentData.weather?.[0]?.description ??
      currentData.weather?.[0]?.main ?? '',
    windDescription: describeWind(windKph, compassDir),
    forecast: buildForecast(forecastData.list ?? []),
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
      return await tryApiKey(key, lat, lon);
    } catch (err) {
      console.error('[Weather] Attempt failed:', err);
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
