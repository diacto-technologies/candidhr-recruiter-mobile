import { call, CallEffect, put, PutEffect, select, takeLatest } from "redux-saga/effects";
import { JOBS_ACTION_TYPES } from "./constants";
import {
  getJobsRequest,
  getJobsSuccess,
  getJobsFailure,
  getJobDetailRequest,
  getJobDetailSuccess,
  getJobDetailFailure,
  createJobRequest,
  createJobSuccess,
  createJobFailure,
  updateJobRequest,
  updateJobSuccess,
  updateJobFailure,
  deleteJobRequest,
  deleteJobSuccess,
  deleteJobFailure,
  getJobNameListRequest,
  getJobNameListSuccess,
  getJobNameListFailure,
  generateJobDescriptionRequest,
  generateJobDescriptionSuccess,
  generateJobDescriptionFailure,
  submitApplicationFormStepRequest,
  submitApplicationFormStepSuccess,
  submitApplicationFormStepFailure,
  patchJobUsersSharedRequest,
  patchJobUsersSharedSuccess,
  patchJobUsersSharedFailure,
  patchJobDetailsRequest,
  patchJobDetailsSuccess,
  patchJobDetailsFailure,
  patchJobPublishedRequest,
  patchJobPublishedSuccess,
  patchJobPublishedFailure,
  patchJobWorkflowSuccess,
  assignWorkflowToJobRequest,
  assignWorkflowToJobFailure,
  softDeleteJobRequest,
  softDeleteJobSuccess,
  softDeleteJobFailure,
  fetchApplicationFormDraftRequest,
  fetchApplicationFormDraftSuccess,
  fetchApplicationFormDraftFailure,
} from "./slice";
import { jobsApi, buildResumeScreeningPreferencesBody, buildCriteriaBulkBody } from "./api";
import { workflowsApi } from "../workflows/api";
import {
  GetJobsRequestActionPayload,
  getPublishedJobsRequestAction,
  getUnpublishedJobsRequestAction,
} from "./actions";
import {
  Job,
  JobNamesListApiResponse,
  JobsListApiResponse,
  GenerateJobDescriptionRequest,
  GenerateJobDescriptionResponse,
  CreateJobRequest,
  SubmitJobApplicationFormStepPayload,
  PatchJobUsersSharedPayload,
  PatchJobDetailsRequest,
  PatchJobPublishedPayload,
  SoftDeleteJobPayload,
  JobDetail,
  JobsState,
  JobCriteriaApiRow,
  ResumeScreeningPreferencesApi,
  JobCriteriaListApiResponse,
  AssignWorkflowToJobPayload,
} from "./types";
import { PayloadAction } from "@reduxjs/toolkit";
import { showToastMessage } from "../../utils/toast";

function* getJobsWorker(
  action: { type: string; payload?: GetJobsRequestActionPayload }
): Generator<any, void, any> {
  try {
    const payload = action.payload;
    yield put(getJobsRequest(payload));

    const response: JobsListApiResponse = yield call(
      jobsApi.getJobs,
      payload
    );

    yield put(
      getJobsSuccess({
        page: payload?.page ?? 1,
        append: payload?.append ?? false,
        published: payload?.published ?? true,
        data: response,
        requestId: payload?.requestId,
        onlyCount: payload?.onlyCount,
        favourites: payload?.favourites,
      })
    );
  } catch (error: any) {
    yield put(getJobsFailure(error.message || "Failed to fetch jobs"));
  }
}

function* getPublishedJobsWorker(
  action: PayloadAction<GetJobsRequestActionPayload | undefined>
): Generator<CallEffect | PutEffect, void, JobsListApiResponse> {
  try {
    const payload = { ...(action.payload ?? {}), published: true };

    yield put(getJobsRequest(payload));

    const response = yield call(jobsApi.getJobs, payload);

    yield put(
      getJobsSuccess({
        page: payload.page ?? 1,
        append: payload.append ?? false,
        published: true,
        data: response,
        requestId: payload.requestId,
        onlyCount: payload.onlyCount,
      })
    );
  } catch (error: any) {
    yield put(getJobsFailure(error.message));
  }
}


