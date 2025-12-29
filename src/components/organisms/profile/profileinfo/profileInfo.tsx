import React, { Fragment } from "react";
import { View} from "react-native";
import ProfileOverView from "./profileoverview";
import CriteriaResponsesCard from "./criteriasresponses";
import ScreeningQuestions from "./screeningquestions";


const ProfileInfo = () => {
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
