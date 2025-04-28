"use client";

import { createSlice } from "@reduxjs/toolkit";

// Initial state for user slice
const initialState = {
  loading: false,
  userData: null,
  email: null, // Added field for storing email
  error: null,
  forgetPasswordSuccess: null,
  verifyOtpSuccess: null,
  userDetail: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userData = action.payload.userData;
      state.error = null;
      // Store token in session storage
      if (action.payload.userData?.accessToken) {
        sessionStorage.setItem(
          "accessToken",
          action.payload.userData.accessToken
        );
      }
    },
    // Add this to your userSlice.ts reducers
    initializeFromStorage: (state) => {
      const storedToken = sessionStorage.getItem("accessToken");
      if (storedToken && !state.userData) {
        state.userData = {
          ...state.userData,
          accessToken: storedToken,
        };
      }
    },
    forgetpasswordSuccess: (state, action) => {
      state.loading = false;
      state.forgetPasswordSuccess = action.payload;
      state.error = null;
    },

    verifyOtpSuccess: (state, action) => {
      state.loading = false;
      state.forgetPasswordSuccess = action.payload;
      state.error = null;
    },
    SaveUserDetail: (state, action) => {
      state.loading = false;
      state.userDetail = action.payload;
      state.error = null;

    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setEmail: (state, action) => {
      // Action to store email during the forgot password process
      state.email = action.payload;
    },
    clearEmail: (state) => {
      // Action to clear email after OTP verification
      state.email = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setEmail,
  clearEmail,
  forgetpasswordSuccess,
  initializeFromStorage, // Add this
  verifyOtpSuccess,
  SaveUserDetail
} = userSlice.actions;

export default userSlice.reducer;
