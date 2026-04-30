/** Row from GET /core/locations/autocomplete/ */
export type LocationAutocompleteItem = {
  /** Server id after POST /core/locations/select/ */
  id?: string | null;
  place_id: string | null;
  display_name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  lat: string | null;
  lon: string | null;
  /** Some responses use these keys instead of lat/lon */
  latitude?: string | null;
  longitude?: string | null;
  type: string;
};

export type LocationAutocompleteEnvelope = {
  success: boolean;
  message?: string;
  data: LocationAutocompleteItem[];
  pagination?: {
    count: number;
    next: string | null;
    previous: string | null;
    page_size: number;
    total_pages: number;
    current_page: number;
  };
};

/** data from POST /core/locations/select/ */
export type SavedLocationData = {
  id: string;
  place_id: string | null;
  display_name: string;
  name: string;
  city: string;
  state: string;
  country: string;
  country_code: string;
  latitude: string | null;
  longitude: string | null;
  location_type: string;
};

export type LocationSelectEnvelope = {
  success: boolean;
  message?: string;
  data: SavedLocationData;
};

export type LocationsState = {
  autocompleteResults: LocationAutocompleteItem[];
  autocompleteLoading: boolean;
  autocompleteError: string | null;
  selectedLocation: SavedLocationData | null;
  selectLoading: boolean;
  selectError: string | null;
};

export function savedLocationToItem(
  saved: SavedLocationData
): LocationAutocompleteItem {
  return {
    id: saved.id,
    place_id: saved.place_id,
    display_name: saved.display_name,
    city: saved.city,
    state: saved.state,
    country: saved.country,
    lat: saved.latitude,
    lon: saved.longitude,
    type: saved.location_type,
  };
}
