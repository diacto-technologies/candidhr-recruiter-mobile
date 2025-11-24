import { ADD_USER } from "./constants";

export const addUserRequest = (payload: any) => ({
    type: ADD_USER,
    payload,
});