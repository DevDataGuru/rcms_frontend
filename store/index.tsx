"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeConfigSlice from "@/store/themeConfigSlice";
import userReducer from "./slices/userSlice";
import permissionReducer from "./slices/permissionsSlice"; // Import permission slice
import { thunk } from "redux-thunk"; // Use named import for 'thunk'

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  user: userReducer,
  permissions: permissionReducer,
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Use named import for 'thunk'
});

export type IRootState = ReturnType<typeof rootReducer>;
