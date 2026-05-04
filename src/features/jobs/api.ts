import { apiClient } from "../../api/client";
import { API_ENDPOINTS } from "../../api/endpoints";
import {
  CreateJobRequest,
  DuplicateJobRequest,
  UpdateJobRequest,
  PatchJobDetailsRequest,
  Job,
  GetJobsParams,
  JobsListApiResponse,
  JobNamesListApiResponse,
  GenerateJobDescriptionRequest,
  GenerateJobDescriptionResponse,
  SubmitJobApplicationFormStepPayload,
  JobFilterCriteriaPayload,
  JobCriteriaBulkItem,
  JobCriteriaBulkResponseType,
  JobCriteriaListApiResponse,
  ResumeScreeningPreferencesApi,
  JobDetail,
  Owner,
  SharedUser,
  Skill,
  UserRole,
} from "./types";

function emptyUserRole(): UserRole {
  return { id: 0, name: "", tenant: "", is_default: false };
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

/** Duplicate POST returns a flat job; `users_shared_with` may be user id strings. */
function normalizeUsersSharedForJob(raw: unknown): Job["users_shared_with"] {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const first = raw[0];
  if (typeof first === "string") {
    return (raw as string[])
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => ({ id, name: "", email: "" }));
  }
  return raw as Job["users_shared_with"];
}

function normalizeDuplicateJobResponse(res: unknown): Job {
  const root = asRecord(res);
  const inner = root.job && typeof root.job === "object" ? root.job : res;
  const rec = asRecord(inner);
  const out = { ...rec } as Record<string, unknown>;
  out.users_shared_with = normalizeUsersSharedForJob(rec.users_shared_with) as unknown;
  return out as Job;
}