function* getUnpublishedJobsWorker(
  action: PayloadAction<GetJobsRequestActionPayload | undefined>
): Generator<CallEffect | PutEffect, void, JobsListApiResponse> {
  try {
    const payload = { ...(action.payload ?? {}), published: false };

    yield put(getJobsRequest(payload));

    const response = yield call(jobsApi.getJobs, payload);

    yield put(
      getJobsSuccess({
        page: payload.page ?? 1,
        append: payload.append ?? false,
        published: false,
        data: response,
        requestId: payload.requestId,
        onlyCount: payload.onlyCount,
      })
    );
  } catch (error: any) {
    yield put(getJobsFailure(error.message));
  }
}

function* getJobDetailWorker(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(getJobDetailRequest(action.payload));
    const response = yield call(jobsApi.getJobDetail, action.payload);
    yield put(getJobDetailSuccess(response));
  } catch (error: any) {
    yield put(getJobDetailFailure(error.message || "Failed to fetch job details"));
  }
}

function* createJobWorker(
  action: PayloadAction<CreateJobRequest> | { type: string; payload: CreateJobRequest }
): Generator<any, void, Job> {
  try {
    yield put(createJobRequest(action.payload));
    const job: Job = yield call(jobsApi.createJob, action.payload);
    yield put(createJobSuccess(job));
  } catch (error: any) {
    yield put(createJobFailure(error.message || "Failed to create job"));
  }
}

function* updateJobWorker(action: { type: string; payload: any }): Generator<any, void, any> {
  try {
    yield put(updateJobRequest(action.payload));
    const response = yield call(jobsApi.updateJob, action.payload);
    yield put(updateJobSuccess(response.job));
  } catch (error: any) {
    yield put(updateJobFailure(error.message || "Failed to update job"));
  }
}

function* deleteJobWorker(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(deleteJobRequest(action.payload));
    yield call(jobsApi.deleteJob, action.payload);
    yield put(deleteJobSuccess(action.payload));
  } catch (error: any) {
    yield put(deleteJobFailure(error.message || "Failed to delete job"));
  }
}

function* getJobNameListWorker(
  action: PayloadAction<{ page?: number; search?: string; append?: boolean } | undefined>
): Generator<any, void, any> {
  try {
    const page = action.payload?.page ?? 1;
    const search = action.payload?.search ?? "";
    const append = action.payload?.append ?? false;

    yield put(getJobNameListRequest({ page, search, append }));

    const response: JobNamesListApiResponse = yield call(
      jobsApi.getJobNamesList,
      page,
      search
    );

    yield put(
      getJobNameListSuccess({
        page,
        append,
        data: response,
      })
    );
  } catch (error: any) {
    yield put(getJobNameListFailure(error.message || "Failed to fetch job names list"));
  }
}

function* generateJobDescriptionWorker(
  action: { type: string; payload: GenerateJobDescriptionRequest }
): Generator<any, void, any> {
  try {
    yield put(generateJobDescriptionRequest());
    const response: GenerateJobDescriptionResponse = yield call(
      jobsApi.generateJobDescription,
      action.payload
    );
    yield put(generateJobDescriptionSuccess(response));
  } catch (error: any) {
    const errorMsg = error.message || "Failed to generate job description";
    yield put(generateJobDescriptionFailure(errorMsg));
  }
}

function* submitApplicationFormStepWorker(
  action: PayloadAction<SubmitJobApplicationFormStepPayload>
): Generator<any, void, unknown> {
  const payload = action.payload;
  try {
    yield put(submitApplicationFormStepRequest(payload));
    const prefsBody = buildResumeScreeningPreferencesBody(payload);
    const prefsId = payload.screeningPreferencesId;
    if (typeof prefsId === "number" && prefsId > 0) {
      yield call(jobsApi.patchResumeScreeningPreferences, prefsId, payload.jobId, prefsBody);
    } else {
      yield call(jobsApi.postResumeScreeningPreferences, payload.jobId, prefsBody);
    }
    if (payload.filterCriteria.length > 0) {
      const criteriaBody = buildCriteriaBulkBody(payload.jobId, payload.filterCriteria);
      yield call(jobsApi.bulkCreateOrUpdateCriteria, payload.jobId, criteriaBody);
    }
    yield put(submitApplicationFormStepSuccess());
  } catch (error: any) {
    yield put(
      submitApplicationFormStepFailure(
        error?.message || "Could not save application form. Try again."
      )
    );
  }
}

