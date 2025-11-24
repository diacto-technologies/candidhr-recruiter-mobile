export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  [key: string]: any;
}

export interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar?: string;
}

