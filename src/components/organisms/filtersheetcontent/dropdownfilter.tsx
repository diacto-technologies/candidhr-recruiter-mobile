import React from "react";
import { View } from "react-native";
import CommonDropdown from "../commondropdown";
import { CommonDropdownOption } from "../commondropdown/types";

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
  options: CommonDropdownOption[];
}

const DropdownFilter: React.FC<Props> = ({
  mode,
  field,
  placeholder,
  options,
}) => {
  const dispatch = useAppDispatch();

  const appFilters = useAppSelector(selectApplicationsFilters);
  const jobFilters = useAppSelector(selectJobFilters);
  const assessmentFilters = useAppSelector(selectAssignedAssessmentFilters);
  const personalityScreeningFilters = useAppSelector(selectPersonalityScreeningFilters);

  const value =
    mode === "applicant"
      ? appFilters?.[field] ?? ""
      : mode === "job"
        ? jobFilters?.[field] ?? ""
        : mode === "videoInterview"
          ? (personalityScreeningFilters as Record<string, string>)?.[field] ?? ""
          : assessmentFilters?.[field] ?? "";

  const handleChange = (val: string) => {
    if (mode === "applicant") {
      dispatch(setApplicationsFilters({ ...appFilters, [field]: val }));
    } else if (mode === "job") {
      dispatch(setJobFilters({ ...jobFilters, [field]: val }));
    } else if (mode === "videoInterview") {
      dispatch(setPersonalityScreeningFilters({ [field]: val }));
    } else {
      dispatch(setAssignedAssessmentFilters({ [field]: val }));
    }
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <CommonDropdown
        placeholder={placeholder || "Select"}
        options={options}
        value={value}
        labelKey="label"
        valueKey="value"
        onChange={handleChange}
      />
    </View>
  );
};

export default DropdownFilter;