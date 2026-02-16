import React, { Fragment } from "react";
import { View} from "react-native";
import ProfileOverView from "./overview";
import ScreeningQuestions from "./screeningquestions";
import DeviceInfo from "react-native-device-info";
import CriteriaResponsesCard from "./criteriaresponsescard";


const ProfileInfo = () => {
  const isTablet = DeviceInfo.isTablet();
  return (
    <Fragment>
      <View style={{flex:1, gap:16}}>
        <ProfileOverView />
        <CriteriaResponsesCard />
        <ScreeningQuestions/>
      </View>
    </Fragment>
  );
};

export default ProfileInfo;
