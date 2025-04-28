import { createSlice } from "@reduxjs/toolkit";

// Initial state for permissions
const initialState = {
  GeneralSettings: [],
  error: null,
  // Default to an empty array
};

export const GeneralSettingsSlice = createSlice({
  name: "generalSettings",
  initialState,
  reducers: {
    generalSettings: (state, action) => {
      state.GeneralSettings = action.payload;
    },
    generalSettingsFail: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { generalSettings, generalSettingsFail } =
  GeneralSettingsSlice.actions;

export default GeneralSettingsSlice.reducer;
