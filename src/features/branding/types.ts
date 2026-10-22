export interface BrandingData {
  product_name: string;
  secondary_logo: string | null;
  logo: string | null;
  primary_color: string;
  powered_by_enabled: boolean;
  favicon: string | null;
}

export interface BrandingFilePayload {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

export interface UpdateBrandingRequest {
  product_name?: string;
  primary_color?: string;
  powered_by_enabled?: boolean;
  logo?: BrandingFilePayload | null;
  secondary_logo?: BrandingFilePayload | null;
  favicon?: BrandingFilePayload | null;
}

export type UpdateBrandingPayload = FormData | UpdateBrandingRequest;

export interface BrandingState {
  data: BrandingData | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  updateSuccess: boolean;
  isReset: boolean;
}