/** Normalizes GET /job/v1/jobs/:id/ (flat job) or legacy `{ job }` into `JobDetail`. */
export function normalizeJobDetailFromApi(raw: unknown): JobDetail {
  const root = asRecord(raw);
  const job = asRecord(
    "job" in root && root.job && typeof root.job === "object" ? root.job : root
  );

  const ownerRec = asRecord(job.owner);
  const ownerRole =
    ownerRec.role && typeof ownerRec.role === "object"
      ? (ownerRec.role as UserRole)
      : emptyUserRole();

  const owner: Owner = {
    id: String(ownerRec.id ?? ""),
    name: String(ownerRec.name ?? ""),
    email: String(ownerRec.email ?? ""),
    role: ownerRole,
    contact: (ownerRec.contact as number | null | undefined) ?? null,
    state: (ownerRec.state as string | null | undefined) ?? null,
    country: (ownerRec.country as string | null | undefined) ?? null,
    user_type: (ownerRec.user_type as string | null | undefined) ?? null,
    profile_pic: (ownerRec.profile_pic as string | null | undefined) ?? null,
  };

  const usersRaw = Array.isArray(job.users_shared_with) ? job.users_shared_with : [];
  const users_shared_with: SharedUser[] = (usersRaw as unknown[]).map((u) => {
    const ur = asRecord(u);
    const r =
      ur.role && typeof ur.role === "object" ? (ur.role as UserRole) : emptyUserRole();
    return {
      id: String(ur.id ?? ""),
      name: String(ur.name ?? ""),
      email: String(ur.email ?? ""),
      role: r,
      contact: (ur.contact as number | null | undefined) ?? null,
      state: (ur.state as string | null | undefined) ?? null,
      country: (ur.country as string | null | undefined) ?? null,
      user_type: (ur.user_type as string | null | undefined) ?? null,
      profile_pic: (ur.profile_pic as string | null | undefined) ?? null,
    };
  });

  const skillsRaw = Array.isArray(job.must_have_skills) ? job.must_have_skills : [];
  const must_have_skills: Skill[] = (skillsRaw as unknown[]).map((s) => {
    const sr = asRecord(s);
    const label = String(sr.label ?? sr.value ?? "");
    const value = String(sr.value ?? sr.label ?? "");
    return { label, value };
  });

  const desc =
    typeof job.description === "string" && job.description.trim() !== ""
      ? job.description
      : typeof job.jd_html === "string"
        ? job.jd_html
        : "";
  const jd =
    typeof job.jd_html === "string" && job.jd_html.trim() !== ""
      ? job.jd_html
      : desc;

  const emails = Array.isArray(job.emails) ? (job.emails as string[]) : [];
  const closeRaw = job.close_date;
  const close_date =
    closeRaw == null || closeRaw === ""
      ? null
      : typeof closeRaw === "string"
        ? closeRaw
        : String(closeRaw);

  const locDetail = job.location_detail;
  const location_detail =
    locDetail && typeof locDetail === "object"
      ? (locDetail as JobDetail["location_detail"])
      : null;

  const workflowRaw = job.workflow;
  let workflow: JobDetail["workflow"] | undefined;
  if (typeof workflowRaw === "string" && workflowRaw.trim() !== "") {
    workflow = { id: workflowRaw.trim(), name: "" };
  } else if (workflowRaw && typeof workflowRaw === "object") {
    const wr = asRecord(workflowRaw);
    workflow = {
      id: String(wr.id ?? ""),
      name: String(wr.name ?? ""),
    };
  } else {
    workflow = undefined;
  }

  const emailCandidateFromApi =
    typeof job.email_candidate === "boolean"
      ? job.email_candidate
      : typeof job.new_applicant_notify === "boolean"
        ? job.new_applicant_notify
        : undefined;

  return {
    id: String(job.id ?? ""),
    title: String(job.title ?? ""),
    description: desc,
    jd_html: jd,
    experience: (job.experience as number | null | undefined) ?? null,
    min_experience: (job.min_experience as number | null | undefined) ?? null,
    max_experience: (job.max_experience as number | null | undefined) ?? null,
    applicants_count: (job.applicants_count as number | undefined) ?? 0,
    applicants_today_count: (job.applicants_today_count as number | undefined) ?? 0,
    users_shared_with,
    must_have_skills,
    encrypted: String(job.encrypted ?? ""),
    owner,
    tenant: String(job.tenant ?? ""),
    employment_type: String(job.employment_type ?? ""),
    location: String(job.location ?? ""),
    published: Boolean(job.published),
    close_date,
    created_at: String(job.created_at ?? ""),
    last_viewed:
      job.last_viewed == null || job.last_viewed === ""
        ? null
        : String(job.last_viewed),
    views_count: (job.views_count as number | undefined) ?? 0,
    workflow,
    invite_via_application_form: Boolean(job.invite_via_application_form),
    invite_via_email: Boolean(job.invite_via_email),
    emails,
    application_ids: (job.application_ids as string[] | null) ?? null,
    location_detail,
    score_weight: (job.score_weight as JobDetail["score_weight"]) ?? null,
    resume_screening_enabled: Boolean(job.resume_screening_enabled),
    salary_currency:
      job.salary_currency == null ? null : String(job.salary_currency),
    min_salary: job.min_salary as JobDetail["min_salary"],
    max_salary: job.max_salary as JobDetail["max_salary"],
    is_salary_visible: job.is_salary_visible as boolean | undefined,
    email_candidate: emailCandidateFromApi,
    new_applicant_notify:
      typeof job.new_applicant_notify === "boolean" ? job.new_applicant_notify : undefined,
    workflow_enabled:
      typeof job.workflow_enabled === "boolean" ? job.workflow_enabled : undefined,
    workflow_version:
      job.workflow_version == null || job.workflow_version === ""
        ? undefined
        : String(job.workflow_version),
  };
}

function mandatoryFieldUiToApi(value: string): "off" | "optional" | "mandatory" {
  const t = (value ?? "").trim();
  if (t.toLowerCase() === "off") return "off";
  if (t === "optional") return "optional";
  return "mandatory";
}

/** Reverse of `mandatoryFieldUiToApi` for GET resume-screening-preferences → UI dropdown ids. */
export function apiMandatoryToUi(value: string | null | undefined): string {
  const t = (value ?? "off").trim().toLowerCase();
  if (t === "optional") return "optional";
  if (t === "mandatory") return "mandatory";
  return "Off";
}

