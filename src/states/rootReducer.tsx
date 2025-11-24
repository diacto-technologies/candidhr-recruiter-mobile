import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './feature/auth/authSlice'
const rootReducer = combineReducers({
    user:userReducer
})

export default rootReducer;