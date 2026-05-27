import React, { Fragment } from "react";
import { View } from "react-native";

import ProfileOverView from "./overview";
import ScreeningQuestions from "./screeningquestions";
import CriteriaResponsesCard from "./criteriaresponsescard";
import ApplicationDetailsCard from "./applicationdetails";

const ProfileInfo = () => {
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