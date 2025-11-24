import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface UserState {
    user: any;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: {},
    loading: false,
    error: null,
};

export const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setUser: (state, action: PayloadAction<object>) => {
            state.user = action.payload;
        },
    },
});

export const { setUser, setLoading, setError } = authSlice.actions;

// Selector
export const selectUser = (state: RootState) => state.user?.user;
export const selectUserLoading = (state: RootState) => state.user?.loading;
export const selectUserError = (state: RootState) => state.user?.error;

export default authSlice.reducer;
