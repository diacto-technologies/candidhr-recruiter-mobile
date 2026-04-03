import React, { Fragment } from "react";
import {
  View,
} from "react-native";

import ProfileOverView from "./overview";
import ScreeningQuestions from "./screeningquestions";
import CriteriaResponsesCard from "./criteriaresponsescard";
import ApplicationDetailsCard from "./applicationdetails";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import {
  selectApplicationStages,
  selectSelectedApplication,
} from "../../../../../features/applications/selectors";

const ProfileInfo = () => {
  const application = useAppSelector(selectSelectedApplication);
  const stagesFromStore = useAppSelector(selectApplicationStages) as any[] | null;

  return (
    <Fragment>
      <View style={{ flex: 1, gap: 16 }}>
        <ProfileOverView />
        {/* <ApplicationDetailsCard /> */}
        <CriteriaResponsesCard />
        <ScreeningQuestions />
      </View>
    </Fragment>
  );
};

export default ProfileInfo;