function formatIdToResponseType(formatId: string): JobCriteriaBulkResponseType {
  if (formatId === "yes_no") return "radio";
  if (formatId === "multiple_choice") return "checkbox";
  return "dropdown";
}

export function buildResumeScreeningPreferencesBody(p: SubmitJobApplicationFormStepPayload) {
  return {
    job: p.jobId,
    max_retries: p.maxRetries,
    max_applicants: p.maxApplicants,
    currency:
      p.salaryCurrency && String(p.salaryCurrency).trim() !== ""
        ? String(p.salaryCurrency).trim()
        : null,
    include_relevant_experience: mandatoryFieldUiToApi(p.relevantExperience),
    include_notice_period: mandatoryFieldUiToApi(p.noticePeriod),
    include_expected_ctc: mandatoryFieldUiToApi(p.expectedSalary),
    include_current_ctc: mandatoryFieldUiToApi(p.currentSalary),
    include_profile_pic: mandatoryFieldUiToApi(p.profilePicture),
    include_intro_video: mandatoryFieldUiToApi(p.introVideo),
    include_github: mandatoryFieldUiToApi(p.includeGithub),
    include_linkedin: mandatoryFieldUiToApi(p.includeLinkedIn),
    include_personal_website: mandatoryFieldUiToApi(p.includeWebsite),
    include_questions: p.screeningQuestionIds.length > 0,
    questions: p.screeningQuestionIds,
    random_questions: false,
    random_questions_count: null,
  };
}

export function buildCriteriaBulkBody(
  jobId: string,
  filterCriteria: JobFilterCriteriaPayload[]
): JobCriteriaBulkItem[] {
  return filterCriteria.map((crit) => {
    const yesNo = crit.formatId === "yes_no";
    const optTexts = yesNo
      ? ["Yes", "No"]
      : crit.options.map((o) => o.text.trim()).filter(Boolean);
    const correctTexts = crit.correctOptionIds
      .map((id) => crit.options.find((o) => o.id === id)?.text?.trim() ?? "")
      .filter(Boolean);
    let expected = correctTexts.join(", ");
    if (!expected) {
      expected = optTexts[0] ?? "";
    }
    return {
      criteria_id: null,
      job_id: jobId,
      question: crit.questionText.trim(),
      response_type: formatIdToResponseType(crit.formatId),
      options: optTexts,
      expected_response: expected,
    };
  });
}

