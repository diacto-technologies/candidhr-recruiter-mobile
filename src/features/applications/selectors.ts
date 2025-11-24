import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectApplicationsState = (state: RootState) => state.applications;

export const selectApplications = createSelector(
  [selectApplicationsState],
  (applications) => applications.applications
);

export const selectSelectedApplication = createSelector(
  [selectApplicationsState],
  (applications) => applications.selectedApplication
);

export const selectApplicationsLoading = createSelector(
  [selectApplicationsState],
  (applications) => applications.loading
);

export const selectApplicationsError = createSelector(
  [selectApplicationsState],
  (applications) => applications.error
);

export const selectApplicationsPagination = createSelector(
  [selectApplicationsState],
  (applications) => applications.pagination
);

