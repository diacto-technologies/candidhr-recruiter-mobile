import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice";
import profileReducer from "../features/profile/slice"
import { dashboardReducer } from "../features/dashbaord";
// Import other feature reducers as you add them
// import profileReducer from "../features/profile/slice";
import jobsReducer from "../features/jobs/slice";
import applicationsReducer from "../features/applications/slice";
import { usersReducer } from "../features/profile/users";
import languageReducer from "../features/language/slice";
import themeReducer from "../features/theme/slice";
import assessmentsReducer from "../features/assessments/slice";
import personalityScreeningReducer from "../features/personalityScreening/slice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  jobs: jobsReducer,
  applications: applicationsReducer,
  users: usersReducer,
  language: languageReducer,
  theme: themeReducer,
  assessments: assessmentsReducer,
  personalityScreening: personalityScreeningReducer,
});

export default rootReducer;
