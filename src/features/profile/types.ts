export interface Profile {
  id: string;
  name: string;
  email: string;
  contact: number;
  state: string;
  country: string;
  position: string;
  profile_pic: string;
  is_active: boolean;
  is_superadmin: boolean;
  is_admin: boolean;
  agree_to_terms_and_conditions: boolean;

  created_at: string;
  updated_at: string;
  last_login: string;

  user: string;  // Firebase / internal user ID

  tenant: Tenant;
  role: Role;

  // Accept any additional backend keys
  [key: string]: any;
}

export interface Tenant {
  id: string;
  org_name: string;
  org_domain: string;
  org_tier: string;
  org_location: string;
  support_email: string;
  contact_email: string;
  contact_phone: string;
  size: string;
  industry: string;
  website: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  headquarters?: string | null;
  country: string;
  state: string;
  logo: string | null;
  secondary_logo?: string | null;
  banner_image?: string | null;
  video_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  background_color?: string | null;
  about_us?: string | null;

  features: Feature[];
}

export interface Feature {
  id: number;
  name: string;
  description: string;
  feature_type: string;
  key: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  codename: string;
  description: string;
}

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  contact?: number;
  position?: string;
  state?: string;
  country?: string;
  profile_pic?: string;
  bio?: string;
  location?: string;
}