export const jobsApi = {
  getJobs: async (params?: GetJobsParams): Promise<JobsListApiResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append("page", (params?.page || 1).toString());
    queryParams.append("limit", (params?.limit && params.limit > 0 ? params.limit : 10).toString());

    if (typeof params?.published === "boolean") {
      queryParams.append("published", String(params.published));
    }

    if (params?.idIn) {
      queryParams.append("id__in", params.idIn);
    }

    if (params?.title) {
      queryParams.append("title__icontains", params.title);
    }

    if (params?.experience) {
      queryParams.append("experience__in", String(params.experience));
    }

    if (params?.employmentType) {
      queryParams.append("employment_type__icontains", params.employmentType);
    }

    if (params?.location) {
      queryParams.append("location__icontains", params.location);
    }

    if (params?.createdBy) {
      queryParams.append("owner__name__icontains", params.createdBy);
    }

    // ⭐ NEW — close date filter
    if (params?.closeDate) {
      queryParams.append("close_date__in", params.closeDate);
    }

    // ⭐ NEW — ordering
    if (params?.orderBy) {
      queryParams.append("o", params.orderBy);
    }

    const query = queryParams.toString();

    return apiClient.get(`${API_ENDPOINTS.JOBS.LIST}?${query}`);
  },



  getJobDetail: async (id: string): Promise<JobDetail> => {
    const res = await apiClient.get(API_ENDPOINTS.JOBS.DETAIL(id));
    return normalizeJobDetailFromApi(res);
  },

  createJob: async (data: CreateJobRequest): Promise<Job> => {
    const res = await apiClient.post(API_ENDPOINTS.JOBS.CREATE, data);
    if (res && typeof res === "object" && "job" in res && (res as { job?: Job }).job) {
      return (res as { job: Job }).job;
    }
    return res as Job;
  },

  duplicateJob: async (jobId: string, body: DuplicateJobRequest): Promise<Job> => {
    const res = await apiClient.post(API_ENDPOINTS.JOBS.DUPLICATE(jobId), body);
    return normalizeDuplicateJobResponse(res);
  },

  updateJob: async (data: UpdateJobRequest): Promise<{ job: Job }> => {
    return apiClient.put(API_ENDPOINTS.JOBS.UPDATE(data.id), data);
  },

  patchJobUsersSharedWith: async (
    jobId: string,
    usersSharedWithIds: string[]
  ): Promise<unknown> => {
    return apiClient.patch(API_ENDPOINTS.JOBS.V1_JOB(jobId), {
      users_shared_with_ids: usersSharedWithIds,
    });
  },

  /** PATCH /job/v1/jobs/:id/ — wizard job details (same URL as partial team PATCH). */
  patchJobDetails: async (payload: PatchJobDetailsRequest): Promise<JobDetail> => {
    const { jobId, ...body } = payload;
    const res = await apiClient.patch(API_ENDPOINTS.JOBS.V1_JOB(jobId), body);
    return normalizeJobDetailFromApi(res);
  },

  patchJobPublished: async (jobId: string, published: boolean): Promise<JobDetail> => {
    const res = await apiClient.patch(API_ENDPOINTS.JOBS.V1_JOB(jobId), { published });
    return normalizeJobDetailFromApi(res);
  },

  softDeleteJob: async (jobId: string, deletedBy: string): Promise<unknown> => {
    return apiClient.patch(API_ENDPOINTS.JOBS.V1_JOB(jobId), {
      is_deleted: true,
      deleted_by: deletedBy,
    });
  },

  deleteJob: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.JOBS.DELETE(id));
  },

  getJobNamesList: async (
    page: number,
    search: string
  ): Promise<JobNamesListApiResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append("page", String(page));

    if (search) {
      queryParams.append("title__icontains", search);
    }

    return apiClient.get(
      `${API_ENDPOINTS.JOBS.JOB_NAME_LIST}?${queryParams.toString()}`
    );
  },

  generateJobDescription: async (data: GenerateJobDescriptionRequest): Promise<GenerateJobDescriptionResponse> => {
    return apiClient.post(API_ENDPOINTS.JOBS.GENERATE_DESCRIPTION, data);
  },

  getResumeScreeningPreferences: async (
    jobId: string
  ): Promise<ResumeScreeningPreferencesApi> => {
    return apiClient.get(API_ENDPOINTS.JOBS.RESUME_SCREENING_PREFERENCES(jobId));
  },

  postResumeScreeningPreferences: async (
    jobId: string,
    body: ReturnType<typeof buildResumeScreeningPreferencesBody>
  ): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.JOBS.RESUME_SCREENING_PREFERENCES(jobId), body);
  },

  patchResumeScreeningPreferences: async (
    preferencesId: number,
    jobId: string,
    body: ReturnType<typeof buildResumeScreeningPreferencesBody>
  ): Promise<unknown> => {
    return apiClient.patch(
      API_ENDPOINTS.JOBS.RESUME_SCREENING_PREFERENCES_BY_ID(preferencesId, jobId),
      body
    );
  },

  getJobCriteriaList: async (jobId: string): Promise<JobCriteriaListApiResponse> => {
    return apiClient.get(API_ENDPOINTS.JOBS.CRITERIA_LIST(jobId));
  },

  bulkCreateOrUpdateCriteria: async (
    jobId: string,
    items: JobCriteriaBulkItem[]
  ): Promise<unknown> => {
    return apiClient.post(API_ENDPOINTS.JOBS.CRITERIA_BULK_CREATE_OR_UPDATE(jobId), items);
  },
};
