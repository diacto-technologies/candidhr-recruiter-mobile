// =========================
// JOB DETAIL INTERFACES
// =========================

export interface JobDetail {
    id: string;
    title: string;
    description: string;     // HTML
    jd_html: string;         // HTML
  
    experience?: number | null;
    min_experience?: number | null;
    max_experience?: number | null;
  
    applicants_count: number;
    applicants_today_count: number;
  
    users_shared_with: SharedUser[];
  
    must_have_skills: JobSkill[];
  
    encrypted: string;
  
    owner: Owner;
  
    tenant: string;
  
    employment_type: string;
    location: string;
  
    published: boolean;
  
    close_date: string | null;   // ISO date
    created_at: string;          // ISO date
    last_viewed?: string | null; // ISO date
  
    views_count?: number;
  
    workflow?: Workflow;
  
    invite_via_application_form: boolean;
    invite_via_email: boolean;
  
    emails: string[];
  
    application_ids: string[] | null;
  }
  
  // =========================
  // SUB-TYPES
  // =========================
  
  export interface SharedUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  
    contact?: string | number | null;
    state?: string | null;
    country?: string | null;
    user_type?: string | null;
    profile_pic?: string | null;
  }
  
  export interface UserRole {
    id: number;
    name: string;
    tenant: string;
    is_default: boolean;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface Owner {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  
    contact?: string | number | null;
    state?: string | null;
    country?: string | null;
    user_type?: string | null;
    profile_pic?: string | null;
  }
  
  export interface JobSkill {
    label: string;
    value: string;
  }
  
  export interface Workflow {
    id: string;
    name: string;
  }
  