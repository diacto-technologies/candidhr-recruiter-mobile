import React, { Fragment } from "react";
import { View } from "react-native";

import ProfileOverView from "../../../../../components/organisms/Overview";
import ScreeningQuestions from "../../../../../components/organisms/ScreeningQuestions";
import CriteriaResponsesCard from "../../../../../components/organisms/CriteriaResponsesCard";
import ApplicationDetailsCard from "../../../../../components/organisms/ApplicationDetails";

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