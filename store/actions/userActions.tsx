import {
  authUser,
  forgetPassword,
  resetPassword,
  verifyOtp
} from "../../services/authService";
import {
  forgetpasswordSuccess,
  loginFailure,
  loginStart,
  loginSuccess
} from "@/store/slices/userSlice";

export const loginUser =
  (credentials: { username: string; password: string }) =>
  async (dispatch: any) => {
    // Use 'any' for simplicity
    try {
      dispatch(loginStart());
      const response = await authUser(credentials); // Assuming authUser is your API service

      if (response.status === 200) {
        // Assuming 200 is a successful response code
        dispatch(loginSuccess({ userData: response }));
        return response;
      } else {
        dispatch(loginFailure("Invalid login credentials"));
        return false;
      }
    } catch (error: any) {
      // Annotate error as 'any' to avoid strict type issues
      dispatch(loginFailure(error.message));
      return false;
    }
  };
export const forgetPasswordAction =
  (credentials: { email: string }) => async (dispatch: any) => {
    // Use 'any' for simplicity
    try {
      dispatch(loginStart());
      const response = await forgetPassword(credentials); // Assuming authUser is your API service

      if (response.status === 200) {
        // Assuming 200 is a successful response code
        dispatch(forgetpasswordSuccess({ userData: response }));
        return response;
      } else {
        dispatch(loginFailure("Invalid login credentials"));
        return false;
      }
    } catch (error: any) {
      // Annotate error as 'any' to avoid strict type issues
      dispatch(loginFailure(error.message));
      return false;
    }
  };

export const verifyOtpAction =
  (credentials: { email: string; otp: string }) => async (dispatch: any) => {
    // Use 'any' for simplicity
    try {
      dispatch(loginStart());
      const response = await verifyOtp(credentials); // Assuming authUser is your API service

      if (response.status === 200) {
        // Assuming 200 is a successful response code
        dispatch(forgetpasswordSuccess({ userData: response }));
        return response;
      } else {
        dispatch(loginFailure("Invalid login credentials"));
        return false;
      }
    } catch (error: any) {
      // Annotate error as 'any' to avoid strict type issues
      dispatch(loginFailure(error.message));
      return false;
    }
  };
export const ResetPassAction =
  (credentials: { email: string; password: string }) =>
  async (dispatch: any) => {
    // Use 'any' for simplicity
    try {
      dispatch(loginStart());
      const response = await resetPassword(credentials); // Assuming authUser is your API service

      if (response.status === 200) {
        // Assuming 200 is a successful response code
        dispatch(forgetpasswordSuccess({ userData: response }));
        return response;
      } else {
        dispatch(loginFailure("Invalid login credentials"));
        return false;
      }
    } catch (error: any) {
      // Annotate error as 'any' to avoid strict type issues
      dispatch(loginFailure(error.message));
      return false;
    }
  };
