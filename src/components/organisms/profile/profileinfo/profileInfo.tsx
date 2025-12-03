import React, { Fragment } from "react";
import { View} from "react-native";
import ProfileOverView from "./profileoverview";
import CriteriaResponsesCard from "./criteriasresponses";
import ScreeningQuestions from "./screeningquestions";

const screeningData = [
  {
    id: 1,
    type: "audio",
    question: "Are you willing to relocate for the position?",
    audioDuration: "1:23"
  },
  {
    id: 2,
    type: "mcq",
    question: "Are you willing to relocate for the position?",
    response: "Yes",
    expectedResponse: "NO"
  },
  {
    id: 3,
    type: "text",
    question: "Are you willing to relocate for the position?",
    textAnswer:
      "Reddit young minds One AI conversation at a time. Fueled by cutting-edge AI, Miko connects with kids, responds to their emotions and fosters empathy in every interaction."
  }
];


const ProfileInfo = () => {
  return (
    <Fragment>
      <View style={{flex:1, gap:16}}>
        <ProfileOverView />
        <CriteriaResponsesCard data={[
          {
            id: 1,
            question: "Are you willing to relocate for the position?",
            response: "Yes",
            expected: "NO",
          },
          {
            id: 2,
            question: "Do you have experience with React Native?",
            response: "Yes",
            expected: "YES",
          },
        ]} />
        <ScreeningQuestions data={screeningData}/>
      </View>
    </Fragment>
  );
};

export default ProfileInfo;
