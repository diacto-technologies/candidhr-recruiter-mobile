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
import { commentsReducer } from "../features/comments";

const appReducer = combineReducers({
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
  comments: commentsReducer,
});

export const RESET_APP_STATE = "app/RESET_APP_STATE" as const;

export default function rootReducer(
  state: ReturnType<typeof appReducer> | undefined,
  action: { type: string; payload?: any }
) {
  if (action.type === RESET_APP_STATE) {
    const preserved = {
      email: state?.auth?.email ?? "",
      password: state?.auth?.password ?? "",
      remember: state?.auth?.remember ?? false,
    };

    const nextState = appReducer(undefined, { type: "@@INIT" } as any) as any;
    nextState.auth = {
      ...nextState.auth,
      email: preserved.email,
      password: preserved.password,
      remember: preserved.remember,
    };
    return nextState;
  }

  return appReducer(state, action);
}
