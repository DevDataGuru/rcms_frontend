import { createSlice } from "@reduxjs/toolkit";

// Initial state for permissions
const initialState = {
  permissions: [], // Default to an empty array
};

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setRolePermissions: (state, action) => {
      state.permissions = action.payload;
    },
    clearPermissions: (state) => {
      state.permissions = [];
    },
  },
});

export const { setRolePermissions, clearPermissions } =
  permissionsSlice.actions;

export default permissionsSlice.reducer;
