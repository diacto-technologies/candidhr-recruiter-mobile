import React from "react";
import { View } from "react-native";
import SearchBar from "../../atoms/searchbar";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { selectApplicationsFilters } from "../../../features/applications/selectors";
import { setApplicationsFilters } from "../../../features/applications/slice";
import { setJobFilters } from "../../../features/jobs/slice";
import { selectJobFilters } from "../../../features/jobs/selectors";
import { selectAssignedAssessmentFilters } from "../../../features/assessments/selectors";
import { setAssignedAssessmentFilters } from "../../../features/assessments/slice";
import { selectPersonalityScreeningFilters } from "../../../features/personalityScreening/selectors";
import { setFilters as setPersonalityScreeningFilters } from "../../../features/personalityScreening/slice";

interface Props {
  mode: "job" | "applicant" | "assessments" | "videoInterview";
  field: string;
  placeholder?: string;
}

const TextSearchFilter: React.FC<Props> = ({ mode, field, placeholder }) => {
  const dispatch = useAppDispatch();

  const appFilters = useAppSelector(selectApplicationsFilters);
  const jobFilters = useAppSelector(selectJobFilters);
  const assessmentFilters = useAppSelector(selectAssignedAssessmentFilters);
  const personalityScreeningFilters = useAppSelector(selectPersonalityScreeningFilters);

  const filtersByMode: Record<string, string> =
    mode === "applicant"
      ? (appFilters as Record<string, string>) ?? {}
      : mode === "job"
        ? (jobFilters as Record<string, string>) ?? {}
        : mode === "videoInterview"
          ? (personalityScreeningFilters as Record<string, string>) ?? {}
          : (assessmentFilters as Record<string, string>) ?? {};
  const value = filtersByMode[field] ?? "";

  const handleChange = (text: string) => {
    if (mode === "applicant") {
      dispatch(setApplicationsFilters({ ...appFilters, [field]: text }));
    } else if (mode === "job") {
      dispatch(setJobFilters({ ...jobFilters, [field]: text }));
    } else if (mode === "videoInterview") {
      dispatch(setPersonalityScreeningFilters({ [field]: text }));
    } else {
      dispatch(setAssignedAssessmentFilters({ [field]: text }));
    }
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <SearchBar
        value={value}
        placeholder={placeholder || "Search"}
        onChangeText={handleChange}
      />
    </View>
  );
};

export default TextSearchFilter;