function* assignWorkflowToJobWorker(
  action: PayloadAction<AssignWorkflowToJobPayload>
): Generator<any, void, unknown> {
  const p = action.payload;
  try {
    yield put(assignWorkflowToJobRequest(p));
    const emails = p.invite_via_email ? p.emails : [];
    yield call(workflowsApi.assign, p.jobId, {
      workflow_id: p.workflowId,
      invite_via_email: p.invite_via_email,
      invite_via_application_form: p.invite_via_application_form,
      emails,
    });
    const merged = {
      ...p.job,
      workflow: { id: p.workflowId, name: p.workflowName },
      invite_via_application_form: p.invite_via_application_form,
      invite_via_email: p.invite_via_email,
      emails,
      ...(typeof p.email_candidate === "boolean" ? { email_candidate: p.email_candidate } : {}),
    } as JobDetail;
    yield put(patchJobWorkflowSuccess(merged));
    showToastMessage("Workflow assigned", "success");
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not assign workflow. Try again.";
    yield put(assignWorkflowToJobFailure(message));
    showToastMessage(message, "error");
  }
}

function* patchJobUsersSharedWorker(
  action: PayloadAction<PatchJobUsersSharedPayload>
): Generator<any, void, unknown> {
  const { jobId, usersSharedWithIds } = action.payload;
  try {
    yield put(patchJobUsersSharedRequest({ jobId, usersSharedWithIds }));
    yield call(jobsApi.patchJobUsersSharedWith, jobId, usersSharedWithIds);
    yield put(patchJobUsersSharedSuccess());
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not update team members. Try again.";
    yield put(patchJobUsersSharedFailure(message));
    showToastMessage(message, "error");
  }
}

function* fetchApplicationFormDraftWorker(
  action: PayloadAction<{ jobId: string }>
): Generator<any, void, any> {
  const { jobId } = action.payload;
  try {
    yield put(fetchApplicationFormDraftRequest({ jobId }));
    let preferences: ResumeScreeningPreferencesApi | null = null;
    let criteria: JobCriteriaApiRow[] = [];
    let prefsErr: string | undefined;
    let criteriaErr: string | undefined;
    try {
      preferences = yield call(jobsApi.getResumeScreeningPreferences, jobId);
    } catch (e: any) {
      prefsErr = e?.message || String(e);
    }
    try {
      const wrap: JobCriteriaListApiResponse = yield call(jobsApi.getJobCriteriaList, jobId);
      criteria = Array.isArray(wrap?.data) ? wrap.data! : [];
    } catch (e: any) {
      criteriaErr = e?.message || String(e);
    }
    if (prefsErr && criteriaErr) {
      yield put(
        fetchApplicationFormDraftFailure(
          prefsErr || criteriaErr || "Failed to load application form"
        )
      );
      return;
    }
    yield put(
      fetchApplicationFormDraftSuccess({
        jobId,
        preferences,
        criteria,
      })
    );
  } catch (e: any) {
    yield put(
      fetchApplicationFormDraftFailure(e?.message || "Failed to load application form")
    );
  }
}

function* patchJobDetailsWorker(
  action: PayloadAction<PatchJobDetailsRequest> | { type: string; payload: PatchJobDetailsRequest }
): Generator<any, void, JobDetail> {
  try {
    yield put(patchJobDetailsRequest(action.payload));
    const detail: JobDetail = yield call(jobsApi.patchJobDetails, action.payload);
    yield put(patchJobDetailsSuccess(detail));
    showToastMessage("Job saved", "success");
  } catch (error: any) {
    const msg = error?.message || "Could not save job. Try again.";
    yield put(patchJobDetailsFailure(msg));
    showToastMessage(msg, "error");
  }
}

