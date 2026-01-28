import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice";
import profileReducer from "../features/profile/slice"
import { dashboardReducer } from "../features/dashbaord";
import usersReducer from "../features/profile/users/slice";
// Import other feature reducers as you add them
// import profileReducer from "../features/profile/slice";
import jobsReducer from "../features/jobs/slice";
import applicationsReducer from "../features/applications/slice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  users: usersReducer,
  dashboard: dashboardReducer,
  jobs: jobsReducer,
  applications: applicationsReducer,
});

export default rootReducer;
