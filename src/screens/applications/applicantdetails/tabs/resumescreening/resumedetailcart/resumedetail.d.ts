import type { ResumeScreeningReportApiResponse } from "../../../../../../features/applications/types";

export type RelevanceLevel = string;

export type ScorecardComponent = NonNullable<
  NonNullable<
    NonNullable<
      ResumeScreeningReportApiResponse["attributes"]["scorecard_v3"]
    >["components"]
  >[number]
>;
