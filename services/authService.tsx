import axios from "axios";
import { API_URL } from "./API_URL";


// 1- AUTHENTICATE USER
export const authUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log("Data auth", response)
    if (response.status === 200) {
      return response.data; // Return user data
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 2- REGISTER USER
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/registerTemp`, userData);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 3- FORGET PASSWORD
export const forgetPassword = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgetPassword`, userData);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 4- VERIFY OTP
export const verifyOtp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/confirmOtp`, userData);
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 5- RESET PASSWORD
export const resetPassword = async (userData: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resetPassword`, userData);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to reset password');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

