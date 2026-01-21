import React, { Fragment } from "react";
import { View} from "react-native";
import ProfileOverView from "./profileoverview";
import CriteriaResponsesCard from "./criteriasresponses";
import ScreeningQuestions from "./screeningquestions";
import DeviceInfo from "react-native-device-info";


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
