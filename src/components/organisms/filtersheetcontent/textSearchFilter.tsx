import React from "react";
import { View } from "react-native";
import SearchBar from "../../atoms/searchbar";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { selectApplicationsFilters } from "../../../features/applications/selectors";
import { setApplicationsFilters } from "../../../features/applications/slice";
import { setJobFilters } from "../../../features/jobs/slice";
import { selectJobFilters } from "../../../features/jobs/selectors";


interface Props {
  mode: "job" | "applicant";
  field: string;
  placeholder?: string;
}

const TextSearchFilter: React.FC<Props> = ({ mode, field, placeholder }) => {
  const dispatch = useAppDispatch();

  const appFilters = useAppSelector(selectApplicationsFilters);
  const jobFilters = useAppSelector(selectJobFilters);

  const value =
    mode === "applicant"
      ? (appFilters as any)?.[field] ?? ""
      : (jobFilters as any)?.[field] ?? "";

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <SearchBar
        value={value}
        placeholder={placeholder || "Search"}
        onChangeText={(text) => {
          if (mode === "applicant") {
            dispatch(
              setApplicationsFilters({
                ...appFilters,
                [field]: text,
              })
            );
          } else {
            dispatch(
              setJobFilters({
                ...jobFilters,
                [field]: text,
              })
            );
          }
        }}
      />
    </View>
  );
};

export default TextSearchFilter;