function* patchJobPublishedWorker(
  action: PayloadAction<PatchJobPublishedPayload>
): Generator<any, void, unknown> {
  const { jobId, published } = action.payload;
  try {
    yield put(patchJobPublishedRequest(action.payload));
    const detail = (yield call(jobsApi.patchJobPublished, jobId, published)) as JobDetail;
    yield put(patchJobPublishedSuccess(detail));
    const filters = (yield select(
      (s: { jobs: JobsState }) => s.jobs.filters
    )) as JobsState["filters"];
    yield put(getPublishedJobsRequestAction(filters));
    yield put(getUnpublishedJobsRequestAction(filters));
    showToastMessage(published ? "Job published" : "Job unpublished", "success");
  } catch (error: any) {
    const msg = error?.message || "Could not update job status. Try again.";
    yield put(patchJobPublishedFailure(msg));
    showToastMessage(msg, "error");
  }
}

function* softDeleteJobWorker(
  action: PayloadAction<SoftDeleteJobPayload>
): Generator<any, void, unknown> {
  const { jobId } = action.payload;
  try {
    const profile = (yield select((s: { profile: { profile: { id?: string; user?: string } | null } }) => s.profile.profile)) as {
      id?: string;
      user?: string;
    } | null;
    const deletedBy = String(profile?.id ?? profile?.user ?? "").trim();
    if (!deletedBy) {
      showToastMessage("Sign in again to delete jobs.", "error");
      return;
    }
    yield put(softDeleteJobRequest(action.payload));
    yield call(jobsApi.softDeleteJob, jobId, deletedBy);
    yield put(softDeleteJobSuccess(jobId));
    const filters = (yield select(
      (s: { jobs: JobsState }) => s.jobs.filters
    )) as JobsState["filters"];
    yield put(getPublishedJobsRequestAction(filters));
    yield put(getUnpublishedJobsRequestAction(filters));
    showToastMessage("Job deleted", "success");
  } catch (error: any) {
    const msg = error?.message || "Could not delete job. Try again.";
    yield put(softDeleteJobFailure(msg));
    showToastMessage(msg, "error");
  }
}

export function* jobsSaga() {
  yield takeLatest(JOBS_ACTION_TYPES.GET_UNPUBLISHED_JOBS_REQUEST, getUnpublishedJobsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_PUBLISHED_JOBS_REQUEST, getPublishedJobsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_JOBS_REQUEST, getJobsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_JOB_DETAIL_REQUEST, getJobDetailWorker);
  yield takeLatest(JOBS_ACTION_TYPES.CREATE_JOB_REQUEST, createJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.UPDATE_JOB_REQUEST, updateJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.DELETE_JOB_REQUEST, deleteJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GET_JOB_NAME_LIST_REQUEST, getJobNameListWorker);
  yield takeLatest(JOBS_ACTION_TYPES.GENERATE_JOB_DESCRIPTION_REQUEST, generateJobDescriptionWorker);
  yield takeLatest(JOBS_ACTION_TYPES.SUBMIT_APPLICATION_FORM_STEP_REQUEST, submitApplicationFormStepWorker);
  yield takeLatest(JOBS_ACTION_TYPES.PATCH_JOB_USERS_SHARED_REQUEST, patchJobUsersSharedWorker);
  yield takeLatest(JOBS_ACTION_TYPES.PATCH_JOB_DETAILS_REQUEST, patchJobDetailsWorker);
  yield takeLatest(JOBS_ACTION_TYPES.PATCH_JOB_PUBLISHED_REQUEST, patchJobPublishedWorker);
  yield takeLatest(JOBS_ACTION_TYPES.SOFT_DELETE_JOB_REQUEST, softDeleteJobWorker);
  yield takeLatest(JOBS_ACTION_TYPES.FETCH_APPLICATION_FORM_DRAFT_REQUEST, fetchApplicationFormDraftWorker);
  yield takeLatest(JOBS_ACTION_TYPES.ASSIGN_WORKFLOW_TO_JOB_REQUEST, assignWorkflowToJobWorker);
}

