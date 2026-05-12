import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import type {
  LocationAutocompleteEnvelope,
  LocationAutocompleteItem,
  LocationSelectEnvelope,
} from './types';

export type LocationAutocompleteParams = {
  q: string;
  page?: number;
  page_size?: number;
};

function firstNonEmptyCoord(
  ...candidates: (string | null | undefined)[]
): string | undefined {
  for (const c of candidates) {
    if (c == null) continue;
    const t = String(c).trim();
    if (t !== '') return t;
  }
  return undefined;
}

function hasLatLonPair(item: LocationAutocompleteItem): boolean {
  const latStr = firstNonEmptyCoord(item.lat, item.latitude);
  const lonStr = firstNonEmptyCoord(item.lon, item.longitude);
  return latStr !== undefined && lonStr !== undefined;
}

/** Normalize "pandharpur..." → "pandharpur" for search */
function sanitizeLocationPart(s: string | null | undefined): string {
  if (s == null) return '';
  return String(s).replace(/\.\.\.+/g, '').trim();
}

function buildGeocodeHintQuery(item: LocationAutocompleteItem): string {
  const city = sanitizeLocationPart(item.city);
  const state = sanitizeLocationPart(item.state);
  const country = sanitizeLocationPart(item.country);
  const compound = [city, state, country].filter(Boolean).join(', ');
  if (compound) return compound;
  return sanitizeLocationPart(item.display_name);
}

/**
 * Manual rows have no coordinates; backend expects lat/lon. Reuse autocomplete
 * to resolve coordinates from the typed address without changing user's city/state.
 */
export async function enrichManualLocationForSelect(
  item: LocationAutocompleteItem
): Promise<LocationAutocompleteItem> {
  const manual = String(item.type).toLowerCase() === 'manual';
  if (!manual || hasLatLonPair(item)) {
    return item;
  }
  const query = buildGeocodeHintQuery(item);
  if (!query) return item;

  try {
    const envelope = await locationsApi.autocomplete({
      q: query,
      page: 1,
      page_size: 8,
    });
    const candidates = envelope.data ?? [];
    const cityNorm = sanitizeLocationPart(item.city).toLowerCase();

    const ranked = candidates
      .filter(
        (r) =>
          String(r.type).toLowerCase() !== 'manual' &&
          hasLatLonPair(r as LocationAutocompleteItem)
      )
      .sort((a, b) => {
        if (!cityNorm) return 0;
        const am =
          sanitizeLocationPart(a.city).toLowerCase() === cityNorm ? 1 : 0;
        const bm =
          sanitizeLocationPart(b.city).toLowerCase() === cityNorm ? 1 : 0;
        return bm - am;
      });

    const picked = ranked[0];
    if (!picked) return item;

    const latStr = firstNonEmptyCoord(picked.lat, picked.latitude);
    const lonStr = firstNonEmptyCoord(picked.lon, picked.longitude);
    if (latStr === undefined || lonStr === undefined) return item;

    return {
      ...item,
      type: 'manual',
      place_id: null,
      lat: latStr,
      lon: lonStr,
      latitude: latStr,
      longitude: lonStr,
    };
  } catch {
    return item;
  }
}

/** Body shape for POST /core/locations/select/ */
export function locationItemToSelectPayload(
  item: LocationAutocompleteItem
): Record<string, string | null | undefined> {
  const body: Record<string, string | null | undefined> = {
    type: item.type || 'manual',
    display_name: item.display_name ?? '',
    city: item.city ?? '',
    state: item.state ?? '',
    country: item.country ?? '',
  };
  if (item.place_id != null && item.place_id !== '') {
    body.place_id = item.place_id;
  }
  const latStr = firstNonEmptyCoord(item.lat, item.latitude);
  const lonStr = firstNonEmptyCoord(item.lon, item.longitude);
  /**
   * Backend expects `lat` / `lon` (plus optional latitude/longitude mirrors).
   * For manual entries still missing coords, send explicit null keys.
   */
  if (latStr !== undefined && lonStr !== undefined) {
    body.lat = latStr;
    body.lon = lonStr;
    body.latitude = latStr;
    body.longitude = lonStr;
  } else if (String(body.type).toLowerCase() === 'manual') {
    body.lat = null;
    body.lon = null;
    body.latitude = null;
    body.longitude = null;
  }

  return body;
}

export const locationsApi = {
  autocomplete: async (
    params: LocationAutocompleteParams
  ): Promise<LocationAutocompleteEnvelope> => {
    const search = new URLSearchParams({
      q: params.q.trim(),
      page: String(params.page ?? 1),
      page_size: String(params.page_size ?? 10),
    });
    const path = `${API_ENDPOINTS.CORE.LOCATIONS_AUTOCOMPLETE}?${search.toString()}`;
    return apiClient.get(path) as Promise<LocationAutocompleteEnvelope>;
  },

  selectLocation: async (
    item: LocationAutocompleteItem
  ): Promise<LocationSelectEnvelope> => {
    const ready = await enrichManualLocationForSelect(item);
    const payload = locationItemToSelectPayload(ready);
    return apiClient.post(
      API_ENDPOINTS.CORE.LOCATIONS_SELECT,
      payload
    ) as Promise<LocationSelectEnvelope>;
  },
};
