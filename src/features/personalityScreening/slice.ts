import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PersonalityScreeningState,
  PersonalityScreeningListResponse,
  PersonalityScreeningFilters,
  GetPersonalityScreeningListPayload,
} from "./types";

const initialState: PersonalityScreeningState = {
  list: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    total: 0,
    next: null,
    previous: null,
  },
  hasMore: true,
};

const personalityScreeningSlice = createSlice({
  name: "personalityScreening",
  initialState,
  reducers: {
    getListRequest: (
      state,
      action: PayloadAction<GetPersonalityScreeningListPayload & { page: number }>
    ) => {
      const { page, append } = action.payload;
      state.loading = true;
      state.error = null;
      state.pagination.page = page;

      if (!append) {
        state.list = [];
      }
    },

    getListSuccess: (
      state,
      action: PayloadAction<{
        page: number;
        append?: boolean;
        data: PersonalityScreeningListResponse;
      }>
    ) => {
      const { page, append, data } = action.payload;
      const results = data.results ?? [];

      state.loading = false;
      state.pagination = {
        page,
        total: data.count ?? 0,
        next: data.next ?? null,
        previous: data.previous ?? null,
      };

      state.list = append ? [...state.list, ...results] : results;
      state.hasMore = state.list.length < (data.count ?? 0);
    },

    getListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    setFilters: (
      state,
      action: PayloadAction<Partial<PersonalityScreeningFilters>>
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  getListRequest,
  getListSuccess,
  getListFailure,
  setFilters,
  clearFilters,
} = personalityScreeningSlice.actions;

export default personalityScreeningSlice.reducer;